class cItems {

    public itemID:number;
    public itemType:number; //tiene que coincidir con el id del item en el sprite de items
    public itemEquipType:enumItemEquipType; //define si es arma, escudo etc
    public inventoryID; //lugar que ocupa el item en el inventario
    public maxRank; //define el color del item 

    public tileX:number; //si esta en el piso viene aca
    public tileY:number;
    public sprite:Phaser.Sprite;

    public signalItemInventoryClick:Phaser.Signal;
    public signalItemOnFloorClick:Phaser.Signal;
    public signalItemEquiped:Phaser.Signal;
    public signalItemDropToFloor:Phaser.Signal;

    public spriteOriginalPoss:Phaser.Point;

    public arrayInventoryPoss:Phaser.Point[];
    public groupRectangles:Phaser.Group;

    public arrayItemEfects:cItemProperty[];

    public itemEquiped = false;

    private groupDesc:Phaser.Group;

    constructor(public controlGame:cControlGame,itemID:number,itemType:number,maxRank:enumPropRank) {
        this.itemType = itemType;
        this.itemID = itemID;
        this.maxRank = maxRank;

        cItemsDefinitions.defineItem(this);

        this.signalItemInventoryClick = new Phaser.Signal();
        this.signalItemOnFloorClick = new Phaser.Signal();
        this.signalItemEquiped = new Phaser.Signal();
        this.signalItemDropToFloor = new Phaser.Signal();

        //inicio el vector para determinar las propiedades
        this.arrayItemEfects = [];
        
        //inicio el array con todas las posiciones, en el orden que indica el enumItemEquipType
        this.arrayInventoryPoss = [];

        this.arrayInventoryPoss[enumItemEquipType.weapon] = new Phaser.Point(1034,387)
        this.arrayInventoryPoss[enumItemEquipType.boots] = new Phaser.Point(1079,433)
        this.arrayInventoryPoss[enumItemEquipType.helmet] = new Phaser.Point(1079,340)
        this.arrayInventoryPoss[enumItemEquipType.special] = new Phaser.Point(1125,387)
        this.arrayInventoryPoss[enumItemEquipType.armor] = new Phaser.Point(1079,387)

    }

    private createItemSprite() {

        this.sprite = this.controlGame.game.add.sprite(0, 0);
        
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputUp.add(this.floorItemClick,this)

        var rankColorString = this.getRankCircleColor(this.maxRank);
        var rankColor = 0x000000 + parseInt(rankColorString, 16);

        var backCircle = this.controlGame.game.add.graphics(20,20);
        backCircle.beginFill(rankColor);
        backCircle.alpha = 0.3;
        backCircle.drawCircle(0, 0, 40);

        this.sprite.addChild(backCircle);

        var itemSprite = this.controlGame.game.add.sprite(0, 0, 'items', this.itemType);
        
        this.sprite.addChild(itemSprite);
    }

    putItemInTile(tileX:number,tileY:number) {

        this.tileX = tileX;
        this.tileY = tileY;

        this.createItemSprite();

        this.controlGame.depthGroup.add(this.sprite);

        var gridSize = this.controlGame.gridSize;

        this.sprite.x = tileX * gridSize;
        this.sprite.y = tileY * gridSize;

    }

     floorItemClick() {
        this.signalItemOnFloorClick.dispatch(this);
    }

    putItemInInventory(inventoryID:number) {

        var inventoryGridSize:number = 46;
        var tileX:number = 1010 + ( (inventoryID - 1 ) - Math.floor( (inventoryID - 1 ) / 4) * 4 ) * inventoryGridSize;   
        var tileY:number = 509 + Math.floor((inventoryID - 1) / 4) *  inventoryGridSize;

        this.createItemSprite();

        this.sprite.fixedToCamera = true;
        this.sprite.cameraOffset.x = tileX;
        this.sprite.cameraOffset.y = tileY;

        this.sprite.input.enableDrag();
        
        this.sprite.events.onInputDown.add(this.inventoryClick, this);
        this.sprite.events.onDragStart.add(this.onDragStart, this);
        this.sprite.events.onDragStop.add(this.onDragStop, this);
        this.sprite.events.onInputOver.add(this.onInputOver,this);
        this.sprite.events.onInputOut.add(this.onInputOut,this);

        this.spriteOriginalPoss = this.sprite.cameraOffset.clone();
        
        this.inventoryID = inventoryID;


    }

