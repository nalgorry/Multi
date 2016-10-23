var cControlChat = (function () {
    function cControlChat(controlGame, controlPlayer, controlOtherPlayers) {
        this.controlGame = controlGame;
        this.controlPlayer = controlPlayer;
        this.controlOtherPlayers = controlOtherPlayers;
        this.isActive = false;
        this.inputTextChat = this.controlGame.game.add.inputField(10, 90, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 984,
            height: 23,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder: 'Chat',
            borderRadius: 0,
        });
        this.inputTextChat.focusOutOnEnter = true;
        this.inputTextChat.blockInput = true;
        this.inputTextChat.fixedToCamera = true;
        this.inputTextChat.cameraOffset.setTo(0, 635);
        Fabrique.Plugins.InputField.onPressEnter.add(this.enterPress, this);
        //registro el evento del teclado
        var enter = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enter.onUp.add(this.enterPress, this);
    }
    cControlChat.prototype.enterPress = function () {
        if (this.isActive) {
            var text = this.inputTextChat.value;
            //me fijo si mando un chat comun, o si uso algun texto para setear alguna variable del juego
            if (text.search("/name ") != -1) {
                var name = text.substring(6, text.length);
                this.controlServer.onSendChatText('you change', { name: name });
                this.controlPlayer.setNameText(name);
            }
            else {
                this.controlServer.onSendChatText('Chat Send', { text: text });
                this.controlPlayer.setChatText(this.inputTextChat.value);
            }
            this.inputTextChat.setText("");
            this.isActive = false;
        }
        else {
            this.inputTextChat.startFocus();
            this.isActive = true;
        }
    };
    cControlChat.prototype.chatReceive = function (data) {
        this.controlOtherPlayers.showChat(data);
    };
    return cControlChat;
}());
