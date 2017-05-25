"use strict";
var cServerControlMonster_1 = require('./../cServerControlMonster');
var cControlServerPlayers_1 = require('./../cControlServerPlayers');
var cServerControlItems_1 = require('./../items/cServerControlItems');
var cServerControlMaps = (function () {
    function cServerControlMaps(socket) {
        this.socket = socket;
        //to control the map of each player 
        this.arrayPlayersMap = [];
        //lets create a control to every object, in every map
        this.arrayControlPlayers = [];
        this.arrayControlMonsters = [];
        this.arrayControlItems = [];
        this.initialMapName = 'mapPrincipal';
        //lets start the principal map
        this.initMap(this.initialMapName);
    }
    cServerControlMaps.prototype.initMap = function (mapName) {
        //lets create the control componentes of the map
        var controlPlayers = new cControlServerPlayers_1.cServerControlPlayers(this.socket);
        var controlItems = new cServerControlItems_1.cServerControlItems(this.socket);
        var controlMonsters = new cServerControlMonster_1.cServerControlMonster(this.socket, controlPlayers, controlItems);
        controlPlayers.controlMonster = controlMonsters;
        //stored them in the array
        this.arrayControlPlayers[mapName] = controlPlayers;
        this.arrayControlMonsters[mapName] = controlMonsters;
        this.arrayControlItems[mapName] = controlItems;
    };
    //this function get the actual map of a player, and get the controler of that map
    cServerControlMaps.prototype.getControlPlayer = function (idPlayer) {
        var mapName = this.arrayPlayersMap[idPlayer];
        return this.arrayControlPlayers[mapName];
    };
    //this function get the actual map of a player, and get the controler of the items
    cServerControlMaps.prototype.getControlItems = function (idPlayer) {
        var mapName = this.arrayPlayersMap[idPlayer];
        return this.arrayControlItems[mapName];
    };
    cServerControlMaps.prototype.onNewPlayer = function (socketNewPlayer, data) {
        //new player conected, it start in the principal room
        var controlPlayers = this.arrayControlPlayers[this.initialMapName];
        var controlMonsters = this.arrayControlMonsters[this.initialMapName];
        var controlItems = this.arrayControlItems[this.initialMapName];
        controlPlayers.onNewPlayerConected(socketNewPlayer, data);
        controlMonsters.onNewPlayerConected(socketNewPlayer);
        controlItems.onNewPlayerConected(socketNewPlayer);
        this.arrayPlayersMap[socketNewPlayer.id] = this.initialMapName;
    };
    cServerControlMaps.prototype.onPlayerDisconnected = function (socketPlayer) {
        console.log('Player has disconnected: ' + socketPlayer.id);
        var controlPlayers = this.getControlPlayer(socketPlayer.id);
        controlPlayers.onPlayerDisconected(this);
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
