const electron = require('electron');
const {app , BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

function createWindow(){
    //Note size in view.js - AppViewState.prototype.toggleCollapse()
    var appWidth = 325, appHeight = 30;
    var screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width
    var xPos = screenWidth - appWidth;
    let win = new BrowserWindow({
        width: appWidth, height: appHeight, 
        x: xPos, y: 100, minimizable: false, maximizable: false,
        alwaysOnTop: true,          
        frame: false,
        resizable: false,
        movable: false,
        skipTaskbar: true,
        opacity: 0.9,
        icon: app.getAppPath() + "/img/Pin.ico"})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
}

app.on('ready', createWindow);