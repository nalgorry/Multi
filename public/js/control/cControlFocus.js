var FocusSystem;
(function (FocusSystem) {
    FocusSystem[FocusSystem["nothing"] = 0] = "nothing";
    FocusSystem[FocusSystem["life"] = 1] = "life";
    FocusSystem[FocusSystem["mana"] = 2] = "mana";
    FocusSystem[FocusSystem["energy"] = 3] = "energy";
    FocusSystem[FocusSystem["exp"] = 4] = "exp";
})(FocusSystem || (FocusSystem = {}));
var cControlFocus = (function () {
    function cControlFocus(controlGame) {
        this.controlGame = controlGame;
        //constantes para velocidad del focus
        this.speedFocus = 50;
        this.speedNormalLife = 0.2;
        this.speedNormalMana = 0.5;
        this.speedNormalEnergy = 1;
        this.speedFocusLife = this.speedNormalLife * 4;
        this.speedFocusMana = this.speedNormalMana * 4;
        this.speedFocusEnergy = this.speedNormalEnergy * 4;
        this.actualFocusSystem = FocusSystem.nothing;
        //valores actuales utilizados por el focus sistem
        this.actualFocusLife = this.speedNormalLife;
        this.actualFocusMana = this.speedNormalMana;
        this.actualFocusEnergy = this.speedNormalEnergy;
        this.LoadBars();
        this.CreateBars();
        var timer = this.controlGame.game.time.events.loop(this.speedFocus, this.UpdateFocus, this);
    }
    cControlFocus.prototype.ResetBars = function () {
        this.UpdateLife(1 - this.life);
        this.UpdateMana(1 - this.mana);
        this.UpdateEnergy(1 - this.energy);
    };
    cControlFocus.prototype.ResizeBar = function (bar, value, maxValue) {
        this.controlGame.game.add.tween(bar.scale).to({ y: value / maxValue }, 25, Phaser.Easing.Linear.None, true);
    };
    cControlFocus.prototype.UpdateFocus = function () {
        this.UpdateLife(this.actualFocusLife);
        this.UpdateMana(this.actualFocusMana);
        this.UpdateEnergy(this.actualFocusEnergy);
    };
    cControlFocus.prototype.UpdateLife = function (addValue) {
        this.life = this.UpdateBar(this.lifeBar, this.life, this.maxLife, addValue);
    };
    cControlFocus.prototype.UpdateMana = function (addValue) {
        this.mana = this.UpdateBar(this.manaBar, this.mana, this.maxMana, addValue);
    };
    cControlFocus.prototype.UpdateEnergy = function (addValue) {
        this.energy = this.UpdateBar(this.energyBar, this.energy, this.maxEnergy, addValue);
    };
    cControlFocus.prototype.UpdateBar = function (bar, value, maxValue, addValue) {
        //controlo si no se paso del maximo
        if (value + addValue <= maxValue) {
            value += addValue;
        }
        else {
            value = maxValue;
            //si paso el maximo con alguna de las barras, me fijo si es necesario resetear el sistema de focus
            if (this.actualFocusSystem == FocusSystem.life || this.actualFocusSystem == FocusSystem.mana || this.actualFocusSystem == FocusSystem.energy) {
                this.SelectNothingFocus();
            }
        }
        this.ResizeBar(bar, value, maxValue);
        return value;
    };
    cControlFocus.prototype.SelectLifeFocus = function () {
        this.SelectFocus(FocusSystem.life);
    };
    cControlFocus.prototype.SelectManaFocus = function () {
        this.SelectFocus(FocusSystem.mana);
    };
    cControlFocus.prototype.SelectEnergyFocus = function () {
        this.SelectFocus(FocusSystem.energy);
    };
    cControlFocus.prototype.SelectNothingFocus = function () {
        this.SelectFocus(FocusSystem.nothing);
    };
    cControlFocus.prototype.SelectFocus = function (wichFocus) {
        switch (wichFocus) {
            case FocusSystem.life:
                this.actualFocusLife = this.speedFocusLife;
                this.actualFocusMana = 0;
                this.actualFocusEnergy = 0;
                this.rectangleFocus.cameraOffset.x = 810;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.life;
                break;
            case FocusSystem.mana:
                this.actualFocusLife = 0;
                this.actualFocusMana = this.speedFocusMana;
                this.actualFocusEnergy = 0;
                this.rectangleFocus.cameraOffset.x = 854;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.mana;
                break;
            case FocusSystem.energy:
                this.actualFocusLife = 0;
                this.actualFocusMana = 0;
                this.actualFocusEnergy = this.speedFocusEnergy;
                this.rectangleFocus.cameraOffset.x = 897;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.energy;
                break;
            case FocusSystem.nothing:
                this.actualFocusLife = this.speedNormalLife;
                this.actualFocusMana = this.speedNormalMana;
                this.actualFocusEnergy = this.speedNormalEnergy;
                this.rectangleFocus.visible = false;
                this.actualFocusSystem = FocusSystem.nothing;
                break;
        }
    };
    cControlFocus.prototype.LoadBars = function () {
        //esto tendria que venir del server en algun momento
        this.maxLife = 200;
        this.maxEnergy = 200;
        this.maxMana = 200;
        this.life = 100;
        this.energy = 100;
        this.mana = 100;
    };
    cControlFocus.prototype.CreateBars = function () {
        //creo las barras de vida y energia 
        //vida
        var bitmapVida = this.controlGame.game.add.bitmapData(24, 130);
        bitmapVida.ctx.beginPath();
        bitmapVida.ctx.rect(0, 0, 24, 130);
        bitmapVida.ctx.fillStyle = '#e33133';
        bitmapVida.ctx.fill();
        this.lifeBar = this.controlGame.game.add.sprite(810 + bitmapVida.width, 125 + bitmapVida.height, bitmapVida);
        this.lifeBar.anchor.setTo(1);
        this.lifeBar.fixedToCamera = true;
        //mana
        var bitmapMana = this.controlGame.game.add.bitmapData(24, 130);
        bitmapMana.ctx.beginPath();
        bitmapMana.ctx.rect(0, 0, 24, 130);
        bitmapMana.ctx.fillStyle = '#0099ff';
        bitmapMana.ctx.fill();
        this.manaBar = this.controlGame.game.add.sprite(854 + bitmapMana.width, 125 + bitmapMana.height, bitmapMana);
        this.manaBar.anchor.setTo(1);
        this.manaBar.fixedToCamera = true;
        //energia
        var bitmapEnergia = this.controlGame.game.add.bitmapData(25, 130);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, 24, 130);
        bitmapEnergia.ctx.fillStyle = '#33cc66';
        bitmapEnergia.ctx.fill();
        this.energyBar = this.controlGame.game.add.sprite(897 + bitmapEnergia.width, 125 + bitmapEnergia.height, bitmapEnergia);
        this.energyBar.anchor.setTo(1);
        this.energyBar.fixedToCamera = true;
        //exp
        var bitmapExp = this.controlGame.game.add.bitmapData(25, 130);
        bitmapExp.ctx.beginPath();
        bitmapExp.ctx.rect(0, 0, 24, 130);
        bitmapExp.ctx.fillStyle = '#cc33cc';
        bitmapExp.ctx.fill();
        this.expBar = this.controlGame.game.add.sprite(954 + bitmapExp.width, 125 + bitmapExp.height, bitmapExp);
        this.expBar.anchor.setTo(1);
        this.expBar.fixedToCamera = true;
        //hago las barras del tamaño segun los valores actuales
        this.ResizeBar(this.lifeBar, this.life, this.maxLife);
        this.ResizeBar(this.manaBar, this.mana, this.maxMana);
        this.ResizeBar(this.energyBar, this.energy, this.maxEnergy);
        //  Para hacer un recuadro sobre la barra selecionada
        this.rectangleFocus = this.controlGame.game.add.graphics(0, 0);
        this.rectangleFocus.lineStyle(2, 0xffffff, 1);
        this.rectangleFocus.fixedToCamera = true;
        this.rectangleFocus.drawRect(0, 0, 24, 130);
        this.rectangleFocus.cameraOffset.x = this.lifeBar.x - this.lifeBar.width;
        this.rectangleFocus.cameraOffset.y = 125;
        console.log(this.rectangleFocus);
    };
    return cControlFocus;
}());
