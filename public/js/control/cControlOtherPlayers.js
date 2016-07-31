var cControlOtherPlayers = (function () {
    function cControlOtherPlayers(controlGame) {
        this.controlGame = controlGame;
        this.arrayPlayers = [];
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
        var newPlayer = new cOtherPlayer(this.controlGame);
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
        var movedPlayer = this.playerById(data.id);
        movedPlayer.MoverJugador(data);
    };
    cControlOtherPlayers.prototype.showChat = function (data) {
        var player = this.playerById(data.id);
        player.setChatText(data.text);
    };
    cControlOtherPlayers.prototype.playerHit = function (data) {
        var player = this.playerById(data.id);
        player.onHit(data);
    };
    return cControlOtherPlayers;
}());
