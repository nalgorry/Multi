var FocusSystem;
(function (FocusSystem) {
    FocusSystem[FocusSystem["life"] = 0] = "life";
    FocusSystem[FocusSystem["mana"] = 1] = "mana";
    FocusSystem[FocusSystem["energy"] = 2] = "energy";
    FocusSystem[FocusSystem["exp"] = 3] = "exp";
    FocusSystem[FocusSystem["nothing"] = 4] = "nothing";
})(FocusSystem || (FocusSystem = {}));
var cControlFocus = (function () {
    function cControlFocus(controlGame) {
        this.controlGame = controlGame;
        //constantes para velocidad del focus
        this.speedFocus = 50;
        this.baseSpeedNormalLife = 0.1;
        this.baseSpeedNormalMana = 0.25;
        this.baseSpeedNormalEnergy = 0.5;
        this.baseSpeedFocusLife = 0.8;
        this.baseSpeedFocusMana = 2;
        this.baseSpeedFocusEnergy = 4;
        this.speedNormalLife = 0.1;
        this.speedNormalMana = 0.25;
        this.speedNormalEnergy = 0.5;
        this.speedFocusLife = 0.8;
        this.speedFocusMana = 2;
        this.speedFocusEnergy = 4;
        this.actualFocusSystem = FocusSystem.mana;
        //valores actuales utilizados por el focus sistem
        this.actualFocusLife = this.speedNormalLife;
        this.actualFocusMana = this.speedNormalMana;
        this.actualFocusEnergy = this.speedNormalEnergy;
        var gameWidth = this.controlGame.game.width;
        var gameHeight = this.controlGame.game.height;
        this.LoadBars();
        this.createBars(gameWidth, gameHeight);
        this.createPotions();
        this.createAtackDefence();
        this.createPlayerStats();
        //seteo por defecto el focus en mana
        this.SelectManaFocus();
        var timer = this.controlGame.game.time.events.loop(this.speedFocus, this.UpdateFocus, this);
    }
    cControlFocus.prototype.createPlayerStats = function () {
        //genero un circulo en la imagen del jugador 
        var backCircle = this.controlGame.game.add.graphics(0, 0);
        backCircle.beginFill(0x000000);
        backCircle.drawCircle(0, 0, 80);
        var playerImageSprite = this.controlGame.game.add.sprite(1065, 50);
        playerImageSprite.addChild(backCircle);
        playerImageSprite.alpha = 0.5;
        playerImageSprite.fixedToCamera = true;
        playerImageSprite.inputEnabled = true;
        playerImageSprite.events.onInputOver.add(this.showPlayerStats, this);
        playerImageSprite.events.onInputOut.add(this.hidePlayerStats, this);
    };
    cControlFocus.prototype.showPlayerStats = function () {
        this.groupPlayerStats = new Phaser.Group(this.controlGame.game);
        //genero el fondo de las estadisticas
        var height = 610;
        var width = 200;
        var bitmapDescItem = this.controlGame.game.add.bitmapData(width, height);
        bitmapDescItem.ctx.beginPath();
        bitmapDescItem.ctx.rect(0, 0, width, height);
        bitmapDescItem.ctx.fillStyle = '#363636';
        bitmapDescItem.ctx.fill();
        var backGroundDesc = this.controlGame.game.add.sprite(790, 10, bitmapDescItem);
        backGroundDesc.anchor.setTo(0);
        backGroundDesc.fixedToCamera = true;
        backGroundDesc.alpha = 0.9;
        this.groupPlayerStats.add(backGroundDesc);
        var colWidth = 40;
        var colHeight = 25;
        var textStart = 68;
        var textWidth = 30;
        var heightStart = 150;
        var styleText = { font: "14px Arial", fill: "#ffffff", boundsAlignH: "center", fontWeight: 600 };
        ;
        //agrego ataque y defenza
        var atackDefense = this.controlGame.game.add.sprite(5, 20, "atackDefense");
        backGroundDesc.addChild(atackDefense);
        var value = this.controlGame.game.add.text(105, 27, this.maxAtack.toString(), styleText);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(165, 27, this.maxDefence.toString(), styleText);
        backGroundDesc.addChild(value);
        //agrego las posiciones y las estadisticas basicas
        //vida 
        var label = this.controlGame.game.add.sprite(textStart - 4, heightStart - 40, 'items', 35);
        backGroundDesc.addChild(label);
        //mana
        var label = this.controlGame.game.add.sprite(textStart - 4 + colWidth, heightStart - 40, 'items', 33);
        backGroundDesc.addChild(label);
        //energia
        var label = this.controlGame.game.add.sprite(textStart - 4 + colWidth * 2, heightStart - 40, 'items', 31);
        backGroundDesc.addChild(label);
        //label de las propiedades
        //voy a sacar las propiedades de los items de aca 
        var value = this.controlGame.game.add.text(textStart, heightStart, this.maxLife.toString(), styleText);
        value.setTextBounds(0, 0, textWidth, 0);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth, heightStart, this.maxMana.toString(), styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth * 2, heightStart, this.maxEnergy.toString(), styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart, heightStart + colHeight, this.getItemValue(3 /* normalLife */) + "%", styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth, heightStart + colHeight, this.getItemValue(4 /* normalMana */) + "%", styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth * 2, heightStart + colHeight, this.getItemValue(5 /* normalEnergy */) + "%", styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart, heightStart + colHeight * 2, this.getItemValue(0 /* focusLife */) + "%", styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth, heightStart + colHeight * 2, this.getItemValue(1 /* focusMana */) + "%", styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
        var value = this.controlGame.game.add.text(textStart + colWidth * 2, heightStart + colHeight * 2, this.getItemValue(2 /* focusEnergy */) + "%", styleText);
        value.setTextBounds(0, 0, textWidth);
        backGroundDesc.addChild(value);
    };
    cControlFocus.prototype.getItemValue = function (enumItemProp) {
        var arrayitemProp = this.controlGame.controlPlayer.controlItems.arrayItemEfects;
        var itemProp = arrayitemProp[enumItemProp];
        var itemvalue;
        if (itemProp != undefined) {
            itemvalue = itemProp.value.toString();
        }
        else {
            itemvalue = '0';
        }
        ;
        return itemvalue;
    };
    cControlFocus.prototype.hidePlayerStats = function () {
        this.groupPlayerStats.destroy();
    };
    cControlFocus.prototype.createPotions = function () {
        var spriteHeal = this.controlGame.game.add.sprite(1000, 114, 'items', 35);
        spriteHeal.fixedToCamera = true;
        spriteHeal.inputEnabled = true;
        spriteHeal.events.onInputDown.add(this.SelectLifeFocus, this);
        var spriteMana = this.controlGame.game.add.sprite(1000, 114 + 25, 'items', 33);
        spriteMana.fixedToCamera = true;
        spriteMana.inputEnabled = true;
        spriteMana.events.onInputDown.add(this.SelectManaFocus, this);
        var spriteEnergy = this.controlGame.game.add.sprite(1000, 114 + 25 * 2, 'items', 31);
        spriteEnergy.fixedToCamera = true;
        spriteEnergy.inputEnabled = true;
        spriteEnergy.events.onInputDown.add(this.SelectEnergyFocus, this);
    };
    cControlFocus.prototype.SpellPosible = function (spell) {
        if (this.mana >= spell.manaCost && this.energy >= spell.energyCost && this.life >= spell.lifeCost) {
            this.UpdateEnergy(-spell.energyCost);
            this.UpdateMana(-spell.manaCost);
            this.UpdateLife(-spell.lifeCost);
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
        this.controlGame.game.add.tween(bar.scale).to({ x: -value / maxValue }, 25, Phaser.Easing.Linear.None, true);
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
        }
        this.ResizeBar(bar, value, maxValue);
        return value;
    };
    cControlFocus.prototype.SelectFocusFromSpell = function (idSpell) {
        var selectedFocus;
        if (idSpell == 0) {
            selectedFocus = FocusSystem.life;
        }
        else if (idSpell == 1) {
            selectedFocus = FocusSystem.mana;
        }
        else if (idSpell == 2) {
            selectedFocus = FocusSystem.energy;
        }
        //si vuelve a tocar el sistema seleccionado le saco la selección
        if (selectedFocus != this.actualFocusSystem) {
            this.SelectFocus(selectedFocus);
            return true;
        }
        else {
            this.SelectFocus(FocusSystem.nothing);
            return false;
        }
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
    cControlFocus.prototype.SelectRotativeFocus = function () {
        if (this.actualFocusSystem == FocusSystem.life) {
            this.SelectManaFocus();
        }
        else if (this.actualFocusSystem == FocusSystem.mana) {
            this.SelectEnergyFocus();
        }
        else if (this.actualFocusSystem == FocusSystem.energy || this.actualFocusSystem == FocusSystem.nothing) {
            this.SelectLifeFocus();
        }
    };
    cControlFocus.prototype.SelectFocus = function (wichFocus) {
        //seteo todo en normal, y hago el focus en el sel
        this.actualFocusLife = this.speedNormalLife;
        this.actualFocusMana = this.speedNormalMana;
        this.actualFocusEnergy = this.speedNormalEnergy;
        switch (wichFocus) {
            case FocusSystem.life:
                this.actualFocusLife = this.speedFocusLife;
                this.rectangleFocus.cameraOffset.x = this.lifeBar.cameraOffset.x;
                this.rectangleFocus.cameraOffset.y = this.lifeBar.cameraOffset.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.life;
                break;
            case FocusSystem.mana:
                this.actualFocusMana = this.speedFocusMana;
                this.rectangleFocus.cameraOffset.x = this.manaBar.cameraOffset.x;
                this.rectangleFocus.cameraOffset.y = this.manaBar.cameraOffset.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.mana;
                break;
            case FocusSystem.energy:
                this.actualFocusEnergy = this.speedFocusEnergy;
                this.rectangleFocus.cameraOffset.x = this.energyBar.cameraOffset.x;
                this.rectangleFocus.cameraOffset.y = this.energyBar.cameraOffset.y;
                this.rectangleFocus.visible = true;
                this.actualFocusSystem = FocusSystem.energy;
                break;
            case FocusSystem.nothing:
                this.rectangleFocus.visible = false;
                this.actualFocusSystem = FocusSystem.nothing;
                break;
        }
    };
    cControlFocus.prototype.LoadBars = function () {
        //esto tendria que venir del server en algun momento
        this.maxLife = 180;
        this.maxEnergy = 100;
        this.maxMana = 100;
        this.baseMaxLife = 180;
        this.baseMaxEnergy = 100;
        this.baseMaxMana = 100;
        this.life = 180;
        this.energy = 50;
        this.mana = 50;
        this.baseMaxAtack = 2;
        this.baseMaxDefence = 2;
        this.maxAtack = 2;
        this.maxDefence = 2;
    };
    cControlFocus.prototype.createAtackDefence = function () {
        this.textAtack = this.controlGame.game.add.text(1168, 50, this.maxAtack.toString(), this.styleText);
        this.textAtack.fixedToCamera = true;
        this.textDefence = this.controlGame.game.add.text(1168, 73, this.maxDefence.toString(), this.styleText);
        this.textDefence.fixedToCamera = true;
    };
    cControlFocus.prototype.updateAtackDefence = function () {
        this.textAtack.text = this.maxAtack.toString();
        this.textDefence.text = this.maxDefence.toString();
    };
    cControlFocus.prototype.createBars = function (gameWidth, gameHeight) {
        //creo las barras de vida y energia
        var barHeight = 20;
        var barWidth = 158;
        //vida
        var bitmapVida = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapVida.ctx.beginPath();
        bitmapVida.ctx.rect(0, 0, barWidth, barHeight);
        bitmapVida.ctx.fillStyle = '#e33133';
        bitmapVida.ctx.fill();
        this.lifeBar = this.controlGame.game.add.sprite(gameWidth - 167, 125 + bitmapVida.height, bitmapVida);
        this.lifeBar.anchor.setTo(1);
        this.lifeBar.fixedToCamera = true;
        this.lifeBar.inputEnabled = true;
        this.lifeBar.events.onInputDown.add(this.SelectLifeFocus, this);
        //mana
        var bitmapMana = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapMana.ctx.beginPath();
        bitmapMana.ctx.rect(0, 0, barWidth, barHeight);
        bitmapMana.ctx.fillStyle = '#0099ff';
        bitmapMana.ctx.fill();
        this.manaBar = this.controlGame.game.add.sprite(gameWidth - 167, 125 + 25 + bitmapMana.height, bitmapMana);
        this.manaBar.anchor.setTo(1);
        this.manaBar.fixedToCamera = true;
        this.manaBar.inputEnabled = true;
        this.manaBar.events.onInputDown.add(this.SelectManaFocus, this);
        //energia
        var bitmapEnergia = this.controlGame.game.add.bitmapData(barWidth, barHeight);
        bitmapEnergia.ctx.beginPath();
        bitmapEnergia.ctx.rect(0, 0, barWidth, barHeight);
        bitmapEnergia.ctx.fillStyle = '#33cc66';
        bitmapEnergia.ctx.fill();
        this.energyBar = this.controlGame.game.add.sprite(gameWidth - 167, 125 + 25 * 2 + bitmapEnergia.height, bitmapEnergia);
        this.energyBar.anchor.setTo(1);
        this.energyBar.fixedToCamera = true;
        this.energyBar.inputEnabled = true;
        this.energyBar.events.onInputDown.add(this.SelectEnergyFocus, this);
        //hago las barras del tamaño segun los valores actuales
        this.ResizeBar(this.lifeBar, this.life, this.maxLife);
        this.ResizeBar(this.manaBar, this.mana, this.maxMana);
        this.ResizeBar(this.energyBar, this.energy, this.maxEnergy);
        //para los textos de las barras
        this.styleText = { font: "14px Arial", fill: "#ffffff", textalign: "center", fontWeight: 600 };
        this.textLife = this.controlGame.game.add.text(gameWidth - 165, 125, "200", this.styleText);
        this.textLife.fixedToCamera = true;
        this.textMana = this.controlGame.game.add.text(gameWidth - 165, 125 + 25, "200", this.styleText);
        this.textMana.fixedToCamera = true;
        this.textEnergy = this.controlGame.game.add.text(gameWidth - 165, 125 + 25 * 2, "200", this.styleText);
        this.textEnergy.fixedToCamera = true;
        //  Para hacer un recuadro sobre la barra selecionada
        this.rectangleFocus = this.controlGame.game.add.graphics(0, 0);
        this.rectangleFocus.lineStyle(2, 0xffffff, 1);
        this.rectangleFocus.fixedToCamera = true;
        this.rectangleFocus.drawRect(0, -barHeight, barWidth, barHeight);
        this.rectangleFocus.cameraOffset.x = this.lifeBar.x - this.lifeBar.width;
        this.rectangleFocus.cameraOffset.y = 125;
        this.rectangleFocus.visible = false;
    };
    return cControlFocus;
}());
