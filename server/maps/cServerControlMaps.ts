
import {cServerControlMonster} from './../cServerControlMonster';
import {cServerControlPlayers} from './../cControlServerPlayers';
import {cServerControlItems} from './../items/cServerControlItems';

export class cServerControlMaps {

    //lets create a control to every object, in every map
    private arrayControlPlayers:cServerControlPlayers[] = [];
    private arrayControlMonsters:cServerControlMonster[] = [];
    private arrayControlItems:cServerControlItems[] = [];

        constructor(public socket:SocketIO.Server){

            //lets start the principal map
            this.initMap('mapPrincipal');

            console.log(this.arrayControlItems['mapPrincipal']);

        }   

    private initMap(mapName:string) {

        //lets create the control componentes of the map
       var controlPlayers = new cServerControlPlayers(this.socket);
       var controlItems = new cServerControlItems(this.socket);
       var controlMonsters = new cServerControlMonster(this.socket,controlPlayers,controlItems);
       controlPlayers.controlMonster = controlMonsters;

       //stored them in the array
        this.arrayControlPlayers[mapName] = controlPlayers;
        this.arrayControlMonsters[mapName] = controlMonsters;
        this.arrayControlItems[mapName] = controlItems;

        console.log("che si entra");
    }



}