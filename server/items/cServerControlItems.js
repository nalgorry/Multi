"use strict";
var cServerItems_1 = require('./cServerItems');
var cServerItemDef_1 = require('./cServerItemDef');
var cServerControlItems = (function () {
    function cServerControlItems(socket, room) {
        this.socket = socket;
        this.room = room;
        this.nextIdItems = 0;
        this.arrayItems = [];
        //defino todos los objetos
        cServerItemDef_1.cServerItemDef.defineItems();
    }
    //crea los items iniciales para cada jugador
    cServerControlItems.prototype.createInitialItems = function (socket) {
        for (var i = 0; i < 3; i++) {
            var itemId = "i" + this.nextIdItems;
            this.createNewItem(i, 10, 33 + i, 31, false, socket);
        }
    };
    cServerControlItems.prototype.dropItemToFloor = function (socket, data) {
        var itemDrop = this.arrayItems[data.itemId];
        if (itemDrop != undefined) {
            itemDrop.tileX = data.tileX;
            itemDrop.tileY = data.tileY;
            itemDrop.onFloor = true;
            //si el item es publico todos lo ven el piso, sino solo el jugador que lo tiro
            if (itemDrop.isPublic == true) {
                this.emitNewItem(itemDrop);
            }
            else {
                this.emitNewItemtoPlayer(itemDrop, socket);
            }
        }
        else {
            console.log("itemNoEncontrado");
        }
    };
    cServerControlItems.prototype.createNewRandomItem = function (itemLevel, tileX, tileY) {
        //defino si va a tirar un item u oro
        var random = this.randomIntFromInterval(1, 10);
        if (random > 4) {
            var itemType = cServerItemDef_1.cServerItemDef.getRandomItemDef();
            if (itemType != undefined) {
                this.createNewItem(itemType, itemLevel, tileX, tileY, true);
            }
            else {
                console.log("item no definido correctamente");
            }
        }
        else {
            this.createGoldItem(tileX, tileY);
        }
    };
    cServerControlItems.prototype.createGoldItem = function (tileX, tileY) {
        var itemId = "i" + this.nextIdItems;
        var gold = this.randomIntFromInterval(1, 100);
        var newItem = new cServerItems_1.cServerItems(itemId, 40 /* gold */, gold, tileX, tileY, true);
        this.emitNewItem(newItem);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;
    };
    cServerControlItems.prototype.createNewItem = function (itemType, itemLevel, tileX, tileY, itemPublic, socket) {
        if (socket === void 0) { socket = this.socket; }
        var itemId = "i" + this.nextIdItems;
        var newItem = new cServerItems_1.cServerItems(itemId, itemType, itemLevel, tileX, tileY, itemPublic);
        this.emitNewItem(newItem);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;
        //agrego una señal para definir cuando el item se borra del juego
        newItem.signalItemDelete.add(this.itemDeleted, this);
    };
    //this emit the item to all the players
    cServerControlItems.prototype.emitNewItem = function (item) {
        if (item.onFloor == true) {
            var itemData = {
                itemID: item.itemID,
                tileX: item.tileX,
                tileY: item.tileY,
                itemType: item.itemType,
                maxRank: item.maxRank };
            this.socket.in(this.room).emit('new item', itemData);
        }
    };
    //this emit the item only to a player
    cServerControlItems.prototype.emitNewItemtoPlayer = function (item, socket) {
        if (item.onFloor == true) {
            var itemData = {
                itemID: item.itemID,
                tileX: item.tileX,
                tileY: item.tileY,
                itemType: item.itemType,
                maxRank: item.maxRank };
            socket.emit('new item', itemData);
        }
    };
    cServerControlItems.prototype.itemDeleted = function (itemID) {
        this.socket.emit('delete item', { itemID: itemID });
        delete this.arrayItems[itemID];
    };
    cServerControlItems.prototype.onNewPlayerConected = function (socket) {
        //le mando al nuevo cliente todos los moustros del mapa
        for (var numItem in this.arrayItems) {
            var item = this.arrayItems[numItem];
            //controlo que el item sea para todos los jugadores.
            if (item.isPublic == true) {
                this.emitNewItem(item);
            }
        }
        this.createInitialItems(socket);
    };
    cServerControlItems.prototype.getItemById = function (id) {
        return this.arrayItems[id];
    };
    cServerControlItems.prototype.youGetItem = function (socketPlayer, data) {
        var item = this.getItemById(data.itemID);
        if (item != undefined) {
            if (item.onFloor == true) {
                var itemData = {};
                if (item.itemType == 40 /* gold */) {
                    itemData = {
                        itemID: item.itemID,
                        tileX: item.tileX,
                        tileY: item.tileY,
                        itemType: item.itemType,
                        totalGold: item.itemLevel,
                    };
                }
                else {
                    itemData = {
                        itemID: item.itemID,
                        itemType: item.itemType,
                        itemEfects: item.arrayItemProperties,
                        maxRank: item.maxRank,
                    };
                }
                //le mando al que agarro su item
                socketPlayer.emit('you get item', itemData);
                //le mando a todos que el item se agarro
                this.socket.in(this.room).emit('item get', { itemID: item.itemID });
                item.onFloor = false;
            }
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
