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

