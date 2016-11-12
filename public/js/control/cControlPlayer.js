var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var move;
(function (move) {
    move[move["up"] = Phaser.Keyboard.W] = "up";
    move[move["down"] = Phaser.Keyboard.S] = "down";
    move[move["left"] = Phaser.Keyboard.A] = "left";
    move[move["right"] = Phaser.Keyboard.D] = "right";
    move[move["idle"] = 0] = "idle";
})(move || (move = {}));
var cControlPlayer = (function (_super) {
    __extends(cControlPlayer, _super);
    function cControlPlayer(controlGame) {
        _super.call(this, controlGame);
        this.speedplayer = 150;
        this.lastMoveX = 0;
        this.lastMoveY = 0;
        this.seMueveX = false;
        this.seMueveY = false;
        this.playerIdle = false;
        this.lastAnimation = move.right;
        this.monstersKills = 0;
        this.gridSize = controlGame.gridSize;
        this.startActor();
        this.startPlayer();
    }
    cControlPlayer.prototype.startPlayer = function () {
        //Cargo el sistema de controlFocus
        this.controlFocus = new cControlFocus(this.controlGame);
        //Cargo el sistema de hechizos.
        this.controlSpells = new cControlSpells(this.controlGame);
        this.controlGame.game.physics.arcade.enable(this.playerSprite);
        this.playerSprite.body.collideWorldBounds = true;
        this.playerSprite.body.width = this.controlGame.gridSize;
        this.playerSprite.body.height = this.controlGame.gridSize;
        this.playerSprite.body.offset.y = this.playerSprite.height - this.controlGame.gridSize;
        //para testear el centro de un sprite
        var marker = this.controlGame.game.add.graphics(0, 0);
        marker.lineStyle(2, 0xffffff, 1);
        marker.drawRect(this.playerSprite.x + this.gridSize / 2, this.playerSprite.y, 1, 1);
        this.controlGame.game.camera.follow(this.playerSprite);
        this.controlGame.game.camera.deadzone = new Phaser.Rectangle(this.controlGame.game.width / 2 - this.controlGame.interfaz.width / 2, this.controlGame.game.height / 2, 0, 0);
        //controlo el movimiento del jugador
        var W = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.W);
        var A = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.A);
        var S = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.S);
        var D = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.D);
        W.onUp.add(this.moveKeyRelease, this);
        A.onUp.add(this.moveKeyRelease, this);
        S.onUp.add(this.moveKeyRelease, this);
        D.onUp.add(this.moveKeyRelease, this);
        W.onDown.add(this.moveKeyPress, this);
        A.onDown.add(this.moveKeyPress, this);
        S.onDown.add(this.moveKeyPress, this);
        D.onDown.add(this.moveKeyPress, this);
        //controles de Hechizos 
        var one = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        one.onDown.add(this.controlSpells.spellSelectKeyboard, this.controlSpells);
        var two = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        two.onDown.add(this.controlSpells.spellSelectKeyboard, this.controlSpells);
        var three = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        three.onDown.add(this.controlSpells.spellSelectKeyboard, this.controlSpells);
        var four = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        four.onDown.add(this.controlSpells.spellSelectKeyboard, this.controlSpells);
        //controles de focus
        var e = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.E);
        e.onDown.add(this.controlFocus.SelectRotativeFocus, this.controlFocus);
        var r = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.R);
        r.onDown.add(this.controlFocus.SelectNothingFocus, this.controlFocus);
        //controles adicionales para test
        var H = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.H);
        H.onDown.add(this.controlFocus.ResetBars, this.controlFocus);
        //para poder tirar poderes sobre si mismo.
        this.armorSprite.inputEnabled = true;
        this.armorSprite.events.onInputDown.add(this.youClickYou, this);
    };
    cControlPlayer.prototype.youClickYou = function () {
        this.controlGame.controlPlayer.controlSpells.thisPlayerClick(this);
    };
    //esto se activa cuando golpean al jugador
    cControlPlayer.prototype.playerHit = function (data) {
        //resto la vida y controlo si murio 
        if (this.controlFocus.UpdateLife(-data.damage)) {
            this.youDie(data);
        }
        if (data.damage != 0) {
            this.controlGame.controlConsole.newMessage(enumMessage.youWereHit, "Te golpearon por " + data.damage);
        }
        this.onHit(data); //esto hace aparecer el cartelito con la vida que te queda y la animación
    };
    cControlPlayer.prototype.youKillMonster = function (data) {
        if (data.damage != 0) {
            this.monstersKills++;
            this.controlGame.controlConsole.newMessage(enumMessage.youKill, "Mataste al monstruo (" + this.monstersKills + ")");
        }
    };
    cControlPlayer.prototype.youHit = function (data) {
        if (data.damage != 0) {
            this.controlGame.controlConsole.newMessage(enumMessage.youHit, "Golpeaste por " + data.damage);
        }
    };
    cControlPlayer.prototype.youDie = function (data) {
        this.playerSprite.x = 44 * this.controlGame.gridSize;
        this.playerSprite.y = 6 * this.controlGame.gridSize;
        this.controlFocus.UpdateLife(this.controlFocus.maxLife);
        this.controlGame.controlServer.socket.emit('you die', { idPlayerKill: data.playerThatHit });
    };
    cControlPlayer.prototype.youKill = function (data) {
        this.controlGame.controlConsole.newMessage(enumMessage.youKill, "Mataste a " + data.name);
    };
    cControlPlayer.prototype.playerUpdate = function () {
        //me fijo para que lado se esta moviendo 
        if (this.seMueveX == true && this.seMueveY == false) {
            this.playerSprite.body.velocity.x = this.speedplayer * this.lastMoveX;
        }
        else if (this.seMueveX == false && this.seMueveY == true) {
            this.playerSprite.body.velocity.y = this.speedplayer * this.lastMoveY;
        }
        else if (this.seMueveX == true && this.seMueveY == true) {
            //me aseguro que no este tocando una pared antes de reducir la velocidad
            if (this.playerSprite.body.blocked.left == false && this.playerSprite.body.blocked.right == false &&
                this.playerSprite.body.blocked.up == false && this.playerSprite.body.blocked.down == false) {
                this.playerSprite.body.velocity.x = this.speedplayer * this.lastMoveX * 0.7071;
                this.playerSprite.body.velocity.y = this.speedplayer * this.lastMoveY * 0.7071;
            }
            else {
                this.playerSprite.body.velocity.x = this.speedplayer * this.lastMoveX;
                this.playerSprite.body.velocity.y = this.speedplayer * this.lastMoveY;
            }
        }
        //para mandar el movimiento solo si paso el centro del jugador 
        var xOffset = this.playerSprite.x;
        var yOffset = this.playerSprite.y - this.gridSize / 2;
        //si solto una tecla sigo avanzando hasta el centro de la grilla a la velocidad actual
        if (this.seMueveX == false) {
            if (this.playerSprite.body.velocity.x != 0) {
                var offsetToCenter = Math.abs(this.controlGame.layer.getTileX(this.playerSprite.body.x + this.gridSize / 2) * this.gridSize - this.playerSprite.body.x);
                if (offsetToCenter <= Math.abs(this.playerSprite.body.deltaX())) {
                    this.playerSprite.body.x += offsetToCenter * this.lastMoveX;
                    this.playerSprite.body.velocity.x = 0;
                    this.lastMoveX = 0;
                }
            }
        }
        if (this.seMueveY == false) {
            if (this.playerSprite.body.velocity.y != 0) {
                var offsetToCenter = Math.abs(this.controlGame.layer.getTileY(this.playerSprite.body.y + this.gridSize / 2) * this.gridSize - this.playerSprite.body.y);
                if (offsetToCenter <= Math.abs(this.playerSprite.body.deltaY())) {
                    this.playerSprite.body.y += offsetToCenter * this.lastMoveY;
                    this.playerSprite.body.velocity.y = 0;
                    this.lastMoveY = 0;
                }
            }
        }
        var isMovingX = this.playerSprite.body.position.x != this.playerSprite.body.prev.x;
        var isMovingY = this.playerSprite.body.position.y != this.playerSprite.body.prev.y;
        //control de las animaciones
        if (isMovingX == false && isMovingY == false) {
            this.startAnimation('idle');
        }
        else if (this.lastMoveX == 1) {
            this.startAnimation('right');
            this.dirMovimiento = move.right;
            this.lastAnimation = move.right;
        }
        else if (this.lastMoveX == -1) {
            this.startAnimation('left');
            this.dirMovimiento = move.left;
            this.lastAnimation = move.left;
        }
        else if (this.lastMoveY == 1) {
            if (this.lastAnimation == move.left) {
                this.startAnimation('left');
            }
            else {
                this.startAnimation('right');
            }
            this.dirMovimiento = move.down;
        }
        else if (this.lastMoveY == -1) {
            if (this.lastAnimation == move.left) {
                this.startAnimation('left');
            }
            else {
                this.startAnimation('right');
            }
            this.dirMovimiento = move.up;
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
        }
        else if (isMovingX == false && isMovingY == false && this.playerIdle == false) {
            this.controlGame.controlServer.socket.emit('move player', { x: this.playerSprite.x, y: this.playerSprite.y, dirMov: move.idle });
            this.playerIdle = true;
        }
    };
    cControlPlayer.prototype.moveKeyPress = function (key) {
        //me fijo que tecla toco
        if (key.keyCode == Phaser.Keyboard.W) {
            this.seMueveY = true;
            this.lastMoveY = -1;
        }
        else if (key.keyCode == Phaser.Keyboard.S) {
            this.seMueveY = true;
            this.lastMoveY = 1;
        }
        else if (key.keyCode == Phaser.Keyboard.A) {
            this.seMueveX = true;
            this.lastMoveX = -1;
        }
        else if (key.keyCode == Phaser.Keyboard.D) {
            this.seMueveX = true;
            this.lastMoveX = 1;
        }
    };
    cControlPlayer.prototype.moveKeyRelease = function (key) {
        //me fijo que tecla solto y si no toco muy rapido la tecla en dir contraria
        if (key.keyCode == Phaser.Keyboard.W && this.lastMoveY == -1) {
            this.seMueveY = false;
        }
        else if (key.keyCode == Phaser.Keyboard.S && this.lastMoveY == 1) {
            this.seMueveY = false;
        }
        else if (key.keyCode == Phaser.Keyboard.A && this.lastMoveX == -1) {
            this.seMueveX = false;
        }
        else if (key.keyCode == Phaser.Keyboard.D && this.lastMoveX == 1) {
            this.seMueveX = false;
        }
    };
    return cControlPlayer;
}(cBasicActor));
