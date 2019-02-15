var readlineSync = require('readline-sync');
import {Command} from './Command';
import {Option} from './Option';
import {controller} from './controller';
import {DefaultController} from './DefaultController';
import {Run} from './Run';
import {FilledOption} from './FilledOption';
import {cmd} from './cmd';
import * as types from './types';

export class hornet extends Run {

    nextcommand ?: cmd = undefined;

    run() : void {
        var self = this;

        while(true)
        {
            if(self.nextcommand)
            {
                /**
                 * ! is placed after nextcommand because:
                 * https://stackoverflow.com/questions/44147937/property-does-not-exist-on-type-never
                 * Basically compiled assumes this code is unreachable because nextcommand is initially set
                 * to null, so it changes its type to 'never'. ! is probably not an ideal solution.
                 */
                if(self.nextcommand!.command) {
                    self.nextcommand = self.handleUserInput(self.nextcommand!.command);
                    continue;
                }

                if(self.nextcommand!.name || self.nextcommand!.action) {
                    let obj : {name?: string, action?: string} = {};
                    if(self.nextcommand.name) {
                        obj.name = self.nextcommand.name;
                    } else {
                        obj.action = self.nextcommand.action;
                    }

                    let activeCmd = self.nextcommand.find(this.commands, obj);

                    self.clearScreen();

                    if(activeCmd) {
                        self.setActiveCommand(activeCmd);
                        self.nextcommand = this.runCommand(activeCmd, self.nextcommand.options);
                    } else {
                        console.log('Command not found');
                        self.nextcommand = undefined;
                    }

                    continue;
                }
            }
            else
            {
                self.nextcommand = self.handleUserInput();
            }
        }
    }

    getUserInput() : string {
        let inp : string = readlineSync.question('>').trim(); // get user input
        if(inp === '') this.getUserInput();

        return inp;
    }

    handleUserInput(userInput ?: string) : cmd | undefined {
        let activeCommands = this.getActiveCommands();

        if(!userInput) {
            this.printAvailableCommands(activeCommands);
            userInput = this.getUserInput();
        }

        /**
         * Might be a better place to put this once I involve more complex return commands
         */
        this.clearScreen(userInput);

        let [command, options] = FilledOption.decompose(userInput);

        // ...

        let activeCmd = Command.find(command, activeCommands);
        if(activeCmd) {
            this.setActiveCommand(activeCmd);
            let validOptions = Option.validOptions(options, activeCmd._options);
            this.nextcommand = this.runCommand(activeCmd, validOptions);
        } else {
            console.log('Command not found');
        }

        return this.nextcommand;
    }

    runCommand(activeCmd : Command, validOptions : types.FreeObjectLiteral = {}) : types.cmd {
        try {
            let nextcommand = this.controllers[activeCmd._controller][activeCmd._method](validOptions);
            this.printLineSeparator();
            return nextcommand;
        } catch(e) {
            console.log("The command you entered was valid but it either doesn't have a controller method or the controller method's signature is invalid");
            process.exit();
        }
    }

    /**
     * Register controllers so they can be accessed in the property 'controllers' - a literal object with all
     * user-defined controllers. (key = name of controller, value = user defined controller class)
     * @param  ...controllers controller classes (must be subclass of controller)
     * @return                void
     *
     * @problem
     * Signature should be the following, but Liskov's Substitution Principle aint workin for
     * some reason, so I'll use "any".
     * register(...controllers : controller[]): void {
     */
    register(...controllers : any[]): void {
        for(let controller of controllers) {
            if(controller.name === 'DEFAULT')
                throw new Error('"DEFAULT" is a reserved controller name, use a different name.');

            this.controllers[controller.name] = <controller> new controller(this);
        }

        this.controllers['DEFAULT'] = <controller> new DefaultController(this);
    }

    setCommands(commands : Command[]) {
        this.commands = commands;
        this.addPath(commands);
    }

    /**
     * Recursive function to add array with path to this particular object (i.e. the sequence of keys to access the object)
     * @relatesto setCommands
     * @todo Maybe make it more general form so I can reuse it on different nested arrays of objects. For now, though,
     * I only need it on commands
     */
    addPath(commands : Command[], path : string[] = []) : any {
        for(let i = 0, len = commands.length; i < len; i++) {
            let command = commands[i];
            command._path = path;
            if(command.hasOwnProperty('_sub') && command._sub !== []) {
                this.addPath(command._sub, path.concat([command._name]));
            }
        }
    }
}
