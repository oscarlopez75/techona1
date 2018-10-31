var connect = require('../modules/dbConnect').check_user;
var makeToken = require('../modules/makeToken').makeToken;
var verifyToken = require('../modules/verifyToken');
var useradd = require('../modules/add_user');
var express = require('express');


var router = express.Router();

router.get('/', function(req, res){
  res.json({message:"Welcome to the user validation api"});
});


router.post('/', (req, res, next) => {

  if(req.body.username && req.body.password){
    connect(req.body.username, req.body.password)
      .then((result) => {
        makeToken(result.username, result.role)
          .then((token) => {
            res.status(200).json({
              username: result.username,
              role: result.role,
              jwt: token
            });
          })
          .catch(err => {
            res.status(400).json({message: err});
          })
      })
      .catch(err => {
        res.status(400).json({message: err.message});
      })
  }else{
    res.status(400).json({message: 'User and Password required but not supplied'});
  }


});

router.get('/checkToken', (req, res, next) => {

  if( req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization') ){
    let token = req.headers.authorization;

    if(token === 'null'){
      return res.status(401).json({error: "Bad Token"});
    }
    verifyToken.verifyToken(token)
      .then(verifiedToken => {
        return res.status(200).json({message: verifiedToken});
      })
      .catch(err => {
        return res.status(403).json({error: err});
      })
  }else{
	console.log('No token')
    return res.status(401).json({error: "No Token"});
  }
});

router.post('/newuser', (req, res, next) => {

  if(req.body.token){
    verifyToken.verifyToken(req.body.token)
      .then(verifiedToken => {
        // return res.status(200).json({message: verifiedToken});
        useradd.useradd(req.body.addusername, req.body.addpassword, req.body.addrole, function(message, response){
          if (response){
            res.status(200).json({
              message: message
            });
          }else{
            res.status(400).json({message: message});
          }
        });
      })
      .catch(err => {
        return res.status(403).json({error: err});
      })
  }else{
    return res.status(401).json({error: "No Token"});
  }


});



module.exports = router;
