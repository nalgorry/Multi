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
        this.speedFocus = 1000;
        this.LoadBars();
        this.CreateBars();
        console.log("entra");
        var timer = this.controlGame.game.time.events.loop(this.speedFocus, this.UpdateFocus, this);
    }
    cControlFocus.prototype.ResizeBar = function (bar, value, maxValue) {
        this.controlGame.game.add.tween(bar.scale).to({ y: value / maxValue }, 200, Phaser.Easing.Linear.None, true);
    };
    cControlFocus.prototype.UpdateFocus = function () {
        console.log("entra");
        this.life += 10;
        this.ResizeBar(this.lifeBar, this.life, this.maxLife);
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
    };
    return cControlFocus;
}());
