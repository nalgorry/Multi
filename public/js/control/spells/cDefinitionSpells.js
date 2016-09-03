var cDefinitionSpells = (function () {
    function cDefinitionSpells(controlGame) {
        this.controlGame = controlGame;
        this.defineSpells();
    }
    cDefinitionSpells.prototype.defineSpells = function () {
        this.arraySpells = new Array();
        //Defino los hechizos que voy a usar en el juego, esto lo hacemos aca pero puede ir en un csv o txt.
        var newSpell = new cSpell(this.controlGame, 0, "Bola de Fuego", 50, 20, 0, 0, 'boom', 100);
        this.arraySpells.push(newSpell);
        var newSpell = new cSpell(this.controlGame, 1, "Meteorito Mortal", 100, 40, 0, 1, 'boom2', 100);
        this.arraySpells.push(newSpell);
        var newSpell = new cSpell(this.controlGame, 2, "Escudo Protector", 50, 100, 0, 2, 'boom', 100);
        this.arraySpells.push(newSpell);
    };
    return cDefinitionSpells;
}());
