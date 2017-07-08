var cControlGame = (function () {
    function cControlGame(_game) {
        this.pvspAllowed = false;
        this.tutorialNumber = 0;
        this.interfazWidth = 200;
        this.game = _game;
        //lets start the two important group elementos
        this.groupMapLayers = this.game.add.group(); //to control the map layers
        this.depthGroup = this.game.add.group(); //  To control the depth of the characters
        this.groupInterface = this.game.add.group(); //To control all the interface related components
        //inicio parametros del juego
        this.gridSize = 40;
        this.initMap('principalMap', 1 /* principalMap */);
        //inicio las ayudas 
        //this.addTutorial(this.tutorialNumber);
        //cargo la interfaz dele juego
        this.spriteInterfaz = this.game.add.sprite(this.game.width - this.interfazWidth, 0, 'interfaz');
        this.spriteInterfaz.inputEnabled = true;
        this.spriteInterfaz.fixedToCamera = true;
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
    }
    cControlGame.prototype.initMap = function (mapName, idMap) {
        var tamanoMapa = 70;
        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, tamanoMapa * this.gridSize, tamanoMapa * this.gridSize);
        //  Our tiled scrolling background
        this.map = this.game.add.tilemap(mapName);
        this.map.addTilesetImage('tiles', 'tiles');
        this.hitLayer = this.map.createLayer('HitTest', this.game.width - this.interfazWidth);
        this.hitLayer.visible = false;
        this.hitLayer.resizeWorld();
        this.groupMapLayers.add(this.hitLayer);
        var layer1 = this.map.createLayer('FirstFloor', this.game.width - this.interfazWidth);
        layer1.cacheAsBitmap = true;
        this.groupMapLayers.add(layer1);
        var layer2 = this.map.createLayer('SecondFloor', this.game.width - this.interfazWidth);
        layer2.cacheAsBitmap = true;
        this.groupMapLayers.add(layer2);
        var layer3 = this.map.createLayer('ThirdFloor', this.game.width - this.interfazWidth);
        layer3.cacheAsBitmap = true;
        this.groupMapLayers.add(layer3);
        this.layer = layer3;
        this.game.world.sendToBack(this.map);
        console.log(this.map.getTile(12, 11, 'HitTest'));
        this.map.setCollision(6, true, this.hitLayer);
        this.game.stage.disableVisibilityChange = true;
        //creo los objetos a partir de los datos del mapa
        this.map.createFromObjects('Objects', 1, 'objects', 'arbol003.png', true, true, this.depthGroup, undefined, false);
        this.map.createFromObjects('Objects', 2, 'objects', 'arbol004.png', true, true, this.depthGroup, undefined, false);
        this.map.createFromObjects('Objects', 3, 'objects', 'arbol005.png', true, true, this.depthGroup, undefined, false);
        this.map.createFromObjects('Objects', 4, 'objects', 'arbol006.png', true, true, this.depthGroup, undefined, false);
        this.map.createFromObjects('Objects', 5, 'objects', 'monumento.png', true, true, this.depthGroup, undefined, false);
        //here we change the anchor of the object so it work ok, and we also include it in the groupMapObjects to be able to delete all the items.
        this.depthGroup.forEach(this.ObjectsConfiguration, this);
        //create special map features (for example, texts, etc.)
        this.createSpecialFeatures(idMap);
    };
    cControlGame.prototype.createSpecialFeatures = function (mapId) {
        switch (mapId) {
            case 3 /* tutorialMap */:
                var text = 'It was a quiet Land...';
                var phaserText = this.game.add.bitmapText(5 * this.gridSize, 65 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = 'Suddenly, lots of crystals rocks appear in the Rein…';
                var phaserText = this.game.add.bitmapText(5 * this.gridSize, 66 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = 'Quickly we discover that we can use the crystals\nto update ours homes, clothes and weapons.';
                var phaserText = this.game.add.bitmapText(18 * this.gridSize, 65 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = 'But something dark were inside the crystals… \n with time each town chose a color of crystal and \n start to reject all the towns that don’t follow the same color.';
                var phaserText = this.game.add.bitmapText(33 * this.gridSize, 65 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = 'War was inevitable… \n you need to be prepared.';
                var phaserText = this.game.add.bitmapText(55 * this.gridSize, 65 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = 'You have \n two defensive skills \n and \n four offensive skills.';
                var phaserText = this.game.add.bitmapText(50 * this.gridSize, 50 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = 'Ofensive: Number 1 to 6 \n Defensive: "Q" and "E"';
                var phaserText = this.game.add.bitmapText(50 * this.gridSize, 53 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = 'Use yours spells\nto attack!';
                var phaserText = this.game.add.bitmapText(61 * this.gridSize, 53 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = 'To successs you need: \n\n Life \n\n Mana \n\n and Energy';
                var phaserText = this.game.add.bitmapText(50 * this.gridSize, 40 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                //lets add the potions to the map
                var sprite = this.game.add.sprite(51 * this.gridSize, 40.5 * this.gridSize, 'items', 35);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite(51.1 * this.gridSize, 41.3 * this.gridSize, 'items', 33);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite(52.4 * this.gridSize, 42.1 * this.gridSize, 'items', 31);
                this.groupMapLayers.add(sprite);
                var text = 'You can focus \n one clicking \n them  at the left. \n The focus resource \n Recover much faster.';
                var phaserText = this.game.add.bitmapText(60.2 * this.gridSize, 40 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var sprite = this.game.add.sprite(63 * this.gridSize, 40 * this.gridSize, 'help_arrow_2');
                this.groupMapLayers.add(sprite);
                var text = 'Items are really \n important to success. \n You need to be well \n equipped to survive';
                var phaserText = this.game.add.bitmapText(50 * this.gridSize, 26 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                //some random items
                var sprite = this.game.add.sprite(61.5 * this.gridSize, 24.5 * this.gridSize, 'items', 1);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 1) * this.gridSize, 24.5 * this.gridSize, 'items', 2);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 2) * this.gridSize, 24.5 * this.gridSize, 'items', 3);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite(61.5 * this.gridSize, (24.5 + 1) * this.gridSize, 'items', 4);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 1) * this.gridSize, (24.5 + 1) * this.gridSize, 'items', 5);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 2) * this.gridSize, (24.5 + 1) * this.gridSize, 'items', 6);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite(61.5 * this.gridSize, (24.5 + 2) * this.gridSize, 'items', 10);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 1) * this.gridSize, (24.5 + 2) * this.gridSize, 'items', 12);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 2) * this.gridSize, (24.5 + 2) * this.gridSize, 'items', 13);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite(61.5 * this.gridSize, (24.5 + 3) * this.gridSize, 'items', 13);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 1) * this.gridSize, (24.5 + 3) * this.gridSize, 'items', 14);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 2) * this.gridSize, (24.5 + 3) * this.gridSize, 'items', 20);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite(61.5 * this.gridSize, (24.5 + 4) * this.gridSize, 'items', 21);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 1) * this.gridSize, (24.5 + 4) * this.gridSize, 'items', 22);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 2) * this.gridSize, (24.5 + 4) * this.gridSize, 'items', 23);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite(61.5 * this.gridSize, (24.5 + 5) * this.gridSize, 'items', 24);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 1) * this.gridSize, (24.5 + 5) * this.gridSize, 'items', 8);
                this.groupMapLayers.add(sprite);
                var sprite = this.game.add.sprite((61.5 + 2) * this.gridSize, (24.5 + 5) * this.gridSize, 'items', 7);
                this.groupMapLayers.add(sprite);
                var text = "Crystals  not only bring new resources,\nalso bring new monsters that want to destroy everything.";
                var phaserText = this.game.add.bitmapText(43 * this.gridSize, 4 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = "Try to kill this monster to practice,\n don’t die!";
                var phaserText = this.game.add.bitmapText(25 * this.gridSize, 14 * this.gridSize, 'gotic', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = "Return to Town";
                var phaserText = this.game.add.bitmapText(13 * this.gridSize, 8 * this.gridSize, 'gotic_white', text, 16);
                this.groupMapLayers.add(phaserText);
                var text = "Exit Tutorial";
                var phaserText = this.game.add.bitmapText(11.2 * this.gridSize, 65.2 * this.gridSize, 'gotic_white', text, 14);
                this.groupMapLayers.add(phaserText);
                break;
            case 1 /* principalMap */:
                var text = "New to game? \n Enter Here!";
                var phaserText = this.game.add.bitmapText(19 * this.gridSize, 28.2 * this.gridSize, 'gotic_white', text, 16);
                this.groupMapLayers.add(phaserText);
                var sprite = this.game.add.sprite(22.5 * this.gridSize, 26 * this.gridSize, 'controls');
                this.groupMapLayers.add(sprite);
                break;
            default:
                break;
        }
    };
    //lets prepare to reset the map
    cControlGame.prototype.resetMap = function (newTileX, newTileY) {
        //first we need to clean all the objects in the actual map
        this.groupMapLayers.destroy();
        this.depthGroup.destroy();
        //lets restart the groups
        this.groupMapLayers = this.game.add.group();
        this.depthGroup = this.game.add.group();
        //lets restart all the portals
        this.controlPlayer.controlPortals.resetPortals();
        //lets restart the focus sistem 
        this.controlPlayer.controlSpells.selActor = null;
        this.controlPlayer.controlSpells.selActorType = enumSelectedActor.nothing;
        //lets restart the player
        this.controlPlayer.startActor(newTileX * this.gridSize, newTileY * this.gridSize);
        this.controlPlayer.setInitialPosition(newTileX, newTileY);
        this.controlPlayer.startPlayerGraphics();
        //lets restart the chat text
        this.controlPlayer.resetChat();
        //lets restart the other players array
        this.controlOtherPlayers.arrayPlayers = [];
    };
    cControlGame.prototype.changeMap = function (mapName, idMap, pvspAllowed) {
        //restart the map with the new data
        this.initMap(mapName, idMap);
        //lets put all the elements of the map to the top again
        this.game.world.bringToTop(this.groupInterface);
        //lets put all the item elements to the top again
        this.game.world.bringToTop(this.controlPlayer.controlItems.itemsGroup);
        //lets change the map settings
        this.pvspAllowed = pvspAllowed;
    };
    cControlGame.prototype.addTutorial = function (tutorialNumber) {
        switch (tutorialNumber) {
            case 0:
                //grupo de todos los elementos de ayuda
                this.groupInitialHelp = new Phaser.Group(this.game);
                this.groupInitialHelpBotons = new Phaser.Group(this.game);
                var controls = this.game.add.sprite(39.5 * this.gridSize, 65 * this.gridSize, 'controls');
                this.groupInitialHelp.add(controls);
                //var yourItems = this.game.add.sprite(45 * this.gridSize, 95 * this.gridSize,'help_arrow');
                var yourItemsText = this.game.add.bitmapText(47 * this.gridSize, 57 * this.gridSize, 'gotic', 'Items!\nGet Close And Click!', 16);
                //this.groupInitialHelp.add(yourItems);
                this.groupInitialHelp.add(yourItemsText);
                var monsterHelp = this.game.add.sprite(53 * this.gridSize, 56.5 * this.gridSize, 'help_arrow_3');
                var monsterHelpText = this.game.add.bitmapText(51 * this.gridSize, 55.5 * this.gridSize, 'gotic', 'Atack with yours spells!', 16);
                this.groupInitialHelp.add(monsterHelp);
                this.groupInitialHelp.add(monsterHelpText);
                //para activar el siguiente tutorial
                var nextTutorial = this.game.add.bitmapText(100, 70, 'gotic', 'Next Tutorial (N)', 16);
                nextTutorial.fixedToCamera = true;
                nextTutorial.inputEnabled = true;
                nextTutorial.events.onInputUp.add(this.goNextTutorial, this);
                var nextTutorialKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
                nextTutorialKey.onDown.add(this.goNextTutorial, this);
                //para sacar la ayuda inicial con X
                var closseHelp = this.game.add.bitmapText(100, 70 + 30, 'gotic', 'Close All Helps (X)', 16);
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
