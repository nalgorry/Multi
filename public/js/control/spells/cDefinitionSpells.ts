class cDefinitionSpells {

    public arraySpells: Array<cSpell>;

    constructor(public controlGame:cControlGame) {

        this.defineSpells();


    }

    defineSpells() {

        this.arraySpells = new Array<cSpell>();

        //Defino los hechizos que voy a usar en el juego, esto lo hacemos aca pero puede ir en un csv o txt.
        
        //hechizo 1
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);

        newSpell.idSpell = 0;
        newSpell.spellName = "Bola de Fuego";
        newSpell.manaCost = 40;
        newSpell.energyCost = 20;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 0;
        newSpell.explotionSprite = 'boom';
        newSpell.explotionFrameRate = 150;

        //hechizo 2
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);

        newSpell.idSpell = 1;
        newSpell.spellName = "Meteorito Mortal";
        newSpell.manaCost = 20;
        newSpell.energyCost = 40;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 5;
        newSpell.explotionSprite = 'boom3';
        newSpell.explotionFrameRate = 100;

        //hechizo 3
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);

        newSpell.idSpell = 3;
        newSpell.spellName = "Focus Vida";
        newSpell.manaCost = 0;
        newSpell.energyCost = 0;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionLoopNumber = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;

        //hechizo 4
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        
        newSpell.idSpell = 4;
        newSpell.spellName = "Focus Mana";
        newSpell.manaCost = 0;
        newSpell.energyCost = 0;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionLoopNumber = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;

        //hechizo 5
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        
        newSpell.idSpell = 5;
        newSpell.spellName = "Focus Energia";
        newSpell.manaCost = 0;
        newSpell.energyCost = 0;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionLoopNumber = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;

        //hechizo 6
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells.push(newSpell);
        
        newSpell.idSpell = 6;
        newSpell.spellName = "Escudo Protector";
        newSpell.manaCost = 50;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 2;
        newSpell.posInSpritesheet = 3;
        newSpell.explotionSprite = 'aura';
        newSpell.explotionFrameRate = 5;
        newSpell.explotionLoopNumber = 5;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;




    }


}