const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const _ = require('lodash')
const index = require("./routes/index");
const configIO = require('./configs/config')
const Constants = require('./constants/constants')
const GitCommands = require('./commands/git-commands')
const NodeCommands = require('./commands/node-commands')
const port = process.env.PORT || 4001;

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIO(server); 


const appMetaIO = io.of(`/${Constants.APP}`)
const artefactIO = io.of(`/${Constants.ARTIFACT}`)
const commandIO  = io.of('/command')

appMetaIO.on('connect', (client) => {
    console.log("New client connected to admin")
    // APP META Collections
    client.on(`${Constants.REGISTERED_ARTIFACTS} ${Constants.FETCH}`, () => {
        let originalConfig = configIO.readConfig()
        let artifacts =  originalConfig[Constants.REGISTERED_ARTIFACTS]
        let configs = originalConfig[Constants.REGISTERED_CONFIGS]
        let aggr =  _.reduce(configs, (agg, {id, location}) => {
                        if(!location){
                            return agg
                        }
                        let artifactListInConfig = configIO.readConfigFrom(location)
                        let localRepos = _.reduce(artifactListInConfig, (a, repo) => {
                            if(!repo.location) {
                                return a
                            }
                            a.push(repo)
                            return a
                        }, [])
                        agg = [...agg, ...localRepos]
                        return agg
                    }, [])
        let flatRepos = [...artifacts, ...aggr]
        client.emit(`${Constants.REGISTERED_ARTIFACTS} ${Constants.FETCH}`, flatRepos)
    })
    
    client.on(`${Constants.REGISTERED_CONFIGS} ${Constants.FETCH}`, () => {
        let originalConfig = configIO.readConfig()
        let configs = originalConfig[Constants.REGISTERED_CONFIGS]
        client.emit(`${Constants.REGISTERED_CONFIGS} ${Constants.FETCH}`, configs)
    })
   
});

artefactIO.on(`connect`, client => {
    console.log("New Artifact registered")
    // Artifacts subscriptions
    // Git Sync
    client.on(`${Constants.ARTIFACT} ${Constants.GIT_SYNC}`, ({id, location, isGitRepo}) => {
        if(!isGitRepo) {
            GitCommands.isGitRepo(location).then((stdout) => {
                if(stdout.match(/^fatal: Not a git repository/i)){
                    isGitRepo = false
                    return
                }
                gitSync()
            }).catch(error => {
                console.error("Git error: ", error)
                return
            })
        } else {
            gitSync()
        }
     function gitSync() {
        let branchName = "master"
        GitCommands.getCurrentBranch(location).then(stdout => {
            let branchName = stdout
            GitCommands.getSyncStatus(location, branchName, branchName).then(({behind, ahead}) => {
                client.emit(`${Constants.ARTIFACT} ${Constants.GIT_SYNC} id:${id}`, {
                    id, 
                    isGitRepo: true,
                    commitsAhead: ahead,
                    commitsBehind: behind,
                    branch: branchName
                })
            })
        })
     }   
    })
    // Git PULL
    client.on(`${Constants.ARTIFACT} ${Constants.GIT_PULL}`, ({id, location}) => {
        GitCommands.gitPull(location).then((stdout) => {
            client.emit(`${Constants.ARTIFACT} ${Constants.GIT_PULL} id:${id}`, {
                id,
                stdout,
                status: Constants.SUCCESS
            })
        }).catch(error => {
            console.error("Git error: ", error)
            client.emit(`${Constants.ARTIFACT} ${Constants.GIT_PULL} id:${id}`, {
                id,
                stdout: error,
                status: Constants.FAILED
            })
        })   
    })
    // Git PUSH
    client.on(`${Constants.ARTIFACT} ${Constants.GIT_PUSH}`, ({id, location}) => {
        GitCommands.gitPush(location).then((stdout) => {
            client.emit(`${Constants.ARTIFACT} ${Constants.GIT_PUSH} id:${id}`, {
                id,
                stdout,
                status: Constants.SUCCESS
            })
        }).catch(error => {
            console.error("Git error: ", error)
            client.emit(`${Constants.ARTIFACT} ${Constants.GIT_PUSH} id:${id}`, {
                id,
                stdout: error,
                status: Constants.FAILED
            })
        })   
    })
    // npm builds
    client.on(`${Constants.ARTIFACT} ${Constants.BUILD_JS}`, ({id, location, customCommand}) => {
        NodeCommands.triggerBuild(location, customCommand).subscribe({
            next: ({status, stdout}) => {
                client.emit(`${Constants.ARTIFACT} ${Constants.BUILD_JS} id:${id}`, {
                    id,
                    stdout,
                    status
                })
            },
            error: err => {
                console.log(err)
            },
            complete: () => {
                console.log("Build Finished")
            }
        })
    })
    // npm test
    client.on(`${Constants.ARTIFACT} ${Constants.TEST_JS}`, ({id, location, customCommand}) => {
        NodeCommands.triggerTest(location, customCommand).subscribe({
            next: ({status, stdout}) => {
                client.emit(`${Constants.ARTIFACT} ${Constants.TEST_JS} id:${id}`, {
                    id,
                    stdout,
                    status
                })
            },
            error: err => {
                console.log(err)
            },
            complete: () => {
                console.log("Test Finished")
            }
        })
    })
    // npm lint-fix
    client.on(`${Constants.ARTIFACT} ${Constants.LINT_FIX_JS}`, ({id, location, customCommand}) => {
        NodeCommands.triggerLint(location, customCommand).subscribe({
            next: ({status, stdout}) => {
                client.emit(`${Constants.ARTIFACT} ${Constants.LINT_FIX_JS} id:${id}`, {
                    id,
                    stdout,
                    status
                })
            },
            error: err => {
                console.log(err)
            },
            complete: () => {
                console.log("Lint Fix Finished")
            }
        })
    })
})
/* io.on("connect", client => {
    console.log("New client connected")
    client.on("dashboard", () => emitCustomMessage(client, "dashboard"))
    client.on("client-disconnect", () => {
        emitCustomMessage(client, "client-disconnect").then(client.disconnect)
    })
    client.on("disconnect", () => console.log("Client disconnected"));
  });
const emitCustomMessage = async (client, type) => {
    try {
        const res = "Hello form: "+ type
        setTimeout(() => client.emit(`from-${type}`, res), 1000);
      } catch (error) {
        console.error(`Error: ${error.code}`);
      }
}
const getApiAndEmit = async socket => {
    try {
      const res = "Hello"
      socket.emit("FromAPI", res);
    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
  }; */
server.listen(port, () => console.log(`Listening on port ${port}`));
