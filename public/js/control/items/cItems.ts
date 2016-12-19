class cItems {

    public itemID:number;
    public itemType:number; //tiene que coincidir con el id del item en el sprite de items
    public itemEquipType:number;

    public tileX:number; //si esta en el piso viene aca
    public tileY:number;
    public tileInventory:number; //si esta en el inventorio viene aca
    public sprite:Phaser.Sprite;

    public signalItemClick:Phaser.Signal;

    public spriteOriginalPoss:Phaser.Point;


    constructor(public controlGame:cControlGame,itemID:number,itemType:number) {
        this.itemType = itemType;
        this.itemID = itemID;

        cItemsDefinitions.defineItem(this);

        this.signalItemClick = new Phaser.Signal();

        
    }

    getItemEquipTypeDestination():Phaser.Point {
        var point:Phaser.Point

        switch (this.itemEquipType) {
            case enumItemEquipType.weapon:
                point = new Phaser.Point(1033,386)
                break;
        
            default:
                point = new Phaser.Point(0,0)
                break;
        }


        return point;
    }

    putItemInTile(tileX:number,tileY:number) {

        this.tileX = tileX;
        this.tileY = tileY;

        var gridSize = this.controlGame.gridSize;
        this.sprite = this.controlGame.game.add.sprite(tileX * gridSize,tileY * gridSize,'items',this.itemType);

    }

    putItemInInventory(inventoryID:number) {

        var inventoryGridSize:number = 46;
        var tileX:number = 1010 + ( (inventoryID - 1 ) - Math.floor( (inventoryID - 1 ) / 4) * 4 ) * inventoryGridSize;   
        var tileY:number = 509 + Math.floor((inventoryID - 1) / 4) *  inventoryGridSize;

        this.sprite = this.controlGame.game.add.sprite(tileX, tileY, 'items', this.itemType);
        this.sprite.fixedToCamera = true;

        this.sprite.inputEnabled = true;
        this.sprite.input.enableDrag();
        this.sprite.events.onInputDown.add(this.inventoryClick, this);
        this.sprite.events.onDragStart.add(this.onDragStart, this);
        this.sprite.events.onDragStop.add(this.onDragStop, this);
        this.spriteOriginalPoss = this.sprite.position.clone();
        
        this.tileInventory = inventoryID;


    }

    onDragStart() {

    }

    onDragStop() {     
         
        var destination = this.getItemEquipTypeDestination();
        var mousePos = this.controlGame.game.input.activePointer.position
        
        var gridSize = 40;

        if (mousePos.x > destination.x && mousePos.x < destination.x + gridSize) {
            this.sprite.cameraOffset.copyFrom(destination);
            this.spriteOriginalPoss = destination.clone();
        } else {
            this.sprite.cameraOffset.copyFrom(this.spriteOriginalPoss);
        }
        
    }

    public inventoryClick() {
        
        this.signalItemClick.dispatch(this);

    }

    equipItem(itemID:number)    {

    }

    getItemFromTile() {
     
    }


    public deleteItem() {
        this.sprite.destroy(true);
    }



}