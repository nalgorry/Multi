var cSpell = (function () {
    function cSpell(controlGame) {
        this.controlGame = controlGame;
        this.explotionLoopNumber = 1;
        this.enabledTrowOtherPlayer = true;
        this.enabledTrowThisPlayer = false;
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
        this.signalTest = new Phaser.Signal();
    };
    cSpell.prototype.spellSelected = function () {
        this.signalTest.dispatch(this);
    };
    return cSpell;
}());
