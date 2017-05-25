
import {cServerControlMonster} from './../cServerControlMonster';
import {cServerControlPlayers} from './../cControlServerPlayers';
import {cServerControlItems} from './../items/cServerControlItems';

export class cServerControlMaps {

    //to control the map of each player 
    private arrayPlayersMap:string[] = [];

    //lets create a control to every object, in every map
    private arrayControlPlayers:cServerControlPlayers[] = [];
    private arrayControlMonsters:cServerControlMonster[] = [];
    private arrayControlItems:cServerControlItems[] = [];
    private initialMapName:string = 'mapPrincipal';

        constructor(public socket:SocketIO.Server){

            //lets start the principal map
            this.initMap(this.initialMapName);

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

    }

    //this function get the actual map of a player, and get the controler of that map
    private getControlPlayer(idPlayer):cServerControlPlayers {
        var mapName = this.arrayPlayersMap[idPlayer];
        return this.arrayControlPlayers[mapName];
    }

    //this function get the actual map of a player, and get the controler of the items
    private getControlItems(idPlayer):cServerControlItems {
        var mapName = this.arrayPlayersMap[idPlayer];
        return this.arrayControlItems[mapName];
    }

    public onNewPlayer(socketNewPlayer, data) {

        //new player conected, it start in the principal room
        var controlPlayers:cServerControlPlayers = this.arrayControlPlayers[this.initialMapName];
        var controlMonsters:cServerControlMonster = this.arrayControlMonsters[this.initialMapName];
        var controlItems:cServerControlItems = this.arrayControlItems[this.initialMapName];

        controlPlayers.onNewPlayerConected(socketNewPlayer, data)    
        controlMonsters.onNewPlayerConected(socketNewPlayer);
        controlItems.onNewPlayerConected(socketNewPlayer);

        this.arrayPlayersMap[socketNewPlayer.id] = this.initialMapName;

    }

    public onPlayerDisconnected(socketPlayer) {

        console.log('Player has disconnected: ' + socketPlayer.id)

        var controlPlayers:cServerControlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.onPlayerDisconected(this);

        //delete the player for the array of conected players
        delete this.arrayPlayersMap[socketPlayer.id];

         socketPlayer.broadcast.emit('remove player', {id: socketPlayer.id})

    }

    public onMovePlayer(socketPlayer, data) {

        var controlPlayers:cServerControlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.movePlayer(socketPlayer, data);

    }

    public onLevelUp(socketPlayer, data) {
        var controlPlayers:cServerControlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.levelUp(socketPlayer, data);
    }

    public dropItemToFloor(socketPlayer, data){
        var controlItems:cServerControlItems = this.getControlItems(socketPlayer.id);
        controlItems.dropItemToFloor(socketPlayer, data);
    }

    public youEquipItem(socketPlayer, data) {
        var controlPlayers:cServerControlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.youEquipItem(socketPlayer, data);
    }

    public youGetItem(socketPlayer, data) {
        var controlItems:cServerControlItems = this.getControlItems(socketPlayer.id);
        controlItems.youGetItem(socketPlayer, data);
    }

    public spellCast(socketPlayer, data) {
        var controlPlayers:cServerControlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.spellCast(socketPlayer, data);
    }

    public playerDie(socketPlayer, data) {
        var controlPlayers:cServerControlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.playerDie(socketPlayer, data);
    }

    public youChange(socketPlayer, data) {

        var controlPlayers:cServerControlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.youChange(socketPlayer, data);       

    }

}

