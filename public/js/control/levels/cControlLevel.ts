class cControlLevel {

    public playerLevel:number = 1;
    public experience:number = 0;
    public arrayExpLevel:number[];
    public styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600};
    public expBar:Phaser.Sprite;
    
    //variables para el recuadro de pasar de lvl 
    private groupLvlUp: Phaser.Group;
    private textLevel:Phaser.BitmapText;
    private arrayLvlUpSelEfects:number[]; //array de itemEfect a variable a modificar

    constructor(public controlGame:cControlGame) {

        this.arrayExpLevel = [1, 15, 50, 100, 220, 400, 600, 950, 1500, 2000, 2500, 3200, 4500, 5000, 10000];

        this.createInterfaceItems();
        this.ResizeExpBar();

    }

    private createLvlUpMenu() {

        this.groupLvlUp = new Phaser.Group(this.controlGame.game)

        this.groupLvlUp.alpha = 0;

        //defino las tres caracteristicas que el jugador puede elegir subir
        var lvlPropNames:string[] = [];

        lvlPropNames[enumItemEfects.atack] = "Atack: ";
        lvlPropNames[enumItemEfects.defense] = "Defense: ";
        lvlPropNames[enumItemEfects.energy] = "Energy: ";
        lvlPropNames[enumItemEfects.life] = "Life: ";
        lvlPropNames[enumItemEfects.mana] = "Mana: ";
        lvlPropNames[enumItemEfects.speedLife] = "Speed Life: ";
        lvlPropNames[enumItemEfects.speedMana] = "Speed Mana: ";
        lvlPropNames[enumItemEfects.speedEnergy] = "Speed Energy: ";

        //genero el fondo de las estadisticas
        var height = 124;
        var width = 684;
        var bitmapLvlUp = this.controlGame.game.add.bitmapData(width, height);
        bitmapLvlUp.ctx.beginPath();
        bitmapLvlUp.ctx.rect(0, 0, width, height);
        bitmapLvlUp.ctx.fillStyle = '#363636';
        bitmapLvlUp.ctx.fill();

        var backGroundDesc = this.controlGame.game.add.sprite(310, 499, bitmapLvlUp);
        backGroundDesc.anchor.setTo(0);
        backGroundDesc.fixedToCamera = true;
        backGroundDesc.alpha = 0.7;

        //create the text for the lvl up 
        var textLvlUp = this.controlGame.game.add.bitmapText(510, 505 , 'gotic_white', 'Level UP Chose your new SKILL', 16);
        textLvlUp.fixedToCamera = true;

        var textLvlUpEnd = this.controlGame.game.add.bitmapText(450, 595 , 'gotic_white', 'You need to select one to continue gaining experience', 16);
        textLvlUpEnd.fixedToCamera = true;

        this.groupLvlUp.add(backGroundDesc);
        this.groupLvlUp.add(textLvlUp);
        this.groupLvlUp.add(textLvlUpEnd);
        

        var botonX:number = 420
        //select tree random updgrates
        this.arrayLvlUpSelEfects = [];
        for (var i = 0; i<3; i++) {
            var selEfect = this.controlGame.game.rnd.between(0,lvlPropNames.length - 1);
            
            //control if the efect selected is unique
            if (this.arrayLvlUpSelEfects[selEfect] == undefined) {

                var maxMin = new Phaser.Point() //will save max min here
                var afterValue:string = "" //use to show the % if needed 

                switch (selEfect) {
                    case enumItemEfects.atack:
                    case enumItemEfects.defense:
                        maxMin.set(1,5);
                    break;
                    case enumItemEfects.life:
                    case enumItemEfects.mana:
                    case enumItemEfects.energy:
                        maxMin.set(10,40);
                    break;

                    case enumItemEfects.speedLife:
                    case enumItemEfects.speedMana:
                    case enumItemEfects.speedEnergy:
                        maxMin.set(5,15);
                        afterValue = " %"
                    default:
                        break;
                }

                var efectValue = this.controlGame.game.rnd.between(maxMin.x,maxMin.y)
                //create the button 
                var button = new cControlLvlButton(this.controlGame,botonX, 555, lvlPropNames[selEfect] + " +"+ efectValue + afterValue, efectValue, selEfect);
                this.groupLvlUp.add(button.sprite);

                button.statSelect.add(this.statSelect,this);

                this.arrayLvlUpSelEfects[selEfect] = 5;
                botonX += 220;
                
            } else { //not unique, try again :P
                i--;
            }
            
        }

        //lets make it enter easssyyy
        this.controlGame.game.add.tween(this.groupLvlUp).to ({alpha: 1},500,null,true);

    }

    private statSelect(statSel:cControlLvlButton) {

        //lets add the select stat to the player stats
        var controlFocus = this.controlGame.controlPlayer.controlFocus;

        switch (statSel.itemEfect) {
            case enumItemEfects.atack:
                controlFocus.baseMaxAtack += statSel.value;
            break;
            case enumItemEfects.defense:
                controlFocus.baseMaxDefence += statSel.value;
            break;
            case enumItemEfects.energy:
                controlFocus.baseMaxEnergy += statSel.value;
            break;
            case enumItemEfects.life:
                controlFocus.baseMaxLife += statSel.value;
            break;
            case enumItemEfects.mana:
                controlFocus.baseMaxMana += statSel.value;
            break;
            case enumItemEfects.speedLife:
                controlFocus.baseSpeedFocusLife += statSel.value / 100;
                controlFocus.baseSpeedNormalLife += statSel.value / 100;
            break;
            case enumItemEfects.speedMana:
                controlFocus.baseSpeedFocusMana += statSel.value / 100;
                controlFocus.baseSpeedNormalMana += statSel.value / 100;
            break;
            case enumItemEfects.speedEnergy:
                controlFocus.baseSpeedFocusEnergy += statSel.value / 100;;
                controlFocus.baseSpeedNormalEnergy += statSel.value / 100;;
            break;
            default:
                console.log("no deberia entrar hasta aca nunca");
                break;
        }

        //lets update player stats
        this.controlGame.controlPlayer.controlItems.calculateItemsEfects();

        //all done! lets hide the menu
        this.groupLvlUp.destroy();

    }


    public updateLevel() {
        this.textLevel.text = this.playerLevel.toString();
    }

    public createInterfaceItems() {

        //creo el texto 
        this.textLevel = this.controlGame.game.add.bitmapText(158, 20, 'gotic_white',  this.playerLevel.toString() , 16)
        this.controlGame.spriteInterfaz.addChild(this.textLevel);

        //creo la barra de progreso de la exp
        var barWidth = 9;
        var barHeight = 31;
        var gameWidth:number = this.controlGame.game.width;

        var bitmapEnergia = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, barWidth, barHeight);
        bitmapEnergia.ctx.fillStyle = '#cc33cc';
        bitmapEnergia.ctx.fill();
        this.expBar = this.controlGame.game.add.sprite(182, 46, bitmapEnergia);
        this.expBar.anchor.setTo(0, 1);
        this.controlGame.spriteInterfaz.addChild(this.expBar);
        
    }

    public ResizeExpBar() {

        var expToNextLevel = this.arrayExpLevel[this.playerLevel - 1 ];
        
        var expLastLevel:number = 0
        if(this.arrayExpLevel[this.playerLevel - 2 ] != undefined) {
            expLastLevel = this.arrayExpLevel[this.playerLevel - 2 ]
        }  

        var expNeeded = expToNextLevel - expLastLevel;
        var expInLevel = this.experience - expLastLevel 

        this.controlGame.game.add.tween(this.expBar.scale).to(
             { y: expInLevel / expNeeded}, 25, Phaser.Easing.Linear.None, true);
    }


    public addExperience(experience:number) {

        this.experience += experience;

        //me fijo si paso de nivel 
        if (this.arrayExpLevel[this.playerLevel - 1] != undefined) { //me fijo si no llego al max lvl
            if (this.experience >= this.arrayExpLevel[this.playerLevel - 1]) {
                
                this.playerLevel += 1;
                this.createLvlUpMenu();
                this.updateLevel();

                //mando el nuevo nivel al server 
                this.controlGame.controlServer.socket.emit('level up', 
                                    { 
                                        playerLevel:this.playerLevel,
                                        nada:"0",
                                    });


            }
        }

        this.ResizeExpBar();

    }






}