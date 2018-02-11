const fs = require('fs')
const path = require('path')
const APP_CONFIG_FILE_PATH = path.join(__dirname, 'artifacts.json')

// All possible Config IOs
const readConfig = () => {
    return readConfigFrom(APP_CONFIG_FILE_PATH)
}

const writeConfig = (obj) => {
    return writeConfigTo(APP_CONFIG_FILE_PATH, obj)
}

const readConfigFrom = (fsPath) => {
    const data = fs.readFileSync(fsPath);
    return JSON.parse(data)
}
const writeConfigTo = (fsPath, data) => {
    const dataJSON = JSON.stringify(data, null, 4)
    fs.writeFile(fsPath, dataJSON, err => {
        console.log(`Data written to ${fsPath}`)
    })
}
module.exports = {
    readConfig,
    writeConfig,
    readConfigFrom,
    writeConfigTo
}