class cControlLevel {

    public playerLevel:number = 1;
    public experience:number = 0;
    public arrayExpLevel:number[];
    public styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600};
    public expBar:Phaser.Sprite;
    private groupLvlUp: Phaser.Group;
    

    public textLevel:Phaser.Text;

    constructor(public controlGame:cControlGame) {

        this.arrayExpLevel = [1, 15, 50, 100, 220, 400, 600, 950, 1500, 2000, 2500, 3200, 4500, 5000, 10000];

        this.createInterfaceItems();
        this.ResizeExpBar();

        this.groupLvlUp = new Phaser.Group(this.controlGame.game)

        this.createLvlUpMenu();

    }

    private createLvlUpMenu() {

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

        var textLvlUp = this.controlGame.game.add.bitmapText(510, 505 , 'gotic_white', 'Level UP Chose your new SKILL', 16);
        textLvlUp.fixedToCamera = true;

        this.groupLvlUp.add(backGroundDesc);
        this.groupLvlUp.add(textLvlUp);

        this.createLvlBoton(420, 555, "Mana: 50%");

        this.createLvlBoton(630, 555, "Life: 5%");

        this.createLvlBoton(860, 555, "Energy: 10%");

        var textLvlUpEnd = this.controlGame.game.add.bitmapText(450, 595 , 'gotic_white', 'You need to select one to continue gaining experience', 16);
        textLvlUpEnd.fixedToCamera = true;
        

    }

    private createLvlBoton(x:number, y:number, text:string) {

        var completeText = this.controlGame.game.add.sprite(x,y)
        completeText.fixedToCamera = true;
        
        var textOption = this.controlGame.game.add.bitmapText(0, 0,  'gotic_white', text, 16);
        textOption.anchor.set(0.5);

        //normal state button 
        var bitmapBoton = this.controlGame.game.add.graphics(-24, -8);
        bitmapBoton.beginFill(0x363636);
        bitmapBoton.lineStyle(2, 0x000000, 1);
        bitmapBoton.drawRect(-(textOption.width)/2, -38/2/2, textOption.width + 48, 38);
        bitmapBoton.endFill();
        bitmapBoton.alpha = 0.9;

        //onmouseover state button 
        var bitmapBotonOver = this.controlGame.game.add.graphics(-24, -8);
        bitmapBotonOver.beginFill(0x363636);
        bitmapBotonOver.lineStyle(2, 0xFFFFFF, 1);
        bitmapBotonOver.drawRect(-(textOption.width)/2, -38/2/2, textOption.width + 48, 38);
        bitmapBotonOver.endFill();
        bitmapBotonOver.alpha = 0.9;
        bitmapBotonOver.visible = false;
        

        //var backGround = this.controlGame.game.add.sprite(-24, -8, bitmapBoton);
        //backGround.alpha = 0.9;

        completeText.addChild(bitmapBoton);
        completeText.addChild(bitmapBotonOver);
        completeText.addChild(textOption);

        completeText.inputEnabled = true;

        completeText.events.onInputOver.add(this.botonLvlUpOver,this);
        completeText.events.onInputOut.add(this.botonLvlUpOut,this);
        

    }

    public botonLvlUpOver(button:Phaser.Sprite) {
        button.children[0].visible = false;
        button.children[1].visible = true;
    }

    public botonLvlUpOut(button:Phaser.Sprite) {
        button.children[0].visible = true;
        button.children[1].visible = false;

    }



    public updateLevel() {
        this.textLevel.text = this.playerLevel.toString();
    }

    public createInterfaceItems() {

        //creo el texto 
        this.textLevel = this.controlGame.game.add.text(1162, 23, this.playerLevel.toString() , this.styleText);
        this.textLevel.fixedToCamera = true;

        //creo la barra de progreso de la exp
        var barWidth = 11;
        var barHeight = 31;
        var gameWidth:number = this.controlGame.game.width;

        var bitmapEnergia = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, barWidth, barHeight);
        bitmapEnergia.ctx.fillStyle = '#cc33cc';
        bitmapEnergia.ctx.fill();
        this.expBar = this.controlGame.game.add.sprite(gameWidth - 8, 46, bitmapEnergia);
        this.expBar.anchor.setTo(1);
        this.expBar.fixedToCamera = true;
        
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
                this.updateLevel();

                //hago visible los monstruos segun el n ivel del jugador
                this.controlGame.controlMonsters.checkMonsterVisibility(this.playerLevel);

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