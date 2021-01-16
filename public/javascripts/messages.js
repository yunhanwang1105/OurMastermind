(function(exports) {
  exports.O_START_GAME = {
    type: "START-GAME"
  }
  exports.S_START_GAME = JSON.stringify(exports.O_START_GAME);
    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
      type: exports.T_GAME_WON_BY,
      data: null
    };
  
    /*
     * Server to client: abort game (e.g. if a player exited the game)
     */
    exports.O_GAME_ABORTED = {
      type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);
  
    /*
     * Server to client: choose a colour.
     */
    exports.O_CHOOSE = { type: "CHOOSE-COLOUR" };
    exports.S_CHOOSE = JSON.stringify(exports.O_CHOOSE);
  
    /*
     * Server to client: set as player A, aka the code setter
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
      type: exports.T_PLAYER_TYPE,
      data: "A"
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);
  
    /*
     * Server to client: set as player B, aka the code guesser
     */
    exports.O_PLAYER_B = {
      type: exports.T_PLAYER_TYPE,
      data: "B"
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);
  
    /*
     * Player A to server OR server to Player B: this is the code to be guessed
     */
    exports.T_TARGET_COLOUR = "SET-TARGET-COLOUR";
    exports.O_TARGET_COLOUR = {
      type: exports.T_TARGET_COLOUR,
      data: null
    };
    //exports.S_TARGET_WORD does not exist, as we always need to fill the data property
  
    /*
     * Player B to server OR server to Player A: guess made by player B.
     */
    exports.T_MAKE_A_GUESS = "MAKE-A-GUESS";
    exports.O_MAKE_A_GUESS = {
      type: exports.T_MAKE_A_GUESS,
      data: null
    };
    //exports.S_MAKE_A_GUESS does not exist, as data needs to be set

    /*
    Player A to server OR server to Player B: This is the key pegs
    */
    exports.T_GIVE_KEY_PEGS = "GIVE-KEY-PEGS";
    exports.O_GIVE_KEY_PEGS = {
        type: exports.T_GIVE_KEY_PEGS,
        data: null
    };
   
    /*
     * Server to Player A & B: game over with result won/loss
     */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
      type: exports.T_GAME_OVER,
      data: null
    };
  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server