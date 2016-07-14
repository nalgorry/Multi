var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.tilemap('map', 'assets/maze.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.image('player', 'assets/car.png');
        this.game.load.image('logo', 'assets/phaser.png');
        this.game.load.image('bat', 'assets/bat.png');
        this.game.load.image('tree', 'assets/tree.jpg');
        this.game.load.image('earth', 'assets/scorched_earth.png');
    };
    SimpleGame.prototype.create = function () {
        //para hacerlo multiplayer :)
        this.socket = io.connect();
        // Socket connection successful
        this.socket.on('connect', SimpleGame.prototype.onSocketConnected.bind(this));
        // Socket disconnection
        this.socket.on('disconnect', SimpleGame.prototype.onSocketDisconnect.bind(this));
        // New player message received
        this.socket.on('new player', SimpleGame.prototype.onNewPlayer.bind(this));
        // Player move message received
        this.socket.on('move player', SimpleGame.prototype.onMovePlayer.bind(this));
        // Player removed message received
        this.socket.on('remove player', SimpleGame.prototype.onRemovePlayer.bind(this));
        //para medir los tiempos
        this.game.time.advancedTiming = true;
        //inicio parametros del juego
        this.gridSize = 32;
        this.speedplayer = 150;
        this.lastMoveX = 0;
        this.lastMoveY = 0;
        this.playerData = new cThisPlayerData();
        this.OtherPlayerData = [];
        // To cotrol the mouses events
        this.game.input.onDown.add(SimpleGame.prototype.mouseDown, this);
        this.game.input.addMoveCallback(SimpleGame.prototype.mouseMove, this);
        //  Our tiled scrolling background
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.setCollision(20, true, this.layer);
        this.game.stage.disableVisibilityChange = true;
        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, 1920, 1920);
        //this.game.world.centerX
        this.playerData.playerSprite = this.game.add.sprite(0, 0, 'player');
        this.playerData.playerSprite.anchor.set(0.5);
        this.game.add.sprite(500, 500, 'tree');
        this.game.physics.arcade.enable(this.playerData.playerSprite);
        this.playerData.playerSprite.body.collideWorldBounds = true;
        this.game.camera.follow(this.playerData.playerSprite);
        //esto controla el teclado
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //  Para hacer un recuadro donde esta el mouse
        this.marker = this.game.add.graphics(0, 0);
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, 32, 32);
        // create 8 bats
        this.Enemies = this.game.add.group();
        this.Enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.Enemies.enableBody = true;
        this.Enemies.classType = Character;
        this.Enemies.createMultiple(30, "bat");
        this.Enemies.forEach(function (Enemy) {
            // setup movements and animations
            Enemy.SetUp(this);
        }, this);
    };
    SimpleGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.playerData.playerSprite, this.layer);
        this.playerData.playerSprite.body.velocity.x = 0;
        this.playerData.playerSprite.body.velocity.y = 0;
        var seMueveX = false;
        var seMueveY = false;
        //me fijo si tengo que mover el jugador
        if (this.cursors.up.isDown) {
            this.playerData.playerSprite.body.velocity.y = -this.speedplayer;
            seMueveY = true;
            this.lastMoveY = -1;
        }
        else if (this.cursors.down.isDown) {
            this.playerData.playerSprite.body.velocity.y = this.speedplayer;
            seMueveY = true;
            this.lastMoveY = 1;
        }
        else if (this.cursors.left.isDown) {
            this.playerData.playerSprite.body.velocity.x = -this.speedplayer;
            seMueveX = true;
            this.lastMoveX = -1;
        }
        else if (this.cursors.right.isDown) {
            this.playerData.playerSprite.body.velocity.x = this.speedplayer;
            seMueveX = true;
            this.lastMoveX = 1;
        }
        //si dejo de moverse, me fijo hasta donde llego y lo acomodo en la grilla
        if (seMueveX == false) {
            if (this.lastMoveX != 0) {
                if (this.playerData.playerSprite.body.x % this.gridSize != 0) {
                    var velocidad1 = this.speedplayer / 60;
                    var velocidad2 = Math.abs(this.layer.getTileX(this.playerData.playerSprite.x) * this.gridSize - this.playerData.playerSprite.body.x);
                    this.playerData.playerSprite.body.x += this.lastMoveX * Math.min(velocidad1, velocidad2);
                }
                else {
                    this.lastMoveX = 0;
                }
            }
        }
        if (seMueveY == false) {
            if (this.lastMoveY != 0) {
                if (this.playerData.playerSprite.body.y % this.gridSize != 0) {
                    var velocidad1 = this.speedplayer / 60;
                    var velocidad2 = Math.abs(this.layer.getTileY(this.playerData.playerSprite.y) * this.gridSize - this.playerData.playerSprite.body.y);
                    this.playerData.playerSprite.body.y += this.lastMoveY * Math.min(velocidad1, velocidad2);
                }
                else {
                    this.lastMoveY = 0;
                }
            }
        }
        //Me fijo si cambio la posicion y si es asi emito la nueva posicion
        this.playerData.tileX = this.layer.getTileX(this.playerData.playerSprite.x);
        this.playerData.tileY = this.layer.getTileY(this.playerData.playerSprite.y);
        if (this.playerData.tileX != this.playerData.lastSendTileX || this.playerData.tileY != this.playerData.lastSendTileY) {
            this.playerData.lastSendTileX = this.playerData.tileX;
            this.playerData.lastSendTileY = this.playerData.tileY;
            this.socket.emit('move player', { x: this.playerData.tileX, y: this.playerData.tileY });
        }
        //muevo los enemigos
        this.Enemies.forEach(function (Enemy) {
            // setup movements and animations
        }, this);
    };
    SimpleGame.prototype.render = function () {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
        this.game.debug.spriteCoords(this.playerData.playerSprite, 32, 500);
        var x = this.layer.getTileX(this.playerData.playerSprite.body.x);
        var y = this.layer.getTileY(this.playerData.playerSprite.body.y);
        var tile = this.map.getTile(x, y, this.layer);
        this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
        //this.game.debug.text('Tile X: ' + this.layer.getTileX(this.player.x), 32, 48, 'rgb(0,0,0)');
        //this.game.debug.text('Tile Y: ' + this.layer.getTileY(this.player.y), 32, 64, 'rgb(0,0,0)');
    };
    SimpleGame.prototype.mouseDown = function (event) {
        var tileX = this.layer.getTileX(this.game.input.activePointer.worldX);
        var tileY = this.layer.getTileY(this.game.input.activePointer.worldY);
        this.socket.emit('mouse click', { x: tileX, y: tileY });
    };
    SimpleGame.prototype.mouseMove = function (pointer, x, y, a) {
        this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * this.gridSize;
        this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * this.gridSize;
    };
    // Socket connected
    SimpleGame.prototype.onSocketConnected = function () {
        console.log('Connected to socket server');
        this.socket.emit('new player', { x: this.layer.getTileX(this.playerData.playerSprite.x), y: this.layer.getTileY(this.playerData.playerSprite.y) });
    };
    // Socket disconnected
    SimpleGame.prototype.onSocketDisconnect = function () {
        console.log('Disconnected from socket server');
    };
    // New player
    SimpleGame.prototype.onNewPlayer = function (data) {
        console.log('New player connected:', data.id);
        //console.log(data);
        var newPlayer = new cOtherPlayerData;
        newPlayer.game = this.game;
        newPlayer.id = data.id;
        newPlayer.tileX = data.x;
        newPlayer.tileY = data.y;
        newPlayer.IniciarJugador();
        this.OtherPlayerData.push(newPlayer);
        // Avoid possible duplicate players
        //var duplicate = playerById(data.id)
        //if (duplicate) {
        //   console.log('Duplicate player!')
        //   return
        //}
    };
    // Move player
    SimpleGame.prototype.onMovePlayer = function (data) {
        // Find player by ID
        var movedPlayer;
        for (var i = 0; i < this.OtherPlayerData.length; i++) {
            if (this.OtherPlayerData[i].id === data.id) {
                movedPlayer = this.OtherPlayerData[i];
                break;
            }
        }
        console.log(movedPlayer);
        movedPlayer.MoverJugador(data);
        //var movePlayer = this.playerById(data.id)
        //Player not found
        //if (!movePlayer) {
        //    console.log('Player not found: ', data.id)
        //    return
        //}
        // Update player position
        //movePlayer.player.x = data.x
        //movePlayer.player.y = data.y
    };
    // Remove player
    SimpleGame.prototype.onRemovePlayer = function (data) {
        //var removePlayer = playerById(data.id)
        // Player not found
        //if (!removePlayer) {
        //    console.log('Player not found: ', data.id)
        //    return
        //}
        //removePlayer.player.kill()
    };
    return SimpleGame;
}()); //fin
window.onload = function () {
    var game = new SimpleGame();
};
