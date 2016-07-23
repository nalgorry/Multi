class cControlPlayer extends cPlayerData {

    public idServer: string;
    
    public lastSendTileX: number;
    public lastSendTileY: number;
    public life:number;
    private speedplayer: number = 150;
    private lastMoveX: number = 0;
    private lastMoveY: number = 0;
    private gridSize: number;

    //texto para mostrar daño (temporal)
    style = { font: "15px Arial", fill: "#ff0044"};
    hitText:Phaser.Text = this.controlGame.game.add.text(0, 0,"Trata de golpear a alguien",this.style);
    
    constructor(controlGame:cControlGame) {
        super(controlGame);
        
        this.startPlayer();
        this.gridSize = controlGame.gridSize;

    }

    public startPlayer() {

        this.playerSprite = this.controlGame.game.add.sprite(0, 0, 'player',2);
        this.playerSprite.anchor.set(0.5);

        this.controlGame.game.physics.arcade.enable(this.playerSprite);
        
        this.playerSprite.body.collideWorldBounds = true;
        this.playerSprite.body.width = this.controlGame.gridSize;
        this.playerSprite.body.height =this.controlGame.gridSize;
        this.playerSprite.body.offset.y =this.playerSprite.height - this.controlGame.gridSize;
        
        this.life = 100; //esto vendria de algun server no?

        this.controlGame.game.camera.follow(this.playerSprite);

        this.controlGame.depthGroup.add(this.playerSprite);

        //animaciones
        this.playerSprite.animations.add('run', [0, 1, 2, 3, 4, 5], 10, true);
        this.playerSprite.animations.add('idle', [6, 7], 2, true);

    }

    public playerHit(data) {

        this.life -= data.damage;

    }

    public youHit(data) {
        this.hitText.text = "Golpeaste a alguien por " + data.damage;
    }

    public youDie(data) {

        this.playerSprite.x = 0;
        this.playerSprite.y = 0;
        this.life = 100;
    }

    public youKill(data) {

    }

    public updatePlayer(cursors:Phaser.CursorKeys,layer:Phaser.TilemapLayer,socket:SocketIOClient.Socket) {

        this.playerSprite.body.velocity.x = 0;
        this.playerSprite.body.velocity.y = 0;

        var seMueveX:Boolean = false;
        var seMueveY:Boolean = false;
        
        //me fijo si tengo que mover el jugador
        if (cursors.up.isDown)
        {
            this.playerSprite.body.velocity.y = -this.speedplayer;
            seMueveY = true;
            this.lastMoveY = -1;
            //this.playerSprite.frame = 0;
        }
        else if (cursors.down.isDown)
        {
            this.playerSprite.body.velocity.y = this.speedplayer;
            seMueveY = true;
            this.lastMoveY = 1;
            //this.playerSprite.frame = 2;
        }
        else if (cursors.left.isDown)
        {
            this.playerSprite.body.velocity.x = -this.speedplayer;
            seMueveX = true;
            this.lastMoveX = -1;
            //this.playerSprite.frame = 1;
        }
        else if (cursors.right.isDown)
        {
            this.playerSprite.body.velocity.x = this.speedplayer;
            seMueveX = true;
            this.lastMoveX = 1;
            //this.playerSprite.frame = 3;
        }

        //si dejo de moverse, me fijo hasta donde llego y lo acomodo en la grilla
        if (seMueveX == false) {
            if (this.lastMoveX != 0) {
                if (this.playerSprite.body.x%this.gridSize != 0) 
                {
                    var velocidad1:number = this.speedplayer/60;
                    var velocidad2:number = Math.abs(layer.getTileX(this.playerSprite.body.x + this.gridSize/2) * this.gridSize - this.playerSprite.body.x); 

                    this.playerSprite.body.x += this.lastMoveX * Math.min(velocidad1,velocidad2);

                } else {
                    this.lastMoveX = 0;
                }
            }
        }
        if (seMueveY == false) {
            if (this.lastMoveY != 0) {
                if (this.playerSprite.body.y%this.gridSize != 0) 
                {
                    var velocidad1:number = this.speedplayer/60;
                    var velocidad2:number = Math.abs(layer.getTileY(this.playerSprite.body.y + this.gridSize/2) * this.gridSize - this.playerSprite.body.y); 

                    this.playerSprite.body.y += this.lastMoveY * Math.min(velocidad1,velocidad2);
                } else {
                    this.lastMoveY = 0;
                }
            }
        }

        //control de las animaciones
        if (this.lastMoveX == 0 && this.lastMoveY == 0) {
            this.playerSprite.animations.play('idle');
            console.log("entra iddle");
        }
        if (this.lastMoveX == 1) { //se esta moviendo hacia la derecha
            this.playerSprite.scale.x = -1;
            this.playerSprite.animations.play('run');
            console.log("entra a la derecha");
        }
        if (this.lastMoveX == -1) { //se esta moviendo hacia la izquierda
            this.playerSprite.scale.x = 1;
            this.playerSprite.animations.play('run');
        }
        

        //Me fijo si cambio la posicion y si es asi emito la nueva posicion
        this.tileX = layer.getTileX(this.playerSprite.x);
        this.tileY = layer.getTileY(this.playerSprite.y);

        if (this.tileX != this.lastSendTileX || this.tileY != this.lastSendTileY) {

            //me fijo para que lado me movi, para enviarle al servidor
            var dirMovimiento:number; // 0 arriba, 1 izquierda, 2 abajo, 3 derecha
            if (this.tileX > this.lastSendTileX) {
                dirMovimiento = 3;
            } else if (this.tileX < this.lastSendTileX) {
                dirMovimiento = 1;
            } else if (this.tileY < this.lastSendTileY) {
                dirMovimiento = 0;
            } else if (this.tileY > this.lastSendTileY) {
                dirMovimiento = 2;
            }

            this.lastSendTileX = this.tileX;
            this.lastSendTileY = this.tileY;
            
            socket.emit('move player', { x: this.tileX, y: this.tileY, dirMov: dirMovimiento });
        } 


    }

}