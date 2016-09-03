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
            if (this.controlGame.controlPlayer.controlFocus.SpellPosible(25, 10, 0) == true) {
                var idSpell = this.controlGame.controlPlayer.controlSpells.selectedSpell;
                this.controlGame.controlServer.socket.emit('player click', { idPlayerHit: player.id, idSpell: idSpell });
            }
            this.controlGame.game.canvas.style.cursor = 'default';
        }
    };
    cControlSpells.prototype.thisPlayerClick = function () {
    };
    cControlSpells.prototype.iniciateSpellSystem = function () {
        //dibujo el rectangulo para el hechizo seleccionado
        this.rectangleSpell = this.controlGame.game.add.graphics(0, 0);
        this.rectangleSpell.lineStyle(2, 0xffffff, 1);
        this.rectangleSpell.fixedToCamera = true;
        this.rectangleSpell.drawRect(0, 0, 27, 71);
        this.rectangleSpell.cameraOffset.x = 850;
        this.rectangleSpell.cameraOffset.y = 296;
        //seleciono el hechioz uno por defecto
        this.selectedSpell = 0;
    };
    cControlSpells.prototype.createSpells = function () {
        this.arraySelectedSpells = new Array();
        //hechizo 1
        var spellOne = this.allSpells.arraySpells[0];
        spellOne.iniciateSpell(new Phaser.Point(850, 296));
        spellOne.spellNumber = 0;
        this.arraySelectedSpells.push(spellOne);
        spellOne.signalTest.add(this.spellClick, this);
        //hechizo 2
        var spellTwo = this.allSpells.arraySpells[1];
        spellTwo.iniciateSpell(new Phaser.Point(881, 296));
        spellTwo.spellNumber = 1;
        this.arraySelectedSpells.push(spellTwo);
        spellTwo.signalTest.add(this.spellClick, this);
        //hechizo 3
        var spellThree = this.allSpells.arraySpells[2];
        spellThree.iniciateSpell(new Phaser.Point(912, 296));
        spellThree.spellNumber = 2;
        this.arraySelectedSpells.push(spellThree);
        spellThree.signalTest.add(this.spellClick, this);
    };
    cControlSpells.prototype.spellClick = function (sender) {
        this.rectangleSpell.cameraOffset.x = sender.spellSprite.cameraOffset.x;
        this.rectangleSpell.cameraOffset.y = sender.spellSprite.cameraOffset.y;
        this.selectedSpell = sender.idSpell;
    };
    return cControlSpells;
}());
