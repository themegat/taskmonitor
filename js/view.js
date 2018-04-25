
const remote = require('electron').remote;
const { dialog } = require('electron').remote;
const jetpack = require('fs-jetpack');
var win = remote.getCurrentWindow();
var appInitHieght = win.getSize()[1];

//# Custom alert object
var Toast = function (message, title) {
    if(title == "" || title == undefined){
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
    var timeWorkStart = this.timeWorkStart;
    if (this.compare(timeNow, timeWorkStart) == 1) {
        this.appStartTime = timeWorkStart;
    } else {
        this.appStartTime = timeNow;
    }
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
    console.log(win.getSize());
    size = size | 410;
    if (!this.isAppCollapsed) {
        $('#rowBody').hide();
        $("#btnResizeApp_icon").removeClass("up");
        $('#btnResizeApp_icon').addClass("down");
        ResizeApp(20, null);
        win.setOpacity(0.4);
        this.isAppCollapsed = true;
    } else {
        $("#btnResizeApp_icon").removeClass("down");
        $('#btnResizeApp_icon').addClass("up");
        ResizeApp(size, function () { $('#rowBody').show() });
        win.setOpacity(1);
        this.isAppCollapsed = false;
    }
};

var ResizeApp = function (size, funct) {
    var startSize = win.getSize()[1];
    var endSize = size | 20;
    var resizeBy = 10;
    if (endSize < startSize) {
        var resizeInterval = setInterval(function () {
            if (startSize <= (endSize + resizeBy)) {
                if (funct !== null && funct !== undefined) {
                    funct();
                }
                clearInterval(resizeInterval);
                win.setSize(win.getSize()[0], endSize);
            }
            startSize = startSize - resizeBy;
            win.setSize(win.getSize()[0], startSize);
        }, 10);
    } else {
        var resizeInterval = setInterval(function () {
            if (startSize >= (endSize - resizeBy)) {
                if (funct !== null && funct !== undefined) {
                    funct();
                }
                clearInterval(resizeInterval);
                win.setSize(win.getSize()[0], endSize);
            }
            startSize = startSize + resizeBy;
            win.setSize(win.getSize()[0], startSize);
        }, 10);
    }
};

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