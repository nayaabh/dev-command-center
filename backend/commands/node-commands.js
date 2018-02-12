const { spawn, exec, execSync } = require('child_process');
const fs = require('fs')
const path = require('path')
const Rx = require('rxjs')
const Constants = require('../constants/constants')
const getDir = location => fs.statSync(location).isDirectory() ? location : path.dirname(location)
const commandRunner = (buildCommand, location) => {
    console.log(`Build Command: ${buildCommand}`)
    return Rx.Observable.create(observer => {
        const buildProcess = spawn("cmd", ["/c", `${buildCommand}`], {cwd: `${location}`});
        buildProcess.stdout.on('data', (data) => {
            console.log("Build in progress...")
            observer.next({
                status: Constants.IN_PROGRESS,
                stdout: data.toString()
            })
            console.log(data.toString())
        })
    
        buildProcess.stderr.on('data', (data) => {
            console.log("Build is failing...")
            observer.next({
                status: Constants.FAILED,
                stdout: data.toString()
            })
            observer.complete()
        })
    
        buildProcess.on('close', (code) => {
            console.log("Build completed...")
            observer.next({
                status: Constants.SUCCESS,
                stdout: `Build Completed with code ${code}`
            })
            observer.complete()
        })
        buildProcess.on('error', (code, msg) => {
            console.log(`Command failed with code ${code}: ${msg}`)
            observer.next({
                status: Constants.FAILED,
                stdout: `Command Failed with code ${code}: ${msg}`
            })
            observer.complete()
        })
    })
}
const triggerBuild = (location, customCommand = null) => {
    location = getDir(location)
    let buildCommand = customCommand ? `${customCommand}` : `npm run build` 
    // buildCommand = `${buildCommand} --prefix "${location}"`
    buildCommand = `${buildCommand}`
    return commandRunner(buildCommand, location)
}

const triggerTest = (location, customCommand = null) => {
    location = getDir(location)
    let buildCommand = customCommand ? `${customCommand}` : `npm run test` 
    // buildCommand = `${buildCommand} --prefix "${location}"`
    buildCommand = `${buildCommand}`
    return commandRunner(buildCommand, location)
}

const triggerLint = (location, customCommand = null) => {
    location = getDir(location)
    let buildCommand = customCommand ? `${customCommand}` : `npm run lint-fix` 
    // buildCommand = `${buildCommand} --prefix "${location}"`
    buildCommand = `${buildCommand}`
    return commandRunner(buildCommand, location)
}

module.exports = {
    triggerBuild,
    triggerTest,
    triggerLint
}