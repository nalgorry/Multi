"use strict";
var cServerItems = (function () {
    function cServerItems(socket, itemID, itemType, tileX, tileY) {
        this.itemID = itemID;
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.socket = socket;
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
    cServerItems.prototype.youGetItem = function (socket, data) {
        //le mando al que agarro su item
        socket.emit('you get item', { itemID: this.itemID, itemType: this.itemType });
        //le mando a todos que el item se agarro
        this.socket.emit('item get', { itemID: this.itemID });
    };
    return cServerItems;
}());
exports.cServerItems = cServerItems;
