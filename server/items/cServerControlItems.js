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
    }
    //crea los items iniciales para cada jugador
    cServerControlItems.prototype.createInitialItems = function (socket) {
        for (var i = 0; i < 3; i++) {
            var itemId = "i" + this.nextIdItems;
            this.createNewItem(i, 10, 47 + i, 59, false, socket);
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
                itemDrop.emitNewItem(this.socket);
            }
            else {
                itemDrop.emitNewItem(socket);
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
        var newItem = new cServerItems_1.cServerItems(this.socket, itemId, 40 /* gold */, gold, tileX, tileY, true);
        this.arrayItems[itemId] = newItem;
        this.nextIdItems += 1;
    };
    cServerControlItems.prototype.createNewItem = function (itemType, itemLevel, tileX, tileY, itemPublic, socket) {
        if (socket === void 0) { socket = this.socket; }
        var itemId = "i" + this.nextIdItems;
        var newItem = new cServerItems_1.cServerItems(socket, itemId, itemType, itemLevel, tileX, tileY, itemPublic);
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
        for (var numItem in this.arrayItems) {
            var item = this.arrayItems[numItem];
            //controlo que el item sea para todos los jugadores.
            if (item.isPublic == true) {
                item.emitNewItem(socket);
            }
        }
        this.createInitialItems(socket);
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
