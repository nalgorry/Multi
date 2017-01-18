"use strict";
var cServerItems = (function () {
    function cServerItems(socket, itemID, itemType, tileX, tileY) {
        this.maxNumberItems = 21;
        this.maxNumberEfects = 10;
        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;
        this.arrayItemProperties = [];
        this.defineItemsProperties(1);
        this.emitNewItem(socket);
    }
    cServerItems.prototype.emitNewItem = function (socket) {
        //emito el monstruo, si viene un socket es porque es un jugador nuevo y le mando solo a el los monstruos que ya existen
        var itemData = {
            itemID: this.itemID,
            tileX: this.tileX,
            tileY: this.tileY,
            itemType: this.itemType };
        socket.emit('new item', itemData);
    };
    cServerItems.prototype.defineItemsProperties = function (itemLevel) {
        var numberEfects = this.randomIntFromInterval(1, 3);
        for (var i = 0; i < numberEfects; i++) {
            var itemEfect = this.randomIntFromInterval(0, this.maxNumberEfects);
            var itemEfectValue = this.randomIntFromInterval(1, 25);
            this.arrayItemProperties.push(new cItemProperty(itemEfect, itemEfectValue));
        }
    };
    cServerItems.prototype.youGetItem = function (socket, data) {
        console.log(this.arrayItemProperties);
        var itemData = {
            itemID: this.itemID,
            itemType: this.itemType,
            itemEfects: this.arrayItemProperties
        };
        //le mando al que agarro su item
        socket.emit('you get item', itemData);
        //le mando a todos que el item se agarro
        this.socket.emit('item get', { itemID: this.itemID });
    };
    cServerItems.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return cServerItems;
}());
exports.cServerItems = cServerItems;
var cItemProperty = (function () {
    function cItemProperty(itemEfect, value) {
        this.itemEfect = itemEfect;
        this.value = value;
    }
    return cItemProperty;
}());
