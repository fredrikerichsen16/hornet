"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
const find = require('lodash/find');
const cloneDeep = require('lodash/cloneDeep');
class Run {
    constructor() {
        // chalk
        // Separator between given command, command output, and available commands
        this.lineSeparator = '-----------------------';
        // Options are incremented a bit in printCommands.
        this.optionsIncrement = '\xa0\xa0\xa0\xa0';
        // All user-defined commands in this CLI
        this.commands = [];
        // All default commands in this CLI
        this.defaultCommands = [];
        // Breadcrumb
        this.breadcrumb = [];
        // Path
        this.path = [];
        /**
         * Object literal containing user-defined controllers.
         * key: name of controller
         * value: instance of controller class
         *
         * @problem
         * I think it should be {[key: string] : controller} -- but that creates an error, investigate that
         * (also need to import controller)
         *
         * {[key: string] : any} = no error, ': controller' = error
         */
        this.controllers = {};
    }
    setActiveCommand(command, addToPath = false) {
        this.activeCommand = command;
        if (command._name === 'back' && command._controller === 'DEFAULT')
            return; // @temporary
        this.breadcrumb.push(command);
        // .slice() because it makes a copy. May alter this.path, but NEVER alter command._path
        this.path = command._path.slice();
        // @cleanup this is probably never necessary
        if (addToPath) {
            this.path.push(command._name);
        }
    }
    /**
     * Concat this.commands and this.defaultCommands
     * @return Command[]
     */
    getAllCommands() {
        return this.commands.concat(this.defaultCommands);
    }
    getActiveCommands(withDefault = true) {
        let commands = this.commands;
        let path = this.path;
        let activeCommands = cloneDeep(commands);
        for (let i = 0; i < path.length; i++) {
            try {
                activeCommands = find(activeCommands, { '_name': path[i] })._sub;
            }
            catch (e) {
                console.log('Problem #434');
                process.exit();
            }
        }
        if (withDefault) {
            activeCommands = activeCommands.concat(this.defaultCommands);
        }
        return activeCommands;
    }
    printAvailableCommands(availableCommands) {
        let self = this;
        if (!availableCommands) {
            availableCommands = this.getActiveCommands();
        }
        console.log('Available Commands:');
        availableCommands.forEach(function (command, index) {
            if (command._name === 'back' && self.path.length === 0) {
                return;
            }
            console.log(command._name);
            if (command._options.length > 0) {
                command._options.forEach(function (option) {
                    process.stdout.write(self.optionsIncrement);
                    if (option.short) {
                        process.stdout.write('-' + option.short);
                    }
                    if (option.long) {
                        if (option.short) {
                            process.stdout.write(', ');
                        }
                        process.stdout.write('--' + option.long);
                        if (option.types.length > 0) {
                            process.stdout.write('=[' + option.types.join(':') + ']');
                        }
                    }
                    process.stdout.write(' - ' + option.description);
                    console.log('');
                });
            }
        });
        this.printLineSeparator();
    }
    /**
     * Clear terminal screen (like writing 'clear')
     *
     * @todo
     * Now it fully clears the screen - I just want to shift up so that you can still scroll up to see
     * what you cleared.
     * @param command print the command if one is given. Idea is to clear the screen, then console.log the most recent
     *                command at the top of the screen.
     */
    clearScreen(command) {
        process.stdout.write('\x1Bc');
        if (command)
            console.log(chalk.bold.cyan('> ' + command));
    }
    printLineSeparator() {
        console.log(chalk.white(this.lineSeparator));
    }
}
exports.Run = Run;
