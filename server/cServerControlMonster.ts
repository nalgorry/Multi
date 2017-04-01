import {cServerMonster} from './cServerMonster';
import {cServerControlPlayers} from './cControlServerPlayers';
import {cServerControlItems} from './items/cServerControlItems';

export class cServerControlMonster {

    public arrayMonster:cServerMonster[];
    private nextIdMonster:number = 0;

    public monsterMaxX:number = 65;
    public monsterMaxY:number = 50;


    constructor(public socket:SocketIO.Server,  public controlPlayer:cServerControlPlayers, public controlItems:cServerControlItems) {

        this.arrayMonster = [];
        
        //creo los primeros monters :)

       for (var i=1; i<=35; i++) {

           var randmType = this.randomIntFromInterval(1, 2)
           var monsterType = enumMonsters.FirstMonster
           if(randmType == 2) {
               var monsterType = enumMonsters.Wolf
           }
            
           this.createNewMonster(Math.round(Math.random() * this.monsterMaxX),Math.round(Math.random() * this.monsterMaxY), monsterType, true);
       }

       //creo el mounstro COSMICO
       this.createNewMonster(Math.round(Math.random() * this.monsterMaxX), Math.round(Math.random() * this.monsterMaxY), enumMonsters.Cosmic, true);
       this.createNewMonster(Math.round(Math.random() * this.monsterMaxX), Math.round(Math.random() * this.monsterMaxY), enumMonsters.Cosmic, true);

    }

    public getMonsterById(id:string):cServerMonster {
        return this.arrayMonster[id];
    }

    public onNewPlayerConected(socket:SocketIO.Server) {

        //le mando al nuevo cliente todos los moustros del mapa
        for (var numMonster in this.arrayMonster) {

            var monster = this.arrayMonster[numMonster] 

            //me fijo si el monstruo es publico antes de mandarlo 
            if (monster.isPublic == true) {
                monster.sendMonsterToNewPlayer(socket);
            }    
        }


        //le mando el moustro para el tutorial solo a este jugador.
        var newMonster = new cServerMonster(this.controlItems);
        newMonster.startMonster("m" + this.nextIdMonster, enumMonsters.FirstMonster, socket, this.controlPlayer, false, false , 55, 59);
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;
        this.nextIdMonster += 1;

    }

    public createNewMonster(tileX:number,tileY:number,monsterType:enumMonsters,monsterRespawn:boolean) {
        
        var newMonster = new cServerMonster(this.controlItems);

        newMonster.startMonster("m" + this.nextIdMonster, monsterType, this.socket, this.controlPlayer, monsterRespawn, true, tileX, tileY);
        
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;

        this.nextIdMonster += 1;

    }

    public findMonstersInArea(centerTileX:number, centerTileY:number, tilesX:number, tilesY:number) {
        var resultado:string[] = [];

        for (var numMonster in this.arrayMonster) {
            var monster = this.arrayMonster[numMonster];

            if ( Math.abs(monster.tileX - centerTileX) <= tilesX) {
                if ( Math.abs(monster.tileY - centerTileY) <= tilesY) {
                    resultado.push(monster.monsterId);
                }
            }

        }

        return resultado
    }

    private randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

}