/**
 * Superclass of hornet with extra behind-the-scenes methods
 */
import {Command} from '../command/Command';
import {controller} from '../controller/controller';
import {cmd} from '../command/cmd';
import {Session} from './Session';

const chalk = require('chalk');
const find = require('lodash.find');
const cloneDeep = require('lodash.cloneDeep');

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
    breadcrumb: cmd[] = [];

    // Path
    path: string[] = [];

    // Session
    session : Session = new Session();

    welcomeMessage ?: string;

    /**
     * Object literal containing user-defined controllers.
     * key: name of controller
     * value: instance of controller class
     *
     * Type should be : controller but that causes some problems. Tried fixing,
     * didn't work. 'any' will probably do.
     */
    controllers: {[key: string] : any} = {};

    setActiveCommand(command : cmd) {
        let activeCommand;
        this.activeCommand = activeCommand = <Command> command.command;

        if(activeCommand._passThrough) return;

        this.breadcrumb.push(command);
        this.path = activeCommand._path.slice(); // .slice() because it makes a copy.
                                                 // May alter this.path, but NEVER alter command._path

        // @cleanup this is probably never necessary
        // if(addToPath) {
        //     this.path.push(command._name);
        // }
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
        let activeCommands = this.findCommandsByPath(this.path);

        if(withDefault) {
            activeCommands = activeCommands.concat(this.defaultCommands);
        }

        return activeCommands;
    }

    findCommandsByPath(path : string[], findOne : boolean = false) {
        if(findOne && path.length === 0) return null;

        let commands : Command[] = cloneDeep(this.commands);

        let command;
        for(let i = 0; i < path.length; i++) {
            try {
                command = find(commands, {'_name': path[i]});
                if(findOne && path.length - 1 === i) {
                    return command;
                }
                commands = command._sub;
            } catch(e) {
                console.log('Problem #434');
                process.exit();
            }
        }

        return commands;
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

            if(command._hidden) {
                return;
            }

            process.stdout.write(command._name);
            if(command._description) console.log(' - ' + command._description);
            else console.log();

            if(command._arguments.length > 0)
            {
                command._arguments.forEach(function(arg) {
                    process.stdout.write(self.optionsIncrement);

                    if(arg.array)
                    {
                        process.stdout.write(`[${arg.name}:${arg.type}]`);
                    }
                    else
                    {
                        process.stdout.write(`<${arg.name}:${arg.type}>`);
                    }

                    if(arg.required) {
                        process.stdout.write(' - required');
                    }

                    if(arg.description) {
                        process.stdout.write(` - ${arg.description}`);
                    }
                    console.log('');
                });
            }

            if(command._flags.length > 0)
            {
                command._flags.forEach(function(flag) {
                    process.stdout.write(self.optionsIncrement);
                    if(flag.short)
                    {
                        process.stdout.write(`-${flag.short}`);
                    }
                    if(flag.long)
                    {
                        if(flag.short) {
                            process.stdout.write(', ');
                        }
                        process.stdout.write(`--${flag.long}`);
                        process.stdout.write(`=[${flag.type}]`);
                    }

                    process.stdout.write(` - ${flag.description}`);

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
