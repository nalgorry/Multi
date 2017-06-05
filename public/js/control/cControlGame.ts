class cControlGame {
    
    public game: Phaser.Game;
    public gridSize: number;
    public map: Phaser.Tilemap;
    public land: Phaser.TileSprite;
    public layer: Phaser.TilemapLayer;
    public hitLayer: Phaser.TilemapLayer;
    public cursors: Phaser.CursorKeys;
    
    public depthGroup:Phaser.Group;
    public groupInterface:Phaser.Group;

    private groupMapLayers:Phaser.Group;
    private groupMapObjects:Phaser.Group;

    public controlServer: cControlServer;
    public controlPlayer:cControlPlayer;
    public controlConsole:cControlConsole;
    public controlMonsters:cControlMonsters;
    public controlSounds:cControlSounds;
    public controlOtherPlayers:cControlOtherPlayers;
    public spriteInterfaz:Phaser.Sprite;

    private groupInitialHelp:Phaser.Group;
    private groupInitialHelpBotons:Phaser.Group;
    private tutorialNumber:number = 0;

    public interfazWidth:number = 200;

    marker; //to get the mouse
    point;

    constructor(_game:Phaser.Game) {
        this.game = _game;

        //lets start the two important group elementos
        this.groupMapLayers = this.game.add.group(); //to control the map layers
        this.depthGroup = this.game.add.group(); //  To control the depth of the characters
        this.groupInterface = this.game.add.group(); //To control all the interface related components

        //inicio parametros del juego
        this.gridSize = 40;
        this.initMap('principalMap');

        //inicio las ayudas 
        //this.addTutorial(this.tutorialNumber);

        //cargo la interfaz dele juego
        this.spriteInterfaz = this.game.add.sprite(this.game.width - this.interfazWidth , 0, 'interfaz');
        this.spriteInterfaz.inputEnabled = true;
        this.spriteInterfaz.fixedToCamera = true;
       
        var graphics = this.game.add.graphics(100, 100);
        graphics.drawRect(50, 250, 100, 100);

        //para testear el centro de un sprite
        //this.point = new Phaser.Point(this.depthGroup.children[0].x, this.depthGroup.children[0].y);

        //  Para hacer un recuadro donde esta el mouse
        this.marker = this.game.add.graphics(0,0);
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, this.gridSize, this.gridSize);

        // To cotrol the mouses events
        this.game.input.onUp.add(this.mouseUp,this);
        this.game.input.onDown.add(this.mouseDown,this);
        this.game.input.addMoveCallback(this.mouseMove,this);

        //inicio la consola
        this.controlConsole = new cControlConsole(this);

        //inicio los sonidos 
        this.controlSounds = new cControlSounds(this);


    }

    private initMap(mapName:string) {
        var tamanoMapa = 70;

        // Configuro el mundo para que sea centrado en el personaje
        this.game.world.setBounds(0, 0, tamanoMapa*this.gridSize, tamanoMapa*this.gridSize);
        
         //  Our tiled scrolling background
        this.map = this.game.add.tilemap(mapName);
        this.map.addTilesetImage('tiles', 'tiles');

        this.hitLayer = this.map.createLayer('HitTest',this.game.width - this.interfazWidth);
        this.groupMapLayers.add(this.hitLayer);
        var layer1 = this.map.createLayer('FirstFloor',this.game.width - this.interfazWidth);
        this.groupMapLayers.add(layer1);
        var layer2 = this.map.createLayer('SecondFloor',this.game.width - this.interfazWidth);
        this.groupMapLayers.add(layer2);
        this.layer = this.map.createLayer('ThirdFloor',this.game.width - this.interfazWidth);
        this.groupMapLayers.add(this.layer);

        this.game.world.sendToBack(this.map);

        this.map.setCollision(5, true, this.hitLayer );
        this.game.stage.disableVisibilityChange = true;

         //creo los objetos a partir de los datos del mapa
        this.map.createFromObjects('Objects', 1, 'objects', 'arbol003.png', true, true, this.depthGroup,undefined,false);
        this.map.createFromObjects('Objects', 2, 'objects', 'arbol004.png', true, true, this.depthGroup,undefined,false);
        this.map.createFromObjects('Objects', 3, 'objects', 'arbol005.png', true, true, this.depthGroup,undefined,false);
        this.map.createFromObjects('Objects', 4, 'objects', 'arbol006.png', true, true, this.depthGroup,undefined,false);

        //here we change the anchor of the object so it work ok, and we also include it in the groupMapObjects to be able to delete all the items.
        this.depthGroup.forEach(this.ObjectsConfiguration,this)
    }

    //lets prepare to reset the map
    public resetMap(newTileX, newTileY) {
        
        //first we need to clean all the objects in the actual map
        this.groupMapLayers.destroy();
        this.depthGroup.destroy();

        //lets restart the groups
        this.groupMapLayers = this.game.add.group();
        this.depthGroup = this.game.add.group();

        //lets restart all the portals
        this.controlPlayer.controlPortals.resetPortals();

        //lets restart the player
        this.controlPlayer.startActor(newTileX, newTileY);
        this.controlPlayer.startPlayerGraphics();

    }

    public changeMap(mapName) {
        //restart the map with the new data
        this.initMap(mapName);

        //lets put all the elements of the map to the top again
        this.game.world.bringToTop(this.groupInterface);

        //lets put all the item elements to the top again
        this.game.world.bringToTop(this.controlPlayer.controlItems.itemsGroup);


    }

    private addTutorial(tutorialNumber:number) {
        
        switch (tutorialNumber) {
            case 0: //enseño a moverse
                //grupo de todos los elementos de ayuda
                this.groupInitialHelp = new Phaser.Group(this.game);
                this.groupInitialHelpBotons = new Phaser.Group(this.game);
            
                var controls = this.game.add.sprite(39.5 * this.gridSize, 65 * this.gridSize,'controls');
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
                nextTutorial.events.onInputUp.add(this.goNextTutorial,this);

                var nextTutorialKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
                nextTutorialKey.onDown.add(this.goNextTutorial,this);

                //para sacar la ayuda inicial con X
                var closseHelp = this.game.add.bitmapText(100, 70 + 30, 'gotic', 'Close All Helps (X)', 16);
                closseHelp.fixedToCamera = true;
                closseHelp.inputEnabled = true 
                closseHelp.events.onInputDown.add(this.closeHelp,this);

                var closeHelpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
                closeHelpKey.onDown.add(this.closeHelp,this);

                this.groupInitialHelpBotons.add(closseHelp);
                this.groupInitialHelpBotons.add(nextTutorial);

                break;
            case 1: //enseño a levantar Items

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
                
            case 3: //enseño a focalizar en el mismo

                this.groupInitialHelp.destroy();
                this.groupInitialHelp = new Phaser.Group(this.game);

                var yourSpells = this.game.add.sprite(950, 280, 'help_arrow_2');
                yourSpells.fixedToCamera = true;
                var yourSpellsText = this.game.add.bitmapText(710, 280, 'gotic', 'Click this\n spell to activate a shield!', 16);
                yourSpellsText.fixedToCamera = true;
                this.groupInitialHelp.add(yourSpells);
                this.groupInitialHelp.add(yourSpellsText);
                break;

            case 4: //enseño a usar el focus
                this.groupInitialHelp.destroy();
                this.groupInitialHelp = new Phaser.Group(this.game);

                var yourSpells = this.game.add.sprite(950, 150, 'help_arrow_2');
                yourSpells.fixedToCamera = true;
                var yourSpellsText = this.game.add.bitmapText(550, 150, 'gotic', 'This are your starts.\n Click on the potions or bars to activate focus. \n The resorse that is focus goes up much faster.', 16);
                yourSpellsText.fixedToCamera = true;
                this.groupInitialHelp.add(yourSpells);
                this.groupInitialHelp.add(yourSpellsText);

                break;

            case 5: //FIN :)
                this.groupInitialHelp.destroy();
                this.groupInitialHelp = new Phaser.Group(this.game);

                var finalText = this.game.add.bitmapText(260, 130, 'gotic', 'That is all! \n Explore the word to kill monsters \n and get great items!. \n Have FUN.', 16);
                finalText.fixedToCamera = true;
                this.groupInitialHelp.add(finalText);

                break;

            case 6: //Saco todos los carteles
                this.groupInitialHelp.destroy();
                this.groupInitialHelpBotons.destroy();
            
            default:
                break;
        }

    }

    private goNextTutorial() {
        this.tutorialNumber += 1;
        this.addTutorial(this.tutorialNumber);
    }

    private closeHelp() {
        this.groupInitialHelp.destroy();
        this.groupInitialHelpBotons.destroy();
    }

    ObjectsConfiguration (child:Phaser.Sprite) {
        child.anchor.set(0,1);
    }


    public updateZDepth() {
        this.depthGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    }


    mouseDown(event:MouseEvent) {
     
    }

    mouseUp(event:MouseEvent) {
    
    }

    mouseMove(pointer:Phaser.Pointer, x:number, y:number ,a:boolean) {

       
       // if (this.game.input.activePointer.position.x < this.game.width - this.interfazWidth) {
            //this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * this.gridSize;
            //this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * this.gridSize;
       // }

    }

    

}
