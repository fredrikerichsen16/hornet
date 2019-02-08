"use strict";
/**
 * Super class for user-defined controllers and the DefaultController.
 * A controller is a class which contains methods for specific commands.
 * The default controller contains methods for commands like 'back'.
 * The user-defined controllers contain methods for all their stuff.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var controller = /** @class */ (function () {
    function controller(hornet) {
        this.hornet = hornet;
    }
    controller.prototype.printCommands = function () {
        var commands = this.hornet.commands;
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            console.log(command._name);
        }
    };
    return controller;
}());
exports.controller = controller;
