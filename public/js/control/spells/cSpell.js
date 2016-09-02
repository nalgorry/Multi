var cSpell = (function () {
    function cSpell(controlGame) {
        this.controlGame = controlGame;
        var spellSprite = this.controlGame.game.add.sprite(1000, 1000, 'spells', 1);
    }
    return cSpell;
}());
