
const remote = require('electron').remote;
const { dialog } = require('electron').remote;
const jetpack = require('fs-jetpack');
var win = remote.getCurrentWindow();
var appInitHieght = win.getSize()[1];

//# Custom alert object
var Toast = function (message) {
    dialog.showErrorBox("Task Monitor", message);
};

/*  Date/Time object, initializes todays date and compares dates
    Has the following methods:
        - get todays date
        - compare two dates
        - chech if date is a past date
*/
var DateTime = function () {
    var dateNow = new Date();
    var month = dateNow.getMonth() + 1, year = dateNow.getFullYear(), day = dateNow.getDate();
    this.date = year + "-" + month + "-" + day;
};

DateTime.prototype.getDate = function () {
    return this.date;
};

DateTime.prototype.compare = function (date, dateCompareTo) {
    var d1 = new Date(date).getTime(), d2 = new Date(dateCompareTo).getTime();
    if (d1 > d2) {
        return 1;
    } else if (d1 < d2) {
        return -1;
    } else {
        return 0;
    }
};

DateTime.prototype.isTimePast = function (stringTime) {
    var stringDate = this.date + " " + stringTime;
    var datePast = new Date(stringDate).getTime();
    var dateNow = new Date().getTime();

    if (datePast > dateNow) {
        return 1;
    } else if (datePast < dateNow) {
        return -1;
    } else {
        return 0;
    }
};

$('#lo_TimePicker').calendar({ ampm: false, type: 'time' });
$('#btnCloseApp').on("click", function () {
    var content = "Task description;Task Time" + _taskLog.allDataToString();
    _logFile.save(content);
    win.close();
});

//Control the view state of the application (collapse view)

var AppViewState = function () {
    this.isAppCollapsed = false;
};

AppViewState.prototype.toggleCollapse = function () {
    if (!this.isAppCollapsed) {
        $('#rowBody').hide();
        $('body').css('overflow-y', 'hidden');
        $("#btnResizeApp_icon").removeClass("up");
        $('#btnResizeApp_icon').addClass("down");
        win.setSize(win.getSize()[0], 50);
        win.setOpacity(0.5);
        this.isAppCollapsed = true;
    } else {
        $('#rowBody').show();
        $('body').css('overflow-y', 'auto');
        $("#btnResizeApp_icon").removeClass("down");
        $('#btnResizeApp_icon').addClass("up");
        win.setSize(win.getSize()[0], appInitHieght);
        win.setOpacity(0.9);
        this.isAppCollapsed = false;
    }
};

// var ind = 0;
// $('#btnResizeApp').on("click", function () {
// });


/*
    Object that performs the following log file operations
    -Read a file (checks if files exists)
    -Write to a a file
    -Append to a file (checks if files exists)
*/

var LogFile = function (path) {
    this.path = path || "C:/Users/MCSD-5/Documents/T_Mot/Electron Projects/TaskMonitor/logData.txt";
};
LogFile.prototype.save = function (content) {
    var path = this.path;
    jetpack.write(path, content);
};
LogFile.prototype.open = function () {
    if (jetpack.exists(this.path) !== false) {
        console.log('file');
        return jetpack.read(this.path);
    } else {
        return false;
    }
};
LogFile.prototype.append = function (content) {
    if (jetpack.exists(this.path) !== false) {
        jetpack.append(this.path, content);
    }
};
