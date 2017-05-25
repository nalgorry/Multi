"use strict";
var cServerControlMonster_1 = require('./../cServerControlMonster');
var cControlServerPlayers_1 = require('./../cControlServerPlayers');
var cServerControlItems_1 = require('./../items/cServerControlItems');
var cServerControlMaps = (function () {
    function cServerControlMaps(socket) {
        this.socket = socket;
        //lets create a control to every object, in every map
        this.arrayControlPlayers = [];
        this.arrayControlMonsters = [];
        this.arrayControlItems = [];
        //lets start the principal map
        this.initMap('mapPrincipal');
        console.log(this.arrayControlItems['mapPrincipal']);
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
        console.log("che si entra");
    };
    return cServerControlMaps;
}());
exports.cServerControlMaps = cServerControlMaps;
