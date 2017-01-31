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

    private speedplayer: number = 150;
    
    private lastMoveX: number = 0;
    private lastMoveY: number = 0;
    private seMueveX:boolean = false;
    private seMueveY:boolean = false;
    private playerIdle:boolean = false;
    private lastAnimation:move = move.idleRight;

    private dirMovimiento:move =move.right;
    private lastdirMov:move; //para guardar el ultimo moviemiento enviado
    
    private gridSize: number;

    private monstersKills:number = 0 ;

    constructor(controlGame:cControlGame) {
        super(controlGame);

        this.gridSize = controlGame.gridSize;
        this.startActor();
        this.startPlayer();
        
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

        this.controlGame.game.physics.arcade.enable(this.playerSprite);
        
        this.playerSprite.body.collideWorldBounds = true;
        this.playerSprite.body.width = this.controlGame.gridSize;
        this.playerSprite.body.height =this.controlGame.gridSize;
        this.playerSprite.body.offset.y =this.playerSprite.height - this.controlGame.gridSize; 

        //para testear el centro de un sprite
        var marker = this.controlGame.game.add.graphics(0,0);
        marker.lineStyle(2, 0xffffff, 1);
        marker.drawRect(this.playerSprite.x + this.gridSize/2, this.playerSprite.y, 1, 1);

        this.controlGame.game.camera.follow(this.playerSprite);
        this.controlGame.game.camera.deadzone = new Phaser.Rectangle(
            this.controlGame.game.width / 2 - this.controlGame.interfaz.width / 2,
            this.controlGame.game.height / 2 ,0,0);

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
        var two = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        two.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells); 
        var three = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        three.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells);
        var four = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        four.onDown.add(this.controlSpells.spellSelectKeyboard,this.controlSpells);

        //controles de focus
        var e = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.E);
        e.onDown.add(this.controlFocus.SelectRotativeFocus,this.controlFocus);
        var r = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.R);
        r.onDown.add(this.controlFocus.SelectNothingFocus,this.controlFocus);
        
        //controles adicionales para test
        var H = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.H);
        H.onDown.add(this.controlFocus.ResetBars,this.controlFocus);

        //para poder tirar poderes sobre si mismo.
        this.armorSprite.inputEnabled = true;
        this.armorSprite.events.onInputDown.add(this.youClickYou, this);

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
    public playerHit(data) {

        //resto la vida y controlo si murio 
        if (this.controlFocus.UpdateLife(-data.damage)) {
            this.youDie(data);
        } 

        if (data.damage != 0 ) {
            this.controlGame.controlConsole.newMessage(enumMessage.youWereHit,"Te golpearon por " + data.damage)
        }
        
        this.controlGame.controlPlayer.controlSpells.onHit(data,this.playerSprite); //esto hace aparecer el cartelito con la vida que te queda y la animación

    }

    public youKillMonster(data) {
        if (data.damage != 0 ) {
            this.monstersKills++;
            this.controlGame.controlConsole.newMessage(enumMessage.youKill,"Mataste al monstruo ("+ this.monstersKills +")")
        }
    }

    public youHit(data) {
        if (data.damage != 0 ) {
            this.controlGame.controlConsole.newMessage(enumMessage.youHit,"Golpeaste por " + data.damage)
        }
    }

    public youDie(data) {
        this.playerSprite.x = 44 * this.controlGame.gridSize;
        this.playerSprite.y = 95 * this.controlGame.gridSize;
        this.controlFocus.UpdateLife(this.controlFocus.maxLife);
        this.controlGame.controlServer.socket.emit('you die', {idPlayerKill:data.playerThatHit });

        this.controlItems.clearItems();

    }

    public youKill(data) {
        this.controlGame.controlConsole.newMessage(enumMessage.youKill,"Mataste a " + data.name);
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