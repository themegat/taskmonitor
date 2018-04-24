var mySql = require('mysql');
<<<<<<< HEAD
=======
$(document).ready(function () {
});

var DBConnection = function () {
    this.connection = mySql.createConnection({
        host: "192.168.15.173",
        user: "admin",
        password: "Password1",
        database: "task_db"
    }, function (err, data) {
        if (err) {
            throw err;
        } else {
            return true;
        }
    });
};

DBConnection.prototype.userGet = function (id, callback) {
    var connection = this.connection;
    connection.connect(function (err) {
        if (err) {
            callback(false);
        }
        var query = "select * from user where id='" + id + "'";
        connection.query(query, function (err, result) {
            if (err) {
                callback(false);
            }
            if (result.length === 0) {
                callback(false);
            } else {
                callback(true);
            }
        });
    });
};

DBConnection.prototype.userNew = function (id, firstName, lastName, callback) {
    var connection = this.connection;
    connection.connect(function (err) {
        // if (err) throw err;
        callback(false);
        var query = "insert into user values ('" + id + "','" + firstName + "','" + lastName + "')";
        connection.query(query, function (err) {
            if (err) {
                if (String(err).indexOf("ER_DUP_ENTRY") > -1) {
                    callback(true);
                } else {
                    callback(false);
                }
            } else {
                callback(true);
            }
        });
    });
};
>>>>>>> temp

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

AppUser.prototype.authenticate = function (callback) {
    var userID;
    if (!this.isInit) {
        this.init();
    }
<<<<<<< HEAD
    var userID = this.id;
    try {
        var query = "select * from user where id='" + userID + "'";
        DBConnect.query(query, function (err, result) {
            if (err) throw err;
            if (userID == "" || result.length === 0) {
                _waiter.call("user_auth", "");
            } else if (userID === result[0].id) {
                _waiter.call("user_auth", null, "");
            } else {
                _waiter.call("user_auth", "");
            }
        });
    } catch (err) {
        Toast(err);
=======
    userID = this.id;
    if (userID == "") {
        callback(false);
    } else {
        _dbConnect.userGet(userID, callback);
>>>>>>> temp
    }
};

AppUser.prototype.setUser = function (id, firstName, lastName, callback) {
    var fileName = this.fileName;
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
<<<<<<< HEAD
        var content = id + ";" + firstName + ";" + lastName;
        var fileName = this.fileName;

        var query = "insert into user values('" + id + "','" + firstName + "','" + lastName + "')";
        DBConnect.query(query, function (err, result) {
            if (err) {
                if (String(err).indexOf("ER_DUP_ENTRY") === -1) {
                    throw err;
                }
            }

            jetpack.write(fileName, content);
            _appState.toggleCollapse();
            _user.authenticate();
=======
        _dbConnect.userNew(id, firstName, lastName, function (result) {
            if (result) {
                var content = id + ";" + firstName + ";" + lastName;
                jetpack.write(fileName, content);
                callback(true);
            }
>>>>>>> temp
        });
    } catch (err) {
        Toast(err);
    }
};