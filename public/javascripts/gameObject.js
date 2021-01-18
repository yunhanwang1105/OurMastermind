let Game = function(id){
    this.id = id;
    this.setter = null;
    this.guesser = null;
    this.gameState = "0 JOINED";
    Game.prototype.transitionStates = {};
    Game.prototype.transitionStates["0 JOINED"] = 0;
    Game.prototype.transitionStates["1 JOINED"] = 1;
    Game.prototype.transitionStates["2 JOINED"] = 2;
    Game.prototype.transitionStates["Setter Turn"] = 3;
    Game.prototype.transitionStates["Guesser Turn"] = 4;
    Game.prototype.transitionStates["Setter Won"] = 5;
    Game.prototype.transitionStates["Guesser Won"] = 6;
    Game.prototype.transitionStates["DISCONNECTED"] = 7;

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

Game.prototype.isValidState = function (s) {
    return (s in this.transitionStates);
};

Game.prototype.setState = function (newState) {

    console.assert(typeof newState == "string", "%s: Expecting a string, got a %s", arguments.callee.name, typeof newState);

    if (this.isValidState(newState)) {
        this.gameState = newState;
        console.log("[STATUS] %s", this.gameState);
    }
    else {
        return new Error("Impossible status change from %s to %s " + this.gameState + newState);
    }
};
}
module.exports = Game;