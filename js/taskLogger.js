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

//Initialize a new Task logging object and load data from file
var _taskLog = new TaskLog();

$(document).ready(function () {
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
});

//tls - Task log state
var tls;
//The delay task logging operations
var timeDelay = 10000;
$(".hideable").hide();
$('#txtQuestion').html("");
setTimeout(function () {
    tls = new TaskLogState();
}, timeDelay);

//User action, button events for next button
$('#btnNext').on("click", function () {
    if (tls.operationIndex == 0) {
        tls.currentTask = $('#txtTaskDetails').val();
        if (tls.currentTask == "" || tls.currentTask.length < 5) {
            Toast("Invalid task description");
        } else {
            $('#segTaskDetails').html(tls.currentTask);
            tls.operationIndex = 1;
            TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
        }
    } else if (tls.operationIndex == 2) {
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
                    _taskLog.add(tls.currentTask, _dateTime.getDate() + " " + strTime);
                    tls.operationIndex = 0;
                    TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
                } else {
                    var taskObj = _taskLog.getLast();
                    if (taskObj !== null) {
                        result = _dateTime.compare(_dateTime.getDate() + " " + strTime, taskObj.time);
                        if (result <= 0) {
                            Toast("invalid time selected.")
                        } else {
                            _taskLog.add(tls.currentTask, _dateTime.getDate() + " " + strTime);
                            tls.operationIndex = 0;
                            TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
                        }
                    }
                }
            }
        }
    }
});

//User action, button events for yes/no buttons
$('#btnYes').on("click", function () {
    if (tls.operationIndex == 1) {
        $(".hideable").hide();
        $('#txtQuestion').html("");
        _appState.toggleCollapse();
        setTimeout(function () {
            TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
            _appState.toggleCollapse();
        }, timeDelay);
    }
});
$('#btnNo').on("click", function () {
    if (tls.operationIndex == 1) {
        tls.operationIndex = 2;
        TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
    }
});