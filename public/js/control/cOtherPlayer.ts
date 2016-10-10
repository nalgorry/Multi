class cOtherPlayer extends cBasicActor {

    idServer:Text;
    moveTween:Phaser.Tween;

    constructor(controlGame:cControlGame,data) {

        super(controlGame);

        this.idServer = data.id;
        this.tileX = data.x;
        this.tileY = data.y;

        this.startActor(); //esto inicia todo el jugador con sus elementos
        this.startPlayer();
        
    }

    public startPlayer() {       
        
        this.armorSprite.inputEnabled = true;
        this.armorSprite.events.onInputDown.add(this.youHitPlayer, this);

        this.startAnimation('idle');

    }

    public MoverJugador(data) {
        
        this.moveTween = this.controlGame.game.add.tween(this.playerSprite).to(
            { x: data.x , y: data.y }
            , 320, Phaser.Easing.Linear.None, true, 0);      
     
        if (data.dirMov == move.right) {
            this.startAnimation('right');
        } else if (data.dirMov == move.left) {
            this.startAnimation('left');
        } else if (data.dirMov == move.up) {
            this.startAnimation('up');
        } else if (data.dirMov == move.down) {
            this.startAnimation('down');
        } else if (data.dirMov == move.idle) {
            this.moveTween.onComplete.add(this.resetAnimation, this)
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