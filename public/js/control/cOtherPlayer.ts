class cOtherPlayer extends cBasicActor {

    idServer:string;
    moveTween:Phaser.Tween;

    constructor(controlGame:cControlGame,data) {

        super(controlGame);

        this.idServer = data.id;

        this.startActor(data.startX , data.startY); //esto inicia todo el jugador con sus elementos
        this.startPlayer(data);

        
    }

    public startPlayer(data) {       
        
        this.armorSprite.inputEnabled = true;
        this.armorSprite.events.onInputDown.add(this.youHitPlayer, this);
        this.setNameText(data.name);

        this.startAnimation('idle_right');

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
        } else if (data.dirMov == move.idleLeft) {
            this.moveTween.onComplete.add(this.resetAnimation, this,undefined,move.idleLeft)
        } else if (data.dirMov == move.idleRight) {
            this.moveTween.onComplete.add(this.resetAnimation, this,undefined,move.idleRight)
        }

        this.tileX = this.controlGame.layer.getTileX(data.x);
        this.tileY = this.controlGame.layer.getTileY(data.y);

    }

    public resetAnimation(sprite, tween , dir:move) {

            if (dir == move.idleLeft) {
                this.startAnimation('idle_left');
            } else {
                this.startAnimation('idle_right');
            }
    }

    public youHitPlayer() {

        this.controlGame.controlPlayer.controlSpells.otherPlayerClick(this)

    }

    public removePlayer() {
        //borro el focus
        this.controlGame.controlPlayer.controlSpells.releaseFocus(this.idServer);

        this.playerSprite.kill();
    }

    public playerDie(data) {

        var deadAnimation = this.controlGame.game.add.tween(this.playerSprite).to( { alpha: 0}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
        deadAnimation.onComplete.add(this.destroySprite,this,null,data);
    }

    public destroySprite(sprite, animation, data) {
        this.playerSprite.x = data.tileX * this.controlGame.gridSize;
        this.playerSprite.y = data.tileY * this.controlGame.gridSize;
        var reviveAnimation = this.controlGame.game.add.tween(this.playerSprite).to( { alpha: 1}, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
    }

}