
import {cServerControlMonster} from './../cServerControlMonster';
import {cServerControlPlayers} from './../cControlServerPlayers';
import {cServerControlItems} from './../items/cServerControlItems';
import {cServerMap} from './cServerMap';

export class cServerControlMaps {

    //to control the map of each player 
    private arrayPlayersMap:number[] = [];
    private arrayMapData:cServerMap[] = []; //we will store all the data of each map here to use it later

    //the data of each map read from the JSON
    private mapsData;

    //lets create a control to every object, in every map
    private arrayControlPlayers:cServerControlPlayers[] = [];
    private arrayControlMonsters:cServerControlMonster[] = [];
    private arrayControlItems:cServerControlItems[] = [];
    private initialMapName:number = enumMapNames.principalMap;

        constructor(public socket:SocketIO.Server){

            //lets get the data of all the mapsData
            this.readMapData();

            //lets start all the maps in the server from the data of the JSON 
            this.mapsData.mapData.forEach(JSONmapData => {
                this.initMap(JSONmapData);
            });

        }   

    private initMap(JSONmapData) {

        //store the map data so we can use it later
        var mapData = new cServerMap(JSONmapData);
        this.arrayMapData[mapData.id] = mapData;

       //lets create the control componentes of the map
       var controlPlayers = new cServerControlPlayers(this.socket, 'room' + mapData.id );
       var controlItems = new cServerControlItems(this.socket,'room' + mapData.id);
       var controlMonsters = new cServerControlMonster(this.socket,'room' + mapData.id, controlPlayers,controlItems, mapData.monsterNumber);
       controlPlayers.controlMonster = controlMonsters;

       //stored them in the array
        this.arrayControlPlayers[mapData.id] = controlPlayers;
        this.arrayControlMonsters[mapData.id] = controlMonsters;
        this.arrayControlItems[mapData.id] = controlItems;

    }

    private readMapData () {
        var fs = require('fs');
        
        //to make it work local and in heroku 
        var file = "server/maps/mapsData.json";
        if(!fs.existsSync(file)) {
            console.log("File not found");
            var file = "./maps/mapsData.json";
        }

        this.mapsData = JSON.parse(fs.readFileSync(file, 'utf8'));
    }

    //this function get the actual map of a player, and get the controler of that map
    private getControlPlayer(idPlayer):cServerControlPlayers {
        var mapName = this.arrayPlayersMap[idPlayer];
        return this.arrayControlPlayers[mapName];
    }

    //this function get the actual controler of the items
    private getControlItems(idPlayer):cServerControlItems {
        var mapName = this.arrayPlayersMap[idPlayer];
        return this.arrayControlItems[mapName];
    }

    //check in wich portal the player enter and act if necessary
    public enterPortal(socketPlayer, data) {

        this.playerChangeMap(socketPlayer, data);

    }

    public playerChangeMap(socketPlayer, data) {

        //lets get the actual player room and check if it really change 
        var controlPlayers:cServerControlPlayers = this.getControlPlayer(socketPlayer.id);

        var newRoom = 'room' + data.idPortal;
        
        if (newRoom != controlPlayers.room) {
            
            //remove the player for the current room
            controlPlayers.onPlayerDisconected(socketPlayer);
            socketPlayer.leave(controlPlayers.room);

            //lets get the controler of the new room  and conect the player
            this.playerEnterMap(socketPlayer, data, data.idPortal);

            //lets update the array of where is every player
            this.arrayPlayersMap[socketPlayer.id] = data.idPortal;

        }

        //lets get the map data to send the info needed to the client
        var mapData = this.arrayMapData[data.idPortal];
        
        socketPlayer.emit('you enter portal', {idPortal:data.idPortal, x:data.x, y:data.y, mapName:mapData.name });

    }

    private playerEnterMap(socketNewPlayer, data, mapNumber:enumMapNames) {

        //this make the socket join the principal map 
        socketNewPlayer.join('room' + mapNumber);
        
        //lets get the components of the actual map
        var controlPlayers:cServerControlPlayers = this.arrayControlPlayers[mapNumber];
        var controlMonsters:cServerControlMonster = this.arrayControlMonsters[mapNumber];
        var controlItems:cServerControlItems = this.arrayControlItems[mapNumber];

        //we send all the data to the player
        controlPlayers.onNewPlayerConected(socketNewPlayer, data)    
        controlMonsters.onNewPlayerConected(socketNewPlayer);
        controlItems.onNewPlayerConected(socketNewPlayer);

        //we send all extra the information about the map (portals, etc.)
        this.sendMapObjects(socketNewPlayer, mapNumber )

        //we redefine where the player is in this class
        this.arrayPlayersMap[socketNewPlayer.id] = mapNumber;

    }

    public sendMapObjects(socketNewPlayer: SocketIO.Server, mapNumber:enumMapNames) {

        //lets get the map data to send the info needed to the client
        var mapData = this.arrayMapData[mapNumber];

        var portals = mapData.arrayPortals;

        console.log(portals);
        socketNewPlayer.emit('new portals', portals);

    } 

    public onNewPlayer(socketNewPlayer, data) {

        //new player conected, it start in the principal room
        this.playerEnterMap(socketNewPlayer, data, this.initialMapName);

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
