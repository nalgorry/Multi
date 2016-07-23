class cControlOtherPlayers {
    
    public arrayPlayers: cOtherPlayerData[]; //clase que controla los demas jugadores

    constructor(public controlGame: cControlGame) {

    }


    public  playerById (id:Text): cOtherPlayerData {
        var i:number;
        
        for (i = 0; i < this.arrayPlayers .length; i++) {
            if (this.arrayPlayers [i].id === id) {
                return this.arrayPlayers [i];
            }
        }

        return null
    }

    public addPlayer(data) {

        var newPlayer = new cOtherPlayerData;
        newPlayer.game = this.controlGame.game;
        newPlayer.id = data.id;
        newPlayer.tileX = data.x;
        newPlayer.tileY = data.y;
        newPlayer.IniciarJugador();

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

        // Find player by ID
        var movedPlayer:cOtherPlayerData;
        for (var i = 0; i < this.arrayPlayers .length; i++) {
            if (this.arrayPlayers [i].id === data.id) {
                movedPlayer = this.arrayPlayers [i];
                break;
            }
        }

        movedPlayer.MoverJugador(data)

    }

}