// @ts-check
const express = require("express");
const http = require("http");
const indexRouter = require("./routes/index");
const messages = require("./public/javascripts/messages")
const app = express();
const server = http.createServer(app);
const websocket = require("ws");
const wss = new websocket.Server({server});
var gameStats = require("./statistics");

var port = process.argv[2];

app.use(express.static(__dirname + "/public"));

app.set('port', port);
app.get("/", indexRouter);
app.get("/play", indexRouter);

module.exports = app;

let games = [];
let players = [];
let gameCounter = 0;
var ind = 0;

function initialiseGame(p1, p2){
    var Game = {
        index:   games.length,
        setter:  p1,
        guesser: p2,
        status:  "started"
    };
    
    games.push(Game);

    p1.status = "playing";
    p1.game = Game;
    p1.role = "CodeSetter";
    p2.status = "playing";
    p2.game = Game;
    p2.role = "CodeGuesser";
    
    console.log("game " + Game.index + " started, Game info:\nSetter: " + Game.setter +"\nGuesser: " + Game.guesser);

    var res = {player: 1, role: "CodeSetter",status: "started"};
    p1.ws.send(JSON.stringify(res));
    res = {player:2, role: "CodeGuesser", status: "started"};
    p2.ws.send(JSON.stringify(res));

    gameStats.gamesOngoing++;
    gameStats.onlinePlayers = gameStats.onlinePlayers + 2;
}

wss.on("connection", function connection(ws) {
    /*
     * two-player game: every two players are added to the same game
     * cd \CSE\Year1-Q2\CSE1500\web\myapp
     */
    var currentGame;
    var player = {};
    player.name = "player " + ind;
    ind++;
    player.ws = ws;
    player.status = "searching";
    players.push(player);

    console.log(player.name + " connected.");
    
    var res = JSON.stringify({status:"searching",message: "Looking for an opponent...."});
    ws.send(res);

    players.forEach(function(p) {
        if(p.status == 'searching' && p.name != player.name){
            currentGame = initialiseGame(p,player); 
        }
    });
    

    ws.on("message", function incoming(message) {
        console.log(message);
        var oMsg;
        oMsg = JSON.parse(message);
        if (oMsg.type === "CODE-GIVEN") {
            currentGame.guesser.ws.send(messages.GUESS_COLOR);
            console.log("Code given");
        }

        if (oMsg.type === "GUESS-MADE") {
            let colors = oMsg.data;
            let checkMsg = messages.CHECK_GUESS;
            checkMsg.data = colors;
            currentGame.setter.ws.send(checkMsg);
            console.log("Guess made");
        }

        if (oMsg.type === "HINTS-MADE") {
            let hints = oMsg.data;
            let giveHintsMsg = messages.GIVE_HINTS_TO;
            giveHintsMsg.data = hints;
            currentGame.guesser.ws.send(giveHintsMsg);
            console.log("Hints made");
        }

        if (oMsg.type === "GAME-RESULT") {
            let winner = oMsg.data;
            if (winner == "CodeGuesser") {

                let res =JSON.stringify({type: "GUESSER-WIN"});
                currentGame.guesser.ws.send(res);
                
            } else {
                let res = JSON.stringify({type: "SETTER-WIN"});
                currentGame.guesser.ws.send(res);
            }
            console.log("There is a winner for game " + currentGame.index);
            currentGame.state = "finished";
        }

        ws.on("close", function(code){
            /*
             * code 1001 means almost always closing initiated by the client;
             * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
            */
           console.log("Game %s end.", currentGame.index);
            if (code == 1001){
                currentGame.setState("DISCONNECTED");
                console.log(currentGame.index + " disconnected...");
                console.log(currentGame.index + " disconnected.");
                if (oMsg.type === "GAME-ABORTED"){
                    if (currentGame.setter !== null){
                        currentGame.setter.close();
                        currentGame.setter = null;
                    } else {
                    currentGame.guesser.close();
                    currentGame.guesser = null;
                    }
                }
            }
        });
    });


});

server.listen(port, () => {
    console.log('server is ready.');
});



