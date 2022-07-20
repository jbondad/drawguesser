/**
 * socketlogic.js
 *
 * Manage Socket IO Functionality
 *
 */

const Room = require("../models/Room");
const Words = require("../game/wordList");

let roomCollection = []; // TODO: Save to database for persistence
exports.socketapp = function (io, socket) {
  // ********************************************************************** //
  // ***** ACCOUNT PAGE *************************************************** //
  // ********************************************************************** //

  // createGame - creates a new Room object and returns the roomCode
  socket.on("createGame", (data) => {
    let user = data;
    let room = new Room(data._id); // create new Room
    room.playerManager.addPlayer(user);
    room.playerManager.getPlayer(user._id).roomCreator = true;
    roomCollection.push(room);
    socket.emit("roomCode", room.roomCode); // send code back to user
    socket.emit("host", room.creatorID);
    socket.join(room.roomCode); // Join Room
    sendPlayerList(room);
    sendGameUpdate(room);
  });

  // joinGame - join room using gameCode
  socket.on("joinGame", (data) => {
    const code = data.roomCode;
    const user = data.user;
    let room = roomCollection.find(({ roomCode }) => roomCode === code);

    if (room) {
      if (room.gameManager.state === 1) {
        // accept join room request
        socket.join(code);
        room.playerManager.addPlayer(user); // add self to Room's playerlist
        socket.emit("roomCode", room.roomCode); // send roomCode to user   // notify subscribers
        socket.emit("host", room.creatorID);
        sendPlayerList(room);
      } else {
        // unable to join because game is in progress
        socket.emit("roomCode", room.roomCode); // send roomCode to user
        io.to(room.roomCode).emit("playerListUpdate", room.userlist); // notify subscribers
      }
    } else {
      // unable to find room
      socket.emit("accountErrorMessage", "unable to join room");
    }
  });

  // ********************************************************************** //
  // ***** ROOM PAGE ****************************************************** //
  // ********************************************************************** //

  socket.on("disconnect", () => {
    console.log("disconnected");
    //  for (let i = 0; i < roomCollection.length; i++) {
    //      console.log(JSON.stringify(roomCollection[i]));
    //      let player = roomCollection[i].playerManager.getPlayer(socket.request.user._id)
    //      if (player !== null) {
    //          player.gameReady = false;
    //          sendPlayerList(roomCollection[i]);
    //      }
    //  }
  });

  // room's creator starts game
  socket.on("playerListStart", (gameCode) => {
    let room = roomCollection.find(({ roomCode }) => roomCode === gameCode);
    let player = room.playerManager.getPlayer(socket.request.user._id);
    if (player.roomCreator && room.playerManager.playersReady()) {
      player.gameReady = true;
      room.gameManager.nextGameState();
      sendGameUpdate(room);
    }
    sendPlayerList(room);
  });

  // standardized playerlist-component reply
  function sendPlayerList(room) {
    // console.log('sendPlayerList: ' + room.gameManager.state + ':');
    //console.log(JSON.stringify(room.playerManager.playerList, null, 1));    // DEBUG PRINTING
    io.in(room.roomCode).emit(
      "playerListUpdate",
      room.playerManager.playerList
    );
  }

  socket.on('wordOptions', ()=>{
    const words = Words.getWordOptions();
    socket.emit('wordOptionsUpdate', words);

  });

  // player sends new message
  socket.on("newMessage", (data) => {

    const code = data.code;
    let room = roomCollection.find(({ roomCode }) => roomCode === code);
    let player = room.playerManager.getPlayer(data._id);
    let correct = room.gameManager.checkGuess(data.message);
    console.log(data.message, room.gameManager.word, correct)
    if(room.gameManager.currentDrawer !== player.username){
      if (correct) {
        room.chatManager.newServerMessage(
          player.username + " has guessed the word!"
        );
        room.gameManager.increasePlayerScore(player)
      }
  
      if (room.gameManager.checkCorrectGuesses()) {
        room.chatManager.newServerMessage(
          "The word was " + room.gameManager.word
        );
        room.gameManager.nextGameState();
        clearInterval(room.gameManager.interval);
        sendGameUpdate(room);
    }
      room.chatManager.newMessage(player.username, data.message, correct);
      sendMessageList(room);
      sendPlayerList(room);
    }

  });

  // standardized chat-component reply
  function sendMessageList(room) {
    io.in(room.roomCode).emit("messageUpdate", room.chatManager.messageList);
  }

  socket.on("wordChosen", (data) => {
    const { code, word } = data;
    let room = roomCollection.find(({ roomCode }) => roomCode === code);
    room.gameManager.chooseWord(word);
    io.in(room.roomCode).emit("clearDrawing");
    room.chatManager.newServerMessage(
      room.gameManager.currentDrawer + " is drawing now!"
    );
    runTimer(code);
    sendGameUpdate(room);
    sendMessageList(room);
  });

  socket.on("draw", ({ code, line }) => {
    socket.to(code).emit("drawLine", line);
  });

  // Player starts the game
  socket.on("startGame", (code) => {
    socket.to(code).emit("startedGame");
    let room = roomCollection.find(({ roomCode }) => roomCode === code);
    room.gameManager.startGame();
    room.chatManager.newServerMessage(
      room.gameManager.currentDrawer + " is choosing a word!"
    );
    sendMessageList(room);
    sendGameUpdate(room);
  });

  // standardized game-component reply
  function sendGameUpdate(room) {
    console.log(
      "sendGame Update: " + JSON.stringify(room.gameManager.getState())
    );
    io.in(room.roomCode).emit("gameUpdate", room.gameManager.getState());
  }

  function runTimer(code) {
    let counter = 10;
    let room = roomCollection.find(({ roomCode }) => roomCode === code);
    room.gameManager.interval = setInterval(() => {
      io.in(code).emit("timer", counter);
      if (counter === 0) {
        clearInterval(room.gameManager.interval);
        room.gameManager.nextGameState();
        room.chatManager.newServerMessage(
          "The word was " + room.gameManager.word
        );
        sendMessageList(room);
        sendGameUpdate(room);
      }
      counter--;
    }, 1000);
  }
};
