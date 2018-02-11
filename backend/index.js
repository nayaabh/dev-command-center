const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { spawn } = require('child_process');
const index = require("./routes/index");
const configIO = require('./configs/config')
const port = process.env.PORT || 4001;

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIO(server); 


const appMetaIO = io.of('/admin')
const artefactIO = io.of('/artifact')
const commandIO  = io.of('/command')
io.clients((error, clients) => {
    if (error) throw error;
    console.log('Client List:' + clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
});

/* io.on("connection", client => {
    console.log("New client connected"), setInterval(
      () => getApiAndEmit(client),
      1000
    );
    client.on("disconnect", () => console.log("Client disconnected"));
  }); */



appMetaIO.on('connect', (client) => {
    console.log("New client connected to admin")
    client.emit('ADMIN_ACK', "all good from admin")
    // const ls = spawn("cmd.exe", ["/c", "dir /w"], {cwd: "../"});
    const ls = spawn("git.exe", ["status"], {cwd: "../"});

    ls.stdout.on('data', (data) => {
        client.emit('ADMIN_DATA', `${data}`);
    });

    ls.stderr.on('data', (data) => {
        client.emit('ADMIN_DATA', `stderr: ${data}`);
    });

    ls.on('close', (code) => {
        // client.emit('ADMIN_DATA', `child process exited with code ${code}`);
    });
    ls.on('error', (code, msg) => {
        client.emit('ADMIN_DATA', `child process exited with code ${code} and ${msg}`);
    });
    client.on("getConfig", () => {
        client.emit("APP_CONFIG", configIO.readConfig())
    })
    client.on("setConfig", (data) => {
        client.emit("APP_CONFIG_SET", configIO.writeConfig(data))
    })
    // setTimeout (() => client.emit('ADMIN_ACK', "all good from admin"), 2000)
});


io.on("connect", client => {
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
  };
server.listen(port, () => console.log(`Listening on port ${port}`));