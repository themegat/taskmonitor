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
    initDBConnection();

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
            DBConnect.destroy();
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
                initDBConnection();
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

    setTimeout(function () {
        startAuthentication();
    }, 2000);
    
    window.addEventListener('error', function (evt) {
        evt.preventDefault();
    });

});

var startAuthentication = function () {
    DBConnect.connect(err => {
        if (err) {
            $("#txtIPAddr").val(localStorage.getItem("IPAddr"));
            $("#txtDBUser").val(localStorage.getItem("dbUser"));
            $("#txtDBPWord").val(localStorage.getItem("dbPWord"));
            UIConfigure(UI_FLOW[4]);
            _appState.toggleCollapse(430);
            Toast(err, "Fatal Error");
        } else {
            _user.authenticate();
        }
    })
}

var initDBConnection = function () {
    DBConnect = mySql.createConnection({
        host: localStorage.getItem("IPAddr"),
        user: localStorage.getItem("dbUser"),
        password: localStorage.getItem("dbPWord"),
        database: "task_db"
    });
};

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

window.onerror = function (msg, url, line) {
    var dateNow = new Date();
    try {
        msg = msg.replace(/'/g, '');
        var query = "insert into error_log values(0,'" + msg + "', '" + _dateTime.convertForDB(dateNow) + "', '" + _user.id + "')";
        DBConnect.query(query, function (err, result) {
            if (err) {
                throw err;
            } else {
                Toast("A fatal error occured. It is advised to restart the application. If the error persists, please contact the administrator.", "Fatal Error");
            }
        });
    } catch (err) {
        Toast(err, "Fatal Error");
    }
    return true; // same as preventDefault
};