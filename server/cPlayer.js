"use strict";
var util = require('util');
var cPlayer = (function () {
    function cPlayer(socket, playerId, playerName, x, y, controlMonster) {
        this.socket = socket;
        this.playerId = playerId;
        this.playerName = playerName;
        this.x = x;
        this.y = y;
        this.controlMonster = controlMonster;
        this.gridSize = 40;
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
    cPlayer.prototype.spellResult = function (data) {
        var _this = this;
        //aca va los resultados de activar el hechizo
        var resultado = new cSpellResult;
        //seteo las animaciones por defecto
        resultado.spellAnimationPlayer = data.idSpell;
        resultado.spellAnimationMonster = data.idSpell;
        //veo que hechizo se activo 
        var damage = 0;
        //defino los tarjets normales de los hechizos
        if (data.idMonster != undefined) {
            resultado.monsterTargets.push(data.idMonster);
        }
        if (data.idPlayerHit != undefined) {
            resultado.playerTargets.push(data.idPlayerHit);
        }
        //analiso que hechizo se lanzo y calculo sus efectos
        switch (data.idSpell) {
            case 1 /* BasicAtack */:
                damage = Math.round(Math.random() * 50 + 20);
                resultado.monsterDamage = damage;
                resultado.playerDamage = damage;
                break;
            case 2 /* CriticalBall */:
                damage = Math.round(Math.random() * 30 + 15);
                if (Math.random() < 0.15) {
                    damage = damage + 50;
                }
                resultado.monsterDamage = damage;
                resultado.playerDamage = damage;
                break;
            case 6 /* LightingStorm */:
                damage = Math.round(Math.random() * 100 + 50);
                resultado.monsterDamage = damage;
                resultado.playerDamage = damage;
                break;
            case 4 /* ProtectField */:
                damage = 0;
                this.protectedField = true;
                var timer = setTimeout(function () { return _this.protectedField = false; }, 4500);
                break;
            case 3 /* WeakBall */:
                this.weakEfect = true;
                var timer = setTimeout(function () { return _this.weakEfect = false; }, 6500);
                break;
            case 5 /* HealHand */:
                resultado.playerDamage = -Math.round(Math.random() * 40 + 40);
                break;
            case 7 /* SelfExplosion */:
                resultado.monsterDamage = Math.round(Math.random() * 50 + 50);
                resultado.playerDamage = 0;
                var playerTileX = Math.round(this.x / this.gridSize);
                var playerTileY = Math.round(this.y / this.gridSize);
                resultado.playerTargets = [this.playerId];
                resultado.monsterTargets =
                    this.controlMonster.findMonstersInArea(playerTileX, playerTileY, 5, 5);
                resultado.spellAnimationMonster = 1 /* BasicAtack */;
            default:
                break;
        }
        if (damage > 0) {
            resultado.playerDamage += this.randomIntFromInterval(this.atack / 2, this.atack);
            resultado.monsterDamage += this.randomIntFromInterval(this.atack / 2, this.atack);
        }
        return resultado;
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
var cSpellResult = (function () {
    function cSpellResult() {
        this.monsterTargets = [];
        this.playerTargets = [];
    }
    return cSpellResult;
}());
