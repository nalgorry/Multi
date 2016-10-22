class cControlChat {

    isActive:boolean = false;
    inputTextChat:Fabrique.InputField;

    controlServer:cControlServer;

    
    constructor(public controlGame:cControlGame, public controlPlayer:cControlPlayer, public controlOtherPlayers:cControlOtherPlayers) {

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

        Fabrique.Plugins.InputField.onPressEnter.add(this.enterPress,this);

        //registro el evento del teclado
        var enter = this.controlGame.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enter.onUp.add(this.enterPress,this);

    }

    public enterPress() {  

        if (this.isActive) {
            var isChat = this.controlServer.onSendChatText(this.inputTextChat.value);
            
            //muestro el texto del chat si es chat unicamente
            if (isChat == true) { 
                this.controlPlayer.setChatText(this.inputTextChat.value); 
            }

            this.inputTextChat.setText("");
            this.isActive = false; 
        } else {
            this.inputTextChat.startFocus();
            this.isActive = true;
        }
        
    }

    public chatReceive(data) {
        this.controlOtherPlayers.showChat(data)
    }

    
}