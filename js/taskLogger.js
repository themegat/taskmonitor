/* 
    This object represents the operation that should be performed for a task logging step
    Question - the question that is to be displayed to the user
    Input - the input that is required from the user
    Action - The action that the user has to take
*/
var TaskLogOperation = function (question, input, action) {
    this.question = question;
    this.input = input;
    this.action = action;
};

//List of steps and operations to be performed
var TASK_FLOW_LIST = [];
TASK_FLOW_LIST.push(new TaskLogOperation("What have you been up to?", "text", "next"));
TASK_FLOW_LIST.push(new TaskLogOperation("Are you still performing this task", "display", "response"));
TASK_FLOW_LIST.push(new TaskLogOperation("When did u finish the task?", "time", "next"));
TASK_FLOW_LIST.push(new TaskLogOperation("You are not signed in. Sign in to continue.", "login", ""));

/*
    Configure the user interface based on operation to be performed. 
    Changes the input types text/time selection
    Changes the user actions next/(yes/no) buttons
*/
var TaskFlowUIConfig = function (operation) {
    $('.hideable').addClass("hidden");
    $('.hideable').hide();

    $("#txtQuestion").html(operation.question);

    switch (operation.input) {
        case "text":
            $("#lo_TextIn").removeClass("hidden");
            $("#lo_TextIn").show();
            break;
        case "display":
            $('#lo_TextDisplay').removeClass("hidden");
            $('#lo_TextDisplay').show();
            break;
        case "time":
            $('#lo_TimePicker').removeClass("hidden");
            $('#lo_TimePicker').show();
            break;
        case "login":
            $('#lo_login').removeClass("hidden");
            $('#lo_login').show();
            break;
    }

    switch (operation.action) {
        case "next":
            $('#btnNext').removeClass("hidden");
            $('#btnNext').show();
            break;
        case "response":
            $('#lo_ResponseButtons').removeClass("hidden");
            $('#lo_ResponseButtons').show();
            break;
    }
};

//Object stores the last logged task and the 
//current step/opeation in the logging procedure
var TaskLogState = function () {
    this.currentTask = "";
    this.operationIndex = 0;
    TaskFlowUIConfig(TASK_FLOW_LIST[this.operationIndex])
};

/*
    Object keeps track and logs the users tasks
    Has methods to:
         Add a task to the log
         Get a logged task based on its index in the list
         Get the last logged task
         Convert and returns logged tasks as CSV
*/
var TaskLog = function () {
    this.arTaskLog = [];
};

TaskLog.prototype.add = function (taskDescription, taskDate) {
    this.arTaskLog.push({ description: taskDescription, time: taskDate });
};

TaskLog.prototype.get = function (index) {
    if (this.arTaskLog.length > 0) {
        return this.arTaskLog[index];
    } else {
        return null;
    }
};

TaskLog.prototype.getLast = function () {
    if (this.arTaskLog.length > 0) {
        return this.get(this.arTaskLog.length - 1);
    }
};

TaskLog.prototype.getSize = function
    () {
    return this.arTaskLog.length;
}

TaskLog.prototype.allDataToString = function () {
    var result = "";
    for (let task of this.arTaskLog) {
        result = result + "\n" + task.description + ";" + task.time;
    }
    return result;
};

//User action, button events for next button
$('#btnNext').on("click", function () {
    if (_tls.operationIndex == 0) {
        _tls.currentTask = $('#txtTaskDetails').val();
        if (_tls.currentTask == "" || _tls.currentTask.length < 5) {
            Toast("Invalid task description");
        } else {
            $('#segTaskDetails').html(_tls.currentTask);
            _tls.operationIndex = 1;
            TaskFlowUIConfig(TASK_FLOW_LIST[_tls.operationIndex]);
        }
    } else if (_tls.operationIndex == 2) {
        $('#txtTaskDetails').val("");
        var strTime = $('#txtTime').val();
        if (strTime == "") {
            Toast("Select a time to continue");
        } else {
            var result = _dateTime.isTimePast(strTime);
            if (parseInt(result) > 0) {
                Toast("Invalid time selected. Cannot select a future value");
            } else {
                if (_taskLog.getSize() <= 0) {
                    _taskLog.add(_tls.currentTask, _dateTime.getDate() + " " + strTime);
                    _tls.operationIndex = 0;
                    TaskFlowUIConfig(TASK_FLOW_LIST[_tls.operationIndex]);
                } else {
                    var taskObj = _taskLog.getLast();
                    if (taskObj !== null) {
                        result = _dateTime.compare(_dateTime.getDate() + " " + strTime, taskObj.time);
                        if (result <= 0) {
                            Toast("invalid time selected.")
                        } else {
                            _taskLog.add(_tls.currentTask, _dateTime.getDate() + " " + strTime);
                            _tls.operationIndex = 0;
                            TaskFlowUIConfig(TASK_FLOW_LIST[_tls.operationIndex]);
                        }
                    }
                }
            }
        }
    }
});

//User action, button events for yes/no buttons
$('#btnYes').on("click", function () {
    if (_tls.operationIndex == 1) {
        $(".hideable").hide();
        $('#txtQuestion').html("");
        _appState.toggleCollapse();
        setTimeout(function () {
            TaskFlowUIConfig(TASK_FLOW_LIST[_tls.operationIndex]);
            _appState.toggleCollapse();
        }, _timeDelay);
    }
});
$('#btnNo').on("click", function () {
    if (_tls.operationIndex == 1) {
        _tls.operationIndex = 2;
        TaskFlowUIConfig(TASK_FLOW_LIST[_tls.operationIndex]);
    }
});

$('#btnLogin').on("click", function () {
    var id = $('#txtEmpNo').val(), fName = $('#txtFName').val(), lName = $('#txtLName').val();
    _user.setUser(id, fName, lName, function () {
        _user.authenticate(function (result) {
            if (result) {
                _appState.toggleCollapse();
                startTaskLogging();
            }
        });
    });
});