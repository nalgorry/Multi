var cSpell = (function () {
    function cSpell(controlGame) {
        this.controlGame = controlGame;
        this.explotionLoopNumber = 1;
        this.enabledTrowOtherPlayer = true;
        this.enabledTrowThisPlayer = false;
        this.coolDownTimeSec = 2;
    }
    cSpell.prototype.spellAnimation = function (actor) {
        //animiacion de la bomba 
        var boomSprite = this.controlGame.game.add.sprite(actor.playerSprite.x, actor.playerSprite.y, this.explotionSprite);
        boomSprite.anchor.set(0.5, 1);
        var animation = boomSprite.animations.add('boom');
        if (this.explotionLoopNumber == 1) {
            boomSprite.animations.play('boom', this.explotionFrameRate, false, true);
        }
        else {
            boomSprite.animations.play('boom', this.explotionFrameRate, true, true);
        }
        animation.onLoop.add(this.loopAnimation, this);
    };
    cSpell.prototype.loopAnimation = function (sprite, animation) {
        if (animation.loopCount == this.explotionLoopNumber - 1) {
            animation.loop = false;
        }
    };
    cSpell.prototype.iniciateSpell = function (spellPos, spellNumber) {
        this.spellSprite = this.controlGame.game.add.sprite(spellPos.x, spellPos.y, 'spells', this.posInSpritesheet);
        this.spellSprite.fixedToCamera = true;
        this.spellSprite.inputEnabled = true;
        this.spellNumber = spellNumber;
        this.spellSprite.events.onInputDown.add(this.spellSelected, this);
        this.signalSpellSel = new Phaser.Signal();
        //creo el recuadro para el coolDownTimeSec
        //circulo interior
        this.spriteFocusCool = this.controlGame.game.add.graphics(this.spellSprite.cameraOffset.x + this.spellSprite.width / 2, this.spellSprite.cameraOffset.y + this.spellSprite.height / 2);
        this.spriteFocusCool.lineStyle(2, 0x141417, 1);
        this.spriteFocusCool.pivot.x = 0.5;
        this.spriteFocusCool.pivot.y = 0.5;
        this.spriteFocusCool.beginFill(0x141417);
        this.spriteFocusCool.fixedToCamera = true;
        this.spriteFocusCool.alpha = 0.5;
        this.spriteFocusCool.drawCircle(0, 0, 40);
        this.spriteFocusCool.visible = false;
        //circulo fijo
        this.spriteFocusFixCool = this.controlGame.game.add.graphics(this.spellSprite.cameraOffset.x + this.spellSprite.width / 2, this.spellSprite.cameraOffset.y + this.spellSprite.height / 2);
        this.spriteFocusFixCool.lineStyle(2, 0x141417, 1);
        this.spriteFocusFixCool.beginFill(0x141417);
        this.spriteFocusFixCool.fixedToCamera = true;
        this.spriteFocusFixCool.alpha = 0.25;
        this.spriteFocusFixCool.drawCircle(0, 0, 40);
        this.spriteFocusFixCool.visible = false;
    };
    cSpell.prototype.spellSelected = function () {
        this.signalSpellSel.dispatch(this);
    };
    cSpell.prototype.spellColdDown = function () {
        this.spriteFocusCool.visible = true;
        this.spriteFocusFixCool.visible = true;
        this.spriteFocusCool.scale.set(1, 1);
        this.controlGame.game.add.tween(this.spriteFocusCool.scale).to({ x: 0, y: 0 }, this.coolDownTimeSec * 1000, Phaser.Easing.Linear.None, true);
        this.controlGame.game.time.events.add(Phaser.Timer.SECOND * this.coolDownTimeSec, this.coolDownFinish, this);
    };
    cSpell.prototype.coolDownFinish = function () {
        this.spriteFocusCool.visible = false;
        this.spriteFocusFixCool.visible = false;
    };
    return cSpell;
}());
