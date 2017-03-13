class cControlOtherPlayers {
    
    public arrayPlayers: cOtherPlayer[]; //clase que controla los demas jugadores

    constructor(public controlGame: cControlGame) {

        this.arrayPlayers = [];

    }

    public  playerById (id:string): cOtherPlayer {
        var i:number;
        
        for (i = 0; i < this.arrayPlayers .length; i++) {
            if (this.arrayPlayers [i].idServer === id) {
                return this.arrayPlayers [i];
            }
        }

        return null
    }

    public addPlayer(data) {

        var newPlayer = new cOtherPlayer(this.controlGame,data);

        this.arrayPlayers.push(newPlayer);


    }

    public removePlayer(data) {
        var playerToRemove = this.playerById(data.id);

        if (playerToRemove != null) {
            playerToRemove.removePlayer()
            this.arrayPlayers .splice(this.arrayPlayers .indexOf(playerToRemove), 1)
        }

        console.log(playerToRemove);
    }

    public movePlayer(data) {

        var movedPlayer =  this.playerById(data.id);
        movedPlayer.MoverJugador(data)

    }

    public showChat(data) {

        var player = this.playerById(data.id);
        player.setChatText(data.text);

    }

    public playerHit(data) {

        var playerHit = this.playerById(data.id);

        //me fijo si el jugador que golpeo es el jugador actual u otro
        if (data.playerThatHit == this.controlGame.controlPlayer.idServer) {
            var playerThatHitSprite = this.controlGame.controlPlayer.playerSprite;
        } else {
            var playerThatHitSprite = this.playerById(data.playerThatHit).playerSprite;
        }
        

        this.controlGame.controlPlayer.controlSpells.onHit(data, playerThatHitSprite, playerHit.playerSprite,0x5e0818);

    }

    public playerDie(data) {

         var player = this.playerById(data.id);

        //me fijo si el jugador que golpeo es el jugador actual u otro
        if (player != null) {
            player.playerDie(data);
        }


    }

}