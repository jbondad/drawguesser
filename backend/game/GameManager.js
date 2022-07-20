// Turn off game engine logging
// console.log = function() {}

const GAME_STATE_WAITING = 1;
const GAME_STATE_STARTED = 2;
const GAME_STATE_CHOOSING_WORD = 3;
const GAME_STATE_DRAWING = 4;
const GAME_STATE_END = 5;
const Words = require("./wordList");


module.exports = class GameManager {
  constructor(playerManager) {
    this.playerManager = playerManager;
    this.state = GAME_STATE_WAITING;
    this.guessedPlayers = new Set(); // # of players that have correctly guessed the drawing
    this.started = false;
    this.rounds = 3;
    this.currentRound = 1;
    this.currentDrawer = "none";
    this.currentDrawerIndex = 0;
    this.word = "";
    this.wordOptions = [];
    this.winner = "";
    this.interval = null;
  }

  startGame() {
    this.playerManager.resetScores();
    this.wordOptions = Words.getWordOptions();
    this.state = GAME_STATE_CHOOSING_WORD;
    this.currentRound = 1;
    this.currentDrawerIndex = 0;
    this.currentDrawer =
      this.playerManager.playerList[this.currentDrawerIndex].username;
  }


  chooseWord(word) {
    this.word = word;
    this.state = GAME_STATE_DRAWING;
  }

  calculateScore() {
    return 1000 - (this.guessedPlayers.size * 100);
  }

  increaseDrawerScore(){
    this.playerManager.playerList[this.currentDrawerIndex].score = this.playerManager.playerList[this.currentDrawerIndex].score + (100 * this.guessedPlayers.size);
  }

  increasePlayerScore(player) {
    player.score = player.score + this.calculateScore();
    this.guessedPlayers.add(player._id);
  }

  checkGuess(guess){
    if(this.word.toLowerCase() == guess.toLowerCase()){
      return true;
    }
    else {
      return false;
    }
  }

  checkCorrectGuesses() {
    if (this.guessedPlayers.size === this.playerManager.getPlayerCount() - 1) {
      return true;
    }
    return false;
  }

  nextGameState() {

    this.increaseDrawerScore();
    if (this.currentDrawerIndex < this.playerManager.getPlayerCount() - 1) {
      this.guessedPlayers.clear();
      this.currentDrawerIndex = ++this.currentDrawerIndex;
      this.wordOptions = Words.getWordOptions();
      this.state = GAME_STATE_CHOOSING_WORD;
    } else {
      if (this.currentRound < this.rounds) {
        this.guessedPlayers.clear();
        this.currentRound = ++this.currentRound;
        this.currentDrawerIndex = 0;
        this.wordOptions = Words.getWordOptions();
        this.state = GAME_STATE_CHOOSING_WORD;
      } else {
        this.winner = this.playerManager.getWinner().username;
        console.log("winner is", this.winner);
        this.state = GAME_STATE_END;
      }
    }
    this.currentDrawer =
      this.playerManager.playerList[this.currentDrawerIndex].username;
  }

  getState() {
    return {
      state: this.state,
      currentDrawer: this.currentDrawer,
      currentRound: this.currentRound,
      numberOfRounds: this.rounds,
      word: this.word,
      wordOptions: this.wordOptions,
      winner: this.winner,
    };
  }

  // debug printing
  printStateDebug(fromState, toState) {
    console.log("\n " + fromState + " -> " + toState + " \n");
  }
};
