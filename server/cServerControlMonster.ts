import {cServerMonster} from './cServerMonster';
import {cServerControlPlayers} from './cControlServerPlayers';
import {cServerControlItems} from './items/cServerControlItems';

export class cServerControlMonster {

    public arrayMonster:cServerMonster[];
    private nextIdMonster:number = 0;

    public mapSizeX:number = 70;
    public mapSizeY:number = 50; //to avoid monster in the city
    public arrayMonsterHit:number[];


    constructor(public socket:SocketIO.Server,
    public room: string,
    public controlPlayer:cServerControlPlayers, 
    public controlItems:cServerControlItems,
    private monsterNumber:number,
    public arrayMonsterTypes:enumMonsters[],
    private mapName:string,
    private arrayMonsters:cServerMonster[]) {

        this.arrayMonster = [];

        //get the tiles where monsters can not move
        this.getMapHitTest(mapName) 
        
        //create the random monsters, if they are any monster in the map
        if (this.arrayMonsterTypes == undefined) {return}

       for (var i=1; i<=monsterNumber; i++) {

           var monsterType = this.getRandomMonster()
            
           this.createNewMonster(undefined, undefined, monsterType, true);
       }

       arrayMonsters.forEach(monster => {
           this.createNewMonster(monster.tileX, monster.tileY, monster.monsterType, monster.monsterRespawn);
       })

    }

    public getRandomMonster():number {

            var randmType = this.randomIntFromInterval(0, this.arrayMonsterTypes.length -1)
            var monsterType = this.arrayMonsterTypes[randmType];

            return monsterType;
    }

    public getMapHitTest(mapFile:string) {

        //lets get the file with the map to avoid monster to hit the water
        var fs = require('fs');
        

        //to make it work local and in heroku 
        var file = "public/assets/maps/" + mapFile
        if(!fs.existsSync(file)) {
            console.log("File not found");
            file = "../public/assets/maps/" + mapFile
        }

        var mapData = JSON.parse(fs.readFileSync(file, 'utf8'));

        this.arrayMonsterHit = new Array();
        this.arrayMonsterHit = mapData.layers[4].data

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

    }

    public createNewMonster(tileX:number, tileY:number, monsterType:enumMonsters, monsterRespawn:boolean) {
        
        var newMonster = new cServerMonster();

        newMonster.defineMonster(monsterType,monsterRespawn, true, tileX, tileY);
        newMonster.startMonster("m" + this.nextIdMonster, this.socket, this.controlPlayer, this.controlItems, this.room , this.arrayMonsterHit, this.mapSizeX, this.mapSizeY);
        
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