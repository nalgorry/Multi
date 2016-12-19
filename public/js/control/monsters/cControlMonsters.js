var cControlMonsters = (function () {
    function cControlMonsters(controlGame) {
        this.controlGame = controlGame;
        this.arrayMonster = [];
    }
    cControlMonsters.prototype.newMonster = function (data) {
        this.arrayMonster[data.id] = new cMonster(this.controlGame, data);
    };
    cControlMonsters.prototype.monsterMove = function (data) {
        var monster = this.arrayMonster[data.idMonster];
        //hago desaparecer el moustro del juego
        if (monster != undefined) {
            monster.monsterMove(data);
        }
    };
    cControlMonsters.prototype.monsterDie = function (data) {
        console.log(data);
        var monster = this.arrayMonster[data.idMonster];
        //hago desaparecer el moustro del juego
        if (monster != undefined) {
            monster.killMonster();
        }
        //si fue el que lo mato, hago que aparezca un mensaje 
        if (data.idPlayer == this.controlGame.controlPlayer.idServer) {
            this.controlGame.controlPlayer.youKillMonster(data);
        }
    };
    //esto es cuando el moustro le pega a alguien
    cControlMonsters.prototype.monsterHit = function (data) {
        var monster = this.arrayMonster[data.idMonster];
        //controlo si golpearon al jugador activo
        if (data.monsterAtackType == 0) {
            if (data.idPlayer == this.controlGame.controlPlayer.idServer) {
                this.controlGame.controlPlayer.playerHit(data);
            }
        }
        else if (data.monsterAtackType == 1) {
            this.mosterSpecialHit(data);
        }
    };
    cControlMonsters.prototype.mosterSpecialHit = function (data) {
        //creo un circulo
        var spriteAreaAtack;
        var bitmapAtack = this.controlGame.game.add.graphics(0, 0);
        ;
        bitmapAtack.beginFill(0xe33133);
        bitmapAtack.drawCircle(0, 0, data.spellSize);
        spriteAreaAtack = this.controlGame.game.add.sprite(data.tileX * this.controlGame.gridSize + this.controlGame.gridSize / 2, data.tileY * this.controlGame.gridSize - this.controlGame.gridSize / 2);
        spriteAreaAtack.addChild(bitmapAtack);
        //spriteAreaAtack.anchor.set(0.5); 
        spriteAreaAtack.alpha = 0.25;
        this.spriteAreaAtack = spriteAreaAtack;
        //configuro el hit test para ver si le pega o no el hechizo
        this.controlGame.game.physics.arcade.enable(spriteAreaAtack);
        var body = spriteAreaAtack.body; //para acceder a las propiedades ts
        body.setCircle(data.spellSize / 2);
        body.offset.x = -data.spellSize / 2;
        body.offset.y = -data.spellSize / 2;
        //lo dejo justo entre las capas de tiles y los objetos
        spriteAreaAtack.sendToBack();
        spriteAreaAtack.moveUp();
        spriteAreaAtack.moveUp();
        spriteAreaAtack.moveUp();
        spriteAreaAtack.moveUp();
        var a = this.controlGame.game.add.tween(spriteAreaAtack).to({ alpha: 1 }, data.coolDownTimeSec * 1000, Phaser.Easing.Cubic.In, true);
        a.onComplete.add(this.monsterSpecialHitDone, this, 0, data);
    };
    cControlMonsters.prototype.monsterSpecialHitDone = function (sprite, tween, data) {
        var playertileX = this.controlGame.controlPlayer.tileX;
        var playertileY = this.controlGame.controlPlayer.tileY;
        //si el player queda adentro del circulo cuando se dispara le saco vida
        if (this.controlGame.game.physics.arcade.overlap(this.controlGame.controlPlayer.playerSprite, sprite)) {
            this.controlGame.controlPlayer.playerHit(data);
        }
        sprite.destroy();
    };
    cControlMonsters.prototype.youHitMonster = function (data) {
        if (data.damage != 0) {
            this.controlGame.controlConsole.newMessage(enumMessage.youHit, "Golpeaste al monstruo por " + data.damage);
            //pongo una animación sobre el pj 
            var monster = this.arrayMonster[data.idMonster];
            if (monster != null) {
                this.controlGame.controlPlayer.controlSpells.spellAnimation(monster.monsterInternalSprite, data);
            }
        }
    };
    return cControlMonsters;
}());
