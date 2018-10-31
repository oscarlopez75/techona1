const axios = require('axios');


var verifyToken = function(token){
  return new Promise((resolve, reject) => {

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
        "Authorization": token
      }
    }

    let linkToSearch = 'http://172.17.17.249:8080/login/checkToken'
    axios.get(linkToSearch,axiosConfig)
    .then(posts => {

      resolve(posts.data)
    })
    .catch(err =>{
      console.log(err);
      reject('Error. Not able to verify token')
    })


  });
}


module.exports.verifyToken = verifyToken;
