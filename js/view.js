let $ = require('jquery');
$('#headTest').text("this is a test");
$('#btnTest').on('click', function(){
    $('#headTest').text("button clicked");
})