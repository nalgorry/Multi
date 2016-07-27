class cOtherPlayerData extends cPlayerData {

    id:Text;

    public IniciarJugador() {

        this.playerSprite = this.controlGame.game.add.sprite(this.tileX * this.controlGame.gridSize, this.tileY * this.controlGame.gridSize, 'player');

        this.controlGame.game.physics.arcade.enable(this.playerSprite);
        
        this.playerSprite.body.collideWorldBounds = true;

        this.controlGame.depthGroup.add(this.playerSprite);

    }

    public MoverJugador(data) {
        
        this.controlGame.game.add.tween(this.playerSprite).to({ x: data.x * this.controlGame.gridSize }, 350, Phaser.Easing.Linear.None, true, 0);
        this.controlGame.game.add.tween(this.playerSprite).to({ y: data.y * this.controlGame.gridSize }, 350, Phaser.Easing.Linear.None, true, 0);

        this.playerSprite.frame = data.dirMov;

    }

    public removePlayer() {
        this.playerSprite.kill();
    }

}