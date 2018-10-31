var nJwt = require('njwt');
var Base64 = require('js-base64').Base64;
var findSigningKey = require('./dbConnect').findSigningKey;

var verifyToken = (token) => {
  return new Promise((resolve, reject) =>{
    try {
      var payLoadUrl = token.split('.')[1];
      var payLoadBase64 = payLoadUrl.replace('-', '+').replace('_', '/');
      var payLoad = JSON.parse(Base64.decode(payLoadBase64));
    } catch (e) {
      console.log(e);
      reject('Unexpected payload')
    }

    // var query = {jti: payLoad.jti};
    findSigningKey(payLoad.jti)
      .then((signingKey) => {
        nJwt.verify(token,signingKey, 'HS512', function(err,verifiedJwt){
            if(err){
              reject(err); // Token has expired, has been tampered with, etc
            }else{
              resolve(verifiedJwt); // Will contain the header and body
            }
          });

      })
      .catch((err) => {
        reject(err)
      })


  });
};


module.exports.verifyToken = verifyToken;
