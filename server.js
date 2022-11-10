var express = require('express');
const path = require('path');
const app = express();
var http = require('http'); 
const server = http.createServer(app);
const {Server} = require("socket.io");
var io = new Server(server);
const cors = require('cors');
const fetch = require('node-fetch-commonjs');
const endpoint = "https://script.google.com/macros/s/AKfycbxeJVPkVJo4itXAgdt-HaH8EpvWm50V8DQ25dKklHkathUB4McBU_31kqT8Jm7LsUCT/exec";
const { Pool } = require('pg');

function insert_query(yt,yd,cih,et,pf,w,yl){
  return 'INSERT INTO trackings(your_ter,your_deck,cih,en_ter,pf,win,your_life) VALUES(\''+yt+'\',\''+yd+'\',\''+cih+'\',\''+et+'\',\''+pf+'\',\''+w+'\',\''+yl+'\');';
}

function select_query(){
  return 'SELECT * FROM trackings;'
}

function select_query_fil(yt,et){
  if(yt == 0 && et == 0) {
    return 'SELECT * FROM trackings;'
  }else if(yt == 0){
    return 'SELECT * FROM trackings WHERE en_ter = \''+et+'\';'
  }else if(et == 0){
    return 'SELECT * FROM trackings WHERE your_ter = \''+yt+'\';'
  }else{
    return 'SELECT * FROM trackings WHERE your_ter = \''+yt+'\' AND en_ter = \''+et+'\';'
  }
}

var client = new Pool({
  user:'smsmmoifqrqkfh',
  host:'ec2-3-229-8-233.compute-1.amazonaws.com',
  database:'ddc8b8t68u0lbf',
  password:'92d9697562aa3d0cd94d97ee8b027ae55ccdbab718f58c3f2eb9847b3e0229c5',
  port:5432,
  ssl: {
    rejectUnauthorized: false
  }
})

client.connect()
.then(() => console.log("Connected successfuly"))

//app uses
app.use(express.static(__dirname));
app.use(cors())
app.use(express.json())



io.on('connection',(socket) => {
  console.log('a user connected');

  socket.on('sql-gettrack',function(){
    console.log('select')
    //var response = []
    client.connect().then(() => client.query(select_query(),(err,res) =>{
      if (err) {
        console.log(err.stack)    
    } else {    
      //res.rows;
      socket.emit('emit-settracks',res.rows)
      console.log(res.rows);
    }
    }))//.then(() => socket.emit('emit-settracks',response))
  })

  socket.on('sql-gettrack-filter',function(y_t,e_t){
    console.log('select')
    //var response = []
    client.connect().then(() => client.query(select_query_fil(y_t,e_t),(err,res) =>{
      if (err) {
        console.log(err.stack)    
    } else {    
      //res.rows;
      socket.emit('emit-settracks',res.rows)
      console.log(res.rows);
    }
    }))//.then(() => socket.emit('emit-settracks',response))
  })

  socket.on('sql-settrack',function(yt,yd,cih,et,pf,w,yl){
    console.log('INSERT INTO trackings(your_ter,your_deck,cih,en_ter,pf,win,your_life) VALUES(\''+yt+'\',\''+yd+'\',\''+cih+'\',\''+et+'\',\''+pf+'\',\''+w+','+yl+'\');');
    client.connect()
    .then(() => client.query(insert_query(yt,yd,cih,et,pf,w,yl), (err, res) => {
      if (err) {
          console.log(err.stack)    
      } else {    
          console.log("insert")    
      }
    }))
    .then(() => socket.broadcast.emit('defeat'));
  })

  socket.on('sql-settrack_',function(yt,yd,cih,et,pf,w,yl){
    console.log('INSERT INTO trackings(your_ter,your_deck,cih,en_ter,pf,win) VALUES("'+yt+'","'+yd+'","'+cih+'","'+et+'","'+pf+'","'+w+'")');
    client.connect()
    .then(() => client.query(insert_query(yt,yd,cih,et,pf,w,yl), (err, res) => {
      if (err) {
          console.log(err.stack)    
      } else {    
          console.log(res.rows[0])    
      }
    }));
  })

  socket.on('emit-setterritory',function(en_ter){
    socket.broadcast.emit('emit-setterritory',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-setsheets',function(en_ter){
    socket.broadcast.emit('emit-setsheets',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-setto',function(en_ter){
    socket.broadcast.emit('emit-setto',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-setlife',function(en_ter){
    socket.broadcast.emit('emit-setlife',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-seten',function(en_ter,num){
    socket.broadcast.emit('emit-seten',en_ter,num);
    console.log(en_ter);
  })

  socket.on('emit-setfie',function(en_ter,num){
    socket.broadcast.emit('emit-setfie',en_ter,num);
    console.log(en_ter);
  })

  socket.on('emit-setgy',function(en_ter,num){
    socket.broadcast.emit('emit-setgy',en_ter,num);
    console.log(en_ter);
  })

  socket.on('emit-setrem',function(en_ter,num){
    socket.broadcast.emit('emit-setrem',en_ter,num);
    console.log(en_ter);
  })

  socket.on('emit-remen',function(en_ter){
    socket.broadcast.emit('emit-remen',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-remfie',function(en_ter){
    socket.broadcast.emit('emit-remfie',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-remgy',function(en_ter){
    socket.broadcast.emit('emit-remgy',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-remrem',function(en_ter){
    socket.broadcast.emit('emit-remrem',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-d100',function(en_ter){
    socket.broadcast.emit('emit-d100',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-hundnumbers',function(en_ter){
    socket.broadcast.emit('emit-hundnumbers',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-judgement',function(en_ter){
    socket.broadcast.emit('emit-judgement',en_ter);
    console.log(en_ter);
  })

  socket.on('reload',function(){
    socket.broadcast.emit('reload');
  })

  socket.on('defeat',function(){
    socket.broadcast.emit('defeat');
  })

  socket.on('addtap',function(en_ter){
    socket.broadcast.emit('addtap',en_ter);
    console.log(en_ter);
  })

  socket.on('remtap',function(en_ter){
    socket.broadcast.emit('remtap',en_ter);
    console.log(en_ter);
  })

  socket.on('emit-getturn',function(en_ter){
    socket.broadcast.emit('emit-getturn',en_ter);
  })

  socket.on('call_aura',function(num){
    socket.broadcast.emit('emit-pullaura',num)
  })

  socket.on('call-pullaura',function(pull){
    socket.broadcast.emit('emit-getaura',pull)
  })
//===================================================//
  socket.on('v2_set_enemyTerritory',function(cardname){
    socket.broadcast.emit('set_enemyTerritory',cardname)
  })
//===================================================//
  socket.on('disconnect', () => {
    console.log('user dc');
  });
})

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000')
})