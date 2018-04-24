var _dateTime, _appState, _logFile, _taskLog;
//tls - Task log state
var _tls;
//The delay task logging operations
// var _timeDelay = 900000, _timeDelayAppStart = 300000;
var _timeDelay = 10000, _timeDelayAppStart = 5000;
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
    //Initialize a new Log file object
    _logFile = new LogFile("C:/Users/MCSD-5/Documents/T_Mot/Electron Projects/TaskMonitor/logData.txt");
    //Initialize a new Task logging object and load data from file
    _taskLog = new TaskLog();

    _waiter = new Waiter();

    $(".hideable").hide();
    $('#txtQuestion').html("");
    // setTimeout(function () {
    //     ResizeApp(450, function(){$('#lo_login').show();});
    // }, 3000);

    _appState.toggleCollapse();
    // var data = _logFile.open();
    // if (data !== false) {
    //     data = data.split("\n");
    //     var task;
    //     for (var i = 1; i < data.length; i++) {
    //         task = data[i];
    //         task = task.split(";");
    //         _taskLog.add(task[0], task[1]);
    //     }
    // }

    DBConnect = mySql.createConnection({
        host: "192.168.15.173",
        user: "admin",
        password: "Password1",
        database: "task_db"
    });

    _waiter.add("user_auth", function () {
        // setTimeout(function () {
        UIConfigure(UI_FLOW[3]);
        _appState.toggleCollapse(430);
        // }, 2000);
    }, function () {
        startTaskLogging();
    });

    _waiter.add("goto_new_task", function () {
        _tls.operationIndex = 0;
        UIConfigure(UI_FLOW[_tls.operationIndex]);
    }, function(){});

    // setTimeout(function(){
    _user.authenticate();
    // }, 5000);
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

Waiter.prototype.add = function (functionName, onSuccessFunction, onFailFunction) {
    this.list.push({ name: functionName, onSuccess: onSuccessFunction, onFail: onFailFunction });
};

Waiter.prototype.call = function (functionName, onSuccessResult, onFailResult) {
    // onFailResult = onFailResult | null;
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
