export class cServerMonster {

    public monsterLife:number;
    public tileX:number; 
    public tileY:number;
    
    constructor(public monsterId:string,
                public socket:SocketIO.Server) {

    }

    public startMonster(monsterLife:number,tileX:number,tileY:number) {

        this.monsterLife = monsterLife;
        this.tileX = tileX;
        this.tileY = tileY;

        this.socket.emit('new Monster', {id:this.monsterId,tileX:this.tileX, tileY:this.tileX});

    }

    public sendMonsterToNewPlayer(socket:SocketIO.Server) {
        socket.emit('new Monster', {id:this.monsterId,tileX:this.tileX, tileY:this.tileX});
    }

}