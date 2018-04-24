/* 
    This object represents the operation that should be performed for a task logging step
    Question - the question that is to be displayed to the user
    Input - the input that is required from the user
    Action - The action that the user has to take
*/
var UIState = function (question, input, action) {
    this.question = question;
    this.input = input;
    this.action = action;
};

//List of steps and operations to be performed
const UI_FLOW = [];
UI_FLOW.push(new UIState("What have you been up to?", "text", "next"));
UI_FLOW.push(new UIState("Are you still performing this task", "display", "response"));
UI_FLOW.push(new UIState("When did u finish the task?", "time", "next"));
UI_FLOW.push(new UIState("You are not signed in. Sign in to continue.", "login", ""));

/*
    Configure the user interface based on operation to be performed. 
    Changes the input types text/time selection
    Changes the user actions next/(yes/no) buttons
*/
var UIConfigure = function (operation) {
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
    this.startTime = "";
    this.operationIndex = 0;
    UIConfigure(UI_FLOW[this.operationIndex])
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

TaskLog.prototype.add = function (taskDescription, taskStart, taskEnd) {
    var taskLog = this;
    var tempStartDate = taskStart;
    if(taskStart instanceof Date){
       tempStartDate =  _dateTime.convertForDB(taskStart);
    }
    try {
        var query = "insert into task values(0, '" + taskDescription + "','" + tempStartDate + "','" + taskEnd +
            "','" + _user.id + "')";
        DBConnect.query(query, function (err, result) {
            if (err) throw err;
            taskLog.arTaskLog.push({ description: taskDescription, timeStart: taskStart, timeEnd: taskEnd });
            _waiter.call("goto_new_task", "", null);
        })
    } catch (err) {
        Toast(err);
    }
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
    try {
        if (_tls.operationIndex == 0) {
            _tls.currentTask = $('#txtTaskDetails').val();
            if (_tls.currentTask == "" || _tls.currentTask.length < 5) {
                throw ("Invalid task description");
            } else {
                $('#segTaskDetails').html(_tls.currentTask);
                _tls.operationIndex = 1;
                UIConfigure(UI_FLOW[_tls.operationIndex]);
            }
        } else if (_tls.operationIndex == 2) {
            $('#txtTaskDetails').val("");
            var strTime = $('#txtTime').val();
            if (strTime == "") {
                throw ("Select a time to continue");
            } else {
                var result = _dateTime.isTimePast(strTime);
                if (parseInt(result) > 0) {
                    throw ("Invalid time selected. Cannot select a future value");
                } else {
                    var taskTimeEnd = _dateTime.getDate() + " " + strTime;
                    if (_taskLog.getSize() <= 0) {
                        if (_dateTime.compare(taskTimeEnd, _dateTime.appStartTime) <= 0) {
                            throw ("Invalid time selected.")
                        }
                        _taskLog.add(_tls.currentTask, _dateTime.appStartTime, taskTimeEnd);
                        // _tls.operationIndex = 0;
                        // UIConfigure(UI_FLOW[_tls.operationIndex]);
                    } else {
                        var taskObj = _taskLog.getLast();
                        if (taskObj !== null) {
                            // console.log(taskObj);
                            result = _dateTime.compare(taskTimeEnd, taskObj.timeEnd);
                            if (result <= 0) {
                                throw ("invalid time selected.")
                            } else {
                                _taskLog.add(_tls.currentTask, taskObj.timeEnd, taskTimeEnd);
                                // _tls.operationIndex = 0;
                                // UIConfigure(UI_FLOW[_tls.operationIndex]);
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        Toast(err);
    }
});

//User action, button events for yes/no buttons
$('#btnYes').on("click", function () {
    if (_tls.operationIndex == 1) {
        $(".hideable").hide();
        $('#txtQuestion').html("");
        _appState.toggleCollapse();
        setTimeout(function () {
            UIConfigure(UI_FLOW[_tls.operationIndex]);
            _appState.toggleCollapse();
        }, _timeDelay);
    }
});
$('#btnNo').on("click", function () {
    if (_tls.operationIndex == 1) {
        _tls.operationIndex = 2;
        UIConfigure(UI_FLOW[_tls.operationIndex]);
    }
});

$('#btnLogin').on("click", function () {
    var id = $('#txtEmpNo').val(), fName = $('#txtFName').val(), lName = $('#txtLName').val();
<<<<<<< HEAD
    _user.setUser(id, fName, lName);
    // _waiter.add("user_new", function () {
    //     _appState.toggleCollapse();
    //     startTaskLogging();
    // }, function () {

    // });
    // if (_user.authenticate()) {
    //     _appState.toggleCollapse();
    //     startTaskLogging();
    // }
=======
    _user.setUser(id, fName, lName, function () {
        _user.authenticate(function (result) {
            if (result) {
                _appState.toggleCollapse();
                startTaskLogging();
            }
        });
    });
>>>>>>> temp
});