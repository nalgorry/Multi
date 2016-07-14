class cOtherPlayerData extends cPlayerData {

    id:Text;

    public IniciarJugador() {

        this.playerSprite = this.game.add.sprite(this.tileX * 32+16, this.tileY * 32+16, 'player');
        this.playerSprite.anchor.set(0.5);

        this.game.physics.arcade.enable(this.playerSprite);
        
        this.playerSprite.body.collideWorldBounds = true;

    }

    public MoverJugador(data) {
        
        this.game.add.tween(this.playerSprite).to({ x: data.x * 32 + 16 }, 230, Phaser.Easing.Linear.None, true, 0);
        this.game.add.tween(this.playerSprite).to({ y: data.y * 32 + 16 }, 230, Phaser.Easing.Linear.None, true, 0);

    }

}