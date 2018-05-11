// const remote = require('electron').remote;
// var win = remote.getCurrentWindow();
const { dialog } = require('electron').remote;
var appInitHieght = _win.getSize()[1];

//# Custom alert object
var Toast = function (message, title) {
    if (title == "" || title == undefined) {
        title = "Oops";
    }
    $("#txtMsgTitle").html(title);
    $("#txtMsgContent").html(message);
    if (message) {
        $('.ui.basic.modal').modal('show');
    }
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
    this.appStartTime = null;
    this.timeWorkStart = new Date();
    this.timeWorkStart.setHours(8);
    this.timeWorkStart.setMinutes(0);
    this.timeWorkStart.setSeconds(0);
    this.timeWorkStart.setMilliseconds(0);
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

DateTime.prototype.initAppStartTime = function () {
    var timeNow = new Date();
    this.appStartTime = timeNow;
};

DateTime.prototype.convertForDB = function (date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
        + date.getDate() + " " + date.getHours() + ":"
        + date.getMinutes();
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

//Control the view state of the application (collapse view)
var AppViewState = function () {
    this.isAppCollapsed = false;
};

AppViewState.prototype.toggleCollapse = function (size) {
    size = size | 410;
    if (!this.isAppCollapsed) {
        $('#rowBody').hide();
        $('body').css("background", "#2185d0");
        $("#btnResizeApp_icon").removeClass("up");
        $('#btnResizeApp_icon').addClass("down");
        appResizer.resizeY(31, null);
        appResizer.slideX(50, function () {
            $('#btnMaximizeApp').show();
        });
        _win.setOpacity(0.4);
        this.isAppCollapsed = true;
    } else {
        $('body').css("background", "white");
        $("#btnResizeApp_icon").removeClass("down");
        $('#btnResizeApp_icon').addClass("up");
        appResizer.resizeY(size, function () { $('#rowBody').show() });
        $('#btnMaximizeApp').hide();
        appResizer.slideX(325, null);
        _win.setOpacity(1);
        this.isAppCollapsed = false;
        _app.focus();
    }
};

var ResizeApp = function () { };

ResizeApp.prototype.slideX = function (size, funct) {
    var endPos = _screenWidth - size;
    var initPos = _win.getPosition()[0];
    var moveInterval;
    var increament = 10;
    if (endPos < initPos) {
        moveInterval = setInterval(function () {
            _win.setPosition(initPos - increament, _win.getPosition()[1]);
            increament = increament + 10;
            if (_win.getPosition()[0] < (endPos + 10)) {
                clearInterval(moveInterval);
                if (funct !== null && funct !== undefined) {
                    funct();
                }
            }
        }, 10);
    } else {
        moveInterval = setInterval(function () {
            _win.setPosition(initPos + increament, _win.getPosition()[1]);
            increament = increament + 10;
            if (_win.getPosition()[0] > (endPos - 10)) {
                clearInterval(moveInterval);
                if (funct !== null && funct !== undefined) {
                    funct();
                }
            }
        }, 10);
    }
};

ResizeApp.prototype.resizeY = function (size, funct) {
    var startSize = _win.getSize()[1];
    var endSize = size | 20;
    var resizeBy = 10;
    if (endSize < startSize) {
        var resizeInterval = setInterval(function () {
            if (startSize <= (endSize + resizeBy)) {
                if (funct !== null && funct !== undefined) {
                    funct();
                }
                clearInterval(resizeInterval);
                _win.setSize(_win.getSize()[0], endSize);
            }
            startSize = startSize - resizeBy;
            _win.setSize(_win.getSize()[0], startSize);
        }, 10);
    } else {
        var resizeInterval = setInterval(function () {
            if (startSize >= (endSize - resizeBy)) {
                if (funct !== null && funct !== undefined) {
                    funct();
                }
                clearInterval(resizeInterval);
                _win.setSize(_win.getSize()[0], endSize);
            }
            startSize = startSize + resizeBy;
            _win.setSize(_win.getSize()[0], startSize);
        }, 10);
    }
};

var appResizer = new ResizeApp();

var includeHTML = function () {
    var z, i, elmnt, file, xhttp;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /*make an HTTP request using the attribute value as the file name:*/
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /*exit the function:*/
            return;
        }
    }
};

/*
Monitor the time the user has not interacted with the application.
Monitoring starts when the application is maximized and stops when is collapsed
If the user has not interacted with the application after a set amount of time, then configure 
the application to it's first screen.
*/
var AppInteractMonitor = function () {
    this.monitorInterval = null;
    //time 1800000 = 30min
    this.DELAY_TIME = 1800000;
    this.counter = 0;
    //this will make this a 4 hour long process
    this.MAX_COUNTER = 8;
};

AppInteractMonitor.prototype.start = function () {
    var me = this;
    me.monitorInterval = setInterval(function () {
        if (me.counter > me.MAX_COUNTER) {
            me.callback();
            me.stop();
        }
        me.counter++;
    }, me.DELAY_TIME);
};

AppInteractMonitor.prototype.registerCallback = function (callback) {
    this.callback = callback;
};

AppInteractMonitor.prototype.stop = function () {
    var me = this;
    me.counter = 0;
    clearInterval(me.monitorInterval);
};

AppInteractMonitor.prototype.reset = function () {
    this.counter = 0;
};