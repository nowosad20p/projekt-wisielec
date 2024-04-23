// server.js
const { randomUUID } = require('crypto');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const app = express();


const server = http.createServer(app);
const io = socketIo(server);
const connectedUsers = {};
const userNames = {};
const roomData = {};
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'localhost:3000'); // Replace with your React app's URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
    
  // Handle joining a room
  socket.on('joinRoom', (room,name) => {
  
    socket.join(room);
  
    
    // Add the user to the connectedUsers object
    if (!connectedUsers[room]) {
      console.log("NOWY")
        connectedUsers[room] = [];
        userNames[room]={};
    }
    connectedUsers[room].push(socket.id);
    userNames[room][socket.id]=name;
    console.log(userNames[room])
    console.log(connectedUsers);
    console.log(`User ${socket.id} joined room ${room}`);
    
    // Emit the updated user list to all clients in the room
    io.to(room).emit('userList', [room,userNames[room]]);
    console.log(io.sockets.adapter.rooms)
});
socket.on('createRoom', (name) => {
    let room = Math.floor(Math.random()*1000)+"";
    socket.join(room);
    userNames[room]={};
    userNames[room][socket.id]=name;
    // Add the user to the connectedUsers object
    connectedUsers[room] = [];
    connectedUsers[room].push(socket.id);
    console.log(connectedUsers)
    console.log(`User ${name} (${socket.id}) joined room ${room}`);

    // Emit the updated user list to all clients in the room
    
    
    io.to(room).emit('userList', [room,userNames[room]]);
});
socket.on('makeTurn',(room,key)=>{
  if(socket.id == roomData[room]["curPlayer"]){
    
     
    let newWord = [...roomData[room]["hiddenWord"]];
    let found = false;
    for(let i = 0; i < roomData[room]["word"].length;i++){
      if(key.toLowerCase() == roomData[room]["word"][i]){
       
        newWord[i] = key;
        found = true;
      }
    }
    if(!found){
      roomData[room]["guessesLeft"]--;
    }
    console.log(roomData[room]["word"])
    roomData[room]["hiddenWord"]=newWord.join("");
    roomData[room]["curTurn"]++;
    if(roomData[room]["curTurn"]>=connectedUsers[room].length){
      roomData[room]["curTurn"]=0;
      console.log("DRUGA TURA")
    }
    roomData[room]["curPlayer"]=connectedUsers[room][roomData[room]["curTurn"]];
   io.to(room).emit('nextTurn',{"word":roomData[room]["hiddenWord"],"curTurn":roomData[room]["curPlayer"],"guessesLeft":roomData[room]["guessesLeft"]})

  }
})
socket.on('startGame',async (room)=>{

  if(socket.id===connectedUsers[room][0]){
    console.log("STARTING GAME IN ROOM "+room);
    roomData[room]={};
    const response = await axios.get('https://random-word-api.herokuapp.com/word');
    
    roomData[room]["word"]=response.data[0];
    roomData[room]["curPlayer"]=socket.id;
    roomData[room]["curTurn"]=0;
    roomData[room]["guessesLeft"]=8;
    let hiddenWord = "";
    for(let i =0;i<response.data[0].length;i++){
      hiddenWord+="-";
    }
    roomData[room]["hiddenWord"]=hiddenWord;
    roomData[room]["playerChancesToGuess"] = {};
    connectedUsers[room].forEach(e=>{ roomData[room]["playerChancesToGuess"][e]=3});
   io.to(room).emit('nextTurn',{"word":roomData[room]["hiddenWord"],"curTurn":roomData[room]["curPlayer"],"guessesLeft":roomData[room]["guessesLeft"]})
  }
})
  // Handle chat messages (you can customize this part)
  socket.on('chatMessage', (message) => {
    // Broadcast the message to everyone in the room
    io.to('myRoom').emit('message', message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});