var cControlMonsters = (function () {
    function cControlMonsters(controlGame) {
        this.controlGame = controlGame;
        this.arrayMonster = [];
        this.mosterSpecialHit('data');
    }
    cControlMonsters.prototype.newMonster = function (data) {
        this.arrayMonster[data.id] = new cMonster(this.controlGame, data);
    };
    cControlMonsters.prototype.monsterDie = function (data) {
        console.log(data);
        var monster = this.arrayMonster[data.idMonster];
        //hago desaparecer el moustro del juego
        if (monster != null) {
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
        if (data.idPlayer == this.controlGame.controlPlayer.idServer) {
            this.controlGame.controlPlayer.playerHit(data);
        }
    };
    cControlMonsters.prototype.mosterSpecialHit = function (data) {
        data = {
            damage: 50,
            tileX: 25,
            tileY: 30,
            spellSize: 400,
            coolDownTimeSec: 3,
        };
        //creo un cuadrado donde va a explotar el hechizo
        var spriteAreaAtack;
        var bitmapAtack = this.controlGame.game.add.graphics(0, 0);
        ;
        bitmapAtack.beginFill(0xe33133);
        bitmapAtack.drawCircle(0, 0, data.spellSize);
        spriteAreaAtack = this.controlGame.game.add.sprite(data.tileX * this.controlGame.gridSize, data.tileY * this.controlGame.gridSize);
        spriteAreaAtack.addChild(bitmapAtack);
        this.controlGame.game.physics.arcade.enable(spriteAreaAtack);
        spriteAreaAtack.anchor.set(0, 0); //esquina superior izquierda
        spriteAreaAtack.alpha = 0.25;
        this.spriteAreaAtack = spriteAreaAtack;
        var body;
        console.log(spriteAreaAtack.body);
        //spriteAreaAtack.body.setCircle(data.spellSize); ja!, viene recien en la versoin 2.6
        this.controlGame.game.debug.body(spriteAreaAtack);
        //lo dejo justo entre las capas de tiles y los objetos
        spriteAreaAtack.sendToBack();
        spriteAreaAtack.moveUp();
        spriteAreaAtack.moveUp();
        spriteAreaAtack.moveUp();
        this.controlGame.game.add.tween(spriteAreaAtack).to({ alpha: 2 }, data.coolDownTimeSec * 1000, Phaser.Easing.Cubic.In, true);
        this.controlGame.game.time.events.add(Phaser.Timer.SECOND * data.coolDownTimeSec, this.monsterSpecialHitDone, this, { data: data, spriteAreaAtack: spriteAreaAtack });
        console.log(spriteAreaAtack);
    };
    cControlMonsters.prototype.hasCollidedCircle = function (obj1, obj2) {
        if (obj1 == null || obj2 == null) {
            return false;
        }
        var dx = obj1.x - obj2.x;
        var dy = obj1.y - obj2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var objectSize = (obj2.contentWidth / 2) + (obj1.contentWidth / 2);
        if (distance < objectSize) {
            return true;
        }
        else {
            return false;
        }
    };
    cControlMonsters.prototype.monsterSpecialHitDone = function (specialHit) {
        var data = specialHit.data;
        var spriteAreaAtack = specialHit.spriteAreaAtack;
        var playertileX = this.controlGame.controlPlayer.tileX;
        var playertileY = this.controlGame.controlPlayer.tileY;
        console.log(spriteAreaAtack);
        console.log(this.controlGame.game.physics.arcade.overlap(this.controlGame.controlPlayer.armorSprite, spriteAreaAtack));
        if (this.controlGame.controlPlayer.armorSprite.overlap(spriteAreaAtack.children[0])) {
            console.log("andetro");
        }
        //specialHit.spriteAreaAtack.destroy();
    };
    cControlMonsters.prototype.youHitMonster = function (data) {
        if (data.damage != 0) {
            this.controlGame.controlConsole.newMessage(enumMessage.youHit, "Golpeaste al monstruo por " + data.damage);
            //pongo una animación sobre el pj 
            var monster = this.arrayMonster[data.idMonster];
            if (monster != null) {
                this.controlGame.controlPlayer.controlSpells.spellAnimation(monster.monsterSprite, data);
            }
        }
    };
    return cControlMonsters;
}());
