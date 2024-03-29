class cSpell {

    //variables para definir el hechizo
    public idSpell:number;
    public spellName: string;
    public manaCost:number;
    public energyCost:number;
    public lifeCost:number;
    public posInSpritesheet:number;
    public explotionSprite:string;
    public explotionFrameRate:number;
    public explotionTimeSeconds:number = 0;
    public explotionFollowCharacter:boolean = true;
    public explotionYOffset:number = -10;
    public enabledTrowOtherPlayer: boolean = true;
    public enabledTrowOnMonster: boolean = true;
    public enabledTrowThisPlayer: boolean = false;
    public coolDownTimeSec:number = 2;
    public tint:number = null;
    public rayAnimationType:enumRayAnimations;
    public afterAnimationSpell:enumSpells;
    public flagSpellSelected = true;
    
    
    //variables creadas por la clase
    public spellSprite:Phaser.Sprite
    public spellNumber:number
    public isSpellOnCoolDown:boolean = false;

    public signalSpellSel:Phaser.Signal;

    constructor(public controlGame: cControlGame) {
        
    }

    public animationFinish() {
            var animation:any = this;
            animation.loop = false;
    }

    public iniciateSpell(spellPos:Phaser.Point,spellNumber:number) {

        this.spellSprite = this.controlGame.game.add.sprite(spellPos.x, spellPos.y, 'spells',this.posInSpritesheet);
        this.controlGame.spriteInterfaz.addChild(this.spellSprite);
        this.spellSprite.inputEnabled = true;
        
        this.spellNumber = spellNumber
        
        this.spellSprite.events.onInputDown.add(this.spellSelected, this);
        this.spellSprite.events.onInputUp.add(this.spellRelease, this);

        this.signalSpellSel = new Phaser.Signal();

        //creo el recuadro para el coolDownTimeSec
        //circulo interior
        this.spriteFocusCool = this.controlGame.game.add.graphics(this.spellSprite.x + this.spellSprite.width/2,
        this.spellSprite.y + this.spellSprite.height/2);
        this.spriteFocusCool.lineStyle(2, 0x141417, 1);
        this.spriteFocusCool.pivot.x = 0.5;
        this.spriteFocusCool.pivot.y = 0.5;
        this.spriteFocusCool.beginFill(0x141417);
        this.controlGame.spriteInterfaz.addChild(this.spriteFocusCool);
        this.spriteFocusCool.alpha = 0.5;
        this.spriteFocusCool.drawCircle(0, 0, 40);
        this.spriteFocusCool.visible = false;

        //circulo fijo
        this.spriteFocusFixCool = this.controlGame.game.add.graphics(this.spellSprite.x + this.spellSprite.width/2,
        this.spellSprite.y + this.spellSprite.height/2);
        this.spriteFocusFixCool.lineStyle(2, 0x141417, 1);
        this.spriteFocusFixCool.beginFill(0x141417);
        this.controlGame.spriteInterfaz.addChild(this.spriteFocusFixCool);
        this.spriteFocusFixCool.alpha = 0.25;
        this.spriteFocusFixCool.drawCircle(0, 0, 40);
        this.spriteFocusFixCool.visible = false;
        
    }

    spellSelected() {
        
        this.signalSpellSel.dispatch(this);
        this.flagSpellSelected = true;

    }

    spellRelease() {
        this.flagSpellSelected = false;
    }

    spriteFocusCool:Phaser.Graphics;
    spriteFocusFixCool:Phaser.Graphics;

    spellColdDown() {
        this.isSpellOnCoolDown = true;
        
        this.spriteFocusCool.visible = true;
        this.spriteFocusFixCool.visible = true;
        this.spriteFocusCool.scale.set(1,1);

        this.controlGame.game.add.tween(this.spriteFocusCool.scale).to(
             { x: 0, y:0 }, this.coolDownTimeSec * 1000, Phaser.Easing.Linear.None, true);

        this.controlGame.game.time.events.add(Phaser.Timer.SECOND * this.coolDownTimeSec, this.coolDownFinish, this);
    }

    coolDownFinish() {
        this.spriteFocusCool.visible = false;
        this.spriteFocusFixCool.visible = false;
        this.isSpellOnCoolDown = false;

        //left check if the spell is still selected
        if (this.flagSpellSelected == true) {
            this.signalSpellSel.dispatch(this);
        }
    }



}

enum enumRayAnimations {
    ray,
    arrow,
    fireball,
    ninjaStar,
}