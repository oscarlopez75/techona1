var nJwt = require('njwt');
var secureRandom = require('secure-random');
var srs = require('secure-random-string');
var writeFiles = require('./dbConnect').writeFiles;



var makeToken = function(username, role){
  return new Promise((resolve, reject) => {

    // var signingKey = secureRandom(512, {type: 'Buffer'}); // Create a highly random byte array of 512 bytes
    var signingKey2 = srs();
    // console.log(signingKey2);

    var claims = {
      login: username,
      role: role
    }

    var jwt = nJwt.create(claims,signingKey2, 'HS512');
    jwt.setExpiration(new Date().getTime() + (120*60*1000)); // Two hours from now
    var jwtCompact = jwt.compact();

    writeFile(jwt, jwtCompact, signingKey2)
      .then(() => {
        resolve(jwtCompact)
      })
      .catch(() =>{
        reject('Could not save to the file')
      })

  });
}

var writeFile = function(jwt, jwtCompact, signingKey2){
  return new Promise((resolve, reject) => {
    var base64SigningKey = signingKey2.toString('base64');

    const record = {
      login: jwt.body.login,
      jti: jwt.body.jti,
      role: jwt.body.role,
      token: jwtCompact
    }

    const keyrecord = {
      jti: jwt.body.jti,
      signingKey: signingKey2
    };

    writeFiles(record, keyrecord)
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      })


  });
}
module.exports.makeToken = makeToken;
