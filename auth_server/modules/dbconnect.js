const sql = require('mssql/msnodesqlv8');
var compare = require('./pass_comp').checkit;



var check_user = (username, password) => {
  return new Promise((resolve, reject) => {


    const pool = new sql.ConnectionPool({
      database: "Support",
      server: "SUPPORT-TEST\\SQLEXPRESS",
      driver: 'msnodesqlv8',
      options: {
        trustedConnection: true
      }
    })
    // console.log(pool);
    pool.connect().then(() => {

      let query = 'select * from users where username = \'' + username + '\'';

      pool.request().query(query, (err, result) => {
          if(err){
            reject({message: 'Error querying the database'})
          } else{
            if(result.recordset.length == 1){
              compare(password, result.recordset[0].password)
                .then(() => {
                  resolve(result.recordset[0]);
                })
                .catch(err => {
                  reject({message: err.message});
                })
            }else{
              if(result.recordset.length > 1){
                reject({message: 'More than one user found sorry'});
              }else{
                reject({message: 'No user found sorry'});
              }

            }

          }
        })
    })


  })

}


var writeFiles = (record, keyrecord) => {
  return new Promise((resolve, reject) => {

    const pool = new sql.ConnectionPool({
      database: "Support",
      server: "SUPPORT-TEST\\SQLEXPRESS",
      driver: 'msnodesqlv8',
      options: {
        trustedConnection: true
      }
    })
    // insert into auths (login, jti, role, token)	values('pepito', 'blablabla', 'admin', 'dhdhdkty.jjdjdj.567')
    pool.connect()
      .then(() => {
        let query = 'insert into auths (login, jti, role, token) values(\''
        query = query + record.login + "\',\'" + record.jti + "\',\'" + record.role + "\',\'" + record.token + "\')"



        pool.request().query(query, (err, result) => {
          if(err){
            reject(err);
          }else{
            let query = '';
            query = 'insert into keys (jti, signingKey) values(\''
            query = query + keyrecord.jti + "\', \'" + keyrecord.signingKey + "\')"



            pool.request().query(query, (err, result) => {
              if(err){
                console.log(err);
                reject(err);
              }else{
                resolve();
              }
            })
          }
        });

      })
      .catch(err =>{
        reject('No DB connection');
      })

  })
}

var findSigningKey = (jti) => {
  return new Promise((resolve, reject) => {

    const pool = new sql.ConnectionPool({
      database: "Support",
      server: "SUPPORT-TEST\\SQLEXPRESS",
      driver: 'msnodesqlv8',
      options: {
        trustedConnection: true
      }
    })
    // select signingKey from keys where jti = '086a1662-3369-423a-bb6a-d4023f966f65'
    pool.connect()
      .then(() => {
        let query = 'select signingKey from keys where jti = \'' + jti + '\'';

        pool.request().query(query, (err, result) => {
          if(err){
            reject(err)
          }else{
            if(result.recordset.length == 0){
              reject('Token not found in DB')
            }else{
              resolve(result.recordset[0].signingKey)
            }

          }
        })

      })
      .catch(err =>{
        reject('No DB connection');
      })

  })
}

var insert_user = (username, password, role) => {
  return new Promise((resolve, reject) => {
    const pool = new sql.ConnectionPool({
      database: "Support",
      server: "SUPPORT-TEST\\SQLEXPRESS",
      driver: 'msnodesqlv8',
      options: {
        trustedConnection: true
      }
    })

    pool.connect()
      .then(() => {
        let query = 'insert into users (username, password, role, active) values(\''
        query = query + username + "\',\'" + password + "\',\'" + role + "\',\'" + 1 + "\')"


        pool.request().query(query, (err, result) => {
          if(err){
            reject('Not able to add the user ' + username);
          }else{
            resolve('User' + username + ' added')
          }
        });

      })
      .catch(err =>{
        reject('No DB connection');
      })



  });
}

module.exports.check_user = check_user;
module.exports.writeFiles = writeFiles;
module.exports.findSigningKey = findSigningKey;
module.exports.insert_user = insert_user;
