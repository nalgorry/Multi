class cControlOtherPlayers {
    
    public arrayPlayers: cOtherPlayerData[]; //clase que controla los demas jugadores


    public  playerById (id:Text): cOtherPlayerData {
        var i:number;
        
        for (i = 0; i < this.arrayPlayers .length; i++) {
            if (this.arrayPlayers [i].id === id) {
                return this.arrayPlayers [i];
            }
        }

        return null
    }

}