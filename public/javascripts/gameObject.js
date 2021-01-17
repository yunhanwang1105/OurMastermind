let Game = function(id){
    const toBeSelected = -1;
    const RED = 8;
    const ORANGE = 9;
    const YELLOW = 10;
    const GREEN = 11;
    const BLUE = 12;
    const PURPLE = 13;
    this.id = id;
    this.setter = null;
    this.guesser = null;
    this.gameState = "0 JOINED";
    this.playboard = [[toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                      [toBeSelected, toBeSelected, toBeSelected, toBeSelected]];
  };
  Game.prototype.transitionStates = {};
  Game.prototype.transitionStates["0 JOINED"] = 0;
  Game.prototype.transitionStates["1 JOINED"] = 1;
  Game.prototype.transitionStates["2 JOINED"] = 2;
  Game.prototype.transitionStates["Setter Turn"] = 3;
  Game.prototype.transitionStates["Guesser Turn"] = 4;
  Game.prototype.transitionStates["Setter Won"] = 5;
  Game.prototype.transitionStates["Guesser Won"] = 6;
  Game.prototype.transitionStates["DISCONNECTED"] = 7;
  Game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0],   // 0 player
    [1, 0, 1, 0, 0, 0, 0, 0],   // 1 player
    [0, 0, 0, 1, 0, 0, 0, 1],   // 2 players
    [0, 0, 0, 0, 1, 1, 0, 1],   // Setter TURN
    [0, 0, 0, 1, 0, 0, 1, 1],   // Guesser TURN
    [0, 0, 0, 0, 0, 0, 0, 0],   // Setter WON
    [0, 0, 0, 0, 0, 0, 0, 0],   // Getter WON
    [0, 0, 0, 0, 0, 0, 0, 0],   // Disconnected
  ];
  Game.prototype.addPlayer = function(player) {
    if (this.hasTwoConnectedPlayers()) {
        return new Error("This room is already full!");
    }
  
    if(this.setter === null) {
        this.setter = player;
        this.setState("1 JOINED");
        return "CodeSetter";
    } else {
        this.guesser = player;
        this.setState("2 JOINED");
        return "CodeGuesser";
    }
  };
  // A game should not contain more than 2 players
  Game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState === "2 JOINED";
  };
  Game.prototype.finalGamestate = function(){
    switch(this.gameState){
        case "Setter won":
        case "Guesser won":
        case "DISCONNECTED":
            return true;
        default:
            return false;
    }
  };

  Game.prototype.isValidTransition = function(from, to) {
    
    console.assert(typeof from == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof from);
    console.assert(typeof to == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof to);
    console.assert( from in this.transitionStates === true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, from);
    console.assert( to in this.transitionStates === true, "%s: Expecting %s to be a valid transition state", arguments.callee.name, to);
    
    let i, j;
    if (! (from in this.transitionStates)) {
        return false;
    }
    else {
        i = this.transitionStates[from];
    }

    if (!(to in this.transitionStates)) {
        return false;
    }
    else {
        j = this.transitionStates[to];
    }

    return (this.transitionMatrix[i][j] > 0);
};

Game.prototype.isValidState = function (s) {
    return (s in this.transitionStates);
};

Game.prototype.setState = function (newState) {

    console.assert(typeof newState == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof newState);

    if (this.isValidState(newState) && this.isValidTransition(this.gameState, newState)) {
        this.gameState = newState;
        console.log("[STATUS] %s", this.gameState);
    }
    else {
        return new Error("Impossible status change from %s to %s " + this.gameState + newState);
    }
};

module.exports = Game;