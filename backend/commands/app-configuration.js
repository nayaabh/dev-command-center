/*     client.emit('ADMIN_ACK', "all good from admin")
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
    }); */