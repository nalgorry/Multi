import {cServerMonster} from './cServerMonster';
import {cServerControlPlayers} from './cControlServerPlayers';

export class cServerControlMonster {

    public arrayMonster:cServerMonster[];
    private nextIdMonster:number = 0;

    constructor(public socket:SocketIO.Server,  public controlPlayer:cServerControlPlayers) {

        this.arrayMonster = [];
        
        //creo los primeros monters :)

       for (var i=1; i<=10;i++) {
           this.createNewMonster(Math.round(Math.random()*50+10),Math.round(Math.random()*50+10),50,-1)
       }

    }

    public getMonsterById(id:string):cServerMonster {
        return this.arrayMonster[id];
    }

    public onNewPlayerConected(socket:SocketIO.Server) {

        //le mando al nuevo cliente todos los moustros del mapa
        for (var monster in this.arrayMonster) {
            this.arrayMonster[monster].sendMonsterToNewPlayer(socket);    
        }

    }

    private createNewMonster(tileX:number,tileY:number,life:number,monsterPower:number) {
        
        var newMonster = new cServerMonster("m" + this.nextIdMonster,this.socket,this.controlPlayer)

        newMonster.startMonster(tileX,tileY,life,monsterPower);
        
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;

        this.nextIdMonster += 1;

    }

    public monsterHit(data,player) {

        //busco el moustro y le pego
        var monster = this.getMonsterById(data.idMonster);

        if (monster != null) {
            monster.monsterHit(data,player)
        } else {
            console.log("monstruo no encontrado")
        }

        //controlo si se murio el moustro y lo saco del array de moustros
        if (monster.monsterDie == true) { 
            delete this.arrayMonster[data.idMonster];

            //creo un nuevo monster mas poderoso
            this.createNewMonster(Math.round(Math.random()*30+10),Math.round(Math.random()*30+10),50 + this.nextIdMonster * 3 ,10 + this.nextIdMonster * 2)
        }

    }

}