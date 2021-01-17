const express = require("express");
const http = require("http");
const indexRouter = require("./routes/index");
const Game = require("./public/javascripts/gameObject")
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

wss.on("connection", function connection(ws) {
    /*
     * two-player game: every two players are added to the same game
     * cd \CSE\Year1-Q2\CSE1500\web\myapp
     */
    var currentGame = new Game(gameStats.ongoingGames++);
    var connectionID = 0; //each websocket receives a unique ID
    let games ={};
    console.log(currentGame);
    console.log("One client connected.");
    
    let newPlayer = ws;
    gameStats.onlinePlayers++;
    newPlayer.id = connectionID++;
    let playerType = currentGame.addPlayer(newPlayer);
    gameStats.addOnlinePlayer();
    games[newPlayer.id] = currentGame;
    
    console.log("Player %s placed in game %s as %s", newPlayer.id, currentGame.id, playerType);
    let roleMsg = messages.ROLE;
    roleMsg.data = playerType;
    newPlayer.send(roleMsg);


    if (playerType === "CodeSetter") {
        currentGame.setter = newPlayer;
    } else {
        currentGame.guesser = newPlayer;
    }
    
    // after 2 players enter the same game
    if (currentGame.hasTwoConnectedPlayers()) {

        
        let Msg = messages.ANOUNCEMENT;
        Msg.data = "Now setter should set the code";
        currentGame.setter.send(Msg);
        currentGame.getter.send(Msg);

    }

    newPlayer.on("message", function incoming(message) {
        let oMsg = JSON.parse(message);
        if (oMsg.type === "CODE-GIVEN") {
            currentGame.guesser.send(messages.GUESS_COLOR);
        }

        if (oMsg.type === "GUESS-MADE") {
            let colors = oMsg.data;
            let checkMsg = messages.CHECK_GUESS;
            checkMsg.data = colors;
            currentGame.setter.send(checkMsg);
        }

        if (oMsg.type === "HINTS-MADE") {
            let hints = oMsg.data;
            let giveHintsMsg = messages.GIVE_HINTS_TO;
            giveHintsMsg.data = hints;
            currentGame.guesser.send(giveHintsMsg);
        }

        if (oMsg.type === "GAME-RESULT") {
            let winner = oMsg.data;
            if (winner == "CodeGuesser") {
                currentGame.guesser.send(messages.GAME_RESULT);
                currentGame.setter.send(messages.GAME_RESULT);
            } else {
                currentGame.guesser.send(messages.GMAE_RESULT);
            }
        }

        newPlayer.on("close", function(code){
            /*
             * code 1001 means almost always closing initiated by the client;
             * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
            */
           console.log("Game %s end.", newPlayer.id);
            if (code == "1001"){
                console.log(con.id + " disconnected ...");
                console.log(newPlayer.id + "disconnected.");
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



