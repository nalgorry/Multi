class cMonster  {

    public idMonster:number;
    public tileX:number;
    public tileY:number;


    constructor(controlGame:cControlGame,data) {

        this.idMonster = data.id;
        this.tileX = data.x;
        this.tileY = data.y;

        this.startMonster(data);

        
    }

    private startMonster(data) {

        
    }

}

