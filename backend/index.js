const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const _ = require('lodash')
const index = require("./routes/index");
const configIO = require('./configs/config')
const Constants = require('./constants/command-types')
const GitCommands = require('./commands/git-commands')
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
    
    client.on(`${Constants.REGISTERED_ARTIFACTS} ${Constants.FETCH}`, () => {
        let originalConfig = configIO.readConfig()
        let artifacts =  originalConfig[Constants.REGISTERED_ARTIFACTS]
        let configs = originalConfig[Constants.REGISTERED_CONFIGS]
        let aggr =  _.reduce(configs, (agg, {id, location}) => {
                        if(!location){
                            return agg
                        }
                        let artifactListInConfig = configIO.readConfigFrom(location)
                        agg = [...agg, ...artifactListInConfig]
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

    /* client.on("setConfig", (data) => {
        client.emit("APP_CONFIG_SET", configIO.writeConfig(data))
    }) */
   
});

artefactIO.on(`connect`, client => {
    console.log("New Artifact registered")
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
                    isGitRepo,
                    commitsAhead: ahead,
                    commitsBehind: behind,
                    branch: branchName
                })
            })
        })
     }   
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