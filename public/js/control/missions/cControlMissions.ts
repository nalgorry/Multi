class cControlMissions {

    public missionGraph:Phaser.Graphics;

    public monsterKills:number = 0;
    public monsterKillsNeeded:number = 0;
    public textMonsterKills:Phaser.BitmapText;
    public monsterType:enumMonsters = undefined;


    constructor(public controlGame:cControlGame) {
    }

    private resetMision() {
        this.monsterKills = 0;

    }

    public loadMision(idMap:enumMapNames) {

        //lets reset the misions
        this.resetMision();

        //lets chech if we need to create the mission 
        if (idMap != enumMapNames.fistMap && idMap != enumMapNames.secondMap &&
        idMap != enumMapNames.thirdMap ) {
            return;
        }
        
        var backWidth:number = 250;
        var backHeight:number = 80;

        //creo el cuadrado donde va a ir la consola
        this.missionGraph = this.controlGame.game.add.graphics(740, 30);
        this.missionGraph.beginFill(0xedeeef);
        this.missionGraph.fixedToCamera = true;
        this.missionGraph.alpha = 0.8;
        this.missionGraph.drawRect(0, 0, backWidth,backHeight);

        //we add the element to the interface group to be able to manipulate it later
        this.controlGame.groupMapLayers.add(this.missionGraph);

        var fixedtext = this.controlGame.game.add.bitmapText(5,5, 'gotic', 'Mission', 16);

        this.missionGraph.addChild(fixedtext);

        //lets create the specific misions for the maps
        switch (idMap) {
            case enumMapNames.fistMap:
            this.initKillMonster (28, 20);
                break;
            case enumMapNames.secondMap:
            this.initKillMonster (28, 30);
                break;
            case enumMapNames.thirdMap:
            this.initKillMonster (28, 1, enumMonsters.Cosmic);
                break;
            
            default:
                break;
        } 

    }

    public initKillMonster(y:number, numberOfMonsters:number, monsterType:enumMonsters = undefined) {

        switch (monsterType) {
            case enumMonsters.Cosmic:
                var text = 'Kill Cosmic Monster 0/' + numberOfMonsters.toString();
                break;
        
            default:
                var text = 'Monsters Kill 0/' + numberOfMonsters.toString();    
                break;
        }
        
        this.textMonsterKills = this.controlGame.game.add.bitmapText(5, y, 'gotic',text , 16);
        this.missionGraph.addChild(this.textMonsterKills);
        this.monsterKillsNeeded = numberOfMonsters;
        this.monsterType = monsterType;

    }

    public updateKillMonster(monster:cMonster) {

        if (this.monsterKills == this.monsterKillsNeeded) {
            console.log("done!");
        } else {
            if (this.monsterType == undefined) {
                this.monsterKills ++;                
                this.textMonsterKills.text = 'Monsters Kill '+ this.monsterKills  + '/' + this.monsterKillsNeeded.toString();;
            } else {
                if (this.monsterType == monster.monsterType) {
                    this.monsterKills ++;
                    this.textMonsterKills.text = 'Kill Cosmic Monster ' + this.monsterKills  +'/' + this.monsterKillsNeeded.toString();
                }
            }
        }

    }

    public thisPlayerDie() {

        this.monsterKills = 0;

    }


    

}