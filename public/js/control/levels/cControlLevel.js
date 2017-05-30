var cControlLevel = (function () {
    function cControlLevel(controlGame) {
        this.controlGame = controlGame;
        this.playerLevel = 1;
        this.experience = 0;
        this.styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600 };
        this.arrayExpLevel = [1, 15, 50, 100, 220, 400, 600, 950, 1500, 2000, 2500, 3200, 4500, 5000, 10000];
        this.createInterfaceItems();
        this.ResizeExpBar();
    }
    cControlLevel.prototype.createLvlUpMenu = function () {
        this.groupLvlUp = new Phaser.Group(this.controlGame.game);
        this.groupLvlUp.alpha = 0;
        //defino las tres caracteristicas que el jugador puede elegir subir
        var lvlPropNames = [];
        lvlPropNames[6 /* atack */] = "Atack: ";
        lvlPropNames[7 /* defense */] = "Defense: ";
        lvlPropNames[5 /* energy */] = "Energy: ";
        lvlPropNames[3 /* life */] = "Life: ";
        lvlPropNames[4 /* mana */] = "Mana: ";
        lvlPropNames[0 /* speedLife */] = "Speed Life: ";
        lvlPropNames[1 /* speedMana */] = "Speed Mana: ";
        lvlPropNames[2 /* speedEnergy */] = "Speed Energy: ";
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
        var textLvlUp = this.controlGame.game.add.bitmapText(510, 505, 'gotic_white', 'Level UP Chose your new SKILL', 16);
        textLvlUp.fixedToCamera = true;
        var textLvlUpEnd = this.controlGame.game.add.bitmapText(450, 595, 'gotic_white', 'You need to select one to continue gaining experience', 16);
        textLvlUpEnd.fixedToCamera = true;
        this.groupLvlUp.add(backGroundDesc);
        this.groupLvlUp.add(textLvlUp);
        this.groupLvlUp.add(textLvlUpEnd);
        var botonX = 420;
        //select tree random updgrates
        this.arrayLvlUpSelEfects = [];
        for (var i = 0; i < 3; i++) {
            var selEfect = this.controlGame.game.rnd.between(0, lvlPropNames.length - 1);
            //control if the efect selected is unique
            if (this.arrayLvlUpSelEfects[selEfect] == undefined) {
                var maxMin = new Phaser.Point(); //will save max min here
                var afterValue = ""; //use to show the % if needed 
                switch (selEfect) {
                    case 6 /* atack */:
                    case 7 /* defense */:
                        maxMin.set(1, 5);
                        break;
                    case 3 /* life */:
                    case 4 /* mana */:
                    case 5 /* energy */:
                        maxMin.set(10, 40);
                        break;
                    case 0 /* speedLife */:
                    case 1 /* speedMana */:
                    case 2 /* speedEnergy */:
                        maxMin.set(5, 15);
                        afterValue = " %";
                    default:
                        break;
                }
                var efectValue = this.controlGame.game.rnd.between(maxMin.x, maxMin.y);
                //create the button 
                var button = new cControlLvlButton(this.controlGame, botonX, 555, lvlPropNames[selEfect] + " +" + efectValue + afterValue, efectValue, selEfect);
                this.groupLvlUp.add(button.sprite);
                button.statSelect.add(this.statSelect, this);
                this.arrayLvlUpSelEfects[selEfect] = 5;
                botonX += 220;
            }
            else {
                i--;
            }
        }
        //lets make it enter easssyyy
        this.controlGame.game.add.tween(this.groupLvlUp).to({ alpha: 1 }, 500, null, true);
    };
    cControlLevel.prototype.statSelect = function (statSel) {
        //lets add the select stat to the player stats
        var controlFocus = this.controlGame.controlPlayer.controlFocus;
        switch (statSel.itemEfect) {
            case 6 /* atack */:
                controlFocus.baseMaxAtack += statSel.value;
                break;
            case 7 /* defense */:
                controlFocus.baseMaxDefence += statSel.value;
                break;
            case 5 /* energy */:
                controlFocus.baseMaxEnergy += statSel.value;
                break;
            case 3 /* life */:
                controlFocus.baseMaxLife += statSel.value;
                break;
            case 4 /* mana */:
                controlFocus.baseMaxMana += statSel.value;
                break;
            case 0 /* speedLife */:
                controlFocus.baseSpeedFocusLife += statSel.value / 100;
                controlFocus.baseSpeedNormalLife += statSel.value / 100;
                break;
            case 1 /* speedMana */:
                controlFocus.baseSpeedFocusMana += statSel.value / 100;
                controlFocus.baseSpeedNormalMana += statSel.value / 100;
                break;
            case 2 /* speedEnergy */:
                controlFocus.baseSpeedFocusEnergy += statSel.value / 100;
                ;
                controlFocus.baseSpeedNormalEnergy += statSel.value / 100;
                ;
                break;
            default:
                console.log("no deberia entrar hasta aca nunca");
                break;
        }
        //lets update player stats
        this.controlGame.controlPlayer.controlItems.calculateItemsEfects();
        //all done! lets hide the menu
        this.groupLvlUp.destroy();
    };
    cControlLevel.prototype.updateLevel = function () {
        this.textLevel.text = this.playerLevel.toString();
    };
    cControlLevel.prototype.createInterfaceItems = function () {
        //creo el texto 
        this.textLevel = this.controlGame.game.add.text(158, 23, this.playerLevel.toString(), this.styleText);
        this.controlGame.spriteInterfaz.addChild(this.textLevel);
        //creo la barra de progreso de la exp
        var barWidth = 9;
        var barHeight = 31;
        var gameWidth = this.controlGame.game.width;
        var bitmapEnergia = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, barWidth, barHeight);
        bitmapEnergia.ctx.fillStyle = '#cc33cc';
        bitmapEnergia.ctx.fill();
        this.expBar = this.controlGame.game.add.sprite(182, 46, bitmapEnergia);
        this.expBar.anchor.setTo(0, 1);
        this.controlGame.spriteInterfaz.addChild(this.expBar);
    };
    cControlLevel.prototype.ResizeExpBar = function () {
        var expToNextLevel = this.arrayExpLevel[this.playerLevel - 1];
        var expLastLevel = 0;
        if (this.arrayExpLevel[this.playerLevel - 2] != undefined) {
            expLastLevel = this.arrayExpLevel[this.playerLevel - 2];
        }
        var expNeeded = expToNextLevel - expLastLevel;
        var expInLevel = this.experience - expLastLevel;
        this.controlGame.game.add.tween(this.expBar.scale).to({ y: expInLevel / expNeeded }, 25, Phaser.Easing.Linear.None, true);
    };
    cControlLevel.prototype.addExperience = function (experience) {
        this.experience += experience;
        //me fijo si paso de nivel 
        if (this.arrayExpLevel[this.playerLevel - 1] != undefined) {
            if (this.experience >= this.arrayExpLevel[this.playerLevel - 1]) {
                this.playerLevel += 1;
                this.createLvlUpMenu();
                this.updateLevel();
                //mando el nuevo nivel al server 
                this.controlGame.controlServer.socket.emit('level up', {
                    playerLevel: this.playerLevel,
                    nada: "0",
                });
            }
        }
        this.ResizeExpBar();
    };
    return cControlLevel;
}());
