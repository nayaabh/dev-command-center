const { spawn, exec, execSync } = require('child_process');
const fs = require('fs')
const path = require('path')
const getDir = location => fs.statSync(location).isDirectory() ? location : path.dirname(location)
const isGitRepo = location => {
    location = getDir(location)
    return new Promise((resolve, reject) => {
        exec(`git -C "${location}" status`, (err, stdout, stderr) => {
            if(err || stderr) {
                reject(err || stderr)
            }
            console.log(stdout)
            resolve(stdout)
        })
    })
}

const getCurrentBranch = location => {
    location = getDir(location)
    return new Promise((resolve, reject) => {
        exec(`git -C "${location}" rev-parse --abbrev-ref HEAD`, (err, stdout, stderr) => {
            if(err || stderr) {
                reject(err || stderr)
            }
            console.log(stdout)
            resolve(stdout.replace(/\n/gm,""))
        })
    })
}

const getSyncStatus = (location, localBranch, remoteBranch) => {
    location = getDir(location)
    return new Promise((resolve, reject) => {
        console.log(`git -C "${location}" rev-list --left-right ${localBranch}...origin/${remoteBranch}`)
        exec(`git -C "${location}" rev-list --left-right ${localBranch}...origin/${remoteBranch}`, (err, stdout, stderr) => {
            if(err || stderr) {
                reject(err || stderr)
            }
            console.log("Location: ", location, " LocalBranch: ", localBranch, " remoteBranch:", remoteBranch)
            console.log("Success: ", stdout)
            const ahead = stdout.match(/^\</gm) || []
            const behind = stdout.match(/^\>/gm) || []
            resolve({behind:behind.length, ahead:ahead.length})
        })
    })
}

const gitExecuterOrigin = (command, location) => {
    return new Promise((resolve, reject) => {
        console.log(`git -C "${location}" ${command} origin`)
        exec(`git -C "${location}" ${command} origin`, (err, stdout, stderr) => {
            if(err || stderr) {
                reject(err || stderr)
            }
            console.log("Success: ", stdout)
            resolve(stdout)
        })
    })
}

const gitPull = location => {
    location = getDir(location)
    return gitExecuterOrigin("pull", location)
}

const gitPush = location => {
    location = getDir(location)
    return gitExecuterOrigin("push", location)
}

module.exports = {
    isGitRepo,
    getCurrentBranch,
    getSyncStatus,
    gitPull,
    gitPush
}
