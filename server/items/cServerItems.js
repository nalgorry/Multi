"use strict";
var cServerItemDef_1 = require('./cServerItemDef');
var cServerItems = (function () {
    function cServerItems(socket, itemID, itemType, itemLevel, tileX, tileY) {
        this.onFloor = true;
        this.maxNumberItems = 21;
        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;
        this.itemLevel = itemLevel;
        this.arrayItemProperties = [];
        this.defineItemsProperties(this.itemLevel);
        this.emitNewItem(this.socket);
    }
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
