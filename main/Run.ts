/**
 * Superclass of hornet with extra behind-the-scenes methods
 */
import {Command} from '../command/Command';
import {controller} from '../controller/controller';

const chalk = require('chalk');
const find = require('lodash/find');
const cloneDeep = require('lodash/cloneDeep');

export class Run {

    // chalk

    // Separator between given command, command output, and available commands
    lineSeparator : string = '-----------------------';

    // Options are incremented a bit in printCommands.
    optionsIncrement : string = '\xa0\xa0\xa0\xa0';

    // current command being run
    activeCommand?: Command;

    // All user-defined commands in this CLI
    commands: Command[] = [];

    // All default commands in this CLI
    defaultCommands: Command[] = [];

    // Breadcrumb
    breadcrumb: Command[] = [];

    // Path
    path: string[] = [];

    /**
     * Object literal containing user-defined controllers.
     * key: name of controller
     * value: instance of controller class
     *
     * Type should be : controller but that causes some problems. Tried fixing,
     * didn't work. 'any' will probably do.
     */
    controllers: {[key: string] : any} = {};

    setActiveCommand(command : Command, addToPath : boolean = false) {
        this.activeCommand = command;

        if(command._name === 'back' && command._controller === 'DEFAULT') return; // @temporary

        this.breadcrumb.push(command);
        this.path = command._path.slice(); // .slice() because it makes a copy.
                                           // May alter this.path, but NEVER alter command._path

        // @cleanup this is probably never necessary
        if(addToPath) {
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

    /**
     * Get the commands available for the user to use at the current level of nesting
     * @param  withDefault boolean = true - If true, include default commands
     * @return             Command[]
     */
    getActiveCommands(withDefault : boolean = true) : Command[] {
        let commands = this.commands;
        let path = this.path;

        let activeCommands = cloneDeep(commands);

        for(let i = 0; i < path.length; i++) {
            try {
                activeCommands = find(activeCommands, {'_name': path[i]})._sub;
            } catch(e) {
                console.log('Problem #434');
                process.exit();
            }
        }

        if(withDefault) {
            activeCommands = activeCommands.concat(this.defaultCommands);
        }

        return activeCommands;
    }

    /**
     * Print available commands
     * @param availableCommands - Command[] - Print these commands if given.
     */
    printAvailableCommands(availableCommands? : Command[]) : void {
        let self = this;

        if(!availableCommands) {
            availableCommands = this.getActiveCommands();
        }

        console.log('Available Commands:');

        availableCommands.forEach(function(command, index) {
            // Don't print the default command 'back' if it's the first command
            if(command._name === 'back' && self.path.length === 0 && self.breadcrumb.length === 0) {
                return;
            }

            console.log(command._name);

            if(command._options.length > 0) {
                command._options.forEach(function(option) {
                    process.stdout.write(self.optionsIncrement);
                    if(option.short) {
                        process.stdout.write('-' + option.short);
                    }
                    if(option.long) {
                        if(option.short) {
                            process.stdout.write(', ');
                        }
                        process.stdout.write('--' + option.long);

                        if(option.types.length > 0) {
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
     */
    clearScreen(command ?: string) : void {
        process.stdout.write('\u001B[2J\u001B[0;0f');

        // process.stdout.write('\x1Bc');
        if(command) console.log(chalk.bold.cyan('> ' + command));
    }

    printLineSeparator() {
        console.log(chalk.white(this.lineSeparator));
    }

}
