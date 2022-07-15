


 // Turn off game engine logging
 // console.log = function() {}

const GAME_STATE_WAITING = 1;
const GAME_STATE_STARTED = 2;
const GAME_STATE_END = 3;
 
 module.exports = class GameManager {
 
     constructor(playerManager) {
         this.playerManager = playerManager;             
         this.state = GAME_STATE_WAITING;                        
         this.numPlayers = 0;
         this.guessedPlayers = 0;
         this.started = false;
         this.rounds = 3;
         this.currentRound = 1;
         this.currentDrawer = ""; 
         this.currentDrawerIndex = 0;
         this.word = "";
     }

     startGame() {
        this.state = GAME_STATE_STARTED;
        this.currentDrawer = this.playerManager.playerList[this.currentDrawerIndex].username;
     }

     nextRound() {
        this.currentDrawer = this.getNextDrawer();
     }

     getNextDrawer(){
        if(this.currentDrawerIndex < this.playerManager.getPlayerCount()){
            this.currentDrawerIndex = ++this.currentDrawerIndex;
        } else {
            this.currentDrawerIndex = 0;
        }
        return this.playerManager.playerList[this.currentDrawerIndex].username;

     }
 


     getState(){
         return {
            state: this.gameActive,
            currentDrawer: this.currentPlayer,
            currentRound: this.currentRound,
            numberOfRounds: this.rounds,

         }
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