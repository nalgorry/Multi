class cControlConsole {

    consoleGraph:Phaser.Graphics;
    public arrayMessages: Array<cConsoleMessage>;
    public arrayPhaserTexts: Array<Phaser.Text>;
  
    constructor(public controlGame: cControlGame) {

        var consoleWidth:number = 300;
        var consoleHeight:number = 120;

        //creo el cuadrado donde va a ir la consola
        this.consoleGraph = this.controlGame.game.add.graphics(5,controlGame.game.height - consoleHeight- 48);
        this.consoleGraph.beginFill(0xedeeef);
        this.consoleGraph.fixedToCamera = true;
        this.consoleGraph.alpha = 0.55;
        this.consoleGraph.drawRect(0, 0, consoleWidth,consoleHeight);

        //inicio el array de mensajes
        this.arrayMessages = new Array<cConsoleMessage>();
        this.arrayPhaserTexts = new Array<Phaser.Text>();

        this.newMessage(enumMessage.information,"Bienvenido a FocusOnline v 0.1 ALPHA")

    }

    newMessage(type:enumMessage,message:string) {

        var newMessage = new cConsoleMessage(type,message);

        this.arrayMessages.unshift(newMessage);

        this.showMessagesInConsole();

    }

    showMessagesInConsole() {
        var maxMessages:number = 7;
        var messageHeight:number = 16;

        this.arrayPhaserTexts.forEach(element => {
           element.destroy();
        });

        var messagesToShow = Math.min(maxMessages,this.arrayMessages.length)

        for (var i = 0; i < messagesToShow ; i++) {

            var newMessage:cConsoleMessage = this.arrayMessages[i];

            var newText:Phaser.Text = this.controlGame.game.add.text(10, this.controlGame.game.height - 70 - i * messageHeight ,
                newMessage.message,newMessage.getStyle());
            newText.fixedToCamera = true;

            this.arrayPhaserTexts.push(newText);

        }

    }


}

class cConsoleMessage {

    public newText:Phaser.Text;

    constructor (public type:enumMessage, public message:string) {

    }

    getStyle() {

        var style
        if (this.type == enumMessage.youHit) {
            style = { font: "15px Arial", fill: "#64936e"};
        } else if (this.type == enumMessage.youKill) {
            style = { font: "15px Arial", fill: "#806ad8"};
        } else if (this.type == enumMessage.information) {
            style = { font: "15px Arial", fill: "#3e76d1"};
        } else if (this.type == enumMessage.youWereHit){
            style = { font: "15px Arial", fill: "#ff0044"};
        } else if (this.type == enumMessage.youDie) {
            style = { font: "15px Arial", fill: "#ff0044"};
        }
        else {
            style = { font: "15px Arial", fill: "#3e76d1"};
        }
    
    return style
    }

}

enum enumMessage {
        all = 0,
        youHit = 1,
        youWereHit = 2,
        youKill = 3,
        youDie = 4,
        information = 5,
    }