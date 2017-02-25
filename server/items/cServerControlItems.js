"use strict";
var cServerItems_1 = require('./cServerItems');
var cServerItemDef_1 = require('./cServerItemDef');
var cServerControlItems = (function () {
    function cServerControlItems(socket) {
        this.socket = socket;
        this.nextIdItems = 0;
        this.arrayItems = [];
        //defino todos los objetos
        cServerItemDef_1.cServerItemDef.defineItems();
        for (var i = 0; i < 1; i++) {
            var itemId = "i" + this.nextIdItems;
            this.createNewItem(i, 10, 44 + i, 90);
        }
    }
    cServerControlItems.prototype.dropItemToFloor = function (data) {
        var itemDrop = this.arrayItems[data.itemId];
        if (itemDrop != undefined) {
            itemDrop.tileX = data.tileX;
            itemDrop.tileY = data.tileY;
            itemDrop.onFloor = true;
            itemDrop.emitNewItem(this.socket);
        }
        else {
            console.log("itemNoEncontrado");
        }
    };
    cServerControlItems.prototype.createNewRandomItem = function (itemLevel, tileX, tileY) {
        var itemType = cServerItemDef_1.cServerItemDef.getRandomItemDef();
        if (itemType != undefined) {
            this.createNewItem(itemType, itemLevel, tileX, tileY);
        }
        else {
            console.log("item no definido correctamente");
        }
    };
    cServerControlItems.prototype.createNewItem = function (itemType, itemLevel, tileX, tileY) {
        var itemId = "i" + this.nextIdItems;
        var newItem = new cServerItems_1.cServerItems(this.socket, itemId, itemType, itemLevel, tileX, tileY);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;
        //agrego una señal para definir cuando el item se borra del juego
        newItem.signalItemDelete.add(this.itemDeleted, this);
    };
    cServerControlItems.prototype.itemDeleted = function (itemID) {
        delete this.arrayItems[itemID];
    };
    cServerControlItems.prototype.onNewPlayerConected = function (socket) {
        //le mando al nuevo cliente todos los moustros del mapa
        for (var item in this.arrayItems) {
            this.arrayItems[item].emitNewItem(socket);
        }
    };
    cServerControlItems.prototype.getItemById = function (id) {
        return this.arrayItems[id];
    };
    cServerControlItems.prototype.youGetItem = function (socket, data) {
        var item = this.getItemById(data.itemID);
        if (item != undefined) {
            item.youGetItem(socket, data);
        }
        else {
            console.log("el item ya fue agarrado");
        }
    };
    cServerControlItems.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return cServerControlItems;
}());
exports.cServerControlItems = cServerControlItems;
