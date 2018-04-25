const app = require('electron').remote.app
var _dateTime, _appState, _taskLog;
//tls -> Task log state
var _tls;
//The delay task logging operations
var _timeDelay = 600000, _timeDelayAppStart = 5000;
// var _timeDelay = 10000, _timeDelayAppStart = 5000;
var _user;
var _waiter;
var DBConnect;

$(document).ready(function () {
    //Initialize a new App user object
    _user = new AppUser();
    //Initialize a new date time object
    _dateTime = new DateTime();
    _dateTime.initAppStartTime();
    //Initialize a new App state object
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
        _appState.toggleCollapse(430);
    }, function () {
        _taskLog.initFromDB();
    });

    _waiter.add("start_logging", function () {
        startTaskLogging();
    }, function () { });

    _waiter.add("goto_new_task", function () {
        _tls.operationIndex = 0;
        UIConfigure(UI_FLOW[_tls.operationIndex]);
    }, function () { });

    _user.authenticate();
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
