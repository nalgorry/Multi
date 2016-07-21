var cControlOtherPlayers = (function () {
    function cControlOtherPlayers() {
    }
    cControlOtherPlayers.prototype.playerById = function (id) {
        var i;
        for (i = 0; i < this.arrayPlayers.length; i++) {
            if (this.arrayPlayers[i].id === id) {
                return this.arrayPlayers[i];
            }
        }
        return null;
    };
    return cControlOtherPlayers;
}());
