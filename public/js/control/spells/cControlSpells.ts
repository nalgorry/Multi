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
    public rectFocus:Phaser.Graphics
    public autoFocusUsed:boolean = false;

    public selActorType:enumSelectedActor = enumSelectedActor.nothing;
    public selActor:Object;

    private styleHit;
    private hitTextPosition:number = 0;

    public maxRangeX = 12;
    public maxRangeY = 7;


    constructor(public controlGame:cControlGame) {

            this.allSpells = new cDefinitionSpells(this.controlGame); 

            this.iniciatenumSpellsystem();
            this.createnumSpells();

    }

    public getSelActorID():string {
        var id:string

         if (this.selActorType == enumSelectedActor.monster){
             var monster = this.selActor as cMonster
             id = monster.idServer;
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


    public reduceLifeBar(lifePercRemaining) {
        var newWidth = this.rectFocus.width * lifePercRemaining
        
        this.controlGame.game.add.tween(this.rectFocus).to({width: newWidth}, 250, Phaser.Easing.Linear.None, true, 0, 0);

    }

    public monsterClick(monster:cMonster) {

        //lets check if this monster was already focus
        if (this.selActorType == enumSelectedActor.monster) {
            var selMonster = <cMonster> this.selActor;

            //lets do a basic atack if we click the monster twice
            if (monster.idServer == selMonster.idServer)
            {
                this.selSpell = this.allSpells.arraySpells[enumSpells.BasicAtack];
                this.selSpell.spellSelected();
            }

        }

        this.selActorType = enumSelectedActor.monster;
        this.selActor = monster;
        this.autoFocusUsed = false;

        this.drawFocusRect(monster.monsterSprite)
    }

    public otherPlayerClick(player:cOtherPlayer) {

        this.selActorType = enumSelectedActor.otherPlayer;
        this.selActor = player;
        this.autoFocusUsed = false; 

        this.drawFocusRect(player.playerSprite, true);
    }

    public thisPlayerClick(player:cControlPlayer) {
        
        this.selActorType = enumSelectedActor.thisPlayer;
        this.selActor = player;
        this.autoFocusUsed = false;

        this.drawFocusRect(player.playerSprite,true)
    }

    private drawFocusRect(sprite:Phaser.Sprite,colorGreen:boolean = false) {

        if (this.rectFocus != undefined) {
            this.rectFocus.destroy();
        }
        this.rectFocus = this.controlGame.game.add.graphics(0,0);

        //dibujo el rectangulo
        var barWidth;
        if (colorGreen == true) {
            this.rectFocus.beginFill(0x18770f,0.3); //recuadro verde
            
            //set the player variables
            barWidth = 40;
            var xRectangle = -20;
        } else {
            this.rectFocus.beginFill(0xb52113,0.3); //recuadro rojo
            
            //set the monster variables
            barWidth = 80;
            var xRectangle = -Math.abs(sprite.children[0].width / 2) - this.controlGame.gridSize/2 + (Math.abs(sprite.children[0].width) - barWidth) / 2;
        }

        //de aca saco las dimensionese de los sprites
        
        this.rectFocus.drawRect(xRectangle, 0, barWidth , 5);
        this.rectFocus.pivot.x = 0.5;

        sprite.addChild(this.rectFocus);
    }

    private iniciatenumSpellsystem() {

        //dibujo el marco para el hechizo seleccionado
        this.borderSpell = this.controlGame.game.add.graphics(0,0);
        this.borderSpell.lineStyle(2, 0xffffff, 1);
        this.controlGame.spriteInterfaz.addChild(this.borderSpell);
        this.borderSpell.drawCircle(0, 0, 50);

    }

    private createnumSpells() {

        var gameWidth:number = this.controlGame.game.width;
        
        this.arrayselSpells = new Array<cSpell>();

        //hechizo 1
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.BasicAtack];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 0, 205),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);
     
        //seleciono el hechizo uno por defecto
        this.selSpell = newSpell;
        this.borderSpell.x = newSpell.spellSprite.x + newSpell.spellSprite.width/2;
        this.borderSpell.y = newSpell.spellSprite.y + newSpell.spellSprite.height/2;

        //hechizo 2
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.CriticalBallRelease];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 1, 205),2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);          

        //hechizo 3
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.fireballRelease];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 2, 205), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);                

        //hechizo 4
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.LightingStorm];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 0, 265), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);

        //hechizo 5
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.HealHand];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 1, 265), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);

        //hechizo 6
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.ProtectField];
        newSpell.iniciateSpell(new Phaser.Point(12 + 58 * 2, 265), 2);
        
        this.arrayselSpells.push(newSpell);
        newSpell.signalSpellSel.add(this.spellClick,this);  
 


    }

    public autoFocusSystem(spell:cSpell):boolean {

        //me fijo algunas caracteristicas especiales de algunos hechizos
        if (this.selSpell.idSpell == enumSpells.SelfExplosion) { //la explosion es sobre el mismo pj, lo enfoco antes de castearlo
            this.thisPlayerClick(this.controlGame.controlPlayer);
        }

        //me fijo si selecciono algun pj por defecto 
        var spellAllowed:boolean = false;

        if (this.selActorType == enumSelectedActor.monster && spell.enabledTrowOnMonster == true) {
            spellAllowed = true;
        } else if (this.selActorType == enumSelectedActor.otherPlayer && spell.enabledTrowOtherPlayer == true) {
            
            //var selPlayer = <cOtherPlayer>this.selActor;

            //lets check if we can atack in this map
            if (this.controlGame.pvspAllowed == true) {
                spellAllowed = true;
            } else {
                spellAllowed = false;
                this.controlGame.controlPlayer.showMessage("Can´t atack here");
            }
        } else if (this.selActorType == enumSelectedActor.thisPlayer && spell.enabledTrowThisPlayer == true) {
            spellAllowed = true;
        }   

        //si no selecciono a nadie, intento hacer el auto focus
        //si permite seleccionar monstruos, busco el moustro mas cercano
        if (this.selActorType  != enumSelectedActor.monster && spell.enabledTrowOnMonster == true) {
            
            var closestMonster:cMonster = this.controlGame.controlMonsters.getClosestMonsterInRange(this.maxRangeX, this.maxRangeY);

            if (closestMonster != undefined) {

                this.selActorType = enumSelectedActor.monster;
                this.selActor = closestMonster;
                this.drawFocusRect(closestMonster.monsterSprite);

                this.autoFocusUsed = true;
                
                spellAllowed = true;
            } else {
                this.controlGame.controlPlayer.showMessage("No Monster In Range");
            }
            
        }

        //si es un hechizo que pueda tirarse sobre mi, me selecciono 
        if (spellAllowed == false && spell.enabledTrowThisPlayer == true) {
                
                this.selActorType = enumSelectedActor.thisPlayer;
                this.selActor = this.controlGame.controlPlayer;
                this.drawFocusRect(this.controlGame.controlPlayer.playerSprite,true);

                 spellAllowed = true;
        }

        return spellAllowed
    }

    public spellClick(sender:cSpell) {

            this.borderSpell.x = sender.spellSprite.x + sender.spellSprite.width/2;
            this.borderSpell.y = sender.spellSprite.y + sender.spellSprite.height/2;
            this.selSpell = sender;

            //me fijo si es posible utilizar el hechizo seleccionado, segun las caracteristicas del mismo y el personaje enfocado

            if (this.selSpell.isSpellOnCoolDown == false) {
               
                //me fijo si es posible tirar el hechizo en el pj selecionado
                var spellAllowed:boolean = this.autoFocusSystem(sender);
                var spellInRange:boolean = this.checkSpellDistance();

                //if autofocus was used, and the distance is too far, we allow the sistem to change targets
                if (spellInRange == false && this.autoFocusUsed == true) {
                    this.selActorType = enumSelectedActor.nothing;
                    var spellAllowed:boolean = this.autoFocusSystem(sender);
                }

                if (spellAllowed == true) {
                    if (this.checkSpellDistance() == true) {                 
                        if (this.controlGame.controlPlayer.controlFocus.enoughResourses(this.selSpell) == true){ //esto se fija si es posible el hechizo y resta el mana
                            
                            //we cast the spell before the animation
                            this.useSpell(this.selSpell.idSpell, this.selActorType, this.selActor);
                            
                            //we set the timer to use it again in some time.
                            this.selSpell.spellColdDown();
                        }
                    }
                } 

            }

    }

    public useSpell(efect:enumSpells, selActorType:enumSelectedActor, actor) {

        var isMonster:Boolean = false;

        //check if we are hiting a monster or otrher player to send it to the server
        if (selActorType == enumSelectedActor.monster){
            isMonster = true;
        }
    
        // lets check if the actor is not already dead!
        if (actor != undefined) {
            this.controlGame.controlServer.socket.emit('actor click', 
            { 
                idServer: actor.idServer,
                idSpell: efect,
                isMonster: isMonster
            });
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

        if (Math.abs(actorTileX - this.controlGame.controlPlayer.tileX) <= this.maxRangeX && 
            Math.abs(actorTileY - this.controlGame.controlPlayer.tileY) <= this.maxRangeY ) {
            
                isAllowed = true;

            } else {
            
                isAllowed = false;
                this.controlGame.controlConsole.newMessage(enumMessage.information,"The Character is too far away to Atack.");

            }

        return isAllowed
    }

    public spellSelectKeyboard(sender:Phaser.Key) {

        //lets set the letter Q and E to replace the number 5 and 6
        switch (sender.keyCode) {
            case Phaser.Keyboard.Q:
                sender.keyCode = Phaser.Keyboard.FIVE
                break;
            case Phaser.Keyboard.E:
                sender.keyCode = Phaser.Keyboard.SIX
                break;
        
            default:
                break;
        }

            var spell = this.arrayselSpells[sender.keyCode - Phaser.Keyboard.ONE]

            this.selSpell = spell;
            spell.spellSelected();

    }

    public spellRelease(sender:Phaser.Key) {
        var spell = this.arrayselSpells[sender.keyCode - Phaser.Keyboard.ONE]
        spell.spellRelease();
    }

    public onHit(data, fromSprite:Phaser.Sprite, toSprite:Phaser.Sprite, rayColor:number) {
       
        //para cambiar la posicion del daño si te golpean muy rapido
        if (this.hitTextPosition == -30) {
            this.hitTextPosition = 10;
        } else {
            this.hitTextPosition = -30;
        }

        var spell:cSpell = this.allSpells.arraySpells[data.idSpell]

        new cControlSpellAnim(this.controlGame, fromSprite, toSprite, rayColor, data.damage, 
            this.hitTextPosition, spell, this.selActorType, this.selActor);

    }
    


}