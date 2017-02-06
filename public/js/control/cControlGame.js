var cControlGame = (function () {
    function cControlGame(_game) {
        this.game = _game;
        //inicio parametros del juego
        this.gridSize = 40;
        this.interfazWidth = 200;
        var tamanoMapa = 100;
        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, tamanoMapa * this.gridSize, tamanoMapa * this.gridSize);
        //  Our tiled scrolling background
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.hitLayer = this.map.createLayer('HitTest', this.game.width - this.interfazWidth);
        this.layer = this.map.createLayer('FirstFloor', this.game.width - this.interfazWidth);
        this.layer = this.map.createLayer('SecondFloor', this.game.width - this.interfazWidth);
        this.layer = this.map.createLayer('ThirdFloor', this.game.width - this.interfazWidth);
        this.map.setCollision(5, true, this.hitLayer);
        this.game.stage.disableVisibilityChange = true;
        //inicio el grupo de profundidad
        this.depthGroup = this.game.add.group(); //  To control the depth of the characters      
        //creo los objetos a partir de los datos del mapa
        this.map.createFromObjects('Objects', 1, 'objects', 'arbol003.png', true, true, this.depthGroup, undefined, false);
        this.map.createFromObjects('Objects', 2, 'objects', 'arbol004.png', true, true, this.depthGroup, undefined, false);
        this.map.createFromObjects('Objects', 3, 'objects', 'arbol005.png', true, true, this.depthGroup, undefined, false);
        this.map.createFromObjects('Objects', 4, 'objects', 'arbol006.png', true, true, this.depthGroup, undefined, false);
        this.depthGroup.forEach(this.ObjectsConfiguration, this);
        //cargo la interfaz dele juego
        this.interfaz = this.game.add.sprite(this.game.width - this.interfazWidth, 0, 'interfaz');
        this.interfaz.inputEnabled = true;
        this.interfaz.fixedToCamera = true;
        //boton.cameraOffset.setTo(100, 560);
        var graphics = this.game.add.graphics(100, 100);
        graphics.drawRect(50, 250, 100, 100);
        //para testear el centro de un sprite
        //this.point = new Phaser.Point(this.depthGroup.children[0].x, this.depthGroup.children[0].y);
        //  Para hacer un recuadro donde esta el mouse
        this.marker = this.game.add.graphics(0, 0);
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, this.gridSize, this.gridSize);
        // To cotrol the mouses events
        this.game.input.onUp.add(this.mouseUp, this);
        this.game.input.onDown.add(this.mouseDown, this);
        this.game.input.addMoveCallback(this.mouseMove, this);
        //to control the keyboard 
        var atackKeyOne = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        atackKeyOne.onDown.add(this.activateAtackMode, this);
        //inicio la consola
        this.controlConsole = new cControlConsole(this);
        //inicio las ayudas 
        this.addTutorial();
    }
    cControlGame.prototype.addTutorial = function () {
        //agrego todas las ayudas
        this.groupInitialHelp = new Phaser.Group(this.game);
        var controls = this.game.add.sprite(40 * this.gridSize, 90 * this.gridSize, 'controls');
        var yourItems = this.game.add.sprite(45 * this.gridSize, 95 * this.gridSize, 'help_arrow');
        var yourItemsText = this.game.add.bitmapText(46.5 * this.gridSize, 95.5 * this.gridSize, 'gotic', 'Items!\nGet Close And Click!', 16);
        var yourSpells = this.game.add.sprite(950, 225, 'help_arrow_2');
        yourSpells.fixedToCamera = true;
        var yourSpellsText = this.game.add.bitmapText(850, 250, 'gotic', 'Your Spells', 16);
        yourSpellsText.fixedToCamera = true;
        var closseHelp = this.game.add.bitmapText(825, 600, 'gotic', 'Close All Helps (X)', 16);
        closseHelp.fixedToCamera = true;
        var monsterHelp = this.game.add.sprite(50 * this.gridSize, 90.5 * this.gridSize, 'help_arrow_3');
        var monsterHelpText = this.game.add.bitmapText(46 * this.gridSize, 90 * this.gridSize, 'gotic', 'Select Monster to Focus!', 16);
        this.groupInitialHelp.add(controls);
        this.groupInitialHelp.add(yourItems);
        this.groupInitialHelp.add(yourItemsText);
        this.groupInitialHelp.add(yourSpells);
        this.groupInitialHelp.add(yourSpellsText);
        this.groupInitialHelp.add(monsterHelp);
        this.groupInitialHelp.add(monsterHelpText);
        this.groupInitialHelp.add(closseHelp);
        //para sacar la ayuda inicial con X
        var closeHelp = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        closeHelp.onDown.add(this.closeHelp, this);
    };
    cControlGame.prototype.closeHelp = function () {
        this.groupInitialHelp.destroy();
    };
    cControlGame.prototype.ObjectsConfiguration = function (child) {
        child.anchor.set(0, 1);
    };
    cControlGame.prototype.activateAtackMode = function () {
        this.game.canvas.style.cursor = 'crosshair';
        this.atackMode = true;
    };
    cControlGame.prototype.updateZDepth = function () {
        this.depthGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    };
    cControlGame.prototype.mouseDown = function (event) {
    };
    cControlGame.prototype.mouseUp = function (event) {
        //controlo si hizo click en el juego y si es asi desactivo el sistema de ataque
        if (this.game.input.activePointer.position.x < this.game.width - this.interfazWidth) {
            this.atackMode = false;
            this.game.canvas.style.cursor = 'default';
        }
    };
    cControlGame.prototype.mouseMove = function (pointer, x, y, a) {
        // if (this.game.input.activePointer.position.x < this.game.width - this.interfazWidth) {
        //this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * this.gridSize;
        //this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * this.gridSize;
        // }
    };
    return cControlGame;
}());
