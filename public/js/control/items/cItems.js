var cItems = (function () {
    function cItems(controlGame, itemID, itemType) {
        this.controlGame = controlGame;
        this.itemType = itemType;
        this.itemID = itemID;
        cItemsDefinitions.defineItem(this);
        this.signalItemInventoryClick = new Phaser.Signal();
        this.signalItemOnFloorClick = new Phaser.Signal();
        this.signalItemEquiped = new Phaser.Signal();
        //inicio el array con todas las posiciones, en el orden que indica el enumItemEquipType
        this.arrayInventoryPoss = [];
        this.arrayInventoryPoss[1 /* weapon */] = new Phaser.Point(1034, 387);
        this.arrayInventoryPoss[2 /* boots */] = new Phaser.Point(1079, 433);
        this.arrayInventoryPoss[4 /* helmet */] = new Phaser.Point(1079, 340);
        this.arrayInventoryPoss[3 /* special */] = new Phaser.Point(1125, 387);
        this.arrayInventoryPoss[5 /* armor */] = new Phaser.Point(1079, 387);
    }
    cItems.prototype.putItemInTile = function (tileX, tileY) {
        this.tileX = tileX;
        this.tileY = tileY;
        var gridSize = this.controlGame.gridSize;
        this.sprite = this.controlGame.game.add.sprite(tileX * gridSize, tileY * gridSize, 'items', this.itemType);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputUp.add(this.floorItemClick, this);
    };
    cItems.prototype.floorItemClick = function () {
        this.signalItemOnFloorClick.dispatch(this);
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
        //dibujo un cuadrado en cada lugar donde va el item
        this.groupRectangles = new Phaser.Group(this.controlGame.game);
        for (var num in this.arrayInventoryPoss) {
            var inventoryPoss = this.arrayInventoryPoss[num];
            var rectangle = this.controlGame.game.add.graphics(0, 0);
            if (num.toString() == this.itemEquipType.toString()) {
                rectangle.beginFill(0x18770f, 0.5); //recuadro verde
            }
            else {
                rectangle.beginFill(0xb52113, 0.5); //recuadro rojo
            }
            rectangle.fixedToCamera = true;
            rectangle.drawRect(0, 0, 40, 40);
            rectangle.cameraOffset.copyFrom(inventoryPoss);
            this.groupRectangles.add(rectangle);
        }
    };
    cItems.prototype.onDragStop = function () {
        this.groupRectangles.destroy();
        var destination = this.arrayInventoryPoss[this.itemEquipType];
        var mousePos = this.controlGame.game.input.activePointer.position;
        var gridSize = 40;
        if (mousePos.x > destination.x && mousePos.x < destination.x + gridSize &&
            mousePos.y > destination.y && mousePos.y < destination.y + gridSize) {
            //equipo correctamente el item 
            this.signalItemEquiped.dispatch(this);
            this.sprite.cameraOffset.copyFrom(destination);
            this.spriteOriginalPoss = destination.clone();
        }
        else {
            this.sprite.cameraOffset.copyFrom(this.spriteOriginalPoss);
        }
    };
    cItems.prototype.inventoryClick = function () {
        this.signalItemInventoryClick.dispatch(this);
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
