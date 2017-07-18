"use strict";
var cServerItemDef_1 = require('./cServerItemDef');
var Signal_1 = require('../Signal');
var cServerItems = (function () {
    function cServerItems() {
        this.onFloor = true;
        this.isPublic = true;
        this.itemDeleteTime = 200000;
        this.maxNumberItems = 21;
        this.signalItemDelete = new Signal_1.Signal();
        this.arrayItemProperties = [];
    }
    cServerItems.prototype.defineItem = function (itemType, itemLevel, tileX, tileY, isPublic) {
        this.itemType = itemType;
        this.tileX = tileX;
        this.tileY = tileY;
        this.itemLevel = itemLevel;
        this.isPublic = isPublic;
        if (itemType != 40 /* gold */) {
            this.defineItemsProperties(this.itemLevel);
        }
    };
    cServerItems.prototype.defineId = function (itemId) {
        var _this = this;
        this.itemID = itemId;
        //when the id is set it start to count the life time of this object in the map.
        var itemTime = setTimeout(function () { return _this.deleteItem(); }, this.itemDeleteTime);
    };
    //si pasa un tiempo sin que nadie levante el item lo borro
    cServerItems.prototype.deleteItem = function () {
        var _this = this;
        if (this.onFloor == true) {
            this.onFloor = false;
            this.signalItemDelete.dispatch(this.itemID);
        }
        else {
            var itemTime = setTimeout(function () { return _this.deleteItem(); }, this.itemDeleteTime);
        }
    };
    cServerItems.prototype.defineItemsProperties = function (itemLevel) {
        this.arrayItemProperties = cServerItemDef_1.cServerItemDef.defineProperties(itemLevel, this.itemType);
        this.maxRank = cServerItemDef_1.cServerItemDef.getItemMaxRank(this.arrayItemProperties);
    };
    cServerItems.prototype.youGetItem = function (socket, data) {
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
