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

var currentGame = new Game(gameStats.ongoingGames++);
var connectionID = 0; //each websocket receives a unique ID
let games ={};
console.log(currentGame);

wss.on("connection", function connection(ws) {
    /*
     * two-player game: every two players are added to the same game
     * cd \CSE\Year1-Q2\CSE1500\web\myapp
     */
    console.log("One client connected.");
    let newPlayer = ws;
    gameStats.onlinePlayers++;
    newPlayer.id = connectionID++;
    let playerType = currentGame.addPlayer(newPlayer);
    gameStats.addOnlinePlayer();
    games[newPlayer.id] = currentGame;
  
    console.log("Player %s placed in game %s as %s", newPlayer.id, currentGame.id, playerType);
    newPlayer.send((playerType === "CodeSetter") ? messages.S_PLAYER_A : messages.S_PLAYER_B);
    
    // after 2 players enter the same game
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame.send("Now code setter should set the code.");
        currentGame.setter.send(messages.S_START_GAME);
        currentGame = new Game(gameStats.getOngoingGames());
        gameStats.addOngoingGames();
    }
    
});

server.listen(port, () => {
    console.log('server is ready.');
});