/* 
 In-memory game statistics "tracker".
 TODO: as future work, this object should be replaced by a DB backend.
*/

let gameStats = {
    since: Date.now(), /* since we keep it simple and in-memory, keep track of when this object was created */
    onlinePlayers: 0, /* number of players playing now */
    ongoingGames: 0, /* number of games playing right now */
    finishedGames: 0, /* number of games successfully completed in total */

    addOnlinePlayer: function(){
      this.onlinePlayers++;
    },

    addOngoingGames: function(){
      this.ongoingGames++;
    },

    addFinishedGames: function(){
      this.finishedGames++;
    },
    
    getOnlinePlayer: function(){
      return this.onlinePlayers;
    },

    getOngoingGames: function(){
      return this.ongoingGames;
    },

    getFinishedGames: function(){
      return this.finishedGames;
    }
};
  
module.exports = gameStats;