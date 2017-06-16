"use strict";
var cServerControlMonster_1 = require('./../cServerControlMonster');
var cControlServerPlayers_1 = require('./../cControlServerPlayers');
var cServerControlItems_1 = require('./../items/cServerControlItems');
var cServerMap_1 = require('./cServerMap');
var cServerControlMaps = (function () {
    function cServerControlMaps(socket) {
        var _this = this;
        this.socket = socket;
        //to control the map of each player 
        this.arrayPlayersMap = [];
        this.arrayMapData = []; //we will store all the data of each map here to use it later
        //lets create a control to every object, in every map
        this.arrayControlPlayers = [];
        this.arrayControlMonsters = [];
        this.arrayControlItems = [];
        this.initialMapName = 1 /* principalMap */;
        //lets get the data of all the mapsData
        this.readMapData();
        //lets start all the maps in the server from the data of the JSON 
        this.mapsData.mapData.forEach(function (JSONmapData) {
            _this.initMap(JSONmapData);
        });
        //lets set the map names to send to the players with the portals
        this.arrayMapData.forEach(function (map) {
            map.arrayPortals.forEach(function (portal) {
                portal.mapName = _this.arrayMapData[portal.idPortal].mapName;
            });
        });
    }
    cServerControlMaps.prototype.initMap = function (JSONmapData) {
        //store the map data so we can use it later
        var mapData = new cServerMap_1.cServerMap(JSONmapData);
        this.arrayMapData[mapData.id] = mapData;
        //lets create the control componentes of the map
        var controlPlayers = new cControlServerPlayers_1.cServerControlPlayers(this.socket, 'room' + mapData.id);
        var controlItems = new cServerControlItems_1.cServerControlItems(this.socket, 'room' + mapData.id);
        var controlMonsters = new cServerControlMonster_1.cServerControlMonster(this.socket, 'room' + mapData.id, controlPlayers, controlItems, mapData.monsterNumber, mapData.file, mapData.arrayMonster);
        controlPlayers.controlMonster = controlMonsters;
        //stored them in the array
        this.arrayControlPlayers[mapData.id] = controlPlayers;
        this.arrayControlMonsters[mapData.id] = controlMonsters;
        this.arrayControlItems[mapData.id] = controlItems;
    };
    cServerControlMaps.prototype.readMapData = function () {
        var fs = require('fs');
        //to make it work local and in heroku 
        var file = "server/maps/mapsData.json";
        if (!fs.existsSync(file)) {
            console.log("File not found");
            var file = "./maps/mapsData.json";
        }
        this.mapsData = JSON.parse(fs.readFileSync(file, 'utf8'));
    };
    //this function get the actual map of a player, and get the controler of that map
    cServerControlMaps.prototype.getControlPlayer = function (idPlayer) {
        var mapName = this.arrayPlayersMap[idPlayer];
        return this.arrayControlPlayers[mapName];
    };
    //this function get the actual controler of the items
    cServerControlMaps.prototype.getControlItems = function (idPlayer) {
        var mapName = this.arrayPlayersMap[idPlayer];
        return this.arrayControlItems[mapName];
    };
    //check in wich portal the player enter and act if necessary
    cServerControlMaps.prototype.enterPortal = function (socketPlayer, data) {
        this.playerChangeMap(socketPlayer, data);
    };
    cServerControlMaps.prototype.chatSend = function (socket, data) {
        //lets get the room of the player that send the chatSend
        var controlPlayers = this.getControlPlayer(socket.id);
        controlPlayers.chatSend(socket, data);
    };
    cServerControlMaps.prototype.playerChangeMap = function (socketPlayer, data) {
        //lets get the actual player room and check if it really change 
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        var newRoom = 'room' + data.idPortal;
        if (newRoom != controlPlayers.room) {
            //remove the player for the current room
            var dataPlayer = controlPlayers.onPlayerDisconected(socketPlayer); //this give you the data of the player
            socketPlayer.leave(controlPlayers.room);
            //lets get the controler of the new room  and conect the player
            this.playerEnterMap(socketPlayer, data, data.idPortal, dataPlayer);
            //lets update the array of where is every player
            this.arrayPlayersMap[socketPlayer.id] = data.idPortal;
        }
        socketPlayer.emit('you enter portal', { idPortal: data.idPortal, x: data.x, y: data.y });
    };
    cServerControlMaps.prototype.playerEnterMap = function (socketNewPlayer, data, mapNumber, playerData) {
        if (playerData === void 0) { playerData = null; }
        //this make the socket join the principal map 
        socketNewPlayer.join('room' + mapNumber);
        //lets get the components of the actual map
        var controlPlayers = this.arrayControlPlayers[mapNumber];
        var controlMonsters = this.arrayControlMonsters[mapNumber];
        var controlItems = this.arrayControlItems[mapNumber];
        //we send all the data to the player
        controlPlayers.onNewPlayerConected(socketNewPlayer, data, playerData);
        controlMonsters.onNewPlayerConected(socketNewPlayer);
        controlItems.onNewPlayerConected(socketNewPlayer);
        //we send all extra the information about the map (portals, etc.)
        this.sendMapObjects(socketNewPlayer, mapNumber);
        //we redefine where the player is in this class
        this.arrayPlayersMap[socketNewPlayer.id] = mapNumber;
    };
    cServerControlMaps.prototype.sendMapObjects = function (socketNewPlayer, mapNumber) {
        //lets get the map data to send the info needed to the client
        var mapData = this.arrayMapData[mapNumber];
        var portals = mapData.arrayPortals;
        socketNewPlayer.emit('new portals', portals);
    };
    cServerControlMaps.prototype.onNewPlayer = function (socketNewPlayer, data) {
        //new player conected, it start in the principal room
        this.playerEnterMap(socketNewPlayer, data, this.initialMapName);
    };
    cServerControlMaps.prototype.onPlayerDisconnected = function (socketPlayer) {
        console.log('Player has disconnected: ' + socketPlayer.id);
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.onPlayerDisconected(socketPlayer);
        //delete the player for the array of conected players
        delete this.arrayPlayersMap[socketPlayer.id];
        socketPlayer.broadcast.emit('remove player', { id: socketPlayer.id });
    };
    cServerControlMaps.prototype.onMovePlayer = function (socketPlayer, data) {
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.movePlayer(socketPlayer, data);
    };
    cServerControlMaps.prototype.onLevelUp = function (socketPlayer, data) {
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.levelUp(socketPlayer, data);
    };
    cServerControlMaps.prototype.dropItemToFloor = function (socketPlayer, data) {
        var controlItems = this.getControlItems(socketPlayer.id);
        controlItems.dropItemToFloor(socketPlayer, data);
    };
    cServerControlMaps.prototype.youEquipItem = function (socketPlayer, data) {
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.youEquipItem(socketPlayer, data);
    };
    cServerControlMaps.prototype.youGetItem = function (socketPlayer, data) {
        var controlItems = this.getControlItems(socketPlayer.id);
        controlItems.youGetItem(socketPlayer, data);
    };
    cServerControlMaps.prototype.spellCast = function (socketPlayer, data) {
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.spellCast(socketPlayer, data);
    };
    cServerControlMaps.prototype.playerDie = function (socketPlayer, data) {
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.playerDie(socketPlayer, data);
    };
    cServerControlMaps.prototype.youChange = function (socketPlayer, data) {
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.youChange(socketPlayer, data);
    };
    return cServerControlMaps;
}());
exports.cServerControlMaps = cServerControlMaps;
