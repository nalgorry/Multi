var cItems = (function () {
    function cItems(controlGame, itemID, itemType) {
        this.controlGame = controlGame;
        this.itemType = itemType;
        this.itemID = itemID;
        cItemsDefinitions.defineItem(this);
        this.signalItemClick = new Phaser.Signal();
    }
    cItems.prototype.getItemEquipTypeDestination = function () {
        var point;
        switch (this.itemEquipType) {
            case 1 /* weapon */:
                point = new Phaser.Point(1033, 386);
                break;
            default:
                point = new Phaser.Point(0, 0);
                break;
        }
        return point;
    };
    cItems.prototype.putItemInTile = function (tileX, tileY) {
        this.tileX = tileX;
        this.tileY = tileY;
        var gridSize = this.controlGame.gridSize;
        this.sprite = this.controlGame.game.add.sprite(tileX * gridSize, tileY * gridSize, 'items', this.itemType);
    };
    cItems.prototype.putItemInInventory = function (inventoryID) {
        var inventoryGridSize = 46;
        var tileX = 1010 + ((inventoryID - 1) - Math.floor((inventoryID - 1) / 4) * 4) * inventoryGridSize;
        var tileY = 509 + Math.floor((inventoryID - 1) / 4) * inventoryGridSize;
        this.sprite = this.controlGame.game.add.sprite(tileX, tileY, 'items', this.itemType);
        this.sprite.fixedToCamera = true;
        this.sprite.inputEnabled = true;
        this.sprite.input.enableDrag();
        this.sprite.events.onInputDown.add(this.inventoryClick, this);
        this.sprite.events.onDragStart.add(this.onDragStart, this);
        this.sprite.events.onDragStop.add(this.onDragStop, this);
        this.spriteOriginalPoss = this.sprite.position.clone();
        this.tileInventory = inventoryID;
    };
    cItems.prototype.onDragStart = function () {
    };
    cItems.prototype.onDragStop = function () {
        var destination = this.getItemEquipTypeDestination();
        var mousePos = this.controlGame.game.input.activePointer.position;
        var gridSize = 40;
        if (mousePos.x > destination.x && mousePos.x < destination.x + gridSize) {
            this.sprite.cameraOffset.copyFrom(destination);
            this.spriteOriginalPoss = destination.clone();
        }
        else {
            this.sprite.cameraOffset.copyFrom(this.spriteOriginalPoss);
        }
    };
    cItems.prototype.inventoryClick = function () {
        this.signalItemClick.dispatch(this);
    };
    cItems.prototype.equipItem = function (itemID) {
    };
    cItems.prototype.getItemFromTile = function () {
    };
    cItems.prototype.deleteItem = function () {
        this.sprite.destroy(true);
    };
    return cItems;
}());
