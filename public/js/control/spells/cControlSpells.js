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
        this.hitTextPosition = 0;
        this.maxRangeX = 12;
        this.maxRangeY = 7;
        this.allSpells = new cDefinitionSpells(this.controlGame);
        this.createnumSpells();
        this.iniciatenumSpellsystem();
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
    cControlSpells.prototype.makeRay = function (spriteFrom, spriteTo, color) {
        var from;
        var to;
        from = new Phaser.Point(spriteFrom.x, spriteFrom.y - 40);
        to = new Phaser.Point(spriteTo.x, spriteTo.y - 40);
        var graphics = this.controlGame.game.add.graphics(0, 0);
        graphics.lineStyle(2, color, 1);
        graphics.moveTo(from.x, from.y);
        var maxLenght = 5;
        var distance = from.distance(to);
        var numberOfLines = Math.floor(distance / maxLenght);
        var lastX = from.x;
        var lastY = from.y;
        var randomFactor = 3;
        var fixX = (to.x - from.x) / numberOfLines;
        var fixY = (to.y - from.y) / numberOfLines;
        for (var i = 0; i < numberOfLines; i++) {
            var randX = this.controlGame.game.rnd.integerInRange(-randomFactor, randomFactor);
            var randY = this.controlGame.game.rnd.integerInRange(-randomFactor, randomFactor);
            lastX += fixX + randX;
            lastY += fixY + randY;
            graphics.lineTo(lastX, lastY);
        }
        var buletAnimation = this.controlGame.game.add.tween(graphics).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
        buletAnimation.onComplete.add(this.destroyBulet, this, null, graphics);
    };
    cControlSpells.prototype.destroyBulet = function (bulet, tween) {
        bulet.destroy();
    };
    cControlSpells.prototype.monsterClick = function (monster) {
        this.selActorType = enumSelectedActor.monster;
        this.selActor = monster;
        this.drawFocusRect(monster.monsterSprite);
    };
    cControlSpells.prototype.otherPlayerClick = function (player) {
        this.selActorType = enumSelectedActor.otherPlayer;
        this.selActor = player;
        this.drawFocusRect(player.playerSprite, true);
    };
    cControlSpells.prototype.thisPlayerClick = function (player) {
        this.selActorType = enumSelectedActor.thisPlayer;
        this.selActor = player;
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
        this.borderSpell.fixedToCamera = true;
        this.borderSpell.drawCircle(0, 0, 50);
    };
    cControlSpells.prototype.createnumSpells = function () {
        var gameWidth = this.controlGame.game.width;
        this.arrayselSpells = new Array();
        //hechizo 1
        var newSpell = this.allSpells.arraySpells[1 /* BasicAtack */];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 0, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //seleciono el hechizo uno por defecto
        this.selSpell = newSpell;
        //hechizo 2
        var newSpell = this.allSpells.arraySpells[2 /* CriticalBall */];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 1, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 3
        var newSpell = this.allSpells.arraySpells[6 /* LightingStorm */];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 2, 205), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 4
        var newSpell = this.allSpells.arraySpells[4 /* ProtectField */];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 0, 265), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 5
        var newSpell = this.allSpells.arraySpells[5 /* HealHand */];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 1, 265), 2);
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick, this);
        //hechizo 6
        var newSpell = this.allSpells.arraySpells[7 /* SelfExplosion */];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 2, 265), 2);
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
            //me fijo si no estoy tratando de atacar en la ciudad
            var selPlayer = this.selActor;
            if (selPlayer.tileX >= 27 && selPlayer.tileY >= 58) {
                spellAllowed = false;
                this.controlGame.controlConsole.newMessage(enumMessage.information, "You cant atack a player in the city");
            }
            else if (this.controlGame.controlPlayer.tileX >= 27 && this.controlGame.controlPlayer.tileY >= 58) {
                spellAllowed = false;
                this.controlGame.controlConsole.newMessage(enumMessage.information, "You cant atack a player if you are in the city");
            }
            else {
                spellAllowed = true;
            }
        }
        else if (this.selActorType == enumSelectedActor.thisPlayer && spell.enabledTrowThisPlayer == true) {
            spellAllowed = true;
        }
        //si no selecciono a nadie, intento hacer el auto focus
        //si permite seleccionar monstruos, busco el moustro mas cercano
        if (spellAllowed == false && spell.enabledTrowOnMonster == true) {
            var closestMonster = this.controlGame.controlMonsters.getClosestMonsterInRange(this.maxRangeX, this.maxRangeY);
            if (closestMonster != undefined) {
                this.selActorType = enumSelectedActor.monster;
                this.selActor = closestMonster;
                this.drawFocusRect(closestMonster.monsterSprite);
                spellAllowed = true;
            }
        }
        //si es un hechizo que pueda tirarse sobre mi, me selecciono 
        if (spellAllowed == false && spell.enabledTrowThisPlayer == true) {
            this.selActorType = enumSelectedActor.thisPlayer;
            this.selActor = this.controlGame.controlPlayer;
            this.drawFocusRect(this.controlGame.controlPlayer.playerSprite);
            spellAllowed = true;
        }
        return spellAllowed;
    };
    cControlSpells.prototype.spellClick = function (sender) {
        this.borderSpell.cameraOffset.x = sender.spellSprite.cameraOffset.x + sender.spellSprite.width / 2;
        this.borderSpell.cameraOffset.y = sender.spellSprite.cameraOffset.y + sender.spellSprite.height / 2;
        this.selSpell = sender;
        //me fijo si es posible utilizar el hechizo seleccionado, segun las caracteristicas del mismo y el personaje enfocado
        if (this.selSpell.isSpellOnCoolDown == false) {
            //me fijo si es posible tirar el hechizo en el pj selecionado
            var spellAllowed = this.autoFocusSystem(sender);
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
            this.makeRay(fromSprite, toSprite, rayColor);
        }
    };
    cControlSpells.prototype.removeTweenText = function (sprite) {
        sprite.destroy();
    };
    return cControlSpells;
}());
