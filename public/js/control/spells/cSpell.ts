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

    
    //variables creadas por la clase
    public spellSprite:Phaser.Sprite
    public spellNumber:number

    public signalTest:Phaser.Signal;

    constructor(public controlGame: cControlGame) {
        
    }

    public spellAnimation(actor:cBasicActor) {
        //animiacion de la bomba 
        var boomSprite = this.controlGame.game.add.sprite(actor.playerSprite.x , 
            actor.playerSprite.y,this.explotionSprite);    
        boomSprite.anchor.set(0.5,1);
        boomSprite.animations.add('boom');
        boomSprite.animations.play('boom',this.explotionFrameRate,false,true);

    }

    public iniciateSpell(spellPos:Phaser.Point) {
        this.spellSprite = this.controlGame.game.add.sprite(spellPos.x, spellPos.y, 'spells',this.posInSpritesheet);
        this.spellSprite.fixedToCamera = true;
        this.spellSprite.inputEnabled = true;
        
        this.spellSprite.events.onInputDown.add(this.spellSelected, this);

        this.signalTest = new Phaser.Signal();
    }

    spellSelected() {
        
        this.signalTest.dispatch(this);

    }


}