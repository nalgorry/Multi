var cControlSpells = (function () {
    function cControlSpells(controlGame) {
        this.controlGame = controlGame;
        this.allSpells = new cDefinitionSpells(this.controlGame);
        this.createSpells();
        this.iniciateSpellSystem();
    }
    cControlSpells.prototype.spellAnimation = function (actor, data) {
        this.allSpells.arraySpells[data.idSpell].spellAnimation(actor);
    };
    cControlSpells.prototype.otherPlayerClick = function (player) {
        if (this.controlGame.atackMode == true) {
            if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true &&
                this.selSpell.enabledTrowOtherPlayer == true) {
                this.controlGame.controlServer.socket.emit('player click', { idPlayerHit: player.idServer, idSpell: this.selSpell.idSpell });
            }
            this.controlGame.game.canvas.style.cursor = 'default';
        }
    };
    cControlSpells.prototype.thisPlayerClick = function (player) {
        if (this.controlGame.atackMode == true) {
            if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true &&
                this.selSpell.enabledTrowThisPlayer == true) {
                this.controlGame.controlServer.socket.emit('player click', { idPlayerHit: player.idServer, idSpell: this.selSpell.idSpell });
            }
            this.controlGame.game.canvas.style.cursor = 'default';
        }
    };
    cControlSpells.prototype.iniciateSpellSystem = function () {
        //dibujo el marco para el hechizo seleccionado
        this.borderSpell = this.controlGame.game.add.graphics(0, 0);
        this.borderSpell.lineStyle(2, 0xffffff, 1);
        this.borderSpell.fixedToCamera = true;
        this.borderSpell.drawCircle(0, 0, 40);
    };
    cControlSpells.prototype.createSpells = function () {
        var gameWidth = this.controlGame.game.width;
        this.arrayselSpells = new Array();
        //hechizo 1
        var spellOne = this.allSpells.arraySpells[0];
        spellOne.iniciateSpell(new Phaser.Point(gameWidth - 190, 212), 0);
        this.arrayselSpells.push(spellOne);
        spellOne.signalTest.add(this.spellClick, this);
        //hechizo 2
        var spellTwo = this.allSpells.arraySpells[1];
        spellTwo.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48, 212), 1);
        this.arrayselSpells.push(spellTwo);
        spellTwo.signalTest.add(this.spellClick, this);
        //hechizo 3
        var spellThree = this.allSpells.arraySpells[2];
        spellThree.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48 * 2, 212), 2);
        this.arrayselSpells.push(spellThree);
        spellThree.signalTest.add(this.spellClick, this);
        //seleciono el hechioz uno por defecto
        this.selSpell = spellOne;
    };
    cControlSpells.prototype.spellClick = function (sender) {
        this.borderSpell.cameraOffset.x = sender.spellSprite.cameraOffset.x + sender.spellSprite.width / 2;
        this.borderSpell.cameraOffset.y = sender.spellSprite.cameraOffset.y + sender.spellSprite.height / 2;
        this.selSpell = sender;
        this.controlGame.activateAtackMode();
    };
    return cControlSpells;
}());
