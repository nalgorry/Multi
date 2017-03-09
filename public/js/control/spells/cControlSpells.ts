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

    public maxRangeX = 12;
    public maxRangeY = 7;

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

    public spellAnimation(sprite:Phaser.Sprite, data) {
        



    }

    public makeRay(spriteFrom:Phaser.Sprite, spriteTo:Phaser.Sprite, color:number) {


        var from:Phaser.Point;
        var to:Phaser.Point;

        from = new Phaser.Point(spriteFrom.x, spriteFrom.y - 40);
        to = new Phaser.Point(spriteTo.x, spriteTo.y - 40);

        var graphics = this.controlGame.game.add.graphics(0, 0);
        graphics.lineStyle(2, color, 1);

        graphics.moveTo(from.x , from.y);

        var maxLenght:number = 5;

        var distance = from.distance(to);

        var numberOfLines:number = Math.floor(distance/maxLenght);

        var lastX = from.x;
        var lastY = from.y;
        var randomFactor = 3;
        var fixX = (to.x - from.x) / numberOfLines ;
        var fixY = (to.y - from.y) / numberOfLines;


        for(var i = 0; i < numberOfLines ; i++) {
            var randX = this.controlGame.game.rnd.integerInRange(-randomFactor, randomFactor);
            var randY = this.controlGame.game.rnd.integerInRange(-randomFactor, randomFactor);

            lastX += fixX + randX;
            lastY += fixY + randY; 

            graphics.lineTo(lastX, lastY);
        }

        var buletAnimation = this.controlGame.game.add.tween(graphics).to( { alpha: 0}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
        buletAnimation.onComplete.add(this.destroyBulet,this,null,graphics);


    }

    public destroyBulet(bulet:Phaser.Graphics, tween:Phaser.Tween) {
        bulet.destroy();
    }

    public monsterClick(monster:cMonster) {

        this.selActorType = enumSelectedActor.monster;
        this.selActor = monster;

        this.drawFocusCircle(monster.monsterSprite)
    }

    public otherPlayerClick(player:cOtherPlayer) {

        this.selActorType = enumSelectedActor.otherPlayer;
        this.selActor = player; 

        this.drawFocusCircle(player.playerSprite);
    }

    public thisPlayerClick(player:cControlPlayer) {
        
        this.selActorType = enumSelectedActor.thisPlayer;
        this.selActor = player;

        this.drawFocusCircle(player.playerSprite,true)
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
        var newSpell:cSpell = this.allSpells.arraySpells[enumSpells.SelfExplosion];
        newSpell.iniciateSpell(new Phaser.Point(gameWidth - 185 + 57 * 2, 265), 2);
        
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
            spellAllowed = true;
        } else if (this.selActorType == enumSelectedActor.thisPlayer && spell.enabledTrowThisPlayer == true) {
            spellAllowed = true;
        }   

        //si no selecciono a nadie, intento hacer el auto focus
        //si permite seleccionar monstruos, busco el moustro mas cercano
        if (spellAllowed == false && spell.enabledTrowOnMonster == true) {
            
            var closestMonster:cMonster = this.controlGame.controlMonsters.getClosestMonsterInRange(this.maxRangeX, this.maxRangeY);

            if (closestMonster != undefined) {

                this.selActorType = enumSelectedActor.monster;
                this.selActor = closestMonster;
                this.drawFocusCircle(closestMonster.monsterSprite);
                
                spellAllowed = true;
            }
            
        }

        //si es un hechizo que pueda tirarse sobre mi, me selecciono 
        if (spellAllowed == false && spell.enabledTrowThisPlayer == true) {
                
                this.selActorType = enumSelectedActor.thisPlayer;
                this.selActor = this.controlGame.controlPlayer;
                this.drawFocusCircle(this.controlGame.controlPlayer.playerSprite);

                 spellAllowed = true;
        }

        return spellAllowed
    }

    public spellClick(sender:cSpell) {

            this.borderSpell.cameraOffset.x = sender.spellSprite.cameraOffset.x + sender.spellSprite.width/2;
            this.borderSpell.cameraOffset.y = sender.spellSprite.cameraOffset.y + sender.spellSprite.height/2;
            this.selSpell = sender;

            //me fijo si es posible utilizar el hechizo seleccionado, segun las caracteristicas del mismo y el personaje enfocado

            if (this.selSpell.isSpellOnCoolDown == false) {
               
                //me fijo si es posible tirar el hechizo en el pj selecionado
                var spellAllowed:boolean = this.autoFocusSystem(sender);

                if (spellAllowed == true) {
                    if (this.checkSpellDistance() == true) {                 
                        if (this.controlGame.controlPlayer.controlFocus.SpellPosible(this.selSpell) == true){ //esto se fija si es posible el hechizo y resta el mana
                            
                            //mando al server laa accion (esto se puede unificar mas TODO)
                            if (this.selActorType == enumSelectedActor.monster){
                                var monster = this.selActor as cMonster
                                this.controlGame.controlServer.socket.emit('monster click', 
                                { 
                                    idMonster:monster.idMonster,
                                    idSpell: this.selSpell.idSpell,
                                });

                            } else if (this.selActorType == enumSelectedActor.otherPlayer){
                                var otherplayer = this.selActor as cOtherPlayer
                                this.controlGame.controlServer.socket.emit('player click', 
                                { 
                                    idPlayerHit:otherplayer.idServer,
                                    idSpell: this.selSpell.idSpell,
                                });
                            } else if (this.selActorType == enumSelectedActor.thisPlayer){
                                var thisPlayer = this.selActor as cControlPlayer
                                this.controlGame.controlServer.socket.emit('player click', 
                                { 
                                    idPlayerHit:thisPlayer.idServer,
                                    idSpell: this.selSpell.idSpell,
                                });
                            }
                            
                            this.selSpell.spellColdDown();
                        }
                    }
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

    public onHit(data, fromSprite:Phaser.Sprite, toSprite:Phaser.Sprite, rayColor:number) {
       
        //texto con el daño
        if (data.damage != 0) {

            if (data.damage > 0) { //daño real 
                this.styleHit = { font: "18px Arial", fill: "#750303", fontWeight: 900 }
            } else { //curacción
                this.styleHit = { font: "18px Arial", fill: "#113d01", fontWeight: 900 }
                data.damage = -data.damage;
            };

            //para cambiar la posicion del daño si te golpean muy rapido
            if (this.hitTextPosition == -30) {
                this.hitTextPosition = 10;
            } else {
                this.hitTextPosition = -30;
            }

            var completeText = this.controlGame.game.add.sprite(this.hitTextPosition , -40);
            
            //texto que se muestra
            var hitText = this.controlGame.game.add.text(0,0, data.damage, this.styleHit);            

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

            var tweenText = this.controlGame.game.add.tween(completeText).to({y: '-40'}, 1000, Phaser.Easing.Cubic.Out, true);
            tweenText.onComplete.add(this.removeTweenText,completeText);
        }

        //animacion de un sprite 
        this.allSpells.arraySpells[data.idSpell].spellAnimation(toSprite);

        //creo una mega rayo super mortal 
        if (fromSprite != null) {
            this.makeRay(fromSprite, toSprite, rayColor);
        }

    }

    removeTweenText(sprite:Phaser.Sprite) {        
        sprite.destroy();        
    }
    


}