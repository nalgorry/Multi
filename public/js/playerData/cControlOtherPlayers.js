var cControlOtherPlayers = (function () {
    function cControlOtherPlayers(controlGame) {
        this.controlGame = controlGame;
    }
    cControlOtherPlayers.prototype.playerById = function (id) {
        var i;
        for (i = 0; i < this.arrayPlayers.length; i++) {
            if (this.arrayPlayers[i].id === id) {
                return this.arrayPlayers[i];
            }
        }
        return null;
    };
    cControlOtherPlayers.prototype.addPlayer = function (data) {
        var newPlayer = new cOtherPlayerData;
        newPlayer.game = this.controlGame.game;
        newPlayer.id = data.id;
        newPlayer.tileX = data.x;
        newPlayer.tileY = data.y;
        newPlayer.IniciarJugador();
        this.arrayPlayers.push(newPlayer);
    };
    cControlOtherPlayers.prototype.removePlayer = function (data) {
        var playerToRemove = this.playerById(data.id);
        if (playerToRemove != null) {
            playerToRemove.removePlayer();
            this.arrayPlayers.splice(this.arrayPlayers.indexOf(playerToRemove), 1);
        }
        console.log(playerToRemove);
    };
    cControlOtherPlayers.prototype.movePlayer = function (data) {
        // Find player by ID
        var movedPlayer;
        for (var i = 0; i < this.arrayPlayers.length; i++) {
            if (this.arrayPlayers[i].id === data.id) {
                movedPlayer = this.arrayPlayers[i];
                break;
            }
        }
        movedPlayer.MoverJugador(data);
    };
    return cControlOtherPlayers;
}());
