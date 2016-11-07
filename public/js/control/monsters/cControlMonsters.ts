class cControlMonsters {


    private arrayMonster:cMonster[];

    constructor(public controlGame: cControlGame) {

        this.arrayMonster = [];

    }

    public newMonster(data) {
        this.arrayMonster[data.id] = new cMonster(this.controlGame,data);
    }

    public monsterDie(data) {

        console.log(data);
        
        var monster:cMonster = this.arrayMonster[data.idMonster];

        //hago desaparecer el moustro del juego
        if (monster != null) {
            monster.killMonster();
        }

        //si fue el que lo mato, hago que aparezca un mensaje 
        if (data.idPlayer == this.controlGame.controlPlayer.idServer) {
            this.controlGame.controlPlayer.youKillMonster(data);
        }


    }

    //esto es cuando el moustro le pega a alguien
    public monsterHit(data) {

        var monster = this.arrayMonster[data.idMonster]

        //controlo si golpearon al jugador activo
        if (data.idPlayer == this.controlGame.controlPlayer.idServer) {
            this.controlGame.controlPlayer.playerHit(data)
        }

    }

    public youHitMonster(data) {

        if (data.damage != 0 ) {
            this.controlGame.controlConsole.newMessage(enumMessage.youHit,"Golpeaste al monstruo por " + data.damage)
            
            //pongo una animación sobre el pj 
            var monster = this.arrayMonster[data.idMonster];
            if (monster != null) {
                this.controlGame.controlPlayer.controlSpells.spellAnimation(monster.monsterSprite,data);
            }
        }
    }


}