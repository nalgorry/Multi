class cControlMonsters {


    private arrayMonster:cMonster[];

    constructor(public controlGame: cControlGame) {

        this.arrayMonster = [];

    }

    public newMonster(data) {
        this.arrayMonster[data.id] = new cMonster(this.controlGame,data);
    }


}