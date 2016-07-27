var cPlayerData = (function () {
    function cPlayerData(_controlGame) {
        this.controlGame = _controlGame;
        this.styleChat = { font: "22px Arial", fill: "#ffffff" };
    }
    cPlayerData.prototype.setChatText = function (texto) {
        if (this.textChat == null) {
            this.textChat = this.controlGame.game.add.text(-30, -30, "", this.styleChat);
            this.playerSprite.addChild(this.textChat);
        }
        this.textChat.text = texto;
    };
    return cPlayerData;
}());
