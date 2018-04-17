var mySql = require('mysql');

$(document).ready(function(){
    var conn = mySql.createConnection({
        host: "192.168.15.173",
        user: "admin",
        password: "Password1"
    })

    conn.connect(function(err){
        if(err) throw err;
        console.log("Connected to mysql");
        var query = "show databases";
        conn.query(query, function(err, result){
            if(err) throw err;
            console.log("Sql Result:\n");
            console.log(result);
        });
    });
});