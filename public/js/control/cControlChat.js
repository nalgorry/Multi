var cControlChat = (function () {
    function cControlChat(controlGame, controlPlayer, controlOtherPlayers) {
        this.controlGame = controlGame;
        this.controlPlayer = controlPlayer;
        this.controlOtherPlayers = controlOtherPlayers;
        this.isActive = false;
        this.isEnabled = true; //to control if we want to see the chat or not
        if (this.isEnabled == false) {
            return;
        }
        this.inputTextChat = this.controlGame.game.add.inputField(10, 90, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 984 - 315,
            height: 23,
            padding: 8,
            borderWidth: 0,
            borderColor: '#ffffff',
            placeHolder: 'Chat: Press enter to chat',
            borderRadius: 0,
            zoom: false,
        });
        this.inputTextChat.focusOutOnEnter = true;
        this.inputTextChat.blockInput = true;
        this.controlGame.spriteInterfaz.addChild(this.inputTextChat);
        this.inputTextChat.position.set(-690, 625);
        Fabrique.Plugins.InputField.onPressEnter.add(this.enterPress, this);
        Fabrique.Plugins.InputField.onChatFocus.add(this.chatFocus, this);
        //registro el evento del teclado
        var enter = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enter.onUp.add(this.enterPress, this);
    }
    cControlChat.prototype.chatFocus = function () {
        this.isActive = true;
    };
    cControlChat.prototype.enterPress = function () {
        if (this.isEnabled == false) {
            return;
        }
        if (this.isActive) {
            var text = this.inputTextChat.value;
            //me fijo si mando un chat comun, o si uso algun texto para setear alguna variable del juego
            if (text.toUpperCase().search("/NAME ") != -1) {
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
        if (this.isEnabled == false) {
            return;
        }
        this.controlOtherPlayers.showChat(data);
    };
    return cControlChat;
}());
