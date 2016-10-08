class cControlConsole {

    consoleGraph:Phaser.Graphics;

  
    constructor(public controlGame: cControlGame) {

        var consoleWidth:number = 300;
        var consoleHeight:number = 120;

        //creo el cuadrado donde va a ir la consola
        this.consoleGraph = this.controlGame.game.add.graphics(5,controlGame.game.height - consoleHeight- 45);
        this.consoleGraph.beginFill(0x141417);
        this.consoleGraph.fixedToCamera = true;
        this.consoleGraph.alpha = 0.25;
        this.consoleGraph.drawRect(0, 0, consoleWidth,consoleHeight);

        console.log("hola");

    }


}