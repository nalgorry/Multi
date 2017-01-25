"use strict";
var cServerItems_1 = require('./cServerItems');
var cServerControlItems = (function () {
    function cServerControlItems(socket) {
        this.socket = socket;
        this.nextIdItems = 0;
        this.arrayItems = [];
        for (var i = 0; i < 15; i++) {
            var itemId = "i" + this.nextIdItems;
            var newItem = new cServerItems_1.cServerItems(socket, itemId, i, 40 + i, 5);
            this.arrayItems[itemId] = newItem;
            this.nextIdItems += 1;
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
    cServerControlItems.prototype.createNewItem = function (itemType, tileX, tileY) {
        var itemId = "i" + this.nextIdItems;
        var newItem = new cServerItems_1.cServerItems(this.socket, itemId, itemType, tileX, tileY);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;
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
    return cServerControlItems;
}());
exports.cServerControlItems = cServerControlItems;
