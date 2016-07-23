class cOtherPlayerData extends cPlayerData {

    id:Text;

    public IniciarJugador() {

        this.playerSprite = this.game.add.sprite(this.tileX * 50, this.tileY * 50, 'player');
        this.playerSprite.anchor.set(0,0.5);

        this.game.physics.arcade.enable(this.playerSprite);
        
        this.playerSprite.body.collideWorldBounds = true;

    }

    public MoverJugador(data) {
        
        this.game.add.tween(this.playerSprite).to({ x: data.x * 50 }, 350, Phaser.Easing.Linear.None, true, 0);
        this.game.add.tween(this.playerSprite).to({ y: data.y * 50 }, 350, Phaser.Easing.Linear.None, true, 0);

    }

    public removePlayer() {
        this.playerSprite.kill();
    }

}