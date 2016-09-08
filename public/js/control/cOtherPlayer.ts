class cOtherPlayer extends cBasicActor {

    id:Text;

    constructor(controlGame:cControlGame,data) {

        super(controlGame);

        this.id = data.id;
        this.tileX = data.x;
        this.tileY = data.y;

        this.startActor(); //esto inicia todo el jugador con sus elementos
        this.startPlayer();
        
    }

    public startPlayer() {       
        
        this.playerSprite.inputEnabled = true;
        this.playerSprite.events.onInputDown.add(this.youHitPlayer, this);

        this.startAnimation('idle');

    }

    public MoverJugador(data) {
        
        var tween = this.controlGame.game.add.tween(this.playerSprite).to({ x: data.x * this.controlGame.gridSize + this.playerSprite.width/2 }, 350, Phaser.Easing.Linear.None, true, 0);
        this.controlGame.game.add.tween(this.playerSprite).to({ y: data.y * this.controlGame.gridSize }, 350, Phaser.Easing.Linear.None, true, 0);

        tween.onComplete.add(this.resetAnimation, this)
        
        if (data.x > this.tileX) {
            this.startAnimation('right');
        } else if (data.x < this.tileX) {
            this.startAnimation('left');
        }

        if (data.y > this.tileY) {
            this.startAnimation('up');
        } else if (data.y < this.tileY) {
            this.startAnimation('down');
        }

        this.tileX = data.x;
        this.tileY = data.y;

    }

    public resetAnimation() {
        this.startAnimation('idle');
    }

    public youHitPlayer() {

        this.controlGame.controlPlayer.controlSpells.otherPlayerClick(this)

    }

    public removePlayer() {
        this.playerSprite.kill();
    }

}