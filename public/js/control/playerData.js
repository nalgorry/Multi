var cPlayerData = (function () {
    function cPlayerData(_controlGame) {
        this.controlGame = _controlGame;
    }
    cPlayerData.prototype.setChatText = function (texto) {
        //pruebas de texto
        this.playerSprite.addChild(texto);
    };
    return cPlayerData;
}());
