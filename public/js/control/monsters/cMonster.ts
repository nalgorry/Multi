class cMonster  {

    public idMonster:number;
    public tileX:number;
    public tileY:number;

    public monsterSprite:Phaser.Sprite;
    public monsterAtackTilesX:number = 13;
    public monsterAtackTilesY:number = 9;


    constructor(public controlGame:cControlGame,data) {

        this.idMonster = data.id;
        this.tileX = data.tileX;
        this.tileY = data.tileY;

        this.startMonster(data);

        
    }

    private startMonster(data) {

        console.log(data);

        //creo el moustro
        this.monsterSprite = this.controlGame.game.add.sprite(
            this.tileX * this.controlGame.gridSize, this.tileY * this.controlGame.gridSize,
             'monster_1',0);
        this.monsterSprite.anchor.set(0,1);

        this.controlGame.depthGroup.add(this.monsterSprite);

        var timer = setTimeout(() => this.simulateMonsterAtack(), 1200);


        
    }

    public simulateMonsterAtack() {

        var playerTileX = this.controlGame.controlPlayer.tileX;
        var playerTileY = this.controlGame.controlPlayer.tileY;

        if (Math.abs(playerTileX - this.tileX) < this.monsterAtackTilesX &&
        Math.abs(playerTileY - this.tileY) < this.monsterAtackTilesY) {

                var data = {
                    damage:5,
                    idSpell:4,
                }

                this.controlGame.controlPlayer.playerHit(data);

            }


        var timer = setTimeout(() => this.simulateMonsterAtack(), 650);
    }

    public monsterAtack(data) {

        //me fijo a quien ataco el monstro 
        if (data.idPlayer == this.controlGame.controlPlayer.idServer) {


        }

    }

}

