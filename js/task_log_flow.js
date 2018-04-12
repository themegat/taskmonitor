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

// TaskLogPerform.prototype.next = function(){
//     if(this.currentTask == ""){
//         TaskFlowUIConfig(TASK_FLOW_LIST[this.operationIndex]);
//     }
// };

var tls;
$(".hideable").hide();
$('#txtQuestion').html("");
setTimeout(function () {
    tls = new TaskLogState();
}, 10000);
$('#btnNext').on("click", function () {
    if (tls.operationIndex == 0) {
        tls.currentTask = $('#txtTaskDetails').val();
        $('#segTaskDetails').html(tls.currentTask);
        tls.operationIndex = 1;
        TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
    } else if (tls.operationIndex == 2) {
        $('#txtTaskDetails').val("");
        tls.operationIndex = 0;
        TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
    }
});
$('#btnYes').on("click", function () {
    if (tls.operationIndex == 1) {
        $(".hideable").hide();
        $('#txtQuestion').html("");
        setTimeout(function () {
            TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
        }, 10000);
    }
});
$('#btnNo').on("click", function () {
    if (tls.operationIndex == 1) {
        tls.operationIndex = 2;
        TaskFlowUIConfig(TASK_FLOW_LIST[tls.operationIndex]);
    }
});