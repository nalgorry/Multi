var cControlMissions = (function () {
    function cControlMissions(controlGame) {
        this.controlGame = controlGame;
        this.monsterKills = 0;
        this.monsterKillsNeeded = 0;
        this.monsterType = undefined;
    }
    cControlMissions.prototype.resetMision = function () {
        this.monsterKills = 0;
    };
    cControlMissions.prototype.loadMision = function (idMap) {
        //lets reset the misions
        this.resetMision();
        //lets chech if we need to create the mission 
        if (idMap != 2 /* fistMap */ && idMap != 4 /* secondMap */ &&
            idMap != 5 /* thirdMap */) {
            return;
        }
        var backWidth = 250;
        var backHeight = 80;
        //creo el cuadrado donde va a ir la consola
        this.missionGraph = this.controlGame.game.add.graphics(740, 30);
        this.missionGraph.beginFill(0xedeeef);
        this.missionGraph.fixedToCamera = true;
        this.missionGraph.alpha = 0.8;
        this.missionGraph.drawRect(0, 0, backWidth, backHeight);
        //we add the element to the interface group to be able to manipulate it later
        this.controlGame.groupMapLayers.add(this.missionGraph);
        var fixedtext = this.controlGame.game.add.bitmapText(5, 5, 'gotic', 'Mission', 16);
        this.missionGraph.addChild(fixedtext);
        //lets create the specific misions for the maps
        switch (idMap) {
            case 2 /* fistMap */:
                this.initKillMonster(28, 20);
                break;
            case 4 /* secondMap */:
                this.initKillMonster(28, 30);
                break;
            case 5 /* thirdMap */:
                this.initKillMonster(28, 1, 5 /* Cosmic */);
                break;
            default:
                break;
        }
    };
    cControlMissions.prototype.initKillMonster = function (y, numberOfMonsters, monsterType) {
        if (monsterType === void 0) { monsterType = undefined; }
        switch (monsterType) {
            case 5 /* Cosmic */:
                var text = 'Kill Cosmic Monster 0/' + numberOfMonsters.toString();
                break;
            default:
                var text = 'Monsters Kill 0/' + numberOfMonsters.toString();
                break;
        }
        this.textMonsterKills = this.controlGame.game.add.bitmapText(5, y, 'gotic', text, 16);
        this.missionGraph.addChild(this.textMonsterKills);
        this.monsterKillsNeeded = numberOfMonsters;
        this.monsterType = monsterType;
    };
    cControlMissions.prototype.updateKillMonster = function (monster) {
        if (this.monsterKills == this.monsterKillsNeeded) {
            console.log("done!");
        }
        else {
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
        }
    };
    cControlMissions.prototype.thisPlayerDie = function () {
        this.monsterKills = 0;
    };
    return cControlMissions;
}());
