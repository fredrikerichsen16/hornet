/**
 * Superclass of hornet with extra behind-the-scenes methods
 */
import {Command} from './Command';

const chalk = require('chalk');
const find = require('lodash/find');
const cloneDeep = require('lodash/cloneDeep');

export class Run {

    // chalk

    // Separator between given command, command output, and available commands
    lineSeparator : string = '-----------------------';

    optionsIncrement : string = '\xa0\xa0\xa0\xa0';

    // current command being run
    activeCommand?: Command;

    // All commands in this CLI
    commands: Command[] = [];

    // Breadcrumb
    breadcrumb: Command[] = [];

    // Path
    path: string[] = [];

    /**
     * Object literal containing user-defined controllers.
     * key: name of controller
     * value: instance of controller class
     *
     * @problem
     * I think it should be {[key: string] : controller} -- but that creates an error, investigate that
     * (also need to import controller)
     */
    controllers: {[key: string] : any} = {};

    setActiveCommand(command : Command, addToPath : boolean = false) {
        this.activeCommand = command;
        this.breadcrumb.push(command);
        // .slice() because it makes a copy. May alter this.path, but NEVER alter command._path
        this.path = command._path.slice();

        // @cleanup this is probably never necessary
        if(addToPath) {
            this.path.push(command._name);
        }
    }

    getActiveCommands() : Command[] {
        let commands = this.commands;
        let path = this.path;

        let activeCommands = cloneDeep(commands);

        for(let i = 0; i < path.length; i++) {
            activeCommands = find(activeCommands, {'_name': path[i]})._sub;
        }

        return activeCommands;
    }

    printAvailableCommands(availableCommands : Command[]) : void {
        let self = this;

        console.log('Available Commands:');

        availableCommands.forEach(function(command, index) {
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

            // @cleanup
            // if(index != availableCommands.length - 1) {
            //     console.log('...');
            // }
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
    clearScreen(command ?: string) : void {
        process.stdout.write('\x1Bc');
        if(command) console.log(chalk.bold.cyan('> ' + command));
    }

    printLineSeparator() {
        console.log(chalk.white(this.lineSeparator));
    }

}
