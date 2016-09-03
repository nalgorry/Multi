var cSpell = (function () {
    function cSpell(controlGame, idSpell, spellName, manaCost, energyCost, lifeCost, posInSpritesheet, explotionSprite, explotionFrameRate) {
        //this.spellSprite.anchor.setTo(1);
        this.controlGame = controlGame;
        this.idSpell = idSpell;
        this.spellName = spellName;
        this.manaCost = manaCost;
        this.energyCost = energyCost;
        this.lifeCost = lifeCost;
        this.posInSpritesheet = posInSpritesheet;
        this.explotionSprite = explotionSprite;
        this.explotionFrameRate = explotionFrameRate;
    }
    cSpell.prototype.spellAnimation = function (actor) {
        //animiacion de la bomba 
        var boomSprite = this.controlGame.game.add.sprite(actor.tileX * this.controlGame.gridSize + this.controlGame.gridSize / 2, actor.tileY * this.controlGame.gridSize + this.controlGame.gridSize / 2, this.explotionSprite);
        boomSprite.anchor.set(0.5);
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
