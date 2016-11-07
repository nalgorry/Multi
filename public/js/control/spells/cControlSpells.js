var cControlSpells = (function () {
    function cControlSpells(controlGame) {
        this.controlGame = controlGame;
        this.allSpells = new cDefinitionSpells(this.controlGame);
        this.createSpells();
        this.iniciateSpellSystem();
    }
    cControlSpells.prototype.spellAnimation = function (sprite, data) {
        this.allSpells.arraySpells[data.idSpell].spellAnimation(sprite);
    };
    cControlSpells.prototype.monsterClick = function (monster) {
        if (this.controlGame.atackMode == true) {
            if (this.selSpell.enabledTrowOtherPlayer == true && this.selSpell.isSpellOnCoolDown == false) {
                if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {
                    this.controlGame.controlServer.socket.emit('monster click', {
                        idPlayer: this.controlGame.controlPlayer.idServer,
                        idMonster: monster.idMonster,
                        idSpell: this.selSpell.idSpell
                    });
                    this.selSpell.spellColdDown();
                }
            }
            this.controlGame.game.canvas.style.cursor = 'default';
        }
    };
    cControlSpells.prototype.otherPlayerClick = function (player) {
        if (this.controlGame.atackMode == true) {
            if (this.selSpell.enabledTrowOtherPlayer == true && this.selSpell.isSpellOnCoolDown == false) {
                if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {
                    this.controlGame.controlServer.socket.emit('player click', { idPlayerHit: player.idServer, idSpell: this.selSpell.idSpell });
                    this.selSpell.spellColdDown();
                }
            }
            this.controlGame.game.canvas.style.cursor = 'default';
        }
    };
    cControlSpells.prototype.thisPlayerClick = function (player) {
        if (this.controlGame.atackMode == true) {
            if (this.selSpell.enabledTrowThisPlayer == true && this.selSpell.isSpellOnCoolDown == false) {
                if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {
                    this.controlGame.controlServer.socket.emit('player click', { idPlayerHit: player.idServer, idSpell: this.selSpell.idSpell });
                    this.selSpell.spellColdDown();
                }
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
        var newSpell = this.allSpells.arraySpells[3];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48 * 0, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //seleciono el hechizo uno por defecto
        this.selSpell = newSpell;
        //hechizo 2
        var newSpell = this.allSpells.arraySpells[4];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48 * 1, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 3
        var newSpell = this.allSpells.arraySpells[5];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48 * 2, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 4
        var newSpell = this.allSpells.arraySpells[6];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48 * 3, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
    };
    cControlSpells.prototype.spellClick = function (sender) {
        this.borderSpell.cameraOffset.x = sender.spellSprite.cameraOffset.x + sender.spellSprite.width / 2;
        this.borderSpell.cameraOffset.y = sender.spellSprite.cameraOffset.y + sender.spellSprite.height / 2;
        this.selSpell = sender;
        this.controlGame.activateAtackMode();
    };
    cControlSpells.prototype.spellSelectKeyboard = function (sender) {
        //selecciono el hechizo segun la tecla que toco
        if (sender.keyCode == Phaser.Keyboard.ONE) {
            var spell = this.arrayselSpells[0];
        }
        else if (sender.keyCode == Phaser.Keyboard.TWO) {
            var spell = this.arrayselSpells[1];
        }
        else if (sender.keyCode == Phaser.Keyboard.THREE) {
            var spell = this.arrayselSpells[2];
        }
        else if (sender.keyCode == Phaser.Keyboard.FOUR) {
            var spell = this.arrayselSpells[3];
        }
        this.borderSpell.cameraOffset.x = spell.spellSprite.cameraOffset.x + spell.spellSprite.width / 2;
        this.borderSpell.cameraOffset.y = spell.spellSprite.cameraOffset.y + spell.spellSprite.height / 2;
        this.selSpell = spell;
        this.controlGame.activateAtackMode();
    };
    return cControlSpells;
}());
