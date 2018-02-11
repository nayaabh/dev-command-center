const { spawn, exec, execSync } = require('child_process');
const fs = require('fs')
const path = require('path')
const triggerBuild = location => {
    if(!fs.statSync(location).isDirectory()){
        location = path.dirname(location)
    }
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

const triggerTest = location => {
    if(!fs.statSync(location).isDirectory()){
        location = path.dirname(location)
    }
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

const triggerLint = (location, localBranch, remoteBranch) => {
    if(!fs.statSync(location).isDirectory()){
        location = path.dirname(location)
    }
    return new Promise((resolve, reject) => {
        console.log(`git -C "${location}" rev-list --left-right ${localBranch}...origin/${remoteBranch}`)
        exec(`git -C "${location}" rev-list --left-right ${localBranch}...origin/${remoteBranch}`, (err, stdout, stderr) => {
            if(err || stderr) {
                reject(err || stderr)
            }
            console.log("Location: ", location, " LocalBranch: ", localBranch, " remoteBranch:", remoteBranch)
            console.log("Success: ", stdout)
            const behind = stdout.match(/^\</gm) || []
            const ahead = stdout.match(/^\>/gm) || []
            resolve({behind:behind.length, ahead:ahead.length})
        })
    })
}

module.exports = {
    isGitRepo,
    getCurrentBranch,
    getSyncStatus
}