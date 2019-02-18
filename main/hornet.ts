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
                if(self.nextcommand!.command)
                {
                    self.nextcommand = self.handleUserInput(self.nextcommand!.command);
                }
                else if(self.nextcommand!.name || self.nextcommand!.action)
                {
                    let obj : {name?: string, action?: string} = {};
                    if(self.nextcommand.name) {
                        obj.name = self.nextcommand.name;
                    } else if(self.nextcommand.action) {
                        obj.action = self.nextcommand.action;
                    } else {
                        console.log('Nextcommand error. #2');
                        process.exit();
                    }

                    let activeCmd = self.nextcommand.find(this.getAllCommands(), obj);

                    self.clearScreen();

                    if(activeCmd) {
                        self.setActiveCommand(activeCmd);
                        self.nextcommand = this.runCommand(activeCmd, self.nextcommand.options);
                    } else {
                        console.log('Command not found');
                        self.nextcommand = undefined;
                    }
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

        let [command, options] = FilledOption.decompose(userInput);

        // ...

        let activeCmd = Command.find(command, activeCommands);

        /**
         * Might be a better place to put this once I involve more complex return commands
         */
        this.clearScreen(userInput);

        if(activeCmd) {
            this.setActiveCommand(activeCmd);
            let validOptions = Option.validOptions(options, activeCmd._options);
            this.nextcommand = this.runCommand(activeCmd, validOptions);
        } else {
            console.log('Command not found');
            return undefined;
        }

        return this.nextcommand;
    }

    /**
     * Run command
     * @param  activeCmd    the active command that is being run
     * @param  validOptions options/flags in object form.
     * @return              next command (cmd) or undefined
     */
    runCommand(activeCmd : Command, validOptions : types.FreeObjectLiteral = {}) : types.cmd {
        try {
            // fuck this error -- problem is explained in commend above Run.controllers
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

            this.controllers[controller.name] = new controller(this);
        }

        this.controllers['DEFAULT'] = new DefaultController(this);
    }

    /**
     * In app.ts user passes an array of their personal commands.
     * This is a setter + it adds a 'path' to all the nested commands.
     * @param  commands [description]
     * @return          [description]
     */
    setCommands(commands : Command[]) {
        this.commands = commands;
        this.addPath(commands);

        this.defaultCommands = defaultCommands;
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
