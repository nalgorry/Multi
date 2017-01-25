"use strict";
var util = require('util');
var cPlayer = (function () {
    function cPlayer(socket, playerId, playerName, x, y) {
        this.socket = socket;
        this.playerId = playerId;
        this.playerName = playerName;
        this.x = x;
        this.y = y;
        this.atack = 2;
        this.defense = 2;
        this.protectedField = false;
        this.weakEfect = false;
    }
    cPlayer.prototype.sendPlayerToNewPlayer = function (socket) {
        socket.emit('new player', { id: this.playerId,
            x: this.x, y: this.y, name: this.playerName });
    };
    cPlayer.prototype.calculateDamage = function (damage) {
        if (damage > 0) {
            damage -= this.randomIntFromInterval(this.defense / 2, this.defense);
            if (damage <= 0) {
                damage = 1;
            }
            //me fijo si tiene el escudo protector
            if (this.protectedField == true) {
                damage = Math.round(damage / 2);
            }
            //me fijo si tiene el efecto de daño incrementado
            if (this.weakEfect == true) {
                damage = Math.round(damage * 2);
            }
        }
        return damage;
    };
    cPlayer.prototype.spellActivated = function (data) {
        var _this = this;
        //veo que hechizo se activo 
        var damage = 0;
        switch (data.idSpell) {
            case 1 /* BasicAtack */:
                damage = Math.round(Math.random() * 50 + 20);
                break;
            case 2 /* CriticalBall */:
                damage = Math.round(Math.random() * 30 + 15);
                if (Math.random() < 0.15) {
                    damage = damage + 50;
                }
                break;
            case 6 /* LightingStorm */:
                damage = Math.round(Math.random() * 100 + 50);
                break;
            case 4 /* ProtectField */:
                this.protectedField = true;
                var timer = setTimeout(function () { return _this.protectedField = false; }, 4500);
                break;
            case 3 /* WeakBall */:
                this.weakEfect = true;
                var timer = setTimeout(function () { return _this.weakEfect = false; }, 6500);
                break;
            case 5 /* HealHand */:
                damage = -Math.round(Math.random() * 40 + 40);
                break;
            default:
                break;
        }
        if (damage > 0) {
            damage += this.randomIntFromInterval(this.atack / 2, this.atack);
        }
        return damage;
    };
    cPlayer.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    cPlayer.prototype.equipItems = function (data) {
        //actualizo el ataque y la defensa del player
        if (data.itemsEfects[9 /* atack */] != undefined) {
            this.atack = data.itemsEfects[9 /* atack */].value;
        }
        if (data.itemsEfects[10 /* defense */] != undefined) {
            this.defense = data.itemsEfects[10 /* defense */].value;
        }
    };
    return cPlayer;
}());
exports.cPlayer = cPlayer;
