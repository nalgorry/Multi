var cSpell = (function () {
    function cSpell(controlGame) {
        this.controlGame = controlGame;
        this.explotionTimeSeconds = 0;
        this.explotionFollowCharacter = true;
        this.explotionYOffset = -10;
        this.enabledTrowOtherPlayer = true;
        this.enabledTrowOnMonster = true;
        this.enabledTrowThisPlayer = false;
        this.coolDownTimeSec = 2;
        this.tint = null;
        this.isSpellOnCoolDown = false;
    }
    cSpell.prototype.spellAnimation = function (sprite) {
        //animiacion de la bomba 
        if (this.explotionFollowCharacter == true) {
            var boomSprite = this.controlGame.game.add.sprite(0, this.explotionYOffset, this.explotionSprite);
            sprite.addChild(boomSprite);
        }
        else {
            var boomSprite = this.controlGame.game.add.sprite(sprite.x, sprite.y + this.explotionYOffset, this.explotionSprite);
        }
        boomSprite.anchor.set(0.5, 1);
        var animation = boomSprite.animations.add('boom');
        //cambio el tint de la explosión si viene con 
        if (this.tint != null) {
            boomSprite.tint = this.tint;
        }
        sprite.addChild(boomSprite);
        if (this.explotionTimeSeconds == 0) {
            boomSprite.animations.play('boom', this.explotionFrameRate, false, true);
        }
        else {
            boomSprite.animations.play('boom', this.explotionFrameRate, true, true);
            this.controlGame.game.time.events.add(Phaser.Timer.SECOND * this.explotionTimeSeconds, this.animationFinish, animation);
        }
    };
    cSpell.prototype.animationFinish = function () {
        var animation = this;
        animation.loop = false;
    };
    cSpell.prototype.iniciateSpell = function (spellPos, spellNumber) {
        console.log(this.controlGame);
        this.spellSprite = this.controlGame.game.add.sprite(spellPos.x, spellPos.y, 'spells', this.posInSpritesheet);
        this.controlGame.spriteInterfaz.addChild(this.spellSprite);
        this.spellSprite.inputEnabled = true;
        this.spellNumber = spellNumber;
        this.spellSprite.events.onInputDown.add(this.spellSelected, this);
        this.signalSpellSel = new Phaser.Signal();
        //creo el recuadro para el coolDownTimeSec
        //circulo interior
        this.spriteFocusCool = this.controlGame.game.add.graphics(this.spellSprite.x + this.spellSprite.width / 2, this.spellSprite.y + this.spellSprite.height / 2);
        this.spriteFocusCool.lineStyle(2, 0x141417, 1);
        this.spriteFocusCool.pivot.x = 0.5;
        this.spriteFocusCool.pivot.y = 0.5;
        this.spriteFocusCool.beginFill(0x141417);
        this.controlGame.spriteInterfaz.addChild(this.spriteFocusCool);
        this.spriteFocusCool.alpha = 0.5;
        this.spriteFocusCool.drawCircle(0, 0, 40);
        this.spriteFocusCool.visible = false;
        //circulo fijo
        this.spriteFocusFixCool = this.controlGame.game.add.graphics(this.spellSprite.x + this.spellSprite.width / 2, this.spellSprite.y + this.spellSprite.height / 2);
        this.spriteFocusFixCool.lineStyle(2, 0x141417, 1);
        this.spriteFocusFixCool.beginFill(0x141417);
        this.controlGame.spriteInterfaz.addChild(this.spriteFocusFixCool);
        this.spriteFocusFixCool.alpha = 0.25;
        this.spriteFocusFixCool.drawCircle(0, 0, 40);
        this.spriteFocusFixCool.visible = false;
    };
    cSpell.prototype.spellSelected = function () {
        this.signalSpellSel.dispatch(this);
    };
    cSpell.prototype.spellColdDown = function () {
        this.isSpellOnCoolDown = true;
        this.spriteFocusCool.visible = true;
        this.spriteFocusFixCool.visible = true;
        this.spriteFocusCool.scale.set(1, 1);
        this.controlGame.game.add.tween(this.spriteFocusCool.scale).to({ x: 0, y: 0 }, this.coolDownTimeSec * 1000, Phaser.Easing.Linear.None, true);
        this.controlGame.game.time.events.add(Phaser.Timer.SECOND * this.coolDownTimeSec, this.coolDownFinish, this);
    };
    cSpell.prototype.coolDownFinish = function () {
        this.spriteFocusCool.visible = false;
        this.spriteFocusFixCool.visible = false;
        this.isSpellOnCoolDown = false;
    };
    return cSpell;
}());
