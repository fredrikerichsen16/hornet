"use strict";
/**
 * Super class for user-defined controllers and the DefaultController.
 * A controller is a class which contains methods for specific commands.
 * The default controller contains methods for commands like 'back'.
 * The user-defined controllers contain methods for all their stuff.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("./cmd");
const chalk = require('chalk');
const readlineSync = require('readline-sync');
class controller {
    constructor(hornet) {
        /**
         * cmd class
         */
        this.cmd = cmd_1.cmd;
        this.chalk = new chalk.constructor({ level: 2 }); // level 2 = supports 256 colors rather than 16 million
        this.hornet = hornet;
    }
    printCommands() {
        let commands = this.hornet.commands;
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];
            console.log(command._name);
        }
    }
    readline(question, color, trim = true) {
        if (color) {
            question = this.chalk[color](question);
        }
        let inp = readlineSync.question(question);
        if (trim)
            inp = inp.trim();
        return inp;
    }
    readlineYN(question, trim = true) {
        let inp = readlineSync.question(question);
        if (trim)
            inp = inp.trim();
        return inp === 'Y';
    }
    traverseForward() {
        if (!this.hornet.activeCommand) {
            throw new Error("hornet.activeCommand is undefined");
        }
        this.hornet.path.push(this.hornet.activeCommand._name);
    }
    traverseBackward() {
        this.hornet.path.pop();
    }
    /**
     * Clear terminal screen (like writing 'clear')
     *
     * @todo
     * Now it fully clears the screen - I just want to shift up so that you can still scroll up to see
     * what you cleared.
     */
    clearScreen() {
        process.stdout.write('\x1Bc');
    }
}
exports.controller = controller;
