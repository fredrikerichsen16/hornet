/**
 * Main class.
 */

var readlineSync = require('readline-sync');
import {Command} from '../command/Command';
import {Option} from '../option/Option';
import {controller} from '../controller/controller';
import {DefaultController} from '../controller/DefaultController';
import {Run} from './Run';
import {FilledOption} from '../option/FilledOption';
import {cmd} from '../command/cmd';
import * as types from './types';
import {defaultCommands} from '../command/defaultCommands';

export class hornet extends Run {

    nextCommand ?: cmd = undefined;

    async run() {
        let self = this;

        while(true)
        {
            if(self.nextCommand)
            {
                if(self.nextCommand.isInput())
                {
                    await self.handleUserInput(self.nextCommand);
                }
                else if(self.nextCommand.isCommand())
                {
                    await this.runCommand(self.nextCommand);
                }
                else
                {
                    self.nextCommand = undefined;
                }
            }
            else
            {
                await self.handleUserInput();
            }
        }
    }

    getUserInput() : string {
        let inp : string = readlineSync.question('>').trim(); // get user input
        if(inp === '') this.getUserInput();

        return inp;
    }

    async handleUserInput(command ?: cmd) {
        let self = this;

        if(command && !command.input) {
            console.log('Error #3710');
            process.exit();
        }

        let activeCommands = this.getActiveCommands();

        let userInput;
        if(!command) {
            this.printAvailableCommands(activeCommands);
            userInput = this.getUserInput();
            command = new cmd(this, {'command': userInput});
        }

        let [commandName, options] = FilledOption.decompose(<string> command.input);
        let activeCmd = <Command> Command.find(commandName, activeCommands, true);
        let validOptions = Option.validOptions(options, activeCmd._options);

        command.command = activeCmd;
        command.options = validOptions;

        await this.runCommand(command);
    }

    async runCommand(command : cmd)
    {
        let self = this;

        this.clearScreen(command.input);

        this.setActiveCommand(command);

        let activeCommand = <Command> command.command;

        this.nextCommand = await this.controllers[activeCommand._controller][activeCommand._method](command.options);
        this.printLineSeparator();
    }

    commandNotFound()
    {
        console.log('Command not found');
        process.exit(); // breakpoint
    }

    /**
     * Register controllers so they can be accessed in the property 'controllers' - a literal object with all
     * user-defined controllers. (key = name of controller, value = user defined controller class)
     * @param  ...controllers controller classes (must be subclass of controller)
     * @return                void
     */
    register(...controllers : any[]) : void {
        for(let controller of controllers) {
            if(controller.name === 'DEFAULT') {
                throw new Error('"DEFAULT" is a reserved controller name, use a different name.');
            }

            this.controllers[controller.name] = <controller> new controller(this);
        }

        this.controllers['DEFAULT'] = <controller> new DefaultController(this);
    }

    /**
     * In app.ts user passes an array of their app's commands.
     * This is a setter + it adds a 'path' to all the nested commands.
     *
     * @example in app.ts user writes something like
     * CLI.setCommands([
     *   command
     *      subcommand
     *      subcommand
     *          subcommand
     *   command
     * ])
     * @param  commands Command[]
     * @return          void
     */
    setCommands(commands : Command[]) : void {
        this.commands = commands;
        this.addPath(commands);

        this.defaultCommands = defaultCommands;
    }

    /**
     * Recursive function to add array with path to this particular object (i.e. the sequence of keys to access the object)
     *
     * @relatesto setCommands
     * @todo Maybe make it more general form so I can reuse it on different nested arrays of objects. For now, though,
     * I only need it on commands
     */
    addPath(commands : Command[], path : string[] = []) : any {
        for(let i = 0; i < commands.length; i++) {
            let command = commands[i];
            command._path = path;
            if(command.hasOwnProperty('_sub') && command._sub !== []) {
                this.addPath(command._sub, path.concat([command._name]));
            }
        }
    }
}
