enum enumSelectedActor {
    nothing = 0,
    monster = 1,
    thisPlayer = 2,
    otherPlayer = 3
}

class cControlSpells {

    public selSpell:cSpell;
    public arrayselSpells: Array<cSpell>;
    private allSpells:cDefinitionSpells;

    public borderSpell:Phaser.Graphics;
    public rectangleFocus:Phaser.Graphics

    public selActorType:enumSelectedActor;
    public selActor:Object;

    constructor(public controlGame:cControlGame) {

            this.allSpells = new cDefinitionSpells(this.controlGame); 

            this.createSpells();

            this.iniciateSpellSystem();

    }

    public spellAnimation(sprite:Phaser.Sprite,data) {

        this.allSpells.arraySpells[data.idSpell].spellAnimation(sprite);
    }

    public monsterClick(monster:cMonster) {

        this.selActorType = enumSelectedActor.monster;
        this.selActor = monster;

        this.drawFocusRectangle(monster.monsterSprite)
    }

    public otherPlayerClick(player:cOtherPlayer) {

        this.selActorType = enumSelectedActor.otherPlayer;
        this.selActor = player; 

        this.drawFocusRectangle(player.playerSprite)
    }

    public thisPlayerClick(player:cControlPlayer) {
        
        this.selActorType = enumSelectedActor.thisPlayer;
        this.selActor = player;

        this.drawFocusRectangle(player.playerSprite,true)

    }

    private drawFocusRectangle(sprite:Phaser.Sprite,colorGreen:boolean = false) {

        if (this.rectangleFocus != undefined) {
            this.rectangleFocus.destroy();
        }
        this.rectangleFocus = this.controlGame.game.add.graphics(0,0);

        //dibujo el rectangulo
        if (colorGreen == true) {
            this.rectangleFocus .beginFill(0x18770f,0.3); //recuadro verde
        } else {
            this.rectangleFocus .beginFill(0xb52113,0.3); //recuadro rojo
        }

        this.rectangleFocus .drawRect(-sprite.width/2, -sprite.width + 5, sprite.width, sprite.width);
        sprite.addChild(this.rectangleFocus);
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

        //hechizo 1
        var newSpell:cSpell = this.allSpells.arraySpells[3];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*0,205),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);

              
        //seleciono el hechizo uno por defecto
        this.selSpell = newSpell;

        //hechizo 2
        var newSpell:cSpell = this.allSpells.arraySpells[4];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48*1,205),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);          

        //hechizo 3
        var newSpell:cSpell = this.allSpells.arraySpells[5];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48 * 2, 205), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);                

        //hechizo 4
        var newSpell:cSpell = this.allSpells.arraySpells[6];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 190 + 48 * 3, 205), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this); 


    }

    public spellClick(sender:cSpell) {

            console.log(this.selActor);

            this.borderSpell.cameraOffset.x = sender.spellSprite.cameraOffset.x + sender.spellSprite.width/2;
            this.borderSpell.cameraOffset.y = sender.spellSprite.cameraOffset.y + sender.spellSprite.height/2;
            this.selSpell = sender;

            //me fijo si es posible utilizar el hechizo seleccionado, segun las caracteristicas del mismo y el personaje enfocado

            if (this.selSpell.isSpellOnCoolDown == false) {
                
                //me fijo si es posible tirar el hechizo en el pj selecionado
                var spellAllowed:boolean = false;
                if (this.selActorType == enumSelectedActor.monster && sender.enabledTrowOnMonster == true) {
                    spellAllowed = true;
                } else if (this.selActorType == enumSelectedActor.otherPlayer && sender.enabledTrowOtherPlayer == true) {
                    spellAllowed = true;
                } else if (this.selActorType == enumSelectedActor.thisPlayer && sender.enabledTrowThisPlayer == true) {
                    spellAllowed = true;
                }   

                if (spellAllowed == true) {                
                    if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true){ //esto se fija si es posible el hechizo y resta el mana
                        
                        //mando al server laa accion 
                        if (this.selActorType == enumSelectedActor.monster){
                            var monster = this.selActor as cMonster
                            this.controlGame.controlServer.socket.emit('monster click', 
                            { 
                                idPlayer:this.controlGame.controlPlayer.idServer,
                                idMonster:monster.idMonster,
                                idSpell: this.selSpell.idSpell 
                            });

                        } else if (this.selActorType == enumSelectedActor.otherPlayer){
                            var otherplayer = this.selActor as cOtherPlayer
                            this.controlGame.controlServer.socket.emit('player click', 
                            { 
                                idPlayerHit:otherplayer.idServer,
                                idSpell: this.selSpell.idSpell 
                            });
                        } else if (this.selActorType == enumSelectedActor.thisPlayer){
                            var thisPlayer = this.selActor as cControlPlayer
                            this.controlGame.controlServer.socket.emit('player click', 
                            { 
                                idPlayerHit:thisPlayer.idServer,
                                idSpell: this.selSpell.idSpell 
                            });
                        }
                        
                        this.selSpell.spellColdDown();
                    }
                }

            }

    }

    public spellSelectKeyboard(sender:Phaser.Key) {

            //selecciono el hechizo segun la tecla que toco
            if (sender.keyCode == Phaser.Keyboard.ONE) {
                var spell = this.arrayselSpells[0];
            } else if (sender.keyCode == Phaser.Keyboard.TWO) {
                var spell = this.arrayselSpells[1];
            } else if (sender.keyCode == Phaser.Keyboard.THREE) {
                var spell = this.arrayselSpells[2];
            }  else if (sender.keyCode == Phaser.Keyboard.FOUR) {
                var spell = this.arrayselSpells[3];
            } 

            this.selSpell = spell;
            spell.spellSelected()

    }


}