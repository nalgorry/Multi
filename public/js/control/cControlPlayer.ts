enum move {
    up = Phaser.Keyboard.W,
    down = Phaser.Keyboard.S,
    left = Phaser.Keyboard.A,
    right = Phaser.Keyboard.D,
    idleLeft = 0,
    idleRight = -1,
    }

class cControlPlayer extends cBasicActor {
    

    public idServer: string;
    
    public lastSendTileX: number;
    public lastSendTileY: number;

    public controlFocus: cControlFocus;
    public controlSpells:cControlSpells;
    public controlPortals:cControlPortal;
    public controlItems:cControlItems;
    public controlLevel:cControlLevel;

    private speedplayer: number = 180;
    
    private lastMoveX: number = 0;
    private lastMoveY: number = 0;
    private seMueveX:boolean = false;
    private seMueveY:boolean = false;
    private playerIdle:boolean = false;
    public lastAnimation:move = move.idleRight;

    public startTileX:number = 24;
    public startTileY:number = 24;

    private dirMovimiento:move =move.right;
    private lastdirMov:move; //para guardar el ultimo moviemiento enviado
    
    private gridSize: number;

    private monstersKills:number = 0 ;

    constructor(controlGame:cControlGame) {
        super(controlGame);

        this.gridSize = controlGame.gridSize;
        this.startActor(this.startTileX * this.gridSize, this.startTileY * this.gridSize);
        this.startPlayer();
        
    }

    public showMessage(message) {
    
        var completeText = this.controlGame.game.add.sprite(15, -30);
        
        var text:Phaser.BitmapText = this.controlGame.game.add.bitmapText(0, 0, 'gotic',  message , 14)            

        //hago un recuadro blanco abajo del texto
        var rectangleBack = this.controlGame.game.add.bitmapData(text.width + 6, 22);
        rectangleBack.ctx.beginPath();
        rectangleBack.ctx.rect(-3, -1, text.width + 6, 22);
        rectangleBack.ctx.fillStyle = '#ffffff';
        rectangleBack.ctx.fill();

        var textBack = this.controlGame.game.add.sprite(0, 0, rectangleBack);
        textBack.alpha = 0.6;

        completeText.addChild(textBack);
        completeText.addChild(text);

        this.playerSprite.addChild(completeText)

        var tweenText = this.controlGame.game.add.tween(completeText).to({y: '-40'}, 1000, Phaser.Easing.Cubic.Out, true);
        tweenText.onComplete.add(this.removeTweenText,completeText);
    }

    removeTweenText(sprite:Phaser.Sprite) {        
        sprite.destroy();        
    }


    public startPlayerGraphics() {

        this.controlGame.game.physics.arcade.enable(this.playerSprite);

        this.playerSprite.body.collideWorldBounds = true;
        this.playerSprite.body.width = this.controlGame.gridSize;
        this.playerSprite.body.height = this.controlGame.gridSize;
        this.playerSprite.body.offset.y = this.playerSprite.height - this.controlGame.gridSize;
        this.playerSprite.body.offset.x = - this.controlGame.gridSize / 2 ;

        //para testear el centro de un sprite
        var marker = this.controlGame.game.add.graphics(0,0);
        marker.lineStyle(2, 0xffffff, 1);
        marker.drawRect(this.playerSprite.x + this.gridSize/2, this.playerSprite.y, 1, 1);

        this.controlGame.game.camera.follow(this.playerSprite);
        this.controlGame.game.camera.deadzone = new Phaser.Rectangle(
            this.controlGame.game.width / 2 - this.controlGame.interfazWidth / 2,
            this.controlGame.game.height / 2 ,0,0);

        //para poder tirar poderes sobre si mismo.
        this.armorSprite.inputEnabled = true;
        this.armorSprite.events.onInputDown.add(this.youClickYou, this);

        //lets put the name 'guest' for now
        this.setNameText(this.playerName);

    }