    onInputOver() {

        var bitmapDescItem = this.controlGame.game.add.bitmapData(180, 70);
        bitmapDescItem.ctx.beginPath();
        bitmapDescItem.ctx.rect(0, 0, 180, 70);
        bitmapDescItem.ctx.fillStyle = '#164084';
        bitmapDescItem.ctx.fill();

        this.groupDesc = new Phaser.Group(this.controlGame.game);
        
        var itemDescX = this.sprite.cameraOffset.x - 150 / 2;
        var itemDescY = this.sprite.cameraOffset.y + 40

        //si se pasa del borde, los corrijo
        if(itemDescX + 180 > this.controlGame.game.width - 5 ) {
            itemDescX = this.controlGame.game.width - 185;
        }

        //si se pasa del borde para abajo, subo el cartel
        if(itemDescY + 70 > this.controlGame.game.height - 5 ) {
            itemDescY = this.sprite.cameraOffset.y - 50;
        }


        var itemDesc = this.controlGame.game.add.sprite(itemDescX, itemDescY,bitmapDescItem);
        itemDesc.anchor.setTo(0);
        itemDesc.fixedToCamera = true;
        itemDesc.alpha = 0.8;
        
        this.groupDesc.add(itemDesc);

        //armo el texto con la propiedades del item
        var styleText;
        var i = 0;

        this.arrayItemEfects.forEach(efect => {

            var color = this.getRankColor(efect.itemPropRank);

            styleText = { font: "14px Arial", fill: "#" + color, textalign: "center", fontWeight: 400};

            var text = cItemsDefinitions.defineItemEfectsName(efect);
            var textLife = this.controlGame.game.add.text(itemDescX + 2, itemDescY + 2 + 15 * i, text , styleText);
            textLife.anchor.setTo(0);
            textLife.fixedToCamera = true;
            this.groupDesc.add(textLife);
            i++;
            
        })      
 
    }

    onInputOut() {
        this.groupDesc.destroy();
    }

    getRankCircleColor(rank:enumPropRank):string {
        var color:string;

        if (rank == enumPropRank.normal) {
            color = "000000";
        } else if (rank == enumPropRank.silver) {
            color = "79a9f7";
        } else if (rank == enumPropRank.gold) {
            color = "7A7600";
        } else if (rank == enumPropRank.diamont) {
            color = "e87f7f";
        }

        return color;
    }

    getRankColor(rank:enumPropRank):string {
        var color:string;

        if (rank == enumPropRank.normal) {
            color = "ffffff";
        } else if (rank == enumPropRank.silver) {
            color = "79a9f7";
        } else if (rank == enumPropRank.gold) {
            color = "efd59b";
        } else if (rank == enumPropRank.diamont) {
            color = "e87f7f";
        }

        return color;
    }

    hashCode(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    onDragStart() {

        //dibujo un cuadrado en cada lugar donde va el item
        this.groupRectangles = new Phaser.Group(this.controlGame.game);
        
        for (var num in this.arrayInventoryPoss) {
            var inventoryPoss = this.arrayInventoryPoss[num];

            var rectangle = this.controlGame.game.add.graphics(0,0);

            if (num.toString() == this.itemEquipType.toString()) {
                rectangle.beginFill(0x18770f,0.5); //recuadro verde
            } else {
                rectangle.beginFill(0xb52113,0.5); //recuadro rojo
            }

            rectangle.fixedToCamera = true;
            rectangle.drawRect(0, 0, 40,40);
            rectangle.cameraOffset.copyFrom(inventoryPoss);

            this.groupRectangles.add(rectangle);
    
        }

        //elimino la desc
        this.groupDesc.destroy();

    }

    onDragStop() {     

        this.groupRectangles.destroy();
         
        var destination = this.arrayInventoryPoss[this.itemEquipType];
        var mousePos = this.controlGame.game.input.activePointer.position;

        //controlo primero si el item es un item equipable  
        if (destination == undefined) {
            this.sprite.cameraOffset.copyFrom(this.spriteOriginalPoss);
            return
        }
        
        var gridSize = 40;

        if (mousePos.x > destination.x && mousePos.x < destination.x + gridSize && 
            mousePos.y > destination.y && mousePos.y < destination.y + gridSize) {
            //equipo correctamente el item 
            this.signalItemEquiped.dispatch(this);
            
            this.sprite.cameraOffset.copyFrom(destination);
            this.spriteOriginalPoss = destination.clone();
            this.itemEquiped = true;
            

        } else if (mousePos.x < this.controlGame.game.width - 200) 
        {//item tirado al piso
            this.signalItemDropToFloor.dispatch(this); 
        }
        else { //la solto en un lugar no valido 
            this.sprite.cameraOffset.copyFrom(this.spriteOriginalPoss);
        }
        
    }

    public inventoryClick() {
        
        this.signalItemInventoryClick.dispatch(this);

    }

    equipItem(itemID:number)    {

    }

    getItemFromTile() {
     
    }


    public deleteItem() {
        this.sprite.destroy(true);
    }



}