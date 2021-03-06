var mySql = require('mysql');

var AppUser = function () {
    this.id = "";
    this.fName = "";
    this.lName = "";
    this.isInit = false;
};

AppUser.prototype.init = function () {
    this.id = localStorage.getItem("user_id");
    this.fName = localStorage.getItem("user_fname");
    this.lName = localStorage.getItem("user_lname");
    this.isInit = true;
};

AppUser.prototype.authenticate = function () {
    if (!this.isInit) {
        this.init();
    }
    var user = this;
    try {
        var query = "select * from user where id='" + user.id + "'";
        DBConnect.query(query, function (err, result) {
            if (err) throw err;
            if (user.id == "" || result.length === 0) {
                _waiter.call("user_auth", "");
            } else if (user.id === result[0].id) {
                _waiter.call("user_auth", null, "");
                $("#txtUserName").html(String(user.fName).substring(0, 1) + "." + user.lName);
            } else {
                _waiter.call("user_auth", "");
            }
        });
    } catch (err) {
        Toast(err);
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

        var query = "insert into user values('" + id + "','" + firstName + "','" + lastName + "')";
        DBConnect.query(query, function (err, result) {
            if (err) {
                if (String(err).indexOf("ER_DUP_ENTRY") === -1) {
                    throw err;
                }
            }
            localStorage.setItem("user_id", id);
            localStorage.setItem("user_fname", firstName);
            localStorage.setItem("user_lname", lastName);
            _appState.toggleCollapse();
            _user.authenticate();
        });
    } catch (err) {
        Toast(err);
    }
};