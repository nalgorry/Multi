class cDefinitionSpells {

    public arraySpells: Array<cSpell>;

    constructor(public controlGame:cControlGame) {

        this.definenumSpells();


    }

    definenumSpells() {

        this.arraySpells = new Array<cSpell>();

        //Defino los hechizos que voy a usar en el juego, esto lo hacemos aca pero puede ir en un csv o txt.
        
        //BasicAtack
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[enumSpells.BasicAtack] = newSpell;

        newSpell.idSpell = enumSpells.BasicAtack;
        newSpell.spellName = "Bola de Fuego";
        newSpell.manaCost = 8;
        newSpell.energyCost = 5;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 0;
        newSpell.coolDownTimeSec = 0.6;
        newSpell.explotionSprite = 'boom4';
        newSpell.tint = 0xFC0000;
        newSpell.explotionFrameRate = 100;
        newSpell.rayAnimationType = enumRayAnimations.arrow;

        //Special atack release
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[enumSpells.CriticalBallRelease] = newSpell;

        newSpell.idSpell = enumSpells.CriticalBallRelease;
        newSpell.spellName = "Estrella Ninja";
        newSpell.manaCost = 30;
        newSpell.energyCost = 5;
        newSpell.lifeCost = 0;
        newSpell.posInSpritesheet = 1;
        newSpell.coolDownTimeSec = 1.5;
        newSpell.rayAnimationType = enumRayAnimations.ninjaStar;
        newSpell.afterAnimationSpell = enumSpells.CriticalBallHit

        //Special atack hit
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[enumSpells.CriticalBallHit] = newSpell;

        newSpell.idSpell = enumSpells.CriticalBallHit;
        newSpell.spellName = "Estrella Ninja HIT";
        newSpell.explotionSprite = 'boom4';
        newSpell.explotionFrameRate = 100;

        //firestorm
        var newSpell = new cSpell(this.controlGame);
        this.arraySpells[enumSpells.WeakBall] = newSpell;
        
        newSpell.idSpell = enumSpells.WeakBall;
        newSpell.spellName = "Ataque de rayo";
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
        newSpell.rayAnimationType = enumRayAnimations.arrow;

        //ProtectField
        var newSpell = new cSpell(this.controlGame);
         this.arraySpells[enumSpells.ProtectField] = newSpell;
        
        newSpell.idSpell = enumSpells.ProtectField;
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
        newSpell.rayAnimationType = enumRayAnimations.ray;

        //HealHand
        var newSpell = new cSpell(this.controlGame);
         this.arraySpells[enumSpells.HealHand] = newSpell;
        
        newSpell.idSpell = enumSpells.HealHand;
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
        newSpell.rayAnimationType = enumRayAnimations.ray;

        //LightingStorm
        var newSpell = new cSpell(this.controlGame);
         this.arraySpells[enumSpells.LightingStorm] = newSpell;
        
        newSpell.idSpell = enumSpells.LightingStorm;
        newSpell.spellName = "Lighting Storm";
        newSpell.manaCost = 30;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 0;
        newSpell.coolDownTimeSec = 2;
        newSpell.enabledTrowOtherPlayer = true;
        newSpell.enabledTrowThisPlayer = false;
        newSpell.enabledTrowOnMonster = true;
        newSpell.posInSpritesheet = 5;
        newSpell.explotionSprite = 'boom4';
        newSpell.explotionFrameRate = 100;
        newSpell.rayAnimationType = enumRayAnimations.ray;

        //Explosion
        var newSpell = new cSpell(this.controlGame);
        
        newSpell.idSpell = enumSpells.SelfExplosion;
        newSpell.spellName = "Fireball";
        newSpell.manaCost = 50;
        newSpell.energyCost = 50;
        newSpell.lifeCost = 30;
        newSpell.coolDownTimeSec = 4;
        newSpell.enabledTrowOtherPlayer = false;
        newSpell.enabledTrowThisPlayer = true;
        newSpell.enabledTrowOnMonster = false;
        newSpell.posInSpritesheet = 6;
        newSpell.explotionSprite = 'boom3';
        newSpell.explotionFrameRate = 16;
        newSpell.explotionYOffset = 70;

        //Fireball
        var newSpell = new cSpell(this.controlGame);
        
        newSpell.idSpell = enumSpells.fireballRelease;
        newSpell.spellName = "Fireball";
        newSpell.manaCost = 20;
        newSpell.energyCost = 20;
        newSpell.lifeCost = 0;
        newSpell.coolDownTimeSec = 3;
        newSpell.enabledTrowOtherPlayer = true;
        newSpell.enabledTrowThisPlayer = false;
        newSpell.enabledTrowOnMonster = true;
        newSpell.posInSpritesheet = 6;
        newSpell.explotionSprite = undefined;
        newSpell.rayAnimationType = enumRayAnimations.fireball;
        newSpell.afterAnimationSpell = enumSpells.fireballHit;

        this.arraySpells[newSpell.idSpell] = newSpell;

        //Fireball finish, we only need the explosion deff for this one.
        var newSpell = new cSpell(this.controlGame);
        
        newSpell.idSpell = enumSpells.fireballHit;
        newSpell.spellName = "Fireball Hit";
        newSpell.explotionSprite = "boom4";
        newSpell.explotionFrameRate = 40;
        

        this.arraySpells[newSpell.idSpell] = newSpell;

    }


}