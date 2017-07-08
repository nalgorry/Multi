var cControlMissions = (function () {
    function cControlMissions(controlGame) {
        this.controlGame = controlGame;
        //to control monster kills
        this.monsterKills = 0;
        this.monsterKillsNeeded = 0;
        this.monsterToKill = "Any Monster";
        this.monsterType = undefined;
    }
    cControlMissions.prototype.resetMision = function () {
        this.monsterKills = 0;
    };
    cControlMissions.prototype.loadMision = function (idMap) {
        //lets reset the misions
        this.resetMision();
        //lets create the specific misions for the maps
        switch (idMap) {
            case 2 /* fistMap */:
                this.createMisionMenu();
                this.initKillMonster(28, 20);
                break;
            case 4 /* secondMap */:
                this.createMisionMenu();
                this.initKillMonster(28, 30);
                break;
            case 5 /* thirdMap */:
                this.createMisionMenu();
                this.initKillMonster(28, 1, 5 /* Cosmic */);
                break;
            case 6 /* westone */:
                this.createMisionMenu();
                this.justText(28, "Find Map To the West");
                break;
            case 7 /* west2 */:
                this.createMisionMenu();
                this.justText(28, "Find Map To the West");
                break;
            case 8 /* west3 */:
                this.createMisionMenu();
                this.initKillMonster(28, 2, 2 /* Dragon */);
                break;
            default:
                break;
        }
    };
    cControlMissions.prototype.createMisionMenu = function () {
        var backWidth = 250;
        var backHeight = 80;
        //creo el cuadrado donde va a ir la consola
        this.missionGraph = this.controlGame.game.add.graphics(740, 30);
        this.missionGraph.beginFill(0xedeeef);
        this.missionGraph.fixedToCamera = true;
        this.missionGraph.alpha = 0.8;
        this.missionGraph.drawRect(0, 0, backWidth, backHeight);
        //we add the element to the interface group to be able to manipulate it later
        this.controlGame.groupInterface.add(this.missionGraph);
        var fixedtext = this.controlGame.game.add.bitmapText(5, 5, 'gotic', 'Mission', 16);
        this.missionGraph.addChild(fixedtext);
    };
    cControlMissions.prototype.justText = function (y, text) {
        var justText = this.controlGame.game.add.bitmapText(5, y, 'gotic', text, 16);
        this.missionGraph.addChild(justText);
    };
    cControlMissions.prototype.initKillMonster = function (y, numberOfMonsters, monsterType) {
        if (monsterType === void 0) { monsterType = undefined; }
        switch (monsterType) {
            case 5 /* Cosmic */:
                this.monsterToKill = "Cosmic Monster";
                var text = 'Kill ' + this.monsterToKill + ' 0/' + numberOfMonsters.toString();
                break;
            case 2 /* Dragon */:
                this.monsterToKill = "Dragon";
                var text = 'Kill ' + this.monsterToKill + ' 0/' + numberOfMonsters.toString();
                break;
            default:
                var text = 'Kill Any Monsters 0/' + numberOfMonsters.toString();
                break;
        }
        this.textMonsterKills = this.controlGame.game.add.bitmapText(5, y, 'gotic', text, 16);
        this.missionGraph.addChild(this.textMonsterKills);
        this.monsterKillsNeeded = numberOfMonsters;
        this.monsterType = monsterType;
    };
    cControlMissions.prototype.updateKillMonster = function (monster) {
        //lets check if this is needed 
        if (this.monsterKillsNeeded == 0) {
            return;
        }
        if (this.monsterType == undefined) {
            this.monsterKills++;
            this.textMonsterKills.text = 'Monsters Kill ' + this.monsterKills + '/' + this.monsterKillsNeeded.toString();
            ;
        }
        else {
            if (this.monsterType == monster.monsterType) {
                this.monsterKills++;
                this.textMonsterKills.text = 'Kill Cosmic Monster ' + this.monsterKills + '/' + this.monsterKillsNeeded.toString();
            }
        }
        if (this.monsterKills == this.monsterKillsNeeded) {
            this.textMonsterKills.text = 'Done';
        }
    };
    cControlMissions.prototype.thisPlayerDie = function () {
        this.monsterKills = 0;
    };
    return cControlMissions;
}());
