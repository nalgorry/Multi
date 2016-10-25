class cControlSpells {

    public selSpell:cSpell;
    public arrayselSpells: Array<cSpell>;
    public borderSpell:Phaser.Graphics;
    private allSpells:cDefinitionSpells;

    constructor(public controlGame:cControlGame) {

            this.allSpells = new cDefinitionSpells(this.controlGame); 

            this.createSpells();

            this.iniciateSpellSystem();

    }

    public spellAnimation(actor:cBasicActor,data) {

        this.allSpells.arraySpells[data.idSpell].spellAnimation(actor);
    }

    public otherPlayerClick(player:cOtherPlayer) {

        if (this.controlGame.atackMode == true) {
            
             if (this.selSpell.enabledTrowOtherPlayer == true && this.selSpell.isSpellOnCoolDown == false) {
                 if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {
                    this.controlGame.controlServer.socket.emit('player click', { idPlayerHit:player.idServer,idSpell: this.selSpell.idSpell });
                    this.selSpell.spellColdDown();
                 }
             }

            this.controlGame.game.canvas.style.cursor = 'default';

        }

    }

    public thisPlayerClick(player:cControlPlayer) {
        
        if (this.controlGame.atackMode == true) {
            
             if (this.selSpell.enabledTrowThisPlayer == true && this.selSpell.isSpellOnCoolDown == false) {
                 if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {                   
                        this.controlGame.controlServer.socket.emit('player click', { idPlayerHit:player.idServer,idSpell: this.selSpell.idSpell });
                        this.selSpell.spellColdDown();
                 }
             }

            this.controlGame.game.canvas.style.cursor = 'default';

        }

    }

    private iniciateSpellSystem() {

        //dibujo el marco para el hechizo seleccionado
        this.borderSpell = this.controlGame.game.add.graphics(0,0);
        this.borderSpell.lineStyle(2, 0xffffff, 1);
        this.borderSpell.fixedToCamera = true;
        this.borderSpell.drawCircle(0, 0, 40);

    }

    private createSpells() {

        var gameWidth:number = this.controlGame.game.width;
        
        this.arrayselSpells = new Array<cSpell>();

        //los tres de focus

        //hechizo 1
        var spellOne:cSpell = this.allSpells.arraySpells[0];
        spellOne.iniciateSpell(new Phaser.Point(gameWidth - 170,208),0);

        this.arrayselSpells.push(spellOne);
        spellOne.signalSpellSel.add(this.spellClick,this);

        //hechizo 2
        var spellTwo:cSpell = this.allSpells.arraySpells[1];
        spellTwo.iniciateSpell(new Phaser.Point(gameWidth - 170 + 48,208),1);

        this.arrayselSpells.push(spellTwo);
        spellTwo.signalSpellSel.add(this.spellClick,this);

        //hechizo 3
        var newSpell:cSpell = this.allSpells.arraySpells[2];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 170 + 48*2,208),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);

        //resto de hechizos
        
        //hechizo 4
        var newSpell:cSpell = this.allSpells.arraySpells[3];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*0,263),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);

        //hechizo 5
        var newSpell:cSpell = this.allSpells.arraySpells[4];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*1,263),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);          

        //hechizo 6
        var newSpell:cSpell = this.allSpells.arraySpells[5];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*2,263),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);                

        //hechizo 7
        var newSpell:cSpell = this.allSpells.arraySpells[6];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*3,263),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this); 
      

        //seleciono el hechioz uno por defecto
        this.selSpell = spellOne;

    }

    public spellClick(sender:cSpell) {

        //focus
        if (sender.idSpell == 0 || sender.idSpell == 1 || sender.idSpell == 2) {
            this.controlGame.controlPlayer.controlFocus.SelectFocusFromSpell(sender.idSpell) //me devuelve false si salio del focus
        } else { //resto de los hechizos 

            this.borderSpell.cameraOffset.x = sender.spellSprite.cameraOffset.x + sender.spellSprite.width/2;
            this.borderSpell.cameraOffset.y = sender.spellSprite.cameraOffset.y + sender.spellSprite.height/2;
            this.selSpell = sender;
            this.controlGame.activateAtackMode();

        }

    }

    public spellSelectKeyboard(sender:Phaser.Key) {

            //selecciono el hechizo segun la tecla que toco
            if (sender.keyCode == Phaser.Keyboard.ONE) {
                var spell = this.arrayselSpells[3];
            } else if (sender.keyCode == Phaser.Keyboard.TWO) {
                var spell = this.arrayselSpells[4];
            } else if (sender.keyCode == Phaser.Keyboard.THREE) {
                var spell = this.arrayselSpells[5];
            }  else if (sender.keyCode == Phaser.Keyboard.FOUR) {
                var spell = this.arrayselSpells[6];
            } 

            this.borderSpell.cameraOffset.x = spell.spellSprite.cameraOffset.x + spell.spellSprite.width/2;
            this.borderSpell.cameraOffset.y = spell.spellSprite.cameraOffset.y + spell.spellSprite.height/2;
            this.selSpell = spell;
            this.controlGame.activateAtackMode();

    }


}