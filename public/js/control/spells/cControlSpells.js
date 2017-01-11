var enumSelectedActor;
(function (enumSelectedActor) {
    enumSelectedActor[enumSelectedActor["nothing"] = 0] = "nothing";
    enumSelectedActor[enumSelectedActor["monster"] = 1] = "monster";
    enumSelectedActor[enumSelectedActor["thisPlayer"] = 2] = "thisPlayer";
    enumSelectedActor[enumSelectedActor["otherPlayer"] = 3] = "otherPlayer";
})(enumSelectedActor || (enumSelectedActor = {}));
var cControlSpells = (function () {
    function cControlSpells(controlGame) {
        this.controlGame = controlGame;
        this.allSpells = new cDefinitionSpells(this.controlGame);
        this.createSpells();
        this.iniciateSpellSystem();
    }
    cControlSpells.prototype.getSelActorID = function () {
        var id;
        if (this.selActorType == enumSelectedActor.monster) {
            var monster = this.selActor;
            id = monster.idMonster;
        }
        else if (this.selActorType == enumSelectedActor.otherPlayer) {
            var otherPlayer = this.selActor;
            id = otherPlayer.idServer;
        }
        else if (this.selActorType == enumSelectedActor.thisPlayer) {
            var thisPlayer = this.selActor;
            id = thisPlayer.idServer;
        }
        return id;
    };
    cControlSpells.prototype.releaseFocus = function (idActor) {
        if (idActor == this.getSelActorID()) {
            this.selActor = undefined;
            this.selActorType = enumSelectedActor.nothing;
        }
    };
    cControlSpells.prototype.spellAnimation = function (sprite, data) {
        this.allSpells.arraySpells[data.idSpell].spellAnimation(sprite);
    };
    cControlSpells.prototype.monsterClick = function (monster) {
        this.selActorType = enumSelectedActor.monster;
        this.selActor = monster;
        this.drawFocusCircle(monster.monsterSprite);
        this.checkAtackMode();
    };
    cControlSpells.prototype.otherPlayerClick = function (player) {
        this.selActorType = enumSelectedActor.otherPlayer;
        this.selActor = player;
        this.drawFocusCircle(player.playerSprite);
        this.checkAtackMode();
    };
    cControlSpells.prototype.thisPlayerClick = function (player) {
        this.selActorType = enumSelectedActor.thisPlayer;
        this.selActor = player;
        this.drawFocusCircle(player.playerSprite, true);
        this.checkAtackMode();
    };
    cControlSpells.prototype.checkAtackMode = function () {
        if (this.controlGame.atackMode == true) {
            this.spellClick(this.selSpell);
        }
    };
    cControlSpells.prototype.drawFocusCircle = function (sprite, colorGreen) {
        if (colorGreen === void 0) { colorGreen = false; }
        if (this.circleFocus != undefined) {
            this.circleFocus.destroy();
        }
        this.circleFocus = this.controlGame.game.add.graphics(0, 0);
        //dibujo el rectangulo
        if (colorGreen == true) {
            this.circleFocus.beginFill(0x18770f, 0.3); //recuadro verde
        }
        else {
            this.circleFocus.beginFill(0xb52113, 0.3); //recuadro rojo
        }
        //de aca saco las dimensionese de los sprites
        var spriteObject = sprite;
        this.circleFocus.drawRect(-14, 2, 28, 5);
        this.circleFocus.pivot.x = 0.5;
        sprite.addChild(this.circleFocus);
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
        //me fijo si es posible utilizar el hechizo seleccionado, segun las caracteristicas del mismo y el personaje enfocado
        if (this.selSpell.isSpellOnCoolDown == false) {
            //me fijo si es posible tirar el hechizo en el pj selecionado
            var spellAllowed = false;
            if (this.selActorType == enumSelectedActor.monster && sender.enabledTrowOnMonster == true) {
                spellAllowed = true;
            }
            else if (this.selActorType == enumSelectedActor.otherPlayer && sender.enabledTrowOtherPlayer == true) {
                spellAllowed = true;
            }
            else if (this.selActorType == enumSelectedActor.thisPlayer && sender.enabledTrowThisPlayer == true) {
                spellAllowed = true;
            }
            if (spellAllowed == true) {
                if (this.checkSpellDistance() == true) {
                    if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {
                        //mando al server laa accion 
                        if (this.selActorType == enumSelectedActor.monster) {
                            var monster = this.selActor;
                            this.controlGame.controlServer.socket.emit('monster click', {
                                idPlayer: this.controlGame.controlPlayer.idServer,
                                idMonster: monster.idMonster,
                                idSpell: this.selSpell.idSpell
                            });
                        }
                        else if (this.selActorType == enumSelectedActor.otherPlayer) {
                            var otherplayer = this.selActor;
                            this.controlGame.controlServer.socket.emit('player click', {
                                idPlayerHit: otherplayer.idServer,
                                idSpell: this.selSpell.idSpell
                            });
                        }
                        else if (this.selActorType == enumSelectedActor.thisPlayer) {
                            var thisPlayer = this.selActor;
                            this.controlGame.controlServer.socket.emit('player click', {
                                idPlayerHit: thisPlayer.idServer,
                                idSpell: this.selSpell.idSpell
                            });
                        }
                        this.selSpell.spellColdDown();
                    }
                }
            }
            else {
                this.controlGame.activateAtackMode();
            }
        }
    };
    cControlSpells.prototype.checkSpellDistance = function () {
        var isAllowed;
        var actorTileX;
        var actorTileY;
        if (this.selActorType == enumSelectedActor.monster) {
            var monster = this.selActor;
            actorTileX = monster.tileX;
            actorTileY = monster.tileY;
        }
        else if (this.selActorType == enumSelectedActor.otherPlayer) {
            var otherPlayer = this.selActor;
            actorTileX = otherPlayer.tileX;
            actorTileY = otherPlayer.tileY;
        }
        else if (this.selActorType == enumSelectedActor.thisPlayer) {
            var thisPlayer = this.selActor;
            actorTileX = thisPlayer.tileX;
            actorTileY = thisPlayer.tileY;
        }
        if (Math.abs(actorTileX - this.controlGame.controlPlayer.tileX) <= 10 &&
            Math.abs(actorTileY - this.controlGame.controlPlayer.tileY) <= 10) {
            isAllowed = true;
        }
        else {
            isAllowed = false;
            this.controlGame.controlConsole.newMessage(enumMessage.information, "The Character is too far away to Atack.");
        }
        return isAllowed;
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
        this.selSpell = spell;
        spell.spellSelected();
    };
    return cControlSpells;
}());
