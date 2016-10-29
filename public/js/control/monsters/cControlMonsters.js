var cControlMonsters = (function () {
    function cControlMonsters(controlGame) {
        this.controlGame = controlGame;
        this.arrayMonster = [];
        var data = {
            id: 'm125',
            tileX: 20,
            tileY: 20,
        };
        this.arrayMonster[data.id] = new cMonster(this.controlGame, 'data');
        console.log(this.arrayMonster[data.id]);
    }
    return cControlMonsters;
}());
