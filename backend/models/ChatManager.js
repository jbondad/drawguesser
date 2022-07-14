/**
 * ChatManager manages a list of Message objects
 * Message Object - represents a single message
 */

 const uuid = require('uuid');

 module.exports = class ChatManager {
 
     constructor() {
         this.messageList = [];
     }
 
     // creates a new message object with player object's _id.
     newMessage(player, message) {
         this.messageList.push(new Message(player._id, message));
     }
 
     // server custom message - messages sent from the server to the room
     newServerMessage(message) {
         this.messageList.push(new Message(1, message));
     }
 
     // admin custom message - messages sent from admin to the room
     newAdminMessage(message) {
         this.messageList.push(new Message(2, message));
     }
 }
 
 class Message {
     constructor(_id, message) {
         this._mid = uuid.v4();          // Message object's unique id
         this._id = _id;                 // sender's user id 
         this.message = message;
         this.timestamp = Date.now();
     }
 }