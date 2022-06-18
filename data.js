const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
//localhost 192.168.1.156
//global 71.105.80.238
const connection = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: '1234',
  database: 'messenger'
});

connection.connect(err => {
  if(err){
    console.log(err);
    return err;
  }
  else{
    console.log('connected')
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('go to /message to see messages or go to /users to see users')
});

app.get('/users',(req, res)=>{
  const SELECT_ALL_USER_QUERY = 'SELECT * FROM users';
  connection.query(SELECT_ALL_USER_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  });
});

app.get('/users/get-name',(req, res)=>{
  const {id} = req.query;
  const SELECT_USER_ID_QUERY = `SELECT users.name FROM users WHERE id = '${id}'`;
  connection.query(SELECT_USER_ID_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results[0].name
      })
    }
  })
})

app.get('/users/get',(req, res)=>{
  const {username,password} = req.query;
  const SELECT_USER_ID_QUERY = `SELECT * FROM users WHERE name = '${username}'`;
  connection.query(SELECT_USER_ID_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      var evaluate = new Promise((resolve, reject)=>{
        console.log('DATA: starting Promise')
        let rep = false;
        for(let i = 0; i<results.length; i++){
          console.log('DATA: round '+i);
          compareIt(password, results[i].password).then((valid)=>{
            if(valid && !rep){
              rep = true;
              console.log('DATA: found');
              console.log(results[i]);
              resolve(results[i]);
            }
            else if(i === results.length-1){
              resolve([]);
            }
          })
        }
      })
      
      evaluate.then((value) => {
        console.log('DATA: posted');
        return res.json({
          data: value
        })
      })
    }
  })
})

app.get('/users/get-all',(req, res)=>{
  const SELECT_ALL_USER_QUERY = `SELECT id,name FROM users`;
  connection.query(SELECT_ALL_USER_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  })
})

async function hashIt(password){
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);

  return hashed;
}

async function compareIt(password, hashedPassword){
  const validPassword = await bcrypt.compare(password, hashedPassword);
  return validPassword;
}

app.get('/test',(req, res)=>{
  const{password} = req.query;
  hashIt(password).then((value) => {
    console.log(value);
    res.send(value);
    compareIt('password', value).then((valid)=>{
      console.log(valid);
    })
  })
})

app.get('/users/add', (req, res) => {
  const {name, email, password} = req.query;
  hashIt(password).then((hashedPassword)=>{
    const INSERT_USERS_QUERY = `INSERT INTO users (id, name, email, password) VALUES(0,'${name}','${email}','${hashedPassword}')`;
    connection.query(INSERT_USERS_QUERY, (err, results)=>{
      if(err){
        return res.send(err)
      }
      else{
        console.log('DATA: added user');
        return res.send('successfully added users')
      }
    })
  })
});

app.get('/message', (req, res) =>{
  const SELECT_ALL_MESSAGE_QUERY = 'SELECT * FROM chat';
  connection.query(SELECT_ALL_MESSAGE_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  }); 
});

app.get('/message/get', (req, res) =>{
  const {chat_id} = req.query;
  const SELECT_CHAT_ID_MESSAGE_QUERY = `SELECT * FROM chat WHERE chat_id = '${chat_id}'`
  connection.query(SELECT_CHAT_ID_MESSAGE_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  }); 
});

app.get('/message/add', (req, res) => {
  const {id, sender, msg, chat_id} = req.query;
  const INSERT_MESSAGE_QUERY = `INSERT INTO chat (id, sender, msg, chat_id) VALUES(${id},${sender},'${msg}','${chat_id}')`;
  connection.query(INSERT_MESSAGE_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully added message')
    }
  })
});

app.get('/chat/create',(req, res) =>{
  const {chat_id,time,msg} = req.query;
  let request = ''
  chat_id.split('_').forEach(user =>{
    request += `(0,${user},'${chat_id}','${time}', '${msg}'),`;
  });
  const INSERT_CHAT_QUERY = `INSERT INTO inboxes (id, user, chat_id, time,msg) VALUES ${request.substring(0,request.length-1)}`;
  connection.query(INSERT_CHAT_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully added chat')
    }
  })
});

app.get('/chat/delete',(req, res)=>{
  const {chat_id} = req.query;
  const DELETE_CHAT_QUERY = `DELETE inboxes , chat  FROM inboxes  INNER JOIN chat  
  WHERE inboxes.chat_id = chat.chat_id and inboxes.chat_id = '${chat_id}'`;
  connection.query(DELETE_CHAT_QUERY, (err, results) =>{
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully deleted chat')
    }
  })
})

app.get('/inbox', (req, res) =>{
  const SELECT_ALL_INBOX_QUERY = 'SELECT * FROM inboxes';
  connection.query(SELECT_ALL_INBOX_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  }); 
});

app.get('/inbox/get-chats',(req, res)=>{
  const {user} = req.query;
  const SELECT_CHAT_ID_QUERY = `SELECT * FROM inboxes WHERE user = ${user}`;
  connection.query(SELECT_CHAT_ID_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  })
})

app.get('/time_stamp', (req, res)=>{
  const{chat_id, time,msg} = req.query;
  const UPDATE_TIME_QUERY = `UPDATE inboxes SET time ='${time}', msg = '${msg}' WHERE chat_id = '${chat_id}'`;
  connection.query(UPDATE_TIME_QUERY, (err, results)=>{
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully updated time')
    }
  })
})

app.get('/notification/clear', (req, res) =>{
  const{user, chat_id} = req.query;
  const CLEAR_NOTIF_QUERY = `UPDATE inboxes SET notification = 0 WHERE chat_id = '${chat_id}' AND user = ${user}`;
  connection.query(CLEAR_NOTIF_QUERY, (err, results) => {
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully cleared notification')
    }
  })
})

app.get('/notification/update', (req, res) =>{
  const{user, chat_id} = req.query;
  console.log(user,chat_id);
  const UPDATE_NOTIF_QUERY = `UPDATE inboxes SET notification = notification + 1 WHERE chat_id = '${chat_id}' AND NOT user = ${user}`;
  connection.query(UPDATE_NOTIF_QUERY, (err, results) => {
    if(err){
      return res.send(err)
    }
    else{
      return res.send('successfully cleared notification')
    }
  })
})

app.get('/login/attempt',(req,res) =>{
  const{username, password} = req.query;
  console.log(username, password);
  const CHECK_USER_EXIST_QUERY =  
  `SELECT
    CASE WHEN EXISTS(SELECT * FROM users WHERE name='${username}' AND password ='${password}')
    THEN 'TRUE'
    ELSE 'FALSE'
  END`;
  connection.query(CHECK_USER_EXIST_QUERY,(err, results) => {
    if(err){
      return res.send(err)
    }
    else{
      return res.json({
        data: results
      })
    }
  })
})


/*
app.listen(4000, ()=> {
  console.log('message server listening on port 4000')
});
*/
const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'production';
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});