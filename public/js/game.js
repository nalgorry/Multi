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
        this.game.load.image('logo', 'assets/phaser.png');
        this.game.load.image('bat', 'assets/bat.png');
        this.game.load.image('tree', 'assets/tree.jpg');
        this.game.load.image('earth', 'assets/scorched_earth.png');
        this.game.load.spritesheet('player', 'assets/char_test.png', 50, 100);
    };
    SimpleGame.prototype.create = function () {
        //inicio todos los parametros dele juego
        this.controlGame = new cControlGame(this.game);
        //para medir los tiempos
        this.game.time.advancedTiming = true;
        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, 1920, 1920);
        //inicio el jugador principal
        this.controlPlayer = new cControlPlayer(this.controlGame);
        //inicio los jugadores enemigos
        this.controlOtherPlayers = new cControlOtherPlayers(this.controlGame);
        //inicio el servidor
        this.controlServer = new cControlServer(this.controlPlayer, this.controlGame, this.controlOtherPlayers);
        this.controlGame.controlServer = this.controlServer;
    };
    SimpleGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.controlPlayer.playerSprite, this.controlGame.layer);
        this.controlPlayer.updatePlayer(this.controlGame.cursors, this.controlGame.layer, this.controlServer.socket);
        this.controlGame.updateZDepth();
    };
    SimpleGame.prototype.render = function () {
        this.game.debug.cameraInfo(this.game.camera, 50, 50);
        this.game.debug.spriteCoords(this.controlPlayer.playerSprite, 50, 500);
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
    return SimpleGame;
}()); //fin
window.onload = function () {
    var game = new SimpleGame();
};
