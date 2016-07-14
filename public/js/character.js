var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Character = (function (_super) {
    __extends(Character, _super);
    function Character() {
        _super.apply(this, arguments);
    }
    Character.prototype.SetUp = function (main) {
        this.anchor.setTo(0.5, 0.5);
        this.x = Math.floor(Math.random() * 60) * main.gridSize + main.gridSize / 2;
        this.y = Math.floor(Math.random() * 60) * main.gridSize + main.gridSize / 2;
        this.exists = true;
        main.game.time.events.repeat(Phaser.Timer.SECOND * 2, 1000, this.moveCharacter, this);
        this.inputEnabled = true;
        this.events.onInputDown.add(this.clickedCharacter, this);
    };
    Character.prototype.update = function () {
    };
    Character.prototype.moveCharacter = function () {
        //this.x += 32;
        //this.y +=32;
        this.game.add.tween(this).to({ x: this.x + 32 }, 500, Phaser.Easing.Linear.None, true, 0);
        this.game.add.tween(this).to({ y: this.y + 32 }, 500, Phaser.Easing.Linear.None, true, 0);
    };
    Character.prototype.clickedCharacter = function () {
        this.kill();
    };
    return Character;
}(Phaser.Sprite));
