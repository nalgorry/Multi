var cDefinitionSpells = (function () {
    function cDefinitionSpells(controlGame) {
        this.controlGame = controlGame;
        this.defineSpells();
    }
    cDefinitionSpells.prototype.defineSpells = function () {
        this.arraySpells = new Array();
        //Defino los hechizos que voy a usar en el juego, esto lo hacemos aca pero puede ir en un csv o txt.
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 0;
        newSpell.spellName = "Bola de Fuego";
        newSpell.manaCost = 50;
        newSpell.energyCost = 20;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 0;
        newSpell.explotionSprite = 'boom';
        newSpell.explotionFrameRate = 150;
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 1;
        newSpell.spellName = "Meteorito Mortal";
        newSpell.manaCost = 20;
        newSpell.energyCost = 80;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.explotionSprite = 'boom3';
        newSpell.explotionFrameRate = 100;
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 2;
        newSpell.spellName = "Escudo Protector";
        newSpell.manaCost = 50;
        newSpell.energyCost = 100;
        newSpell.lifeCost = 2;
        newSpell.posInSpritesheet = 2;
        newSpell.explotionSprite = 'boom';
        newSpell.explotionFrameRate = 100;
    };
    return cDefinitionSpells;
}());
