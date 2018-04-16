const electron = require('electron');
const {app , BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

function createWindow(){
    var appWidth = 325, appHeight = 410;
    var screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width
    let win = new BrowserWindow({
        width: appWidth, height: appHeight, 
        x: (screenWidth - appWidth), y: 40, minimizable: false, maximizable: false,
        alwaysOnTop: true,
        frame: false,
        resizable: false,
        movable: false,
        skipTaskbar: true,
        opacity: 0.9})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
}

app.on('ready', createWindow);