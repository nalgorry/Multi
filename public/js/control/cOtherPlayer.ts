class cOtherPlayer extends cBasicActor {

    id:Text;
    idleStatus:boolean;
    moveTween:Phaser.Tween;

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
        
        console.log(data);
        
        this.moveTween = this.controlGame.game.add.tween(this.playerSprite).to(
            { x: data.x * this.controlGame.gridSize + this.playerSprite.width/2, y: data.y * this.controlGame.gridSize   }
            , 320, Phaser.Easing.Linear.None, true, 0);
        this.moveTween.onComplete.add(this.resetAnimation, this)      
        
        this.idleStatus = false;
        
        if (data.dirMov == move.right) {
            this.startAnimation('right');
        } else if (data.dirMov == move.left) {
            this.startAnimation('left');
        } else if (data.dirMov == move.up) {
            this.startAnimation('up');
        } else if (data.dirMov == move.down) {
            this.startAnimation('down');
        } else if (data.dirMov == move.idle) {
            this.idleStatus = true;
        }

        this.tileX = data.x;
        this.tileY = data.y;

    }

    public resetAnimation() {
        if (this.idleStatus == true) {
            this.startAnimation('idle');
        }
    }

    public youHitPlayer() {

        this.controlGame.controlPlayer.controlSpells.otherPlayerClick(this)

    }

    public removePlayer() {
        this.playerSprite.kill();
    }

}