var cDefinitionSpells = (function () {
    function cDefinitionSpells(controlGame) {
        this.controlGame = controlGame;
        this.defineSpells();
    }
    cDefinitionSpells.prototype.defineSpells = function () {
        this.arraySpells = new Array();
        //Defino los hechizos que voy a usar en el juego, esto lo hacemos aca pero puede ir en un csv o txt.
        //Focus Vida
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 0;
        newSpell.spellName = "Focus Vida";
        newSpell.manaCost = 0;
        newSpell.energyCost = 0;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionTimeSeconds = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;
        //Focus Mana
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 1;
        newSpell.spellName = "Focus Mana";
        newSpell.manaCost = 0;
        newSpell.energyCost = 0;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionTimeSeconds = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;
        //Focus Energia
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 2;
        newSpell.spellName = "Focus Energia";
        newSpell.manaCost = 0;
        newSpell.energyCost = 0;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionTimeSeconds = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;
        //FireBall
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 3;
        newSpell.spellName = "Bola de Fuego";
        newSpell.manaCost = 30;
        newSpell.energyCost = 5;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 0;
        newSpell.coolDownTimeSec = 1;
        newSpell.explotionSprite = 'boom';
        newSpell.explotionFrameRate = 150;
        //CriticalBall
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 4;
        newSpell.spellName = "Meteorito Mortal";
        newSpell.manaCost = 20;
        newSpell.energyCost = 5;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 5;
        newSpell.coolDownTimeSec = 2.5;
        newSpell.explotionSprite = 'boom3';
        newSpell.explotionFrameRate = 100;
        //WeakBall
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 5;
        newSpell.spellName = "Ataque Mortal";
        newSpell.manaCost = 50;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 2;
        newSpell.posInSpritesheet = 6;
        newSpell.explotionSprite = 'aura2';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionTimeSeconds = 5;
        newSpell.coolDownTimeSec = 10;
        newSpell.enabledTrowOtherPlayer = true;
        newSpell.enabledTrowThisPlayer = false;
        //ProtectField
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        newSpell.idSpell = 6;
        newSpell.spellName = "Escudo Protector";
        newSpell.manaCost = 0;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 2;
        newSpell.posInSpritesheet = 3;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionTimeSeconds = 5;
        newSpell.coolDownTimeSec = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;
    };
    return cDefinitionSpells;
}());
