var bcrypt =require('bcrypt');


var checkit = function (password, passwordenc){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordenc, function(err, res){
      if(err){        
        console.log(err);
        reject({message: err})
      }else{
        if(res){
          resolve()
        }else{
          reject({message: 'incorrect password'})
        }
      }
    });
  })

};


module.exports.checkit = checkit;
