/**
 * Super class for user-defined controllers and the DefaultController.
 * A controller is a class which contains methods for specific commands.
 * The default controller contains methods for commands like 'back'.
 * The user-defined controllers contain methods for all their stuff.
 */

import {hornet} from '../main/hornet';
import {cmd} from '../command/cmd';

const chalk = require('chalk');
const readlineSync = require('readline-sync');

export abstract class controller {

    /**
     * Name of controller
     */
    abstract name : string;

    /**
     * Instance of the hornet class so controllers have access to path, available commands, commands etc.
     */
    hornet: hornet;

    /**
     * Some useful getters that might be used in controllers
     */
     getPath() : string[] {
         return this.hornet.path;
     }

    /**
     * cmd class
     */
    cmd : typeof cmd = cmd;

    /**
     * chalk object for colored text
     */
    chalk = new chalk.constructor({level: 2}); // level 2 = supports 256 colors rather than 16 million

    constructor(hornet: hornet) {
        this.hornet = hornet;
    }

    /**
     * Print available commands (again)
     */
    printCommands() : void {
        this.hornet.printAvailableCommands();
    }

    /**
     * Remove last breadcrumb in the trail
     *
     * Pop this.breadcrumb so that the current command isn't counted as a "real" command that the user can
     * go "back" to. The default command "back" is a good example. You should not be able to go back to "back".
     * @return [description]
     */
    removeBreadcrumb() {
        this.hornet.breadcrumb.pop();
    }

    /**
     * Readline (get user input)
     * @param  question string         - Print text (get answer to that question)
     * @param  color    string?        - Color of question (powered by chalk)
     * @param  trim     boolean = true - Trim user input
     * @return          string         - user input
     */
    readline(question : string, color ?: string, trim : boolean = true) : string {
        if(color) {
            question = this.chalk[color](question);
        }
        let inp : string = readlineSync.question(question);
        if(trim) inp = inp.trim();
        return inp;
    }

    /**
     * Same as readline, but returns boolean. True if 'Y', else false
     * @param  question
     * @param  trim
     * @return boolean
     */
    readlineYN(question : string, trim : boolean = true) : boolean {
        let inp : string = readlineSync.question(question);
        if(trim) inp = inp.trim();
        return inp === 'Y';
    }

    /**
     * Add name of current command to 'path' so that the next "available commands" printed
     * are the subcommands of the current command.
     */
    traverseForward() : void {
        if(!this.hornet.activeCommand) {
            throw new Error("hornet.activeCommand is undefined");
        }

        this.hornet.path.push(this.hornet.activeCommand._name);
    }

    /**
     * Remove last element from 'path' so that the next "available commands" printed
     * are the parent commands of the current command.
     * @return [description]
     */
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
    clearScreen() : void {
        this.hornet.clearScreen();
        // process.stdout.write('\x1Bc');
    }

}
