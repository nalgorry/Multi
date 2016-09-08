var cSpell = (function () {
    function cSpell(controlGame) {
        this.controlGame = controlGame;
    }
    cSpell.prototype.spellAnimation = function (actor) {
        //animiacion de la bomba 
        var boomSprite = this.controlGame.game.add.sprite(actor.playerSprite.x, actor.playerSprite.y, this.explotionSprite);
        boomSprite.anchor.set(0.5, 1);
        boomSprite.animations.add('boom');
        boomSprite.animations.play('boom', this.explotionFrameRate, false, true);
    };
    cSpell.prototype.iniciateSpell = function (spellPos) {
        this.spellSprite = this.controlGame.game.add.sprite(spellPos.x, spellPos.y, 'spells', this.posInSpritesheet);
        this.spellSprite.fixedToCamera = true;
        this.spellSprite.inputEnabled = true;
        this.spellSprite.events.onInputDown.add(this.spellSelected, this);
        this.signalTest = new Phaser.Signal();
    };
    cSpell.prototype.spellSelected = function () {
        this.signalTest.dispatch(this);
    };
    return cSpell;
}());
