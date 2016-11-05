var cControlMonsters = (function () {
    function cControlMonsters(controlGame) {
        this.controlGame = controlGame;
        this.arrayMonster = [];
    }
    cControlMonsters.prototype.newMonster = function (data) {
        this.arrayMonster[data.id] = new cMonster(this.controlGame, data);
    };
    return cControlMonsters;
}());
