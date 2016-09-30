class cControlSpells {

    public selSpell:cSpell;
    public arrayselSpells: Array<cSpell>;
    public borderSpell:Phaser.Graphics;
    public borderFocus:Phaser.Graphics;
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
            
             if (this.selSpell.enabledTrowOtherPlayer == true) {
                 if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {
                    this.controlGame.controlServer.socket.emit('player click', { idPlayerHit:player.idServer,idSpell: this.selSpell.idSpell });
                 }
             }

            this.controlGame.game.canvas.style.cursor = 'default';

        }

    }

    public thisPlayerClick(player:cControlPlayer) {
        
        if (this.controlGame.atackMode == true) {
            
             if (this.selSpell.enabledTrowThisPlayer == true) {
                 if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true) {                   
                        this.controlGame.controlServer.socket.emit('player click', { idPlayerHit:player.idServer,idSpell: this.selSpell.idSpell });
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

        //dibujo el marco para el focusthis.borderSpell = this.controlGame.game.add.graphics(0,0);
        this.borderFocus = this.controlGame.game.add.graphics(0,0);
        this.borderFocus.lineStyle(2, 0x141417, 1);
        this.borderFocus.fixedToCamera = true;
        this.borderFocus.drawCircle(0, 0, 40);
    }

    private createSpells() {

        var gameWidth:number = this.controlGame.game.width;
        
        this.arrayselSpells = new Array<cSpell>();

        //hechizo 1
        var spellOne:cSpell = this.allSpells.arraySpells[2];
        spellOne.iniciateSpell(new Phaser.Point(gameWidth - 170,208),0);

        this.arrayselSpells.push(spellOne);
        spellOne.signalTest.add(this.spellClick,this);

        //hechizo 2
        var spellTwo:cSpell = this.allSpells.arraySpells[3];
        spellTwo.iniciateSpell(new Phaser.Point(gameWidth - 170 + 48,208),1);

        this.arrayselSpells.push(spellTwo);
        spellTwo.signalTest.add(this.spellClick,this);

        //hechizo 3
        var spellThree:cSpell = this.allSpells.arraySpells[4];
        spellThree.iniciateSpell(new Phaser.Point(gameWidth - 170 + 48*2,208),2);
        
        this.arrayselSpells.push(spellThree);
        spellThree.signalTest.add(this.spellClick,this);


        //hechizo 4
        var spellThree:cSpell = this.allSpells.arraySpells[0];
        spellThree.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*0,263),2);
        
        this.arrayselSpells.push(spellThree);
        spellThree.signalTest.add(this.spellClick,this);

        //hechizo 5
        var spellThree:cSpell = this.allSpells.arraySpells[1];
        spellThree.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*1,263),2);
        
        this.arrayselSpells.push(spellThree);
        spellThree.signalTest.add(this.spellClick,this);          

        //hechizo 6
        var spellThree:cSpell = this.allSpells.arraySpells[5];
        spellThree.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*2,263),2);
        
        this.arrayselSpells.push(spellThree);
        spellThree.signalTest.add(this.spellClick,this);                

        //hechizo 7
        var spellThree:cSpell = this.allSpells.arraySpells[5];
        spellThree.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*3,263),2);
        
        this.arrayselSpells.push(spellThree);
        spellThree.signalTest.add(this.spellClick,this); 
      

        //seleciono el hechioz uno por defecto
        this.selSpell = spellOne;

    }

    public spellClick(sender:cSpell) {

        //focus
        if (sender.idSpell == 3 || sender.idSpell == 4 || sender.idSpell == 5) {
            this.borderFocus.cameraOffset.x = sender.spellSprite.cameraOffset.x + sender.spellSprite.width/2;
            this.borderFocus.cameraOffset.y = sender.spellSprite.cameraOffset.y + sender.spellSprite.height/2;
            this.borderFocus.visible = this.controlGame.controlPlayer.controlFocus.SelectFocusFromSpell(sender.idSpell) //me devuelve false si salio del focus
        } else { //resto de los hechizos 

            this.borderSpell.cameraOffset.x = sender.spellSprite.cameraOffset.x + sender.spellSprite.width/2;
            this.borderSpell.cameraOffset.y = sender.spellSprite.cameraOffset.y + sender.spellSprite.height/2;
            this.selSpell = sender;
            this.controlGame.activateAtackMode();

        }

    }


}