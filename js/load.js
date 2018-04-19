var _dateTime, _appState, _logFile, _taskLog;
//tls - Task log state
var _tls;
//The delay task logging operations
// var _timeDelay = 900000, _timeDelayAppStart = 300000;
var _timeDelay = 10000, _timeDelayAppStart = 5000;
var _user;

$(document).ready(function () {
    //Initialize a new App user object
    _user = new AppUser();
    //Initialize a new date time object
    _dateTime = new DateTime();
    //Initialize a new App state object
    _appState = new AppViewState();
    //Initialize a new Log file object
    _logFile = new LogFile("C:/Users/MCSD-5/Documents/T_Mot/Electron Projects/TaskMonitor/logData.txt");
    //Initialize a new Task logging object and load data from file
    _taskLog = new TaskLog();

    $(".hideable").hide();
    $('#txtQuestion').html("");
    // setTimeout(function () {
    //     ResizeApp(450, function(){$('#lo_login').show();});
    // }, 3000);

    _appState.toggleCollapse();
    var data = _logFile.open();
    if (data !== false) {
        data = data.split("\n");
        var task;
        for (var i = 1; i < data.length; i++) {
            task = data[i];
            task = task.split(";");
            _taskLog.add(task[0], task[1]);
        }
    }

    if (!_user.authenticate()) {
        setTimeout(function () {
            TaskFlowUIConfig(TASK_FLOW_LIST[3]);
            _appState.toggleCollapse(430);
        }, 2000);
    } else {
        startTaskLogging();
    }
});

var startTaskLogging = function () {
    setTimeout(function () {
        _appState.toggleCollapse();
        _tls = new TaskLogState();
    }, _timeDelayAppStart);
};