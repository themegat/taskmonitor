
const remote = require('electron').remote;
var win = remote.getCurrentWindow();
var appInitHieght = win.getSize()[1];

// $('#headTest').text("this is a test");
// $('#btnTest').on('click', function () {
//     $('#headTest').text("button clicked");
// })
$('#timeTaskEnd').calendar();
$('#btnCloseApp').on("click", function () {
    win.close();
});

//Control the view state of the application (collapse view)

var AppViewState = function(){
    this.isAppCollapsed = false;
};

AppViewState.prototype.toggleCollapse = function(){
    if (!this.isAppCollapsed) {
        $('#rowBody').hide();
        $('body').css('overflow-y', 'hidden');
        $("#btnResizeApp_icon").removeClass("up");
        $('#btnResizeApp_icon').addClass("down");
        win.setSize(win.getSize()[0], 50);
        this.isAppCollapsed = true;
    } else {
        $('#rowBody').show();
        $('body').css('overflow-y', 'auto');
        $("#btnResizeApp_icon").removeClass("down");
        $('#btnResizeApp_icon').addClass("up");
        win.setSize(win.getSize()[0], appInitHieght);
        this.isAppCollapsed = false;
    }
};

var appState = new AppViewState();
$('#btnResizeApp').on("click", function () {
    appState.toggleCollapse();
});

//End control state