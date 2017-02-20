var cControlLevel = (function () {
    function cControlLevel(controlGame) {
        this.controlGame = controlGame;
        this.playerLevel = 1;
        this.experience = 0;
        this.styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600 };
        this.arrayExpLevel = [1, 5, 30, 60, 110, 220, 400, 600, 950, 1500, 2000, 2500, 3200, 4500, 5000, 10000];
        this.createInterfaceItems();
        this.ResizeExpBar();
    }
    cControlLevel.prototype.updateLevel = function () {
        this.textLevel.text = this.playerLevel.toString();
    };
    cControlLevel.prototype.createInterfaceItems = function () {
        //creo el texto 
        this.textLevel = this.controlGame.game.add.text(1162, 23, this.playerLevel.toString(), this.styleText);
        this.textLevel.fixedToCamera = true;
        //creo la barra de progreso de la exp
        var barWidth = 11;
        var barHeight = 31;
        var gameWidth = this.controlGame.game.width;
        var bitmapEnergia = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, barWidth, barHeight);
        bitmapEnergia.ctx.fillStyle = '#cc33cc';
        bitmapEnergia.ctx.fill();
        this.expBar = this.controlGame.game.add.sprite(gameWidth - 8, 46, bitmapEnergia);
        this.expBar.anchor.setTo(1);
        this.expBar.fixedToCamera = true;
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
                this.updateLevel();
                //hago visible los monstruos segun el n ivel del jugador
                this.controlGame.controlMonsters.checkMonsterVisibility(this.playerLevel);
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
