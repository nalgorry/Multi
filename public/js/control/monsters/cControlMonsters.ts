class cControlMonsters {

    private arrayMonster:cMonster[];
    public spriteAreaAtack:Phaser.Sprite;

    constructor(public controlGame: cControlGame) {

        this.arrayMonster = [];

    }

    public newMonster(data) {
        this.arrayMonster[data.id] = new cMonster(this.controlGame,data);
    }

    public monsterMove(data) {

        var monster:cMonster = this.arrayMonster[data.idMonster];

        //hago desaparecer el moustro del juego
        if (monster != undefined) {
            monster.monsterMove(data);
        }

    }

    public monsterDie(data) {

        
        var monster:cMonster = this.arrayMonster[data.idMonster];

        //hago desaparecer el moustro del juego
        if (monster != undefined) {
            
            monster.killMonster();
            //borro el focus
            this.controlGame.controlPlayer.controlSpells.releaseFocus(monster.idServer);

            delete this.arrayMonster[data.idMonster];

            //si fue el que lo mato, hago que aparezca un mensaje 
            if (data.idPlayer == this.controlGame.controlPlayer.idServer) {
                this.controlGame.controlPlayer.youKillMonster(data);
                this.controlGame.controlMissions.updateKillMonster(monster);
            }

            
        }

    }

    //esto es cuando el moustro le pega a alguien
    public monsterHit(data) {

        var monster = this.arrayMonster[data.idMonster]

        //controlo si golpearon al jugador activo
        if (data.monsterAtackType == 0) //normalAtack 
        {
            if (data.idPlayer == this.controlGame.controlPlayer.idServer) {
                this.controlGame.controlPlayer.playerHit(data, monster.monsterSprite, this.controlGame.controlPlayer.playerSprite)
            }
        } else if (data.monsterAtackType == 1) { //especial atack
            this.mosterSpecialHit(data);
        }      

    }

    public mosterSpecialHit(data) {
        
        //creo un circulo
        var spriteAreaAtack: Phaser.Sprite;
        
        var bitmapAtack = this.controlGame.game.add.graphics(0,0);
        bitmapAtack.beginFill(0xe33133);
        bitmapAtack.drawCircle(0, 0, data.spellSize);
        
        spriteAreaAtack = this.controlGame.game.add.sprite(
            data.tileX * this.controlGame.gridSize + this.controlGame.gridSize / 2 
            , data.tileY * this.controlGame.gridSize - this.controlGame.gridSize / 2);
        spriteAreaAtack.addChild(bitmapAtack);
            
        //spriteAreaAtack.anchor.set(0.5); 
        spriteAreaAtack.alpha = 0.25;

        this.spriteAreaAtack = spriteAreaAtack;
        this.controlGame.groupMapLayers.add(this.spriteAreaAtack);

        //configuro el hit test para ver si le pega o no el hechizo
        this.controlGame.game.physics.arcade.enable(spriteAreaAtack);
        var body:Phaser.Physics.Arcade.Body = spriteAreaAtack.body //para acceder a las propiedades ts
        body.setCircle(data.spellSize / 2);
        body.offset.x = -data.spellSize / 2;
        body.offset.y = -data.spellSize / 2;

        var a = this.controlGame.game.add.tween(spriteAreaAtack).to(
             { alpha: 1 }, data.coolDownTimeSec * 1000, Phaser.Easing.Cubic.In, true);

        a.onComplete.add(this.monsterSpecialHitDone,this,0,data);

    }

    public monsterSpecialHitDone(sprite:Phaser.Sprite,tween:Phaser.Tween,data) {

        var playertileX = this.controlGame.controlPlayer.tileX;
        var playertileY = this.controlGame.controlPlayer.tileY;

        //si el player queda adentro del circulo cuando se dispara le saco vida
        if (this.controlGame.game.physics.arcade.overlap(this.controlGame.controlPlayer.playerSprite,sprite)) {
            this.controlGame.controlPlayer.playerHit(data,null , this.controlGame.controlPlayer.playerSprite);
        }  
        
        sprite.destroy();

    }

    public monsterWereHit(data) {

        var thisPlayerHit:boolean = false;
        var playerThatHit:cBasicActor;

        if (data.idPlayer == this.controlGame.controlPlayer.idServer) { //este jugador golpea al monstruo
            playerThatHit = this.controlGame.controlPlayer;        
            thisPlayerHit = true;
        } else { //otro jugador golpea al mounstro 
            playerThatHit = this.controlGame.controlOtherPlayers.playerById(data.idPlayer)
        } 

        //Hago la animación y el rayo
        var monster = this.arrayMonster[data.idMonster];
        if (monster != undefined) {
            this.controlGame.controlPlayer.controlSpells.onHit(data, playerThatHit.playerSprite, monster.monsterSprite,0x081d5e);
            this.controlGame.controlSounds.startSoundHit(data.idSpell);

            //lets check if we need to reduce the life bar
            if (thisPlayerHit == true) {
                this.controlGame.controlPlayer.controlSpells.reduceLifeBar(data.lifePercRemaining) 
            };
        }

    }


    public getClosestMonsterInRange(maxRangeX:number, maxRangeY:number):cMonster {
        var closestMonster:cMonster;
        var distance:Number = 1000000; 
        
        for (var numMonster in this.arrayMonster) {

            var monster = this.arrayMonster[numMonster];
                
            var actorTileX = monster.tileX;
            var actorTileY = monster.tileY;

        //en los monstruos cosmicos no hago auto focus, es peligroso (DANGER :)
        if (monster.monsterType == enumMonsters.Cosmic) {
            continue
        }
        //si el monstruo esta invisible no lo considero
        if (monster.monsterSprite.visible == false) {
            continue
        }

        if (Math.abs(actorTileX - this.controlGame.controlPlayer.tileX) <= maxRangeX && 
            Math.abs(actorTileY - this.controlGame.controlPlayer.tileY) <= maxRangeY ) {

                //seteo para buscar solo monstruos mas cercas de la ultima vez que encontre
                var monsterDistance = Math.pow((actorTileX - this.controlGame.controlPlayer.tileX) * this.controlGame.gridSize, 2) + 
                    Math.pow((actorTileY - this.controlGame.controlPlayer.tileY) * this.controlGame.gridSize, 2) ;

                if (monsterDistance < distance) {

                    closestMonster = monster;
                    distance = monsterDistance
                }

            } 
            
        }

        return closestMonster;

    }


}