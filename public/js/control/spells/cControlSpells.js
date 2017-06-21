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
        this.autoFocusUsed = false;
        this.selActorType = enumSelectedActor.nothing;
        this.hitTextPosition = 0;
        this.maxRangeX = 12;
        this.maxRangeY = 7;
        this.allSpells = new cDefinitionSpells(this.controlGame);
        this.iniciatenumSpellsystem();
        this.createnumSpells();
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
    };
    cControlSpells.prototype.reduceLifeBar = function (lifePercRemaining) {
        var newWidth = this.rectFocus.width * lifePercRemaining;
        this.controlGame.game.add.tween(this.rectFocus).to({ width: newWidth }, 250, Phaser.Easing.Linear.None, true, 0, 0);
    };
    cControlSpells.prototype.monsterClick = function (monster) {
        this.selActorType = enumSelectedActor.monster;
        this.selActor = monster;
        this.autoFocusUsed = false;
        this.drawFocusRect(monster.monsterSprite);
    };
    cControlSpells.prototype.otherPlayerClick = function (player) {
        this.selActorType = enumSelectedActor.otherPlayer;
        this.selActor = player;
        this.autoFocusUsed = false;
        this.drawFocusRect(player.playerSprite, true);
    };
    cControlSpells.prototype.thisPlayerClick = function (player) {
        this.selActorType = enumSelectedActor.thisPlayer;
        this.selActor = player;
        this.autoFocusUsed = false;
        this.drawFocusRect(player.playerSprite, true);
    };
    cControlSpells.prototype.drawFocusRect = function (sprite, colorGreen) {
        if (colorGreen === void 0) { colorGreen = false; }
        if (this.rectFocus != undefined) {
            this.rectFocus.destroy();
        }
        this.rectFocus = this.controlGame.game.add.graphics(0, 0);
        //dibujo el rectangulo
        var barWidth;
        if (colorGreen == true) {
            this.rectFocus.beginFill(0x18770f, 0.3); //recuadro verde
            //set the player variables
            barWidth = 40;
            var xRectangle = -20;
        }
        else {
            this.rectFocus.beginFill(0xb52113, 0.3); //recuadro rojo
            //set the monster variables
            barWidth = 80;
            var xRectangle = -Math.abs(sprite.children[0].width / 2) - this.controlGame.gridSize / 2 + (Math.abs(sprite.children[0].width) - barWidth) / 2;
        }
        //de aca saco las dimensionese de los sprites
        this.rectFocus.drawRect(xRectangle, 0, barWidth, 5);
        this.rectFocus.pivot.x = 0.5;
        sprite.addChild(this.rectFocus);
    };
    cControlSpells.prototype.iniciatenumSpellsystem = function () {
        //dibujo el marco para el hechizo seleccionado
        this.borderSpell = this.controlGame.game.add.graphics(0, 0);
        this.borderSpell.lineStyle(2, 0xffffff, 1);
        this.controlGame.spriteInterfaz.addChild(this.borderSpell);
        this.borderSpell.drawCircle(0, 0, 50);
    };
    cControlSpells.prototype.createnumSpells = function () {
        var gameWidth = this.controlGame.game.width;
        this.arrayselSpells = new Array();
        //hechizo 1
        var newSpell = this.allSpells.arraySpells[1 /* BasicAtack */];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 0, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //seleciono el hechizo uno por defecto
        this.selSpell = newSpell;
        this.borderSpell.x = newSpell.spellSprite.x + newSpell.spellSprite.width / 2;
        this.borderSpell.y = newSpell.spellSprite.y + newSpell.spellSprite.height / 2;
        //hechizo 2
        var newSpell = this.allSpells.arraySpells[2 /* CriticalBall */];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 1, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 3
        var newSpell = this.allSpells.arraySpells[6 /* LightingStorm */];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 2, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 4
        var newSpell = this.allSpells.arraySpells[4 /* ProtectField */];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 0, 265), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 5
        var newSpell = this.allSpells.arraySpells[5 /* HealHand */];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 1, 265), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 6
        var newSpell = this.allSpells.arraySpells[7 /* SelfExplosion */];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 2, 265), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
    };
    cControlSpells.prototype.autoFocusSystem = function (spell) {
        //me fijo algunas caracteristicas especiales de algunos hechizos
        if (this.selSpell.idSpell == 7 /* SelfExplosion */) {
            this.thisPlayerClick(this.controlGame.controlPlayer);
        }
        //me fijo si selecciono algun pj por defecto 
        var spellAllowed = false;
        if (this.selActorType == enumSelectedActor.monster && spell.enabledTrowOnMonster == true) {
            spellAllowed = true;
        }
        else if (this.selActorType == enumSelectedActor.otherPlayer && spell.enabledTrowOtherPlayer == true) {
            //var selPlayer = <cOtherPlayer>this.selActor;
            //lets check if we can atack in this map
            if (this.controlGame.pvspAllowed == true) {
                spellAllowed = true;
            }
            else {
                spellAllowed = false;
                this.controlGame.controlPlayer.showMessage("Can´t atack here");
            }
        }
        else if (this.selActorType == enumSelectedActor.thisPlayer && spell.enabledTrowThisPlayer == true) {
            spellAllowed = true;
        }
        //si no selecciono a nadie, intento hacer el auto focus
        //si permite seleccionar monstruos, busco el moustro mas cercano
        if (this.selActorType != enumSelectedActor.monster && spell.enabledTrowOnMonster == true) {
            var closestMonster = this.controlGame.controlMonsters.getClosestMonsterInRange(this.maxRangeX, this.maxRangeY);
            if (closestMonster != undefined) {
                this.selActorType = enumSelectedActor.monster;
                this.selActor = closestMonster;
                this.drawFocusRect(closestMonster.monsterSprite);
                this.autoFocusUsed = true;
                spellAllowed = true;
            }
            else {
                this.controlGame.controlPlayer.showMessage("No Monster In Range");
            }
        }
        //si es un hechizo que pueda tirarse sobre mi, me selecciono 
        if (spellAllowed == false && spell.enabledTrowThisPlayer == true) {
            this.selActorType = enumSelectedActor.thisPlayer;
            this.selActor = this.controlGame.controlPlayer;
            this.drawFocusRect(this.controlGame.controlPlayer.playerSprite, true);
            spellAllowed = true;
        }
        return spellAllowed;
    };
    cControlSpells.prototype.spellClick = function (sender) {
        this.borderSpell.x = sender.spellSprite.x + sender.spellSprite.width / 2;
        this.borderSpell.y = sender.spellSprite.y + sender.spellSprite.height / 2;
        this.selSpell = sender;
        //me fijo si es posible utilizar el hechizo seleccionado, segun las caracteristicas del mismo y el personaje enfocado
        if (this.selSpell.isSpellOnCoolDown == false) {
            //me fijo si es posible tirar el hechizo en el pj selecionado
            var spellAllowed = this.autoFocusSystem(sender);
            var spellInRange = this.checkSpellDistance();
            //if autofocus was used, and the distance is too far, we allow the sistem to change targets
            console.log(this.autoFocusUsed);
            if (spellInRange == false && this.autoFocusUsed == true) {
                this.selActorType = enumSelectedActor.nothing;
                var spellAllowed = this.autoFocusSystem(sender);
                console.log("intenta esto");
            }
            if (spellAllowed == true) {
                if (this.checkSpellDistance() == true) {
                    if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {
                        //mando al server laa accion (esto se puede unificar mas TODO)
                        if (this.selActorType == enumSelectedActor.monster) {
                            var monster = this.selActor;
                            this.controlGame.controlServer.socket.emit('monster click', {
                                idMonster: monster.idMonster,
                                idSpell: this.selSpell.idSpell,
                            });
                        }
                        else if (this.selActorType == enumSelectedActor.otherPlayer) {
                            var otherplayer = this.selActor;
                            this.controlGame.controlServer.socket.emit('player click', {
                                idPlayerHit: otherplayer.idServer,
                                idSpell: this.selSpell.idSpell,
                            });
                        }
                        else if (this.selActorType == enumSelectedActor.thisPlayer) {
                            var thisPlayer = this.selActor;
                            this.controlGame.controlServer.socket.emit('player click', {
                                idPlayerHit: thisPlayer.idServer,
                                idSpell: this.selSpell.idSpell,
                            });
                        }
                        this.selSpell.spellColdDown();
                    }
                }
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
        if (Math.abs(actorTileX - this.controlGame.controlPlayer.tileX) <= this.maxRangeX &&
            Math.abs(actorTileY - this.controlGame.controlPlayer.tileY) <= this.maxRangeY) {
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
    cControlSpells.prototype.onHit = function (data, fromSprite, toSprite, rayColor) {
        //texto con el daño
        if (data.damage != 0) {
            if (data.damage > 0) {
                this.styleHit = { font: "18px Arial", fill: "#750303", fontWeight: 900 };
            }
            else {
                this.styleHit = { font: "18px Arial", fill: "#113d01", fontWeight: 900 };
                data.damage = -data.damage;
            }
            ;
            //para cambiar la posicion del daño si te golpean muy rapido
            if (this.hitTextPosition == -30) {
                this.hitTextPosition = 10;
            }
            else {
                this.hitTextPosition = -30;
            }
            var completeText = this.controlGame.game.add.sprite(this.hitTextPosition, -40);
            //texto que se muestra
            var hitText = this.controlGame.game.add.text(0, 0, data.damage, this.styleHit);
            //hago un recuadro blanco abajo del texto
            var rectangleBack = this.controlGame.game.add.bitmapData(hitText.width, 20);
            rectangleBack.ctx.beginPath();
            rectangleBack.ctx.rect(0, 0, hitText.width, 20);
            rectangleBack.ctx.fillStyle = '#ffffff';
            rectangleBack.ctx.fill();
            var textBack = this.controlGame.game.add.sprite(0, 0, rectangleBack);
            textBack.alpha = 0.6;
            completeText.addChild(textBack);
            completeText.addChild(hitText);
            toSprite.addChild(completeText);
            var tweenText = this.controlGame.game.add.tween(completeText).to({ y: '-40' }, 1000, Phaser.Easing.Cubic.Out, true);
            tweenText.onComplete.add(this.removeTweenText, completeText);
        }
        //animacion de un sprite 
        this.allSpells.arraySpells[data.idSpell].spellAnimation(toSprite);
        //creo una mega rayo super mortal 
        if (fromSprite != null) {
            new cControlRay(this.controlGame, fromSprite, toSprite, rayColor);
        }
    };
    cControlSpells.prototype.removeTweenText = function (sprite) {
        sprite.destroy();
    };
    return cControlSpells;
}());
