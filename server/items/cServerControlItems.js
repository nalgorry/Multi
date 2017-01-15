"use strict";
var cServerItems_1 = require('./cServerItems');
var cServerControlItems = (function () {
    function cServerControlItems(socket) {
        this.socket = socket;
        this.nextIdItems = 0;
        this.arrayItems = [];
        for (var i = 0; i < 30; i++) {
            var newItem = new cServerItems_1.cServerItems(socket, this.nextIdItems, i, 40 + i, 5);
            this.arrayItems[this.nextIdItems] = newItem;
            this.nextIdItems += 1;
        }
    }
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
            delete this.arrayItems[item.itemID];
        }
        else {
            console.log("el item ya fue agarrado");
        }
    };
    return cServerControlItems;
}());
exports.cServerControlItems = cServerControlItems;
