class cSpell {

    public spellSprite:Phaser.Sprite
    public spellNumber:number

    public signalTest:Phaser.Signal;

    constructor(public controlGame: cControlGame,
                public idSpell:number,
                public spellName: string,
                public manaCost:number,
                public energyCost:number,
                public lifeCost:number,
                public posInSpritesheet:number,
                public explotionSprite:string,
                public explotionFrameRate:number) {

        //this.spellSprite.anchor.setTo(1);
        
    }

    public spellAnimation(actor:cBasicActor) {
        //animiacion de la bomba 
        var boomSprite = this.controlGame.game.add.sprite(actor.tileX* this.controlGame.gridSize + this.controlGame.gridSize/2 , 
            actor.tileY * this.controlGame.gridSize + this.controlGame.gridSize/2,this.explotionSprite);    
        boomSprite.anchor.set(0.5);
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