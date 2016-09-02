var cControlSpells = (function () {
    function cControlSpells(controlGame) {
        this.controlGame = controlGame;
        this.createSpells();
    }
    cControlSpells.prototype.createSpells = function () {
        var setSpell = new cSpell(this.controlGame);
    };
    return cControlSpells;
}());
