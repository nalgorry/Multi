"use strict";
var cServerItemDef_1 = require('./cServerItemDef');
var Signal_1 = require('../Signal');
var cServerItems = (function () {
    function cServerItems(socket, itemID, itemType, itemLevel, tileX, tileY) {
        var _this = this;
        this.onFloor = true;
        this.itemDeleteTime = 20000;
        this.maxNumberItems = 21;
        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;
        this.itemLevel = itemLevel;
        this.signalItemDelete = new Signal_1.Signal();
        this.arrayItemProperties = [];
        this.defineItemsProperties(this.itemLevel);
        this.emitNewItem(this.socket);
        var itemTime = setTimeout(function () { return _this.deleteItem(); }, this.itemDeleteTime);
    }
    //si pasa un tiempo sin que nadie levante el item lo borro
    cServerItems.prototype.deleteItem = function () {
        var _this = this;
        if (this.onFloor == true) {
            this.socket.emit('delete item', { itemID: this.itemID });
            this.onFloor = false;
            this.signalItemDelete.dispatch(this.itemID);
        }
        else {
            var itemTime = setTimeout(function () { return _this.deleteItem(); }, this.itemDeleteTime);
        }
    };
    cServerItems.prototype.emitNewItem = function (socket) {
        //emito el item si esta en el piso 
        if (this.onFloor == true) {
            var itemData = {
                itemID: this.itemID,
                tileX: this.tileX,
                tileY: this.tileY,
                itemType: this.itemType,
                maxRank: this.maxRank };
            socket.emit('new item', itemData);
        }
    };
    cServerItems.prototype.defineItemsProperties = function (itemLevel) {
        this.arrayItemProperties = cServerItemDef_1.cServerItemDef.defineProperties(itemLevel, this.itemType);
        this.maxRank = cServerItemDef_1.cServerItemDef.getItemMaxRank(this.arrayItemProperties);
    };
    cServerItems.prototype.youGetItem = function (socket, data) {
        var itemData = {
            itemID: this.itemID,
            itemType: this.itemType,
            itemEfects: this.arrayItemProperties,
            maxRank: this.maxRank
        };
        //le mando al que agarro su item
        socket.emit('you get item', itemData);
        //le mando a todos que el item se agarro
        this.socket.emit('item get', { itemID: this.itemID });
        this.onFloor = false;
    };
    cServerItems.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return cServerItems;
}());
exports.cServerItems = cServerItems;
var cItemProperty = (function () {
    function cItemProperty(itemEfect, value, propRank) {
        this.itemEfect = itemEfect;
        this.value = value;
        this.propRank = propRank;
    }
    return cItemProperty;
}());
exports.cItemProperty = cItemProperty;
