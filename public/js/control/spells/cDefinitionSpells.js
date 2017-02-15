var cDefinitionSpells = (function () {
    function cDefinitionSpells(controlGame) {
        this.controlGame = controlGame;
        this.definenumSpells();
    }
    cDefinitionSpells.prototype.definenumSpells = function () {
        this.arraySpells = new Array();
        //Defino los hechizos que voy a usar en el juego, esto lo hacemos aca pero puede ir en un csv o txt.
        //BasicAtack
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[1 /* BasicAtack */] = newSpell;
        newSpell.idSpell = 1 /* BasicAtack */;
        newSpell.spellName = "Bola de Fuego";
        newSpell.manaCost = 30;
        newSpell.energyCost = 5;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 0;
        newSpell.coolDownTimeSec = 0.8;
        newSpell.explotionSprite = 'boom4';
        newSpell.tint = 0xFC0000;
        newSpell.explotionFrameRate = 100;
        //CriticalBall
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[2 /* CriticalBall */] = newSpell;
        newSpell.idSpell = 2 /* CriticalBall */;
        newSpell.spellName = "Meteorito Mortal";
        newSpell.manaCost = 20;
        newSpell.energyCost = 5;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.coolDownTimeSec = 2;
        newSpell.explotionSprite = 'boom4';
        newSpell.explotionFrameRate = 100;
        //WeakBall
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[3 /* WeakBall */] = newSpell;
        newSpell.idSpell = 3 /* WeakBall */;
        newSpell.spellName = "Ataque Mortal";
        newSpell.manaCost = 50;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 2;
        newSpell.posInSpritesheet = 2;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionYOffset = 25;
        newSpell.tint = 0xFC0000;
        newSpell.explotionFrameRate = 5;
        newSpell.explotionTimeSeconds = 5;
        newSpell.coolDownTimeSec = 10;
        newSpell.enabledTrowOtherPlayer = true;
        newSpell.enabledTrowThisPlayer = false;
        //ProtectField
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[4 /* ProtectField */] = newSpell;
        newSpell.idSpell = 4 /* ProtectField */;
        newSpell.spellName = "Escudo Protector";
        newSpell.manaCost = 0;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 2;
        newSpell.posInSpritesheet = 3;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionYOffset = 25;
        newSpell.explotionFrameRate = 10;
        newSpell.explotionTimeSeconds = 5;
        newSpell.coolDownTimeSec = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;
        newSpell.enabledTrowOnMonster = false;
        //HealHand
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[5 /* HealHand */] = newSpell;
        newSpell.idSpell = 5 /* HealHand */;
        newSpell.spellName = "Heal Hand";
        newSpell.manaCost = 30;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 0;
        newSpell.coolDownTimeSec = 4;
        newSpell.enabledTrowOtherPlayer = true;
        newSpell.enabledTrowThisPlayer = true;
        newSpell.enabledTrowOnMonster = false;
        newSpell.posInSpritesheet = 4;
        newSpell.explotionSprite = 'boom4';
        newSpell.explotionFrameRate = 100;
        //LightingStorm
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[6 /* LightingStorm */] = newSpell;
        newSpell.idSpell = 6 /* LightingStorm */;
        newSpell.spellName = "Lighting Storm";
        newSpell.manaCost = 30;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 0;
        newSpell.coolDownTimeSec = 4;
        newSpell.enabledTrowOtherPlayer = true;
        newSpell.enabledTrowThisPlayer = false;
        newSpell.enabledTrowOnMonster = true;
        newSpell.posInSpritesheet = 5;
        newSpell.explotionSprite = 'boom3';
        newSpell.explotionFrameRate = 100;
        //Explosion
        var newSpell = new cSpell(this.controlGame);
        newSpell.idSpell = 7 /* SelfExplosion */;
        newSpell.spellName = "Self Explosion";
        newSpell.manaCost = 50;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 30;
        newSpell.coolDownTimeSec = 4;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;
        newSpell.enabledTrowOnMonster = false;
        newSpell.posInSpritesheet = 2;
        newSpell.explotionSprite = 'boom3';
        newSpell.explotionFrameRate = 16;
        newSpell.explotionYOffset = 70;
        this.arraySpells[newSpell.idSpell] = newSpell;
    };
    return cDefinitionSpells;
}());
