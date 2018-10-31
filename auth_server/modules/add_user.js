var validate = require('./check_name_password');
var insert_user = require('./dbconnect').insert_user;


var message = "";
var response = false;

var useradd = function(username, password, role, callback){
  validate.validate(username, password, function(mess, resp){
    if (resp){
      var bcrypt =require('bcrypt');
      var salt = bcrypt.genSaltSync(10);
      var hashpassword = bcrypt.hashSync(password, salt);
      insert_user(username, hashpassword, role)
        .then((mess) => {
          callback(mess, true)
        })
        .catch((err) => {          
          callback(err, false)
        })
    }
  })

};


module.exports.useradd = useradd;


// callback(mess, resp);
