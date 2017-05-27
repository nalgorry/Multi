class cMonster  {

    public idMonster:string;
    public tileX:number;
    public tileY:number;
    public monsterSprite:Phaser.Sprite;
    public monsterInternalSprite:Phaser.Sprite;
    public monsterType:enumMonsters;


    private moveTween:Phaser.Tween;

    constructor(public controlGame:cControlGame,data) {

        this.idMonster = data.id;
        this.tileX = data.tileX;
        this.tileY = data.tileY;
        this.monsterType = data.monsterType;

        this.startMonster(data);
        
    }

    private startMonster(data) {

        //creo el moustro segun el tipo de monstruo que toco 
        var monsterImage = "monster_" + data.monsterType;

        this.monsterSprite = this.controlGame.game.add.sprite((this.tileX + 1) * this.controlGame.gridSize, (this.tileY + 1) * this.controlGame.gridSize)
        this.monsterSprite.anchor.set(1,1)

        this.monsterInternalSprite = this.controlGame.game.add.sprite(0,0,
             monsterImage,0);
        this.monsterInternalSprite.anchor.set(0.5,1);
        this.monsterInternalSprite.x += this.monsterSprite.width/2 - this.controlGame.gridSize/2;

        this.monsterSprite.addChild(this.monsterInternalSprite);
        this.monsterSprite.inputEnabled = true;
        this.monsterSprite.events.onInputDown.add(this.youHitMonster, this);

        this.controlGame.depthGroup.add(this.monsterSprite);

    }

    public monsterMove(data) {

        this.tileX = data.tileX;
        this.tileY = data.tileY;
        
        var x = (data.tileX + 1) * this.controlGame.gridSize + this.monsterSprite.width/2;
        var y = (data.tileY + 1) * this.controlGame.gridSize;
        var spriteRotate = this.monsterSprite.children[0];

        if (spriteRotate == undefined) { return }; //para evitar problemas si matan antes que termine el mov

        //me fijo si se mueve para la izquiera o derecha y acomodo el sprite
        if (this.monsterSprite.x > x && spriteRotate.scale.x == 1)  { //izquierda
            spriteRotate.scale.x *= -1
        } else if (this.monsterSprite.x < x && spriteRotate.scale.x == -1) { //derecha
            spriteRotate.scale.x *= -1
        } else { //recto no hago nada es solo para testing

        }

        this.moveTween = this.controlGame.game.add.tween(this.monsterSprite).to(
            { x: x , y: y }
            , 320, Phaser.Easing.Linear.None, true, 0);     

    }

    public youHitMonster() {

        this.controlGame.controlPlayer.controlSpells.monsterClick(this)

    }

    public killMonster() {
        var deadAnimation = this.controlGame.game.add.tween(this.monsterSprite).to( { alpha: 0}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
        deadAnimation.onComplete.add(this.destroySprite,this);
    }

    destroySprite() {
        this.monsterSprite.destroy();
    }


}

