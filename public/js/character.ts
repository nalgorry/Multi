class Character extends Phaser.Sprite {

    public SetUp(main:SimpleGame) {
        
        this.anchor.setTo(0.5, 0.5);

        this.x = Math.floor(Math.random() * 60) * main.dataGame.gridSize + main.dataGame.gridSize/2;
        this.y = Math.floor(Math.random() * 60) * main.dataGame.gridSize + main.dataGame.gridSize/2;
        
        this.exists = true;

        main.game.time.events.repeat(Phaser.Timer.SECOND * 2, 1000, this.moveCharacter, this);
        this.inputEnabled = true;
        this.events.onInputDown.add(this.clickedCharacter, this);


    }

    public update() {
    }

    public moveCharacter() {
        //this.x += 32;
        //this.y +=32;
        this.game.add.tween(this).to({ x: this.x + 32 }, 500, Phaser.Easing.Linear.None, true, 0);
        this.game.add.tween(this).to({ y: this.y + 32 }, 500, Phaser.Easing.Linear.None, true, 0);
    }

    public clickedCharacter(){
        this.kill();
    }



}
