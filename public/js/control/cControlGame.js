var cControlGame = (function () {
    function cControlGame(_game) {
        this.tutorialNumber = 0;
        this.game = _game;
        //inicio parametros del juego
        this.gridSize = 40;
        this.interfazWidth = 200;
        var tamanoMapa = 70;
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
        //inicio la consola
        this.controlConsole = new cControlConsole(this);
        //inicio los sonidos 
        this.controlSounds = new cControlSounds(this);
        //inicio las ayudas 
        this.addTutorial(this.tutorialNumber);
    }
    cControlGame.prototype.addTutorial = function (tutorialNumber) {
        switch (tutorialNumber) {
            case 0:
                //grupo de todos los elementos de ayuda
                this.groupInitialHelp = new Phaser.Group(this.game);
                this.groupInitialHelpBotons = new Phaser.Group(this.game);
                var controls = this.game.add.sprite(39.5 * this.gridSize, 65 * this.gridSize, 'controls');
                this.groupInitialHelp.add(controls);
                //var yourItems = this.game.add.sprite(45 * this.gridSize, 95 * this.gridSize,'help_arrow');
                var yourItemsText = this.game.add.bitmapText(47 * this.gridSize, 58 * this.gridSize, 'gotic', 'Items!\nGet Close And Click!', 16);
                //this.groupInitialHelp.add(yourItems);
                this.groupInitialHelp.add(yourItemsText);
                var monsterHelp = this.game.add.sprite(53 * this.gridSize, 57.5 * this.gridSize, 'help_arrow_3');
                var monsterHelpText = this.game.add.bitmapText(51 * this.gridSize, 56.5 * this.gridSize, 'gotic', 'Atack this monster with yours spells!', 16);
                this.groupInitialHelp.add(monsterHelp);
                this.groupInitialHelp.add(monsterHelpText);
                //para activar el siguiente tutorial
                var nextTutorial = this.game.add.bitmapText(660, 70, 'gotic', 'Next Tutorial (Less than one minute) (N)', 16);
                nextTutorial.fixedToCamera = true;
                nextTutorial.inputEnabled = true;
                nextTutorial.events.onInputUp.add(this.goNextTutorial, this);
                var nextTutorialKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
                nextTutorialKey.onDown.add(this.goNextTutorial, this);
                //para sacar la ayuda inicial con X
                var closseHelp = this.game.add.bitmapText(660, 70 + 30, 'gotic', 'Close All Helps (X)', 16);
                closseHelp.fixedToCamera = true;
                closseHelp.inputEnabled = true;
                closseHelp.events.onInputDown.add(this.closeHelp, this);
                var closeHelpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
                closeHelpKey.onDown.add(this.closeHelp, this);
                this.groupInitialHelpBotons.add(closseHelp);
                this.groupInitialHelpBotons.add(nextTutorial);
                break;
            case 1:
                this.groupInitialHelp.destroy();
                this.groupInitialHelp = new Phaser.Group(this.game);
                var yourItems = this.game.add.sprite(960, 500, 'help_arrow_3');
                yourItems.fixedToCamera = true;
                var yourItemsText = this.game.add.bitmapText(700, 470, 'gotic', 'After you get a item\n it will apear in you inventory!', 16);
                yourItemsText.fixedToCamera = true;
                this.groupInitialHelp.add(yourItems);
                this.groupInitialHelp.add(yourItemsText);
                break;
            case 2:
                this.groupInitialHelp.destroy();
                this.groupInitialHelp = new Phaser.Group(this.game);
                var yourItems = this.game.add.sprite(950, 500, 'help_arrow_3');
                yourItems.fixedToCamera = true;
                var yourItemsText = this.game.add.bitmapText(840, 480, 'gotic', 'I - Drag From Here!', 16);
                yourItemsText.fixedToCamera = true;
                this.groupInitialHelp.add(yourItems);
                this.groupInitialHelp.add(yourItemsText);
                var yourItems = this.game.add.sprite(970, 350, 'help_arrow_3');
                yourItems.fixedToCamera = true;
                var yourItemsText = this.game.add.bitmapText(780, 325, 'gotic', 'II - Drag To Here to Equip', 16);
                yourItemsText.fixedToCamera = true;
                this.groupInitialHelp.add(yourItems);
                this.groupInitialHelp.add(yourItemsText);
                break;
            case 3:
                this.groupInitialHelp.destroy();
                this.groupInitialHelp = new Phaser.Group(this.game);
                var yourSpells = this.game.add.sprite(950, 280, 'help_arrow_2');
                yourSpells.fixedToCamera = true;
                var yourSpellsText = this.game.add.bitmapText(710, 280, 'gotic', 'Click this\n spell to activate a shield!', 16);
                yourSpellsText.fixedToCamera = true;
                this.groupInitialHelp.add(yourSpells);
                this.groupInitialHelp.add(yourSpellsText);
                break;
            case 4:
                this.groupInitialHelp.destroy();
                this.groupInitialHelp = new Phaser.Group(this.game);
                var yourSpells = this.game.add.sprite(950, 150, 'help_arrow_2');
                yourSpells.fixedToCamera = true;
                var yourSpellsText = this.game.add.bitmapText(550, 150, 'gotic', 'This are your starts.\n Click on the potions or bars to activate focus. \n The resorse that is focus goes up much faster.', 16);
                yourSpellsText.fixedToCamera = true;
                this.groupInitialHelp.add(yourSpells);
                this.groupInitialHelp.add(yourSpellsText);
                break;
            case 5:
                this.groupInitialHelp.destroy();
                this.groupInitialHelp = new Phaser.Group(this.game);
                var finalText = this.game.add.bitmapText(260, 130, 'gotic', 'That is all! \n Explore the word to kill monsters \n and get great items!. \n Have FUN.', 16);
                finalText.fixedToCamera = true;
                this.groupInitialHelp.add(finalText);
                break;
            case 6:
                this.groupInitialHelp.destroy();
                this.groupInitialHelpBotons.destroy();
            default:
                break;
        }
    };
    cControlGame.prototype.goNextTutorial = function () {
        this.tutorialNumber += 1;
        this.addTutorial(this.tutorialNumber);
    };
    cControlGame.prototype.closeHelp = function () {
        this.groupInitialHelp.destroy();
        this.groupInitialHelpBotons.destroy();
    };
    cControlGame.prototype.ObjectsConfiguration = function (child) {
        child.anchor.set(0, 1);
    };
    cControlGame.prototype.updateZDepth = function () {
        this.depthGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    };
    cControlGame.prototype.mouseDown = function (event) {
    };
    cControlGame.prototype.mouseUp = function (event) {
    };
    cControlGame.prototype.mouseMove = function (pointer, x, y, a) {
        // if (this.game.input.activePointer.position.x < this.game.width - this.interfazWidth) {
        //this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * this.gridSize;
        //this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * this.gridSize;
        // }
    };
    return cControlGame;
}());
