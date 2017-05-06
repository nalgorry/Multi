var cControlLvlButton = (function () {
    function cControlLvlButton(controlGame, x, y, text, value, itemEfect) {
        this.controlGame = controlGame;
        this.createLvlBoton(x, y, text, value, itemEfect);
        this.statSelect = new Phaser.Signal();
    }
    cControlLvlButton.prototype.createLvlBoton = function (x, y, text, value, itemEfect) {
        this.sprite = this.controlGame.game.add.sprite(x, y);
        this.sprite.fixedToCamera = true;
        var textOption = this.controlGame.game.add.bitmapText(0, 0, 'gotic_white', text, 16);
        textOption.anchor.set(0.5);
        //normal state button 
        var bitmapBoton = this.controlGame.game.add.graphics(-24, -8);
        bitmapBoton.beginFill(0x363636);
        bitmapBoton.lineStyle(2, 0x000000, 1);
        bitmapBoton.drawRect(-(textOption.width) / 2, -38 / 2 / 2, textOption.width + 48, 38);
        bitmapBoton.endFill();
        bitmapBoton.alpha = 0.9;
        //onmouseover state button 
        var bitmapBotonOver = this.controlGame.game.add.graphics(-24, -8);
        bitmapBotonOver.beginFill(0x363636);
        bitmapBotonOver.lineStyle(2, 0xFFFFFF, 1);
        bitmapBotonOver.drawRect(-(textOption.width) / 2, -38 / 2 / 2, textOption.width + 48, 38);
        bitmapBotonOver.endFill();
        bitmapBotonOver.alpha = 0.9;
        bitmapBotonOver.visible = false;
        //var backGround = this.controlGame.game.add.sprite(-24, -8, bitmapBoton);
        //backGround.alpha = 0.9;
        this.sprite.addChild(bitmapBoton);
        this.sprite.addChild(bitmapBotonOver);
        this.sprite.addChild(textOption);
        this.value = value; //save the property of the item here
        this.itemEfect = itemEfect;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputOver.add(this.botonLvlUpOver, this);
        this.sprite.events.onInputOut.add(this.botonLvlUpOut, this);
        this.sprite.events.onInputDown.add(this.botonLvlUpDown, this);
    };
    cControlLvlButton.prototype.botonLvlUpDown = function (btton) {
        this.statSelect.dispatch(this);
    };
    cControlLvlButton.prototype.botonLvlUpOver = function (button) {
        button.children[0].visible = false;
        button.children[1].visible = true;
    };
    cControlLvlButton.prototype.botonLvlUpOut = function (button) {
        button.children[0].visible = true;
        button.children[1].visible = false;
    };
    return cControlLvlButton;
}());
