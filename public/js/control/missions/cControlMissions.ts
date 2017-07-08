class cControlMissions {

    public missionGraph:Phaser.Graphics;

    //to control monster kills
    public monsterKills:number = 0;
    public monsterKillsNeeded:number = 0;
    public textMonsterKills:Phaser.BitmapText;
    public monsterToKill:string = "Any Monster";
    public monsterType:enumMonsters = undefined;


    constructor(public controlGame:cControlGame) {
    }

    private resetMision() {
        this.monsterKills = 0;

    }

    public loadMision(idMap:enumMapNames) {

        //lets reset the misions
        this.resetMision();

        //lets create the specific misions for the maps
        switch (idMap) {
            case enumMapNames.fistMap:
                this.createMisionMenu();
                this.initKillMonster (28, 20);
                break;
            case enumMapNames.secondMap:
                this.createMisionMenu();
                this.initKillMonster (28, 30);
                break;
            case enumMapNames.thirdMap:
                this.createMisionMenu();
                this.initKillMonster (28, 1, enumMonsters.Cosmic);
                break;
            case enumMapNames.westone:
                this.createMisionMenu();
                this.justText(28,"Find Map To the West");
            
            break;
            case enumMapNames.west2:
                this.createMisionMenu();
                this.justText(28,"Find Map To the West");
            break;
            case enumMapNames.west3:
                this.createMisionMenu();
                this.initKillMonster (28, 2, enumMonsters.Dragon);
            break;
            default: //there is no mision for the map
                break;
        } 

    }

    createMisionMenu() {
              
        var backWidth:number = 250;
        var backHeight:number = 80;

         //creo el cuadrado donde va a ir la consola
        this.missionGraph = this.controlGame.game.add.graphics(740, 30);
        this.missionGraph.beginFill(0xedeeef);
        this.missionGraph.fixedToCamera = true;
        this.missionGraph.alpha = 0.8;
        this.missionGraph.drawRect(0, 0, backWidth,backHeight);

        //we add the element to the interface group to be able to manipulate it later
        this.controlGame.groupInterface.add(this.missionGraph);

        var fixedtext = this.controlGame.game.add.bitmapText(5,5, 'gotic', 'Mission', 16);

        this.missionGraph.addChild(fixedtext);

    }

    justText(y:number, text:string)   {
        var justText = this.controlGame.game.add.bitmapText(5, y, 'gotic',text , 16);
        this.missionGraph.addChild(justText);
    }

    public initKillMonster(y:number, numberOfMonsters:number, monsterType:enumMonsters = undefined) {

        switch (monsterType) {
            case enumMonsters.Cosmic:
                this.monsterToKill = "Cosmic Monster";
                var text = 'Kill '+ this.monsterToKill  + ' 0/' + numberOfMonsters.toString();
                
                break;
            case enumMonsters.Dragon:
                this.monsterToKill = "Dragon";
                 var text = 'Kill '+ this.monsterToKill  + ' 0/' + numberOfMonsters.toString();
                break;
        
            default:
                var text = 'Kill Any Monsters 0/' + numberOfMonsters.toString();    
                break;
        }
        
        this.textMonsterKills = this.controlGame.game.add.bitmapText(5, y, 'gotic',text , 16);
        this.missionGraph.addChild(this.textMonsterKills);
        this.monsterKillsNeeded = numberOfMonsters;
        this.monsterType = monsterType;

    }

    public updateKillMonster(monster:cMonster) {

        //lets check if this is needed 
        if(this.monsterKillsNeeded == 0) {return}

        if (this.monsterType == undefined) {
            this.monsterKills ++;                
            this.textMonsterKills.text = 'Monsters Kill '+ this.monsterKills  + '/' + this.monsterKillsNeeded.toString();;
        } else {
            if (this.monsterType == monster.monsterType) {
                this.monsterKills ++;
                this.textMonsterKills.text = 'Kill Cosmic Monster ' + this.monsterKills  +'/' + this.monsterKillsNeeded.toString();
            }
        }

        if (this.monsterKills == this.monsterKillsNeeded) {
            this.textMonsterKills.text = 'Done';
        } 
        

    }

    public thisPlayerDie() {

        this.monsterKills = 0;

    }


    

}