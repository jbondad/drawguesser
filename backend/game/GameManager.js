/**
 * GameManager manages the transition between game states
 * 
 * States:
 * 
 * GAME_STATE_PENDING 
 * - waiting for players to join and room creator to start the game
 * 
 * GAME_STATE_TEAMBUILD
 * - waiting for the current captain to pick players for the quest
 *  
 * GAME_STATE_TEAMVOTE
 * - waiting for the team to vote to 'approve' or 'reject' the quest
 * 
 * GAME_STATE_QUEST
 * - waiting for the quest members to 'success' or 'fail' the quest
 * 
 * GAME_STATE_END
 * - game has ended
 */

 const GAME_STATE_PENDING = 0;
 const GAME_STATE_TEAMBUILD = 1;
 const GAME_STATE_TEAMVOTE = 2;
 const GAME_STATE_QUEST = 3;
 const GAME_STATE_END = 4;
 
 const Game = require('./Game');
 
 // Turn off game engine logging
 // console.log = function() {}
 
 module.exports = class GameManager {
 
     constructor(playerManager) {
         this.playerManager = playerManager;             // playerManager from the room
         this.game = new Game(this.playerManager);       // create a new Game Object
         this.state = GAME_STATE_PENDING;                // set initial game state
         this.gameActive = false;                        // game currently ongoing
     }
 
     // progresses to the next game state, depending on game conditions
     nextGameState() {
     }
 
     // returns game state
     getState(){
         return this.state;
     }
 

 
     // returns the winner of the game
     getWinner(){
         if(this.state === GAME_STATE_END){
             return this.game.get_winner();
         } else {
             return 'Undetermined';
         }
     }
 
     // debug printing
     printStateDebug(fromState, toState) {
         console.log('\n ' + fromState + ' -> ' + toState + ' \n');
     }
 }