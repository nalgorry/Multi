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
        this.speedNormalLife = 0.1;
        this.speedNormalMana = 0.25;
        this.speedNormalEnergy = 0.5;
        this.speedFocusLife = this.speedNormalLife * 8;
        this.speedFocusMana = this.speedNormalMana * 8;
        this.speedFocusEnergy = this.speedNormalEnergy * 8;
        this.actualFocusSystem = FocusSystem.nothing;
        //valores actuales utilizados por el focus sistem
        this.actualFocusLife = this.speedNormalLife;
        this.actualFocusMana = this.speedNormalMana;
        this.actualFocusEnergy = this.speedNormalEnergy;
        this.LoadBars();
        this.CreateBars();
        var timer = this.controlGame.game.time.events.loop(this.speedFocus, this.UpdateFocus, this);
        //para los textos de las barras
        this.styleText = { font: "15px Arial", fill: "#ffffff", textalign: "center" };
        this.textLife = this.controlGame.game.add.text(850, 105, "200", this.styleText);
        this.textLife.fixedToCamera = true;
        this.textMana = this.controlGame.game.add.text(894, 105, "200", this.styleText);
        this.textMana.fixedToCamera = true;
        this.textEnergy = this.controlGame.game.add.text(936, 105, "200", this.styleText);
        this.textEnergy.fixedToCamera = true;
    }
    cControlFocus.prototype.SpellPosible = function (needMana, needEnergy, needLife) {
        if (this.mana >= needMana && this.energy >= needEnergy && this.life >= needLife) {
            this.UpdateEnergy(-needEnergy);
            this.UpdateMana(-needMana);
            this.UpdateLife(-needLife);
            return true;
        }
        else {
            return false;
        }
    };
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
        this.textLife.text = Math.round(this.life).toString();
        this.textMana.text = Math.round(this.mana).toString();
        this.textEnergy.text = Math.round(this.energy).toString();
    };
    //devuelve true si el personaje llego a cero vida
    cControlFocus.prototype.UpdateLife = function (addValue) {
        //controlo si se murio o no 
        if (this.life > -addValue) {
            this.life = this.UpdateBar(this.lifeBar, this.life, this.maxLife, addValue);
            return false;
        }
        else {
            this.life = 0;
            return true;
        }
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
                this.rectangleFocus.cameraOffset.x = 850;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.life;
                break;
            case FocusSystem.mana:
                this.actualFocusLife = 0;
                this.actualFocusMana = this.speedFocusMana;
                this.actualFocusEnergy = 0;
                this.rectangleFocus.cameraOffset.x = 894;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.mana;
                break;
            case FocusSystem.energy:
                this.actualFocusLife = 0;
                this.actualFocusMana = 0;
                this.actualFocusEnergy = this.speedFocusEnergy;
                this.rectangleFocus.cameraOffset.x = 937;
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
        this.maxLife = 150;
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
        this.lifeBar = this.controlGame.game.add.sprite(850 + bitmapVida.width, 125 + bitmapVida.height, bitmapVida);
        this.lifeBar.anchor.setTo(1);
        this.lifeBar.fixedToCamera = true;
        this.lifeBar.inputEnabled = true;
        this.lifeBar.events.onInputDown.add(this.SelectLifeFocus, this);
        //mana
        var bitmapMana = this.controlGame.game.add.bitmapData(24, 130);
        bitmapMana.ctx.beginPath();
        bitmapMana.ctx.rect(0, 0, 24, 130);
        bitmapMana.ctx.fillStyle = '#0099ff';
        bitmapMana.ctx.fill();
        this.manaBar = this.controlGame.game.add.sprite(894 + bitmapMana.width, 125 + bitmapMana.height, bitmapMana);
        this.manaBar.anchor.setTo(1);
        this.manaBar.fixedToCamera = true;
        this.manaBar.inputEnabled = true;
        this.manaBar.events.onInputDown.add(this.SelectManaFocus, this);
        //energia
        var bitmapEnergia = this.controlGame.game.add.bitmapData(25, 130);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, 24, 130);
        bitmapEnergia.ctx.fillStyle = '#33cc66';
        bitmapEnergia.ctx.fill();
        this.energyBar = this.controlGame.game.add.sprite(937 + bitmapEnergia.width, 125 + bitmapEnergia.height, bitmapEnergia);
        this.energyBar.anchor.setTo(1);
        this.energyBar.fixedToCamera = true;
        this.energyBar.inputEnabled = true;
        this.energyBar.events.onInputDown.add(this.SelectEnergyFocus, this);
        //exp
        var bitmapExp = this.controlGame.game.add.bitmapData(25, 130);
        bitmapExp.ctx.beginPath();
        bitmapExp.ctx.rect(0, 0, 24, 130);
        bitmapExp.ctx.fillStyle = '#cc33cc';
        bitmapExp.ctx.fill();
        this.expBar = this.controlGame.game.add.sprite(994 + bitmapExp.width, 125 + bitmapExp.height, bitmapExp);
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
        this.rectangleFocus.visible = false;
    };
    return cControlFocus;
}());
