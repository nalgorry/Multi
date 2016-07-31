var cBasicActor = (function () {
    function cBasicActor(_controlGame) {
        this.controlGame = _controlGame;
        this.styleChat = { font: "22px Arial", fill: "#ffffff" };
        this.styleHit = { font: "22px Arial", fill: "#612131" };
    }
    cBasicActor.prototype.setChatText = function (texto) {
        if (this.textChat == null) {
            this.textChat = this.controlGame.game.add.text(-30, -30, "", this.styleChat);
            this.playerSprite.addChild(this.textChat);
        }
        this.textChat.text = texto;
    };
    cBasicActor.prototype.onHit = function (data) {
        //animiacion de la bomba 
        var boomSprite = this.controlGame.game.add.sprite(this.playerSprite.x, this.playerSprite.y, 'boom');
        boomSprite.anchor.set(0.5);
        boomSprite.animations.add('boom');
        boomSprite.animations.play('boom', 100, false, true);
        //texto con el daño
        var hitText = this.controlGame.game.add.text(-30, -40, data.damage, this.styleHit);
        this.playerSprite.addChild(hitText);
        var tweenText = this.controlGame.game.add.tween(hitText).to({ y: '-30' }, 500, undefined, true);
        tweenText.onComplete.add(this.removeTweenText, hitText);
    };
    cBasicActor.prototype.removeTweenText = function (sprite) {
        sprite.destroy();
    };
    return cBasicActor;
}());
