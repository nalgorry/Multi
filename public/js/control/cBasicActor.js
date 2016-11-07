var cBasicActor = (function () {
    function cBasicActor(_controlGame) {
        this.controlGame = _controlGame;
        this.styleChat = { font: "16px Arial", fill: "#000000" };
        this.styleName = { font: "16px Arial", fill: "#3e76d1" };
        this.styleHit = { font: "16px Arial", fill: "#612131" };
    }
    cBasicActor.prototype.setChatText = function (texto) {
        if (this.textChat == null) {
            this.textChat = this.controlGame.game.add.text(0, -this.armorSprite.height - 18, "", this.styleChat);
            this.playerSprite.addChild(this.textChat);
        }
        this.textChat.text = texto;
        this.textChat.x = -this.textChat.width / 2;
    };
    cBasicActor.prototype.setNameText = function (texto) {
        if (this.textName == null) {
            this.textName = this.controlGame.game.add.text(0, 0, "", this.styleName);
            this.playerSprite.addChild(this.textName);
        }
        this.textName.text = texto;
        this.textName.x = -this.textName.width / 2;
    };
    cBasicActor.prototype.startActor = function () {
        var test = this.controlGame.game.add.sprite(1000, 1000, 'pj');
        test.anchor.set(0.5, 0);
        var a = Phaser.Animation.generateFrameNames('Golpe_', 0, 5, '.png');
        test.animations.add('test', a, 20, true);
        test.animations.play('test', 10, true);
        var weapon = this.controlGame.game.add.sprite(1000, 1000, 'pj');
        weapon.anchor.set(0.5, 0);
        var a = Phaser.Animation.generateFrameNames('sword_', 0, 5, '.png');
        weapon.animations.add('test', a, 20, true);
        weapon.animations.play('test', 10, true);
        var pjFull = this.controlGame.game.add.sprite(1000, 800, 'pj');
        pjFull.anchor.set(0.5, 0);
        var a = Phaser.Animation.generateFrameNames('Idle_right_', 0, 5, '.png');
        pjFull.animations.add('test', a, 20, true);
        pjFull.animations.play('test', 10, true);
        //sprite del jugador, aca se  cargan todas las partes del jugador
        this.playerSprite = this.controlGame.game.add.sprite(1000, 1000);
        this.playerSprite.anchor.set(0.5, 1);
        this.playerSprite.x += this.playerSprite.width / 2;
        //creo el cuerpo con su armadura
        this.armorSprite = this.controlGame.game.add.sprite(0, 0, 'player', 0);
        this.armorSprite.anchor.set(0.5, 1);
        this.playerSprite.addChild(this.armorSprite);
        //creo el arma
        this.weaponSprite = this.controlGame.game.add.sprite(0, 0, 'weapon1', 0);
        this.weaponSprite.anchor.set(0.5, 1);
        this.playerSprite.addChild(this.weaponSprite);
        //defino las animaciones segun la cantidad de cuadros 
        this.armorSprite.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.armorSprite.animations.add('left', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        this.armorSprite.animations.add('right', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
        this.armorSprite.animations.add('up', [24, 25, 26, 27, 28], 10, true);
        this.armorSprite.animations.add('down', [32, 33, 34, 35, 36], 10, true);
        this.weaponSprite.animations.add('idle', [0, 1, 2, 3, 4], 4, true);
        this.weaponSprite.animations.add('left', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        this.weaponSprite.animations.add('right', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
        this.weaponSprite.animations.add('up', [24, 25, 26, 27, 28], 10, true);
        this.weaponSprite.animations.add('down', [32, 33, 34, 35, 36], 10, true);
        this.controlGame.depthGroup.add(this.playerSprite);
    };
    cBasicActor.prototype.startAnimation = function (animation) {
        this.armorSprite.animations.play(animation);
        this.weaponSprite.animations.play(animation);
        if (animation == 'idle') {
            this.playerSprite.children[0] = this.armorSprite;
            this.playerSprite.children[1] = this.weaponSprite;
        }
        else if (animation == 'left') {
            this.playerSprite.children[0] = this.armorSprite;
            this.playerSprite.children[1] = this.weaponSprite;
        }
        else if (animation == 'right') {
            this.playerSprite.children[0] = this.weaponSprite;
            this.playerSprite.children[1] = this.armorSprite;
        }
        else if (animation == 'up') {
            this.playerSprite.children[0] = this.weaponSprite;
            this.playerSprite.children[1] = this.armorSprite;
        }
        else if (animation == 'down') {
            this.playerSprite.children[0] = this.armorSprite;
            this.playerSprite.children[1] = this.weaponSprite;
        }
    };
    cBasicActor.prototype.onHit = function (data) {
        //texto con el daño
        if (data.damage != 0) {
            var hitText = this.controlGame.game.add.text(-30, -40, data.damage, this.styleHit);
            this.playerSprite.addChild(hitText);
            var tweenText = this.controlGame.game.add.tween(hitText).to({ y: '-30' }, 1000, undefined, true);
            tweenText.onComplete.add(this.removeTweenText, hitText);
        }
        this.controlGame.controlPlayer.controlSpells.spellAnimation(this.playerSprite, data);
    };
    cBasicActor.prototype.removeTweenText = function (sprite) {
        sprite.destroy();
    };
    return cBasicActor;
}());
