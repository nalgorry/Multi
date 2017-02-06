import {cServerMonster} from './cServerMonster';
import {cServerControlPlayers} from './cControlServerPlayers';
import {cServerControlItems} from './items/cServerControlItems';

export class cServerControlMonster {

    public arrayMonster:cServerMonster[];
    private nextIdMonster:number = 0;

    constructor(public socket:SocketIO.Server,  public controlPlayer:cServerControlPlayers, public controlItems:cServerControlItems) {

        this.arrayMonster = [];
        
        //creo los primeros monters :)

       for (var i=1; i<=25;i++) {
           this.createNewMonster(Math.round(Math.random() * 76 + 14),Math.round(Math.random() * 60 + 14),this.randomIntFromInterval(1,4));
       }

       //creo el mounstro COSMICO
       this.createNewMonster(Math.round(Math.random() * 76 + 14),Math.round(Math.random() * 60 + 14),5);


    }

    public getMonsterById(id:string):cServerMonster {
        return this.arrayMonster[id];
    }

    public onNewPlayerConected(socket:SocketIO.Server) {

        //le mando al nuevo cliente todos los moustros del mapa
        for (var monster in this.arrayMonster) {
            this.arrayMonster[monster].sendMonsterToNewPlayer(socket);    
        }

        //le mando el moustro para el tutorial.
        //var tutorialMonster:cServerMonster = new cServerMonster(this.controlItems);
        //tutorialMonster.tileX = 52;
        //tutorialMonster.tileY = 93;
        //tutorialMonster.monsterType = enumMonsters.FirstMonster;
        //tutorialMonster.sendMonsterToNewPlayer(socket);
        //this.arrayMonster.push(tutorialMonster);


    }

    private createNewMonster(tileX:number,tileY:number,monsterType:enumMonsters) {
        
        var newMonster = new cServerMonster(this.controlItems);

        newMonster.startMonster("m" + this.nextIdMonster, monsterType, this.socket, this.controlPlayer, tileX, tileY);
        
        this.arrayMonster["m" + this.nextIdMonster] = newMonster;

        this.nextIdMonster += 1;

    }

    public monsterHit(data,player) {

        //busco el moustro y le pego
        var monster = this.getMonsterById(data.idMonster);

        if (monster != undefined) {
            monster.monsterHit(data,player)

            //controlo si se murio el moustro y lo saco del array de moustros
            if (monster.monsterDie == true) { 
                delete this.arrayMonster[data.idMonster];

                //creo un nuevo monster aleatorio, excepto el cosmico que lo creo de nuevo 
                if (monster.monsterType != enumMonsters.Cosmic) {
                    this.createNewMonster(Math.round(Math.random()*76+14),Math.round(Math.random()*76+12),this.randomIntFromInterval(1,4))
                } else {
                    this.createNewMonster(Math.round(Math.random()*76+14),Math.round(Math.random()*76+12),enumMonsters.Cosmic);
                }
            }   
        } else {
            console.log("monstruo no encontrado");
        }

        

    }

    private randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

}