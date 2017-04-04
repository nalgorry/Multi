var cControlOtherPlayers = (function () {
    function cControlOtherPlayers(controlGame) {
        this.controlGame = controlGame;
        this.arrayPlayers = [];
    }
    cControlOtherPlayers.prototype.playerById = function (id) {
        var i;
        for (i = 0; i < this.arrayPlayers.length; i++) {
            if (this.arrayPlayers[i].idServer === id) {
                return this.arrayPlayers[i];
            }
        }
        return null;
    };
    cControlOtherPlayers.prototype.addPlayer = function (data) {
        console.log(data);
        var newPlayer = new cOtherPlayer(this.controlGame, data);
        this.arrayPlayers.push(newPlayer);
        //actualizo el texto del player
        this.controlGame.controlPlayer.controlFocus.textPlayersOnline.text = data.playersOnline;
    };
    cControlOtherPlayers.prototype.removePlayer = function (data) {
        var playerToRemove = this.playerById(data.id);
        if (playerToRemove != null) {
            playerToRemove.removePlayer();
            this.arrayPlayers.splice(this.arrayPlayers.indexOf(playerToRemove), 1);
        }
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
        var playerHit = this.playerById(data.id);
        //me fijo si el jugador que golpeo es el jugador actual u otro
        if (data.playerThatHit == this.controlGame.controlPlayer.idServer) {
            var playerThatHitSprite = this.controlGame.controlPlayer.playerSprite;
        }
        else {
            var playerThatHitSprite = this.playerById(data.playerThatHit).playerSprite;
        }
        this.controlGame.controlPlayer.controlSpells.onHit(data, playerThatHitSprite, playerHit.playerSprite, 0x5e0818);
    };
    cControlOtherPlayers.prototype.playerDie = function (data) {
        var player = this.playerById(data.id);
        //me fijo si el jugador que golpeo es el jugador actual u otro
        if (player != null) {
            player.playerDie(data);
        }
    };
    return cControlOtherPlayers;
}());
