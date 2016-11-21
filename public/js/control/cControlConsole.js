var cControlConsole = (function () {
    function cControlConsole(controlGame) {
        this.controlGame = controlGame;
        var consoleWidth = 300;
        var consoleHeight = 120;
        //creo el cuadrado donde va a ir la consola
        this.consoleGraph = this.controlGame.game.add.graphics(5, controlGame.game.height - consoleHeight - 5);
        this.consoleGraph.beginFill(0xedeeef);
        this.consoleGraph.fixedToCamera = true;
        this.consoleGraph.alpha = 0.55;
        this.consoleGraph.drawRect(0, 0, consoleWidth, consoleHeight);
        //inicio el array de mensajes
        this.arrayMessages = new Array();
        this.arrayPhaserTexts = new Array();
        this.newMessage(enumMessage.information, "Bienvenido a FocusOnline v 0.1 ALPHA");
    }
    cControlConsole.prototype.newMessage = function (type, message) {
        var newMessage = new cConsoleMessage(type, message);
        this.arrayMessages.unshift(newMessage);
        this.showMessagesInConsole();
    };
    cControlConsole.prototype.showMessagesInConsole = function () {
        var maxMessages = 7;
        var messageHeight = 16;
        this.arrayPhaserTexts.forEach(function (element) {
            element.destroy();
        });
        var messagesToShow = Math.min(maxMessages, this.arrayMessages.length);
        for (var i = 0; i < messagesToShow; i++) {
            var newMessage = this.arrayMessages[i];
            var newText = this.controlGame.game.add.text(10, this.controlGame.game.height - 25 - i * messageHeight, newMessage.message, newMessage.getStyle());
            newText.fixedToCamera = true;
            this.arrayPhaserTexts.push(newText);
        }
    };
    return cControlConsole;
}());
var cConsoleMessage = (function () {
    function cConsoleMessage(type, message) {
        this.type = type;
        this.message = message;
    }
    cConsoleMessage.prototype.getStyle = function () {
        var style;
        if (this.type == enumMessage.youHit) {
            style = { font: "15px Arial", fill: "#64936e" };
        }
        else if (this.type == enumMessage.youKill) {
            style = { font: "15px Arial", fill: "#806ad8" };
        }
        else if (this.type == enumMessage.information) {
            style = { font: "15px Arial", fill: "#3e76d1" };
        }
        else if (this.type == enumMessage.youWereHit) {
            style = { font: "15px Arial", fill: "#ff0044" };
        }
        else if (this.type == enumMessage.youDie) {
            style = { font: "15px Arial", fill: "#ff0044" };
        }
        else {
            style = { font: "15px Arial", fill: "#3e76d1" };
        }
        return style;
    };
    return cConsoleMessage;
}());
var enumMessage;
(function (enumMessage) {
    enumMessage[enumMessage["all"] = 0] = "all";
    enumMessage[enumMessage["youHit"] = 1] = "youHit";
    enumMessage[enumMessage["youWereHit"] = 2] = "youWereHit";
    enumMessage[enumMessage["youKill"] = 3] = "youKill";
    enumMessage[enumMessage["youDie"] = 4] = "youDie";
    enumMessage[enumMessage["information"] = 5] = "information";
})(enumMessage || (enumMessage = {}));
