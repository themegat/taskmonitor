const electron = require('electron');
const { ipcMain } = require('electron');
const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const url = require('url');
let myWindow = null;
let tray = null

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
        if (myWindow.isMinimized()) myWindow.restore()
        myWindow.focus()
    }
})

if (isSecondInstance) {
    app.quit()
}

function createWindow() {
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
        icon: app.getAppPath() + "/img/Pin.ico"
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    tray = new Tray(path.join(__dirname, "img/Pin.ico"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Restart', click: function () {
                app.relaunch();
                app.exit();
            }
        }, {
            label: 'Exit', click: function () {
                app.quit();
            }
        }
    ])
    tray.setToolTip('Task Monitor')
    tray.setContextMenu(contextMenu)
}

ipcMain.on("uncaughtException", err => {
    var dateNow = new Date();
    try {
        var query = "insert into error_log values(0,'" + err + "', '" + dateNow + "', '" + _user.id + "')";
        DBConnect.query(query, function (err, result) {
            if (err) {
                throw err;
            } else {
                app.quit();
            }
        });
    } catch (err) {
        Toast(err, "Fatal Error");
    }
})
app.setLoginItemSettings({
    openAtLogin: true
});
app.on('ready', createWindow);
