const electron = require('electron');
const {app , BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

function createWindow(){
    var appWidth = 350;
    var screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width
    let win = new BrowserWindow({
        width: 350, height: 450, 
        x: (screenWidth - appWidth), y: 40, minimizable: false, maximizable: false,
        alwaysOnTop: true,
        frame: false,
        resizable: false,
        movable: false,
        skipTaskbar: true})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
}

app.on('ready', createWindow);