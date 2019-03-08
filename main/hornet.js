"use strict";
/**
 * Main class.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var readlineSync = require('readline-sync');
const Command_1 = require("../command/Command");
const Option_1 = require("../option/Option");
const DefaultController_1 = require("../controller/DefaultController");
const Run_1 = require("./Run");
const cmd_1 = require("../command/cmd");
const defaultCommands_1 = require("../command/defaultCommands");
const helperFunctions_1 = require("./helperFunctions");
let find = require('lodash.find');
class hornet extends Run_1.Run {
    constructor() {
        super(...arguments);
        this.nextCommand = undefined;
    }
    findDefaultCommand() {
        let defaultCommand = find(this.commands, { '_default': true }) ||
            find(this.defaultCommands, { '_default': true });
        if (!defaultCommand)
            throw new Error('No default starting command for unknown reason. Error #1102');
        // Doesn't work, so i'll just do it in Command.default()
        defaultCommand._sub = [];
        defaultCommand._hidden = true;
        defaultCommand._passThrough = false;
        return new cmd_1.cmd(this, {}, defaultCommand);
    }
    async run() {
        let self = this;
        this.nextCommand = this.findDefaultCommand();
        while (true) {
            if (self.nextCommand) {
                if (self.nextCommand.isInput()) {
                    await self.handleUserInput(self.nextCommand);
                }
                else if (self.nextCommand.isCommand()) {
                    await this.runCommand(self.nextCommand);
                }
                else {
                    self.nextCommand = undefined;
                }
            }
            else {
                await self.handleUserInput();
            }
        }
    }
    getUserInput() {
        let inp = readlineSync.question('>').trim(); // get user input
        if (inp === '')
            this.getUserInput();
        return inp;
    }
    async handleUserInput(command) {
        let self = this;
        if (command && !command.input) {
            console.log('Error #3710');
            process.exit();
        }
        let activeCommands = this.getActiveCommands();
        let userInput;
        if (!command) {
            this.printAvailableCommands(activeCommands);
            userInput = this.getUserInput();
            command = new cmd_1.cmd(this, { 'command': userInput });
        }
        let returnObj = Option_1.Option.decompose(command.input);
        let activeCmd = Command_1.Command.find(returnObj.command, activeCommands);
        let validOptions;
        if (activeCmd) {
            validOptions = Option_1.Option.validOptions(activeCmd, returnObj);
        }
        else {
            activeCmd = self.getErrorCommand();
            validOptions = { 'error': 'Command not found' };
        }
        command.command = activeCmd;
        command.options = validOptions;
        await this.runCommand(command);
    }
    getErrorCommand() {
        let errorCommand = find(this.defaultCommands, { '_name': 'error' });
        if (!errorCommand)
            throw new Error("Error encountered but default error command wasn't found.");
        return errorCommand;
    }
    async runCommand(command) {
        let self = this;
        this.clearScreen(command.input);
        this.setActiveCommand(command);
        let activeCommand = command.command;
        this.nextCommand = await this.controllers[activeCommand._controller][activeCommand._method](command.options);
        this.printLineSeparator();
    }
    /**
     * Register controllers so they can be accessed in the property 'controllers' - a literal object with all
     * user-defined controllers. (key = name of controller, value = user defined controller class)
     * @param  ...controllers controller classes (must be subclass of controller)
     * @return                void
     */
    register(...controllers) {
        for (let controller of controllers) {
            if (controller.name === 'DEFAULT') {
                throw new Error('"DEFAULT" is a reserved controller name, use a different name.');
            }
            this.controllers[controller.name] = new controller(this);
        }
        this.controllers['DEFAULT'] = new DefaultController_1.DefaultController(this);
    }
    /**
     * In app.ts user passes an array of their app's commands.
     * This is a setter + it adds a 'path' to all the nested commands.
     *
     * Also, it does some extra stuff that needs to be done after user has defined
     * all the commands.
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
    setCommands(commands) {
        this.commands = commands;
        this.addPath(commands);
        this.defaultCommands = defaultCommands_1.defaultCommands;
        /**
         * - remove duplicate array arguments
         * - put array argument at the end of the _arguments
         */
        Command_1.Command.arrangeArguments(helperFunctions_1.flatten(this.commands, '_sub'));
    }
    /**
     * Recursive function to add array with path to this particular object (i.e. the sequence of keys to access the object)
     *
     * @relatesto setCommands
     * @todo Maybe make it more general form so I can reuse it on different nested arrays of objects. For now, though,
     * I only need it on commands
     */
    addPath(commands, path = []) {
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];
            command._path = path;
            if (command.hasOwnProperty('_sub') && command._sub !== []) {
                this.addPath(command._sub, path.concat([command._name]));
            }
        }
    }
}
exports.hornet = hornet;