    public startPlayer() {

        //Cargo el sistema de controlFocus
        this.controlFocus = new cControlFocus(this.controlGame);

        //Cargo el sistema de hechizos.
        this.controlSpells = new cControlSpells(this.controlGame);

        //inicio el sistema de portales que me permite moverme entre los diferentes mapas
        this.controlPortals = new cControlPortal(this.controlGame);

        //inicio el sistema para controlar los items
        this.controlItems = new cControlItems(this.controlGame);

        //inicio el sistema para controlar el nivel del jugador
        this.controlLevel = new cControlLevel(this.controlGame);
        
        //lets start the player with all the animations
        this.startPlayerGraphics();

        //controlo el movimiento del jugador
        var W = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.W);
        var A = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.A);
        var S = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.S);
        var D = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.D);
       
        W.onUp.add(this.moveKeyRelease,this);
        A.onUp.add(this.moveKeyRelease,this);
        S.onUp.add(this.moveKeyRelease,this);
        D.onUp.add(this.moveKeyRelease,this);

        W.onDown.add(this.moveKeyPress,this);
        A.onDown.add(this.moveKeyPress,this);
        S.onDown.add(this.moveKeyPress,this);
        D.onDown.add(this.moveKeyPress,this);

        //controles del pad
        if (this.controlGame.game.device.desktop == false) {
            var controlPad = new cControlPad(this.controlGame, 120, 610);
            controlPad.onMove.add(this.movePad,this);
            controlPad.onUp.add(this.stopPad,this);   
        }

        //controles de Hechizos 
        var one = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        one.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells); 
        one.onUp.add(this.controlSpells.spellRelease,this.controlSpells);
        var two = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        two.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells);
        two.onUp.add(this.controlSpells.spellRelease,this.controlSpells); 
        var three = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        three.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells);
        three.onUp.add(this.controlSpells.spellRelease,this.controlSpells);
        var four = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        four.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells);
        four.onUp.add(this.controlSpells.spellRelease,this.controlSpells);
        var five = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        five.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells);
        five.onUp.add(this.controlSpells.spellRelease,this.controlSpells);
        var six = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.E);
        six.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells);
        six.onUp.add(this.controlSpells.spellRelease,this.controlSpells);
       
        //controles adicionales para test
        var H = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.H);
        H.onDown.add(this.controlFocus.ResetBars,this.controlFocus);

    }


    //todo falta setear los demas movimientos y terminar el pad
    private movePad(dir:dirPad) {

        switch (dir) {
            case dirPad.up:
                this.seMueveY = true;
                this.lastMoveY = -1;
                this.seMueveX = false;
                break;
            case dirPad.down:
                this.seMueveY = true;
                this.lastMoveY = 1;
                this.seMueveX = false
                break;
            case dirPad.left:
                this.seMueveX = true;
                this.lastMoveX = -1;
                this.seMueveY = false
                break;
            case dirPad.right:
                this.seMueveX = true;
                this.lastMoveX = 1;
                this.seMueveY = false;
                break;
            case dirPad.upLeft:
                this.seMueveY = true;
                this.lastMoveY = -1;
                this.seMueveX = true;
                this.lastMoveX = -1;
                break;
            case dirPad.upRight:
                this.seMueveY = true;
                this.lastMoveY = -1;
                this.seMueveX = true;
                this.lastMoveX = 1;
                break;
            case dirPad.downLeft:
                this.seMueveY = true;
                this.lastMoveY = 1;    
                this.seMueveX = true;
                this.lastMoveX = -1;            
                break;
            case dirPad.downRight:
                this.seMueveY = true;
                this.lastMoveY = 1;  
                this.seMueveX = true;
                this.lastMoveX = 1;              
                break;                
            default:
                break;
        }

    }

    private stopPad() {
        this.seMueveX = false;
        this.seMueveY = false;
    }

    private youClickYou() {
        this.controlGame.controlPlayer.controlSpells.thisPlayerClick(this);
    }

    //esto se activa cuando golpean al jugador
    public playerHit(data, fromSprite:Phaser.Sprite, toSprite:Phaser.Sprite) {

        //resto la vida y controlo si murio 
        if (this.controlFocus.UpdateLife(-data.damage)) {
            this.youDie(data);
        } 

        if (data.damage > 0 ) {
            this.controlGame.controlConsole.newMessage(enumMessage.youWereHit,"You were hit for " + data.damage)
            if (data.damage > 10) {this.controlGame.controlSounds.startPlayerHit();}
            //hago aparecer la animación del golpe
            this.controlGame.controlPlayer.controlSpells.onHit(data, fromSprite, toSprite, 0x5e0818); 

        }  else if (data.damage < 0) { //te curaste
            this.controlGame.controlConsole.newMessage(enumMessage.youHit,"You were heal " + -data.damage)
            this.controlGame.controlPlayer.controlSpells.onHit(data, fromSprite, toSprite, 0x105e08); 
            this.controlGame.controlSounds.startSoundHit(data.idSpell);
        } else {
            this.controlGame.controlSounds.startSoundHit(data.idSpell);
            this.controlGame.controlPlayer.controlSpells.onHit(data, fromSprite, toSprite, 0x000000);
        }


    }

    public youKillMonster(data) {
        if (data.damage != 0 ) {
            this.monstersKills++;
            this.controlGame.controlConsole.newMessage(enumMessage.youKill,"You kill a monster ("+ this.monstersKills +")")
            this.controlGame.controlPlayer.showMessage("KILL HIT!")
            this.controlLevel.addExperience(data.experience);
        }
    }

    public youHit(data) {
        if (data.damage > 0 ) { //golpeaste a algeuin
            this.controlGame.controlConsole.newMessage(enumMessage.youHit,"You hit for" + data.damage)
            this.controlGame.controlSounds.startSoundHit(data.idSpell);
        } else if (data.damage < 0) { //curaste a alguien 
            this.controlGame.controlConsole.newMessage(enumMessage.youHit,"You heal for " + -data.damage)
            this.controlGame.controlSounds.startSoundHit(data.idSpell);
        }
    }

    public youDie(data) {
        this.playerSprite.x = this.startTileX * this.controlGame.gridSize;
        this.playerSprite.y = this.startTileY * this.controlGame.gridSize;
        this.controlFocus.UpdateLife(this.controlFocus.maxLife);
        this.controlGame.controlServer.socket.emit('you die', {idPlayerKill:data.playerThatHit });

        this.controlItems.clearItems();

        //saco el focus del ultimo jugador o moustro que hizo foco
        this.controlSpells.selActor = null;
        this.controlSpells.selActorType = enumSelectedActor.nothing;

        this.controlGame.controlSounds.startPlayerDie();

    }

    public youDieServer(data) {
        this.controlGame.controlConsole.newMessage(
            enumMessage.youDie,"You die by the hand of " + data.name)

        //borro el focus si el player murio 
        this.controlSpells.releaseFocus(this.controlGame.controlPlayer.controlSpells.getSelActorID());
    }

    public youKill(data) {
        this.controlGame.controlConsole.newMessage(enumMessage.youKill,"You kill " + data.name);

    }

    public teleport(tileX,tileY) {
        this.playerSprite.x = tileX * this.controlGame.gridSize;
        this.playerSprite.y = tileY * this.controlGame.gridSize;

        this.controlGame.controlServer.socket.emit('move player', { x: this.playerSprite.x, y: this.playerSprite.y, dirMov: move.idleLeft });

    }

    public playerUpdate() {

        //me fijo para que lado se esta moviendo 
        if (this.seMueveX == true && this.seMueveY == false) {
            this.playerSprite.body.velocity.x = this.speedplayer * this.lastMoveX;
        } else if (this.seMueveX == false && this.seMueveY == true) {
            this.playerSprite.body.velocity.y = this.speedplayer * this.lastMoveY;
        } else if (this.seMueveX == true && this.seMueveY == true) {
            //me aseguro que no este tocando una pared antes de reducir la velocidad
            if (this.playerSprite.body.blocked.left == false && this.playerSprite.body.blocked.right == false &&
            this.playerSprite.body.blocked.up == false && this.playerSprite.body.blocked.down == false ) {  
                 this.playerSprite.body.velocity.x = this.speedplayer * this.lastMoveX * 0.7071;
                 this.playerSprite.body.velocity.y = this.speedplayer * this.lastMoveY * 0.7071;
            } else {
                 this.playerSprite.body.velocity.x = this.speedplayer * this.lastMoveX;
                 this.playerSprite.body.velocity.y = this.speedplayer * this.lastMoveY;
            } 
        } 

        //me fijo si esta efectivamente moviendose para activar los sonidos 
        if (this.seMueveX == true && this.playerSprite.body.blocked.left == false && this.playerSprite.body.blocked.right == false) {
            this.controlGame.controlSounds.startRun();
        } else if (this.seMueveY == true && this.playerSprite.body.blocked.up == false && this.playerSprite.body.blocked.down == false) {
            this.controlGame.controlSounds.startRun();
        } else {
            this.controlGame.controlSounds.stopRun();
        }

        //para mandar el movimiento solo si paso el centro del jugador 
        var xOffset:number = this.playerSprite.x;
        var yOffset:number = this.playerSprite.y - this.gridSize/2;

        //si solto una tecla sigo avanzando hasta el centro de la grilla a la velocidad actual
        if (this.seMueveX == false) {
            if (this.playerSprite.body.velocity.x != 0) {

                    var offsetToCenter:number = Math.abs(this.controlGame.layer.getTileX(this.playerSprite.body.x + this.gridSize/2) * this.gridSize - this.playerSprite.body.x);

                    if (offsetToCenter <= Math.abs(this.playerSprite.body.deltaX())) {
                        this.playerSprite.body.x += offsetToCenter * this.lastMoveX;
                        this.playerSprite.body.velocity.x = 0;
                        this.lastMoveX = 0;
                    }
                }
                
        }

        if (this.seMueveY == false) {
            if (this.playerSprite.body.velocity.y != 0) {

                    var offsetToCenter:number = Math.abs(this.controlGame.layer.getTileY(this.playerSprite.body.y + this.gridSize/2) * this.gridSize - this.playerSprite.body.y);

                    if (offsetToCenter <= Math.abs(this.playerSprite.body.deltaY())) {
                        this.playerSprite.body.y += offsetToCenter * this.lastMoveY;
                        this.playerSprite.body.velocity.y = 0;
                        this.lastMoveY = 0;
                    }
                } 
        }

        var isMovingX:boolean = this.playerSprite.body.position.x !=  this.playerSprite.body.prev.x;
        var isMovingY:boolean = this.playerSprite.body.position.y !=  this.playerSprite.body.prev.y;

        //control de las animaciones
        if (isMovingX == false && isMovingY == false) {
            if (this.dirMovimiento == move.left ) { 
                this.startAnimation('idle_left');
                this.lastAnimation = move.idleLeft;
            } else if (this.dirMovimiento == move.right) {
                this.startAnimation('idle_right');
                this.lastAnimation = move.idleRight;
            }
        } else if (this.lastMoveX == 1) { //se esta moviendo hacia la derecha
            this.startAnimation('right');
            this.dirMovimiento = move.right;
            this.lastAnimation = move.right;
        } else if (this.lastMoveX == -1) { //se esta moviendo hacia la izquierda
            this.startAnimation('left');
            this.dirMovimiento = move.left;
            this.lastAnimation = move.left;
        } else if (this.lastMoveY == 1 || this.lastMoveY == -1) { //mantego el ultimo movimiento del costado
            if (this.dirMovimiento == move.left)
            {
                this.startAnimation('left');
                this.lastAnimation = move.left;
            } else
            {
                this.startAnimation('right');
                this.lastAnimation = move.right;
            }
        } 

        //Me fijo si cambio la posicion y si es asi emito la nueva posicion
        this.tileX = this.controlGame.layer.getTileX(xOffset);
        this.tileY = this.controlGame.layer.getTileY(yOffset);

        if (this.tileX != this.lastSendTileX || this.tileY != this.lastSendTileY) {

            this.lastSendTileX = this.tileX;
            this.lastSendTileY = this.tileY;
            this.lastdirMov = this.dirMovimiento;
            this.playerIdle = false;
            
            this.controlGame.controlServer.socket.emit('move player', { x: this.playerSprite.x, y: this.playerSprite.y, dirMov: this.lastAnimation });

            this.controlPortals.checkPortals(this.tileX,this.tileY);
            
        } else if (isMovingX == false && isMovingY == false && this.playerIdle == false) {
            this.controlGame.controlServer.socket.emit('move player', { x: this.playerSprite.x, y: this.playerSprite.y, dirMov: this.lastAnimation });
            this.playerIdle = true;
        }

       
    }

    public moveKeyPress(key:Phaser.Key) {
 
        //me fijo que tecla toco
        if (key.keyCode == Phaser.Keyboard.W)
        {
            this.seMueveY = true;
            this.lastMoveY = -1;
        }
        else if (key.keyCode == Phaser.Keyboard.S)
        {
            this.seMueveY = true;
            this.lastMoveY = 1;
        }
        else if (key.keyCode == Phaser.Keyboard.A)
        {
            this.seMueveX = true;
            this.lastMoveX = -1;
        }
        else if (key.keyCode == Phaser.Keyboard.D)
        {
            this.seMueveX = true;
            this.lastMoveX = 1;
        }

    }

     public moveKeyRelease(key:Phaser.Key) {


        //me fijo que tecla solto y si no toco muy rapido la tecla en dir contraria
        if (key.keyCode == Phaser.Keyboard.W && this.lastMoveY == -1)
        {
            this.seMueveY = false;
        }
        else if (key.keyCode == Phaser.Keyboard.S && this.lastMoveY == 1)
        {
            this.seMueveY = false;
        }
        else if (key.keyCode == Phaser.Keyboard.A && this.lastMoveX == -1)
        {
            this.seMueveX = false;
        }
        else if (key.keyCode == Phaser.Keyboard.D && this.lastMoveX == 1)
        {
            this.seMueveX = false;
        }
    
    }


}