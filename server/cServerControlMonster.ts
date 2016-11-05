import {cServerMonster} from './cServerMonster';

export class cServerControlMonster {

    private arrayMonster:cServerMonster[];
    private nextIdMonster:number = 0;

    constructor(public socket:SocketIO.Server) {

        this.arrayMonster = [];
        
        var newMonster = new cServerMonster("m" + this.nextIdMonster,this.socket)
        
        newMonster.startMonster(50,30,30);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;

        this.nextIdMonster += 1;

        var newMonster = new cServerMonster("m" + this.nextIdMonster,this.socket)

        newMonster.startMonster(50,10,10);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;

        this.nextIdMonster += 1;

    }

    public onNewPlayerConected(socket:SocketIO.Server) {

        for (var monster in this.arrayMonster) {
            this.arrayMonster[monster].sendMonsterToNewPlayer(socket);    
        }

    }

}