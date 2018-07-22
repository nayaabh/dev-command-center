import url from 'url'
import path from 'path'
import electron from 'electron'
let mainWindow
const homeUrl = url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
})
const { app:application, BrowserWindow } = electron
if(application) {
    application.on('ready', () => {
        // Create new window
        mainWindow = new BrowserWindow({});
        mainWindow.loadURL(homeUrl)
        // Quit app when closed
        mainWindow.on('closed', function(){
            application.quit();
        });
    })
}
