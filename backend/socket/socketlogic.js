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
         let user = data;
         let room = new Room(data._id);                              // create new Room
         room.playerManager.addPlayer(user); 
         console.log(user);                        // add self to Room's playerlist
         room.playerManager.getPlayer(user._id).roomCreator = true;
         roomCollection.push(room);      
         console.log("------------------------------------------------------------");         
         console.log("created new room", room);                       // push room to DB (temporary array)
         console.log(room.playerManager.playerList);
         console.log("------------------------------------------------------------");     
         socket.emit('roomCode', room.roomCode);    // send code back to user               
         socket.join(room.roomCode);   // Join Room
         sendPlayerList(room)
     });
 
     // joinGame - join room using gameCode
     socket.on('joinGame', (data) => {
         const code = data.roomCode;
         const user = data.user;
         let room = roomCollection.find(({ roomCode }) => roomCode === code);   

         if (room) {
            console.log(room.gameManager.state);
             if (room.gameManager.state === 1) {
                console.log("joining room")
                 // accept join room request
                 socket.join(code);
                 room.playerManager.addPlayer(user);                  // add self to Room's playerlist
                 socket.emit('roomCode', room.roomCode);                             // send roomCode to user   // notify subscribers
                 sendPlayerList(room);
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
        // console.log('sendPlayerList: ' + room.gameManager.state + ':');
         //console.log(JSON.stringify(room.playerManager.playerList, null, 1));    // DEBUG PRINTING
         console.log("sending player list update", room.playerManager.playerList);
         io.in(room.roomCode).emit('playerListUpdate', room.playerManager.playerList);
     }
 
 

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
 
 



 



 
     // Player starts the game
     socket.on('startGame', (code) => {
        let room = roomCollection.find(({ roomCode }) => roomCode === code);
        room.gameManager.startGame();
        sendGameUpdate(room);
    });
 
     // standardized game-component reply
     function sendGameUpdate(room) {
         console.log('sendGame: ' + room.gameManager.getState());
         io.in(room.roomCode).emit('gameUpdate', room.gameManager.getState());
     }
 
 
 
 };