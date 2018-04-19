var mySql = require('mysql');

$(document).ready(function () {
    var conn = mySql.createConnection({
        host: "192.168.15.173",
        user: "admin",
        password: "Password1"
    })

    conn.connect(function (err) {
        if (err) throw err;
        console.log("Connected to mysql");
        var query = "show databases";
        conn.query(query, function (err, result) {
            if (err) throw err;
            console.log("Sql Result:\n");
            console.log(result);
        });
    });
});

var AppUser = function () {
    this.id = "";
    this.fName = "";
    this.lName = "";
    this.fileName = "C:/Users/MCSD-5/Documents/T_Mot/Electron Projects/TaskMonitor/user.txt";
    this.isInit = false;
};

AppUser.prototype.init = function () {
    var data;
    if (jetpack.exists(this.fileName) !== false) {
        data = jetpack.read(this.fileName);
        if (data !== "") {
            data = data.split(";");
            this.id = data[0];
            this.fName = data[1];
            this.lName = data[2];
            this.isInit = true;
        }
    }
};

AppUser.prototype.authenticate = function () {
    if (!this.isInit) {
        this.init();
    }
    if (this.id == "") {
        return false;
    } else {
        return true;
    }
};

AppUser.prototype.setUser = function (id, firstName, lastName) {
    try {
        if (id.length < 4) {
            throw ("Invalid Employee Number")
        } else if (firstName.length < 3) {
            throw ("Invalid First Name");
        } else if (firstName.length < 3) {
            throw ("Invalid Surname");
        }
        this.id = id;
        this.fName = firstName;
        this.lName = lastName;
        var content = id + ";" + firstName + ";" + lastName;
        jetpack.write(this.fileName, content);
    } catch (err) {
        Toast(err);
    }

};