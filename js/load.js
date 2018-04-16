var _dateTime, _appState, _logFile, _taskLog;
//tls - Task log state
var _tls;
//The delay task logging operations
var _timeDelay = 900000, _timeDelayAppStart = 300000;

$(document).ready(function () {
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

    setTimeout(function () {
        _appState.toggleCollapse();
        _tls = new TaskLogState();
    }, _timeDelayAppStart);
});