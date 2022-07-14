/**
 * socketlogic.js
 * 
 * Manage Socket IO Functionality
 * 
 */

 const Room = require('../models/Room');


 
 let roomCollection = [];    // TODO: Save to database for persistence
 
 exports.dataGet = function getRoomCollection() {
     return roomCollection;
 }
 
 exports.dataSet = function setRoomCollection(data) {
     for(let i = 0; i < data.length; i++){
         roomCollection.push(data[i]);
     }
 }
 
 exports.socketapp = function (io, socket) {

     // ********************************************************************** //
     // ***** ACCOUNT PAGE *************************************************** //
     // ********************************************************************** //
 
     // createGame - creates a new Room object and returns the roomCode
     socket.on('createGame', (data) => {
         console.log(data);
         let user = data;
         let room = new Room(data.id);                              // create new Room
         room.playerManager.addPlayer(user);                         // add self to Room's playerlist
         room.playerManager.getPlayer(user._id).roomCreator = true;
         roomCollection.push(room);           
         console.log("created new room", room);                       // push room to DB (temporary array)
         socket.emit('roomCode', room.roomCode);                     // send roomCode to user
     });
 
     // joinGame - join room using gameCode
     socket.on('joinGame', (code) => {
         console.log('joinGame: ' + code);
         let room = roomCollection.find(({ roomCode }) => roomCode === code);
         if (room) {
             if (room.gameManager.gameActive === false) {
                 // accept join room request
                 room.playerManager.addPlayer(socket.request.user);                  // add self to Room's playerlist
                 socket.emit('roomCode', room.roomCode);                             // send roomCode to user
                 io.to(room.roomCode).emit('playerListUpdate', room.userlist);       // notify subscribers
             } else {
                 // unable to join because game is in progress
                 socket.emit('roomCode', room.roomCode);                             // send roomCode to user
                 io.to(room.roomCode).emit('playerListUpdate', room.userlist);       // notify subscribers
             }
         } else {
             // unable to find room
             socket.emit('accountErrorMessage', 'unable to join room');
         }
     });
 
     // ********************************************************************** //
     // ***** ROOM PAGE ****************************************************** //
     // ********************************************************************** //
 
     socket.on('disconnect', () => {
         console.log('disconnected');
        //  for (let i = 0; i < roomCollection.length; i++) {
        //      console.log(JSON.stringify(roomCollection[i]));
        //      let player = roomCollection[i].playerManager.getPlayer(socket.request.user._id)
        //      if (player !== null) {
        //          player.gameReady = false;
        //          sendPlayerList(roomCollection[i]);
        //      }
        //  }
     });
 
     // ***** PLAYERLIST COMPONENT ******************************************* //
 
     // initialize playerlist component when user enters room
     socket.on('playerListInit', (gameCode) => {
         console.log('playerListInit: ' + gameCode + ':' + socket.request.user.username);
         let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
         if(room.gameManager.gameActive){
             let player = room.playerManager.getPlayer(socket.request.user._id);
             player.gameReady = true;
         }
         socket.join(room.roomCode);
         sendPlayerList(room);
     });
 
     // toggle player's game ready state
     socket.on('playerListReady', (gameCode) => {
         console.log('playerListReady: ' + gameCode + ':' + socket.request.user.username);
         let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
         let toggle = room.playerManager.getPlayer(socket.request.user._id).gameReady
         room.playerManager.getPlayer(socket.request.user._id).gameReady = !toggle;
         sendPlayerList(room);
     });
 
     // room's creator starts game
     socket.on('playerListStart', (gameCode) => {
         let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
         let player = room.playerManager.getPlayer(socket.request.user._id);
         if (player.roomCreator && room.playerManager.playersReady()) {
             player.gameReady = true;
             room.gameManager.nextGameState();
             sendGameUpdate(room);
         }
         sendPlayerList(room);
     })
 
     // standardized playerlist-component reply
     function sendPlayerList(room) {
         console.log('sendPlayerList: ' + room.gameManager.state + ':');
         console.log(JSON.stringify(room.playerManager.playerList, null, 1));    // DEBUG PRINTING
         io.in(room.roomCode).emit('playerListUpdate', {
             gameState: room.gameManager.state,
             playerList: room.playerManager.playerList,
         });
     }
 
 
     // ***** CHAT COMPONENT ************************************************* //
 
     // initialize chat component when user enters room
     socket.on('chatComponentInit', (code) => {
         console.log('chatComponentInit');
         let room = roomCollection.find(({ roomCode }) => roomCode === code);
         socket.join(room.roomCode);
         sendChatComponent(room);
     });
 
     // player sends new message
     socket.on('newMessage', (code, data) => {
         console.log('newMessage');
         let room = roomCollection.find(({ roomCode }) => roomCode === code);
         let player = room.playerManager.getPlayer(socket.request.user._id);
         room.chatManager.newMessage(player, data);
         sendChatComponent(room);
     });
 
     // standardized chat-component reply
     function sendChatComponent(room) {
         io.in(room.roomCode).emit('messageUpdate', {
             messageList: room.chatManager.messageList,
             playerList: room.playerManager.playerList
         });
     }
 
 
     // ***** GAME COMPONENT ************************************************* //
 
     // initialize game component when user enters room
     socket.on('gameInit', (gameCode) => {
         console.log('gameInit: ' + socket.request.user.username + ':' + gameCode);
         let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
         socket.join(room.roomCode);
         sendGameUpdate(room);
     });
 


 



 
 

 
     // standardized game-component reply
     function sendGameUpdate(room) {
         console.log('sendGame: ' + room.gameManager.state);
         io.in(room.roomCode).emit('gameUpdate', {
             gameState: room.gameManager.state,
             playerList: room.playerManager.playerList,
         });
     }
 
 
 
 };