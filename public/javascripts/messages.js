(function(exports) {
  exports.O_START_GAME = {
    type: "START-GAME"
  }

  // anouncement
  exports.ANOUNCEMENT = "ANOUNCEMENT";
  exports.O_ANOUNCEMENT = {
    type: exports.ANOUNCEMENT,
    data: null
  };

  
  // Server to client: sent player role

  exports.ROLE = {
    type: null,
    data: null
  };

  // Setter to server: code set

  exports.CODEGIVEN = {
    type: "CODE-GIVEN",
    data: null
  };


  // Server to guesser: inform guesser to guess
  exports.GUESS_COLOR = {
    type: "GUESS-COLOR",
    data: "Guesser's turn"
  };

  // Guesser to server: inform server, guess color made, send an array of colors
  exports.GUESS_MADE = {
    type: "GUESS-MADE",
    data: null
  };

  // Server to setter: send array to guesser to check
  exports.CHECK_GUESS = {
    type: "CEHCK-GUESS",
    data: null
  };

  // Setter to server: send array of hints
  exports.HINTS_MADE = {
    type: "HINTS-MADE",
    data: null
  };

  // Server to guesser: send array of hints
  exports.GIVE_HINTS_TO = {
    type: "GIVE-HINTS-TO",
    data: null
  };

  // Client to server: give game result
  exports.GMAE_RESULT = {
    type: "GAME-RESULT",
    data: null
  };

  // 
  
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