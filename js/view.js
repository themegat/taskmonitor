// let $ = require('jquery');
const remote = require('electron').remote;
var win = remote.getCurrentWindow();
var isAppCollapsed = false;
var appInitHieght = win.getSize()[1];

$('#headTest').text("this is a test");
$('#btnTest').on('click', function () {
    $('#headTest').text("button clicked");
})
$('#example1').calendar();
$('#btnCloseApp').on("click", function () {
    win.close();
});
$('#btnResizeApp').on("click", function () {
    if (!isAppCollapsed) {
        $('#rowBody').hide();
        $('body').css('overflow-y', 'hidden');
        $("#btnResizeApp_icon").removeClass("up");
        $('#btnResizeApp_icon').addClass("down");
        win.setSize(win.getSize()[0], 50);
        isAppCollapsed = true;
    } else {
        $('#rowBody').show();
        $('body').css('overflow-y', 'auto');
        $("#btnResizeApp_icon").removeClass("down");
        $('#btnResizeApp_icon').addClass("up");
        win.setSize(win.getSize()[0], appInitHieght);
        isAppCollapsed = false;
    }
});