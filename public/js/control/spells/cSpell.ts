class cSpell {

    public spellName:string;

    public manaCost:number;
    public energyCost:number;
    public lifeCost:number;

    private spellSprite:Phaser.Sprite

    constructor(public controlGame: cControlGame) {

        var spellSprite = this.controlGame.game.add.sprite(1000, 1000, 'spells',1);

    }

}