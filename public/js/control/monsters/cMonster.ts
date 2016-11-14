class cMonster  {

    public idMonster:number;
    public tileX:number;
    public tileY:number;
    public monsterSprite:Phaser.Sprite;

    private moveTween:Phaser.Tween;

    constructor(public controlGame:cControlGame,data) {

        this.idMonster = data.id;
        this.tileX = data.tileX;
        this.tileY = data.tileY;

        this.startMonster(data);

        
    }

    private startMonster(data) {

        //creo el moustro
        this.monsterSprite = this.controlGame.game.add.sprite(
            this.tileX * this.controlGame.gridSize, this.tileY * this.controlGame.gridSize,
             'monster_1',0);
        this.monsterSprite.anchor.set(0.5,1);
        this.monsterSprite.x += this.monsterSprite.width/2;

        this.monsterSprite.inputEnabled = true;
        this.monsterSprite.events.onInputDown.add(this.youHitMonster, this);

        this.controlGame.depthGroup.add(this.monsterSprite);

        
    }

    public monsterMove(data) {

        var x = data.tileX * this.controlGame.gridSize + this.monsterSprite.width/2;
        var y = data.tileY * this.controlGame.gridSize;
        
        this.moveTween = this.controlGame.game.add.tween(this.monsterSprite).to(
            { x: x , y: y }
            , 320, Phaser.Easing.Linear.None, true, 0);     

    }

    public youHitMonster() {

        this.controlGame.controlPlayer.controlSpells.monsterClick(this)

    }

    public killMonster() {
        this.monsterSprite.destroy();
    }


}

