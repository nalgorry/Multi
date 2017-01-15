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
    public circleFocus:Phaser.Graphics

    public selActorType:enumSelectedActor;
    public selActor:Object;

    private styleHit;
    private hitTextPosition:number = 0;

    constructor(public controlGame:cControlGame) {

            this.allSpells = new cDefinitionSpells(this.controlGame); 

            this.createnumSpells();

            this.iniciatenumSpellsystem();

    }

    public getSelActorID():string {
        var id:string

         if (this.selActorType == enumSelectedActor.monster){
             var monster = this.selActor as cMonster
             id = monster.idMonster;
         } else if (this.selActorType == enumSelectedActor.otherPlayer){
                var otherPlayer = this.selActor as cOtherPlayer
                id = otherPlayer.idServer;
         } else if (this.selActorType == enumSelectedActor.thisPlayer){
             var thisPlayer = this.selActor as cControlPlayer
             id = thisPlayer.idServer;
         }

        return id 
    }

    public releaseFocus(idActor:string) {

        if(idActor == this.getSelActorID()) {
            this.selActor = undefined;
            this.selActorType = enumSelectedActor.nothing;
        }

    }

    public spellAnimation(sprite:Phaser.Sprite,data) {
        
        console.log(data);

        this.allSpells.arraySpells[data.idSpell].spellAnimation(sprite);
    }

    public monsterClick(monster:cMonster) {

        this.selActorType = enumSelectedActor.monster;
        this.selActor = monster;

        this.drawFocusCircle(monster.monsterSprite)
        this.checkAtackMode()

    }

    public otherPlayerClick(player:cOtherPlayer) {

        this.selActorType = enumSelectedActor.otherPlayer;
        this.selActor = player; 

        this.drawFocusCircle(player.playerSprite);
        this.checkAtackMode()
    }

    public thisPlayerClick(player:cControlPlayer) {
        
        this.selActorType = enumSelectedActor.thisPlayer;
        this.selActor = player;

        this.drawFocusCircle(player.playerSprite,true)
        this.checkAtackMode()
    }

    private checkAtackMode() {
        if (this.controlGame.atackMode == true) {
            this.spellClick(this.selSpell)
        }
    }

    private drawFocusCircle(sprite:Phaser.Sprite,colorGreen:boolean = false) {

        if (this.circleFocus != undefined) {
            this.circleFocus.destroy();
        }
        this.circleFocus = this.controlGame.game.add.graphics(0,0);

        //dibujo el rectangulo
        if (colorGreen == true) {
            this.circleFocus .beginFill(0x18770f,0.3); //recuadro verde
        } else {
            this.circleFocus .beginFill(0xb52113,0.3); //recuadro rojo
        }

        //de aca saco las dimensionese de los sprites
        var spriteObject:Phaser.Sprite = sprite as Phaser.Sprite
        this.circleFocus.drawRect(-14, 2, 28 , 5);
        this.circleFocus.pivot.x = 0.5;

        sprite.addChild(this.circleFocus);
    }

    private iniciatenumSpellsystem() {

        //dibujo el marco para el hechizo seleccionado
        this.borderSpell = this.controlGame.game.add.graphics(0,0);
        this.borderSpell.lineStyle(2, 0xffffff, 1);
        this.borderSpell.fixedToCamera = true;
        this.borderSpell.drawCircle(0, 0, 50);

    }

    private createnumSpells() {

        var gameWidth:number = this.controlGame.game.width;
        
        this.arrayselSpells = new Array<cSpell>();

        //hechizo 1
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.BasicAtack];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 0, 205),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);

              
        //seleciono el hechizo uno por defecto
        this.selSpell = newSpell;

        //hechizo 2
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.CriticalBall];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 1, 205),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);          

        //hechizo 3
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.LightingStorm];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 2, 205), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);                

        //hechizo 4
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.ProtectField];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 0, 265), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);

        //hechizo 5
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.HealHand];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 1, 265), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);

        //hechizo 6
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.WeakBall];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 2, 265), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);  
 


    }

    public spellClick(sender:cSpell) {

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
                    if (this.checkSpellDistance() == true) {                 
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
                } else {
                    this.controlGame.activateAtackMode();
                }

            }

    }

    public checkSpellDistance():boolean {
        var isAllowed:boolean;

        var actorTileX:number;
        var actorTileY:number;

        if (this.selActorType == enumSelectedActor.monster){
             var monster = this.selActor as cMonster
             
             actorTileX = monster.tileX;
             actorTileY = monster.tileY;

         } else if (this.selActorType == enumSelectedActor.otherPlayer){
            var otherPlayer = this.selActor as cOtherPlayer
            
            actorTileX = otherPlayer.tileX;
            actorTileY = otherPlayer.tileY;

         } else if (this.selActorType == enumSelectedActor.thisPlayer){
            var thisPlayer = this.selActor as cControlPlayer
            
            actorTileX = thisPlayer.tileX;
            actorTileY = thisPlayer.tileY;
        
         }

        if (Math.abs(actorTileX - this.controlGame.controlPlayer.tileX) <= 10 && 
            Math.abs(actorTileY - this.controlGame.controlPlayer.tileY) <= 10 ) {
            
                isAllowed = true;

            } else {
            
                isAllowed = false;
                this.controlGame.controlConsole.newMessage(enumMessage.information,"The Character is too far away to Atack.");

            }

        return isAllowed
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

       public onHit(data,sprite:Phaser.Sprite) {
        
        //texto con el daño
        if (data.damage != 0) {

            if (data.damage > 0) { //daño real 
                this.styleHit = { font: "18px Arial", fill: "#612131", fontWeight: 900 }
            } else { //curacción
                this.styleHit = { font: "18px Arial", fill: "#0b4708", fontWeight: 900 }
                data.damage = -data.damage;
            };

            //para cambiar la posicion del daño si te golpean muy rapido
            if (this.hitTextPosition == -30) {
                this.hitTextPosition = 10;
            } else {
                this.hitTextPosition = -30;
            }

            var hitText = this.controlGame.game.add.text(this.hitTextPosition , -40, data.damage, this.styleHit);
            sprite.addChild(hitText);

            var tweenText = this.controlGame.game.add.tween(hitText).to({y: '-40'}, 1000, Phaser.Easing.Cubic.Out, true);
            tweenText.onComplete.add(this.removeTweenText,hitText);
        }

        this.spellAnimation(sprite,data);

    }

    removeTweenText(sprite:Phaser.Sprite) {        
        sprite.destroy();        
    }
    


}