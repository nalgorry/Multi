"use strict";
var util = require('util');
var cPlayer = (function () {
    function cPlayer(socket, playerId, playerName, x, y) {
        this.socket = socket;
        this.playerId = playerId;
        this.playerName = playerName;
        this.x = x;
        this.y = y;
        this.protectedField = false;
        this.weakEfect = false;
    }
    cPlayer.prototype.sendPlayerToNewPlayer = function (socket) {
        socket.emit('new player', { id: this.playerId,
            x: this.x, y: this.y, name: this.playerName });
    };
    cPlayer.prototype.calculateDamage = function (damage) {
        if (this.protectedField == true) {
            damage = Math.round(damage / 3);
        }
        return damage;
    };
    cPlayer.prototype.spellActivated = function (data) {
        var _this = this;
        //veo que hechizo se activo 
        var damage = 0;
        switch (data.idSpell) {
            case enumActiveSpells.FireBall:
                damage = Math.round(Math.random() * 50 + 20);
                break;
            case enumActiveSpells.CriticalBall:
                damage = Math.round(Math.random() * 30 + 15);
                if (Math.random() < 0.15) {
                    damage = damage + 50;
                }
                break;
            case enumActiveSpells.ProtectField:
                this.protectedField = true;
                var timer = setTimeout(function () { return _this.protectedField = false; }, 4500);
                break;
            case enumActiveSpells.WeakBall:
                this.weakEfect = true;
                var timer = setTimeout(function () { return _this.weakEfect = false; }, 6500);
                break;
            default:
                break;
        }
        if (this.protectedField == true) {
            damage = Math.round(damage / 3);
        }
        if (this.weakEfect == true) {
            damage = Math.round(damage * 2);
        }
        return damage;
    };
    return cPlayer;
}());
exports.cPlayer = cPlayer;
var enumActiveSpells;
(function (enumActiveSpells) {
    enumActiveSpells[enumActiveSpells["FireBall"] = 3] = "FireBall";
    enumActiveSpells[enumActiveSpells["CriticalBall"] = 4] = "CriticalBall";
    enumActiveSpells[enumActiveSpells["WeakBall"] = 5] = "WeakBall";
    enumActiveSpells[enumActiveSpells["ProtectField"] = 6] = "ProtectField";
})(enumActiveSpells || (enumActiveSpells = {}));
