class cControlServer {
    
    public socket:SocketIOClient.Socket; // Socket connection

        constructor(public controlPlayer: cControlPlayer,public controlGame: cControlGame,
                    public controlOtherPlayers: cControlOtherPlayers, public controlChat: cControlChat) {

        //para hacerlo multiplayer :)
        this.socket = io.connect();

        // Socket connection successful
        this.socket.on('connect', cControlServer.prototype.onSocketConnected.bind(this));

        // Socket disconnection
        this.socket.on('disconnect', cControlServer.prototype.onSocketDisconnect.bind(this));

        // New player message received
        this.socket.on('new player', cControlServer.prototype.onNewPlayer.bind(this));

        // Player move message received
        this.socket.on('move player', cControlServer.prototype.onMovePlayer.bind(this));

        // Player removed message received
        this.socket.on('remove player', cControlServer.prototype.onRemovePlayer.bind(this));

        this.socket.on('player hit', cControlServer.prototype.onPlayerHit.bind(this));
        this.socket.on('you hit', cControlServer.prototype.onYouHit.bind(this));

        this.socket.on('player die', cControlServer.prototype.onPlayerDie.bind(this));
        this.socket.on('you kill', cControlServer.prototype.onYouKill.bind(this));

        this.socket.on('Chat Receive', cControlServer.prototype.onYouReceiveChat.bind(this));
        this.socket.on('power throw', cControlServer.prototype.onPowerThrow.bind(this));
        
        
        
        }

    public onPowerThrow(data) {
        this.controlGame.PowerTrow(data);
    }

    //chat text
    public onSendChatText(text:string) {

        this.socket.emit('Chat Send', { text: text });

    }

    public onYouReceiveChat(data) {

        this.controlChat.chatReceive(data);

    }

    // Socket connected
    public onSocketConnected()  {
        
        console.log('Connected to socket server');

        this.controlPlayer.idServer = "/#" + this.socket.id;
        this.socket.emit('new player', { x: this.controlGame.layer.getTileX(this.controlPlayer.playerSprite.x), y: this.controlGame.layer.getTileY(this.controlPlayer.playerSprite.y) });

    }

    // Socket disconnected
    onSocketDisconnect () {
        console.log('Disconnected from socket server');
    }

    // New player
    onNewPlayer (data) {
        
        console.log('New player connected:', data.id);
        this.controlOtherPlayers.addPlayer(data);

    }

    onYouHit (data) {

        this.controlPlayer.youHit(data)
        this.controlOtherPlayers.playerHit(data);
    }

    // Move player
    onMovePlayer (data) {

        this.controlOtherPlayers.movePlayer(data);

    }

     // Player git by other player
    onPlayerHit (data) {

        console.log (data.damage);
        if (data.id === this.controlPlayer.idServer) {
            this.controlPlayer.playerHit(data);
        } else {
            this.controlOtherPlayers.playerHit(data);
        }

    }

    // Someone has die
    onPlayerDie (data) {

        if (data.id === this.controlPlayer.idServer) {
            //this.controlPlayer.youDie(data) 
        }

    }

    onYouKill (data) {
        
    }

    // Remove player, cuando un jugador se desconecta
    onRemovePlayer (data) {

        this.controlOtherPlayers.removePlayer(data)

    }





}