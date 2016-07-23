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
        this.game.load.image('tiles', 'assets/tiles2.png');
        this.game.load.image('player', 'assets/char test.png');
        this.game.load.image('logo', 'assets/phaser.png');
        this.game.load.image('bat', 'assets/bat.png');
        this.game.load.image('tree', 'assets/tree.jpg');
        this.game.load.image('earth', 'assets/scorched_earth.png');
    };
    SimpleGame.prototype.create = function () {
        //inicio todos los parametros dele juego
        this.controlGame = new cControlGame(this.game);
        //para medir los tiempos
        this.game.time.advancedTiming = true;
        //inicio parametros del juego
        this.controlGame.gridSize = 50;
        // To cotrol the mouses events
        this.game.input.onDown.add(SimpleGame.prototype.mouseDown, this);
        this.game.input.addMoveCallback(SimpleGame.prototype.mouseMove, this);
        //  Our tiled scrolling background
        this.controlGame.map = this.game.add.tilemap('map');
        this.controlGame.map.addTilesetImage('tiles', 'tiles');
        this.controlGame.layer = this.controlGame.map.createLayer('Tile Layer 1');
        this.controlGame.map.setCollision(20, true, this.controlGame.layer);
        this.game.stage.disableVisibilityChange = true;
        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, 1920, 1920);
        //this.game.world.centerX
        //inicio el jugador principal
        this.controlPlayer = new cControlPlayer();
        this.controlPlayer.game = this.game;
        this.controlPlayer.startPlayer();
        //inicio los jugadores enemigos
        this.controlOtherPlayers = new cControlOtherPlayers(this.controlGame);
        this.controlOtherPlayers.arrayPlayers = [];
        //esto controla el teclado
        this.controlGame.cursors = this.game.input.keyboard.createCursorKeys();
        //  Para hacer un recuadro donde esta el mouse
        this.marker = this.game.add.graphics(0, 0);
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, 50, 50);
        this.controlServer = new cControlServer(this.controlPlayer, this.controlGame, this.controlOtherPlayers);
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
        this.game.physics.arcade.collide(this.controlPlayer.playerSprite, this.controlGame.layer);
        this.controlPlayer.updatePlayer(this.controlGame.cursors, this.controlGame.layer, this.controlServer.socket);
    };
    SimpleGame.prototype.render = function () {
        //this.game.debug.cameraInfo(this.game.camera, 50, 50);
        //this.game.debug.spriteCoords(this.dataPlayer.playerSprite, 50, 500);
        var x = this.controlGame.layer.getTileX(this.controlPlayer.playerSprite.body.x);
        var y = this.controlGame.layer.getTileY(this.controlPlayer.playerSprite.body.y);
        var tile = this.controlGame.map.getTile(x, y, this.controlGame.layer);
        this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
        this.game.debug.text("vida: " + this.controlPlayer.life.toString(), 100, 100);
        //this.game.debug.text('Tile X: ' + this.layer.getTileX(this.player.x), 50, 48, 'rgb(0,0,0)');
        //this.game.debug.text('Tile Y: ' + this.layer.getTileY(this.player.y), 50, 64, 'rgb(0,0,0)');
        //this.game.debug.bodyInfo(this.dataPlayer.playerSprite, 50, 50);
        //this.game.debug.body(this.dataPlayer.playerSprite);
    };
    SimpleGame.prototype.mouseDown = function (event) {
        var tileX = this.controlGame.layer.getTileX(this.game.input.activePointer.worldX);
        var tileY = this.controlGame.layer.getTileY(this.game.input.activePointer.worldY);
        this.controlServer.socket.emit('mouse click', { x: tileX, y: tileY });
    };
    SimpleGame.prototype.mouseMove = function (pointer, x, y, a) {
        this.marker.x = this.controlGame.layer.getTileX(this.game.input.activePointer.worldX) * this.controlGame.gridSize;
        this.marker.y = this.controlGame.layer.getTileY(this.game.input.activePointer.worldY) * this.controlGame.gridSize;
    };
    return SimpleGame;
}()); //fin
window.onload = function () {
    var game = new SimpleGame();
};
