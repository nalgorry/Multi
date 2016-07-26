var cControlServer = (function () {
    function cControlServer(controlPlayer, controlGame, controlOtherPlayers, controlChat) {
        this.controlPlayer = controlPlayer;
        this.controlGame = controlGame;
        this.controlOtherPlayers = controlOtherPlayers;
        this.controlChat = controlChat;
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
    }
    //chat text
    cControlServer.prototype.onSendChatText = function (text) {
        this.socket.emit('Chat Send', { text: text });
    };
    cControlServer.prototype.onYouReceiveChat = function (data) {
        this.controlChat.chatReceive(data);
    };
    // Socket connected
    cControlServer.prototype.onSocketConnected = function () {
        console.log('Connected to socket server');
        this.controlPlayer.idServer = "/#" + this.socket.id;
        this.socket.emit('new player', { x: this.controlGame.layer.getTileX(this.controlPlayer.playerSprite.x), y: this.controlGame.layer.getTileY(this.controlPlayer.playerSprite.y) });
    };
    // Socket disconnected
    cControlServer.prototype.onSocketDisconnect = function () {
        console.log('Disconnected from socket server');
    };
    // New player
    cControlServer.prototype.onNewPlayer = function (data) {
        console.log('New player connected:', data.id);
        this.controlOtherPlayers.addPlayer(data);
    };
    cControlServer.prototype.onYouHit = function (data) {
        this.controlPlayer.youHit(data);
    };
    // Move player
    cControlServer.prototype.onMovePlayer = function (data) {
        this.controlOtherPlayers.movePlayer(data);
    };
    // Player git by other player
    cControlServer.prototype.onPlayerHit = function (data) {
        console.log(data.damage);
        if (data.id === this.controlPlayer.idServer) {
            this.controlPlayer.playerHit(data);
        }
    };
    // Someone has die
    cControlServer.prototype.onPlayerDie = function (data) {
        if (data.id === this.controlPlayer.idServer) {
            this.controlPlayer.youDie(data);
        }
    };
    cControlServer.prototype.onYouKill = function (data) {
    };
    // Remove player, cuando un jugador se desconecta
    cControlServer.prototype.onRemovePlayer = function (data) {
        this.controlOtherPlayers.removePlayer(data);
    };
    return cControlServer;
}());
