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
        this.socket.on('you die', cControlServer.prototype.onPlayerDie.bind(this));
        this.socket.on('you kill', cControlServer.prototype.onYouKill.bind(this));
        this.socket.on('Chat Receive', cControlServer.prototype.onYouReceiveChat.bind(this));
        this.socket.on('power throw', cControlServer.prototype.onPowerThrow.bind(this));
        this.socket.on('player change', cControlServer.prototype.onPlayerChange.bind(this));
        //monsters controls
        this.socket.on('new Monster', cControlServer.prototype.onNewMonster.bind(this));
        this.socket.on('monster hit', cControlServer.prototype.onMonsterHit.bind(this));
        this.socket.on('monster die', cControlServer.prototype.onMonsterDie.bind(this));
        this.socket.on('you hit monster', cControlServer.prototype.onMosterWereHit.bind(this));
        this.socket.on('monster move', cControlServer.prototype.onMonsterMove.bind(this));
        //items controls
        this.socket.on('new item', cControlServer.prototype.onNewItem.bind(this));
        this.socket.on('you get item', cControlServer.prototype.onYouGetItem.bind(this));
        this.socket.on('item get', cControlServer.prototype.onItemGet.bind(this));
        //control de portalese 
        this.socket.on('you enter portal', cControlServer.prototype.youEnterPortal.bind(this));
    }
    cControlServer.prototype.onItemGet = function (data) {
        this.controlPlayer.controlItems.itemGet(data);
    };
    cControlServer.prototype.onYouGetItem = function (data) {
        this.controlPlayer.controlItems.youGetItem(data);
    };
    cControlServer.prototype.onNewItem = function (data) {
        this.controlGame.controlPlayer.controlItems.newItem(data);
    };
    cControlServer.prototype.youEnterPortal = function (data) {
        this.controlGame.controlPlayer.controlPortals.youEnterPortal(data);
    };
    cControlServer.prototype.onMonsterMove = function (data) {
        this.controlGame.controlMonsters.monsterMove(data);
    };
    cControlServer.prototype.onMosterWereHit = function (data) {
        this.controlGame.controlMonsters.youHitMonster(data);
    };
    cControlServer.prototype.onMonsterDie = function (data) {
        this.controlGame.controlMonsters.monsterDie(data);
    };
    cControlServer.prototype.onMonsterHit = function (data) {
        this.controlGame.controlMonsters.monsterHit(data);
    };
    cControlServer.prototype.onNewMonster = function (data) {
        this.controlGame.controlMonsters.newMonster(data);
    };
    cControlServer.prototype.onPlayerChange = function (data) {
        if (data.name != null) {
            this.controlOtherPlayers.playerById(data.id).setNameText(data.name);
        }
    };
    cControlServer.prototype.onPowerThrow = function (data) {
    };
    //chat text
    cControlServer.prototype.onSendChatText = function (type, argsToSend) {
        this.controlGame.controlServer.socket.emit(type, argsToSend);
    };
    cControlServer.prototype.onYouReceiveChat = function (data) {
        this.controlChat.chatReceive(data);
    };
    // Socket connected
    cControlServer.prototype.onSocketConnected = function () {
        console.log('Connected to socket server');
        this.controlPlayer.idServer = "/#" + this.socket.id;
        this.socket.emit('new player', { x: this.controlGame.layer.getTileX(this.controlPlayer.playerSprite.x),
            y: this.controlGame.layer.getTileY(this.controlPlayer.playerSprite.y),
            name: 'Invitado' });
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
        if (data.id === this.controlPlayer.idServer) {
            this.controlPlayer.playerHit(data);
        }
        else {
            this.controlPlayer.youHit(data);
            this.controlOtherPlayers.playerHit(data);
        }
    };
    // Move player
    cControlServer.prototype.onMovePlayer = function (data) {
        this.controlOtherPlayers.movePlayer(data);
    };
    // Player git by other player
    cControlServer.prototype.onPlayerHit = function (data) {
        if (data.id === this.controlPlayer.idServer) {
            this.controlPlayer.playerHit(data);
        }
        else {
            this.controlOtherPlayers.playerHit(data);
        }
    };
    // Te hicieron pure, veamos quien fue
    cControlServer.prototype.onPlayerDie = function (data) {
        console.log("entra");
        this.controlGame.controlConsole.newMessage(enumMessage.youDie, "Has Muerto. Te Mató " + data.name);
    };
    cControlServer.prototype.onYouKill = function (data) {
        this.controlPlayer.youKill(data);
    };
    // Remove player, cuando un jugador se desconecta
    cControlServer.prototype.onRemovePlayer = function (data) {
        this.controlOtherPlayers.removePlayer(data);
    };
    return cControlServer;
}());
