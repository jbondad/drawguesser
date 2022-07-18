


 // Turn off game engine logging
 // console.log = function() {}

const GAME_STATE_WAITING = 1;
const GAME_STATE_STARTED = 2;
const GAME_STATE_CHOOSING_WORD = 3;
const GAME_STATE_DRAWING = 4;
const GAME_STATE_END = 5;


 
 module.exports = class GameManager {
 
     constructor(playerManager) {
         this.playerManager = playerManager;             
         this.state = GAME_STATE_WAITING;                       
         this.guessedPlayers = new Set();
         this.started = false;
         this.rounds = 3;
         this.correctGuesses = 0;
         this.currentRound = 1;
         this.currentDrawer = "none"; 
         this.currentDrawerIndex = 0;
         this.word = "";
         this.winner = "";
         this.interval = null;
     }

     startGame() {
        this.playerManager.resetScores();
        this.state = GAME_STATE_CHOOSING_WORD;
        this.currentRound = 1;
        this.currentDrawerIndex = 0;
        this.currentDrawer = this.playerManager.playerList[this.currentDrawerIndex].username;
     }

     chooseWord(word) {
        this.word = word;
        this.state = GAME_STATE_DRAWING;
     }

     makeGuess(guess, player){
        if(this.state === GAME_STATE_DRAWING && player.username != this.currentDrawer){
            if(guess.toLowerCase() == this.word.toLowerCase() && !this.guessedPlayers.has(player._id)){
                player.score = player.score + 100;
                this.guessedPlayers.add(player._id);
                this.correctGuesses = this.correctGuesses + 1;
                this.checkCorrectGuesses();
                return true;
            }

        }
        return false;
      }
      
     checkCorrectGuesses(){
        if(this.correctGuesses == this.playerManager.getPlayerCount() - 1){
            return true;
        }
        return false;
     }


     nextGameState(){
        if(this.currentDrawerIndex < this.playerManager.getPlayerCount() - 1){
            this.currentDrawerIndex = ++this.currentDrawerIndex;
            this.state = GAME_STATE_CHOOSING_WORD;
        } else {
            if(this.currentRound < this.rounds){
                this.correctGuesses = 0;
                this.guessedPlayers.clear();
                this.currentRound = ++this.currentRound;
                this.currentDrawerIndex = 0;
                this.state = GAME_STATE_CHOOSING_WORD;
            } else {
                this.winner = this.playerManager.getWinner().username;
                console.log('winner is', this.winner);
                this.state = GAME_STATE_END;
            }
        }
        this.currentDrawer = this.playerManager.playerList[this.currentDrawerIndex].username;
     }




     getState(){
         return {
            state: this.state,
            currentDrawer: this.currentDrawer,
            currentRound: this.currentRound,
            numberOfRounds: this.rounds,
            word: this.word,
            winner: this.winner,
         }
     }
 


 
 
     // debug printing
     printStateDebug(fromState, toState) {
         console.log('\n ' + fromState + ' -> ' + toState + ' \n');
     }
 }