var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var boot = (function (_super) {
    __extends(boot, _super);
    function boot() {
        _super.apply(this, arguments);
    }
    boot.prototype.preload = function () {
        this.load.image('preloadBar', 'assets/preloader.png');
        console.log("llega");
    };
    boot.prototype.create = function () {
        //  Unless you specifically need to support multitouch I would recommend setting this to 1
        this.input.maxPointers = 1;
        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;
        if (this.game.device.desktop) {
        }
        else {
        }
        this.game.state.start('preloader', true, false);
    };
    return boot;
}(Phaser.State));
