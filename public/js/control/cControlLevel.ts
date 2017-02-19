class cControlLevel {

    public playerLevel:number = 1;
    public experience:number = 0;
    public arrayExpLevel:number[];
    public styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600};
    public expBar:Phaser.Sprite;
    

    public textLevel:Phaser.Text;

    constructor(public controlGame:cControlGame) {

        this.arrayExpLevel = [1, 5, 30, 60, 110, 220, 400, 600, 950, 1500, 2000, 2500, 3200, 4500, 5000, 10000];

        this.createInterfaceItems();
        this.ResizeExpBar();

    }

    public updateLevel() {
        this.textLevel.text = this.playerLevel.toString();
    }

    public createInterfaceItems() {

        //creo el texto 
        this.textLevel = this.controlGame.game.add.text(1162, 23, this.playerLevel , this.styleText);
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