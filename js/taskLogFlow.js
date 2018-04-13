var TaskLogOperation = function (question, input, action) {
    this.question = question;
    this.input = input;
    this.action = action;
};

var TASK_FLOW_LIST = [];
TASK_FLOW_LIST.push(new TaskLogOperation("What have you been up to?", "text", "next"));
TASK_FLOW_LIST.push(new TaskLogOperation("Are you still performing this task", "display", "response"));
TASK_FLOW_LIST.push(new TaskLogOperation("When did u finish the task?", "time", "next"));

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

var TaskLogState = function () {
    this.currentTask = "";
    this.operationIndex = 0;
    TaskFlowUIConfig(TASK_FLOW_LIST[this.operationIndex])
};

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

var _taskLog = new TaskLog();

var tls;
var timeDelay = 1000;
$(".hideable").hide();
$('#txtQuestion').html("");
setTimeout(function () {
    tls = new TaskLogState();
}, timeDelay);
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
$('#btnYes').on("click", function () {
    if (tls.operationIndex == 1) {
        $(".hideable").hide();
        $('#txtQuestion').html("");
        setTimeout(function () {
            TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
        }, timeDelay);
    }
});
$('#btnNo').on("click", function () {
    if (tls.operationIndex == 1) {
        tls.operationIndex = 2;
        TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
    }
});