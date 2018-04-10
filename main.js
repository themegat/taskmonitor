const {app , BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

function createWindow(){
    let win = new BrowserWindow({
        width: 800, height: 600, 
        x: 10, y: 10, minimizable: false, maximizable: false,
        alwaysOnTop: true})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createWindow)