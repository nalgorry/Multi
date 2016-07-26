class cControlChat {

    inputTextChat:Fabrique.InputField;
    textChat: Phaser.Text;
    controlServer:cControlServer;

    
    constructor(public controlGame:cControlGame, public controlPlayer:cControlPlayer, public controlOtherPlayers:cControlOtherPlayers) {

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

        var style = { font: "12px Arial", fill: "#ffffff" };
        this.textChat = this.controlGame.game.add.text(-30, -30, this.inputTextChat.value , style);

    }

    public enterPress() {   

        this.textChat.text = this.inputTextChat.value;
        this.controlPlayer.setChatText(this.textChat);

        this.controlServer.onSendChatText(this.inputTextChat.value)

        this.inputTextChat.setText("");

    }

    public chatReceive(data) {
        console.log(data);
        this.controlOtherPlayers.showChat(data)
    }

    
}