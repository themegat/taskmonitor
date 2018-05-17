const electron = require('electron');
const _app = require('electron').remote.app
const remote = require('electron').remote;
var _win = remote.getCurrentWindow();
var _dateTime, _appState, _taskLog;
//tls -> Task log state
var _tls;
//The delay task logging operations
var _timeDelay = 600000, _timeDelayAppStart = 1000;
// var _timeDelay = 10000, _timeDelayAppStart = 1000;
var _user;
var _waiter;
var DBConnect;
var _screenWidth;
var _inactiveMonitor;
var _isDevToolOn = false;

$(document).ready(function () {
    document.addEventListener("keydown", function (e) {
        if (e.which === 123) {
            _win.toggleDevTools();
            if (_isDevToolOn) {
                _isDevToolOn = false;
                appResizer.slideX(325, function () {
                    _win.setSize(325, _win.getSize()[1]);
                });
            } else {
                _isDevToolOn = true;
                _win.setSize(825, _win.getSize()[1]);
                appResizer.slideX(825, null);
            }
        }
    });

    $('#btnMaximizeApp').hide();
    $('#appHead').hide();
    _screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width
    _win.setSkipTaskbar(true);
    //Initialize a new App user object
    _user = new AppUser();
    //Initialize a new date time object
    _dateTime = new DateTime();
    _dateTime.initAppStartTime();
    //Initialize a new App state objects
    _appState = new AppViewState();
    //Initialize a new Task logging object and load data from file
    _taskLog = new TaskLog();
    //Initialize a new Waiter object
    _waiter = new Waiter();

    $(".hideable").hide();
    $('#txtQuestion').html("");

    _appState.toggleCollapse();

    DBConnect = mySql.createConnection({
        host: "192.168.15.173",
        user: "admin",
        password: "Password1",
        database: "task_db"
    });

    _waiter.add("user_auth", function () {
        UIConfigure(UI_FLOW[3]);
        setTimeout(function () {
            _appState.toggleCollapse(430);
        }, 2000);
    }, function () {
        _taskLog.initFromDB();
    });

    _waiter.add("start_logging", function () {
        startTaskLogging();
        //Initialize the inactivity monitor and start monitoring
        _inactiveMonitor = new AppInteractMonitor();
        _inactiveMonitor.registerCallback(function () {
            if (_appState.isAppCollapsed) {
                _appState.toggleCollapse();
            }
            $("#txtTaskDetails").val("");
            clearInterval(_logTimeOut);
            Toast("The application has reset due to no activity from you. Any unsubmitted task has been lost.")
            _taskLog.arTaskLog = [];
            _tls.operationIndex = 0;
            UIConfigure(UI_FLOW[_tls.operationIndex]);
            $('body').on('click', function () {
                _dateTime = new DateTime();
                _dateTime.initAppStartTime();
                _inactiveMonitor.start();
                $('body').off('click');
            });
        });
        _inactiveMonitor.start();
        $('#appHead').show();
    }, function () { });

    _waiter.add("goto_new_task", function () {
        _tls.operationIndex = 0;
        UIConfigure(UI_FLOW[_tls.operationIndex]);
    }, function () { });

    try {
        _user.authenticate();
    } catch (err) {
        Toast(err, "Fatal Error");
    }
});

var startTaskLogging = function () {
    setTimeout(function () {
        _appState.toggleCollapse();
        _tls = new TaskLogState();
    }, _timeDelayAppStart);
};

var Waiter = function () {
    this.list = [];
};

/*The waiter is used as a Promise providing callback mechanisims for MYSQL and other AJAX calls 
add - to the waiter list by providing a name and the success and fail callbacks
*/
Waiter.prototype.add = function (functionName, onSuccessFunction, onFailFunction) {
    this.list.push({ name: functionName, onSuccess: onSuccessFunction, onFail: onFailFunction });
};
/* call - by providing the name of the success and fail callbacks, also provide the parameters to feed the 
 the callbacks*/
Waiter.prototype.call = function (functionName, onSuccessResult, onFailResult) {
    for (let waitObj of this.list) {
        if (waitObj.name === functionName) {
            if (onFailResult == null || onFailResult == undefined) {
                waitObj.onSuccess(onSuccessResult);
            } else {
                waitObj.onFail(onFailResult);
            }
        }
    }
};
