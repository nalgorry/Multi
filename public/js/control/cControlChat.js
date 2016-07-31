var cControlChat = (function () {
    function cControlChat(controlGame, controlPlayer, controlOtherPlayers) {
        this.controlGame = controlGame;
        this.controlPlayer = controlPlayer;
        this.controlOtherPlayers = controlOtherPlayers;
        this.inputTextChat = this.controlGame.game.add.inputField(10, 90, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 350,
            height: 22,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder: 'Chat',
            borderRadius: 0,
        });
        this.inputTextChat.focusOutOnEnter = false;
        this.inputTextChat.blockInput = false;
        this.inputTextChat.fixedToCamera = true;
        this.inputTextChat.cameraOffset.setTo(100, 560);
        //registro el evento del teclado
        var enter = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enter.onDown.add(this.enterPress, this);
    }
    cControlChat.prototype.enterPress = function () {
        this.controlServer.onSendChatText(this.inputTextChat.value);
        this.controlPlayer.setChatText(this.inputTextChat.value);
        this.inputTextChat.setText("");
    };
    cControlChat.prototype.chatReceive = function (data) {
        console.log(data);
        this.controlOtherPlayers.showChat(data);
    };
    return cControlChat;
}());
