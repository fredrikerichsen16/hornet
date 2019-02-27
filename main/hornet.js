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
const FilledOption_1 = require("../option/FilledOption");
const defaultCommands_1 = require("../command/defaultCommands");
class hornet extends Run_1.Run {
    constructor() {
        super(...arguments);
        this.nextcommand = undefined;
    }
    async run() {
        let self = this;
        while (true) {
            if (self.nextcommand) {
                /**
                 * ! is placed after nextcommand because:
                 * https://stackoverflow.com/questions/44147937/property-does-not-exist-on-type-never
                 * Basically compiled assumes this code is unreachable because nextcommand is initially set
                 * to null, so it changes its type to 'never'. ! is probably not an ideal solution.
                 */
                if (self.nextcommand.command) {
                    self.handleUserInput(self.nextcommand.command);
                }
                else if (self.nextcommand.name || self.nextcommand.action) {
                    let obj = {};
                    if (self.nextcommand.name) {
                        obj.name = self.nextcommand.name;
                    }
                    else if (self.nextcommand.action) {
                        obj.action = self.nextcommand.action;
                    }
                    else {
                        console.log('Nextcommand error. Error #3124');
                        process.exit();
                    }
                    let activeCmd = self.nextcommand.find(this.getAllCommands(), obj);
                    if (!activeCmd) {
                        console.log('Command not found.');
                        process.exit();
                    }
                    await this.runCommand(activeCmd, self.nextcommand.options, undefined, undefined);
                }
                else {
                    self.nextcommand = undefined;
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
    async handleUserInput(userInput) {
        let self = this;
        let activeCommands = this.getActiveCommands();
        if (!userInput) {
            this.printAvailableCommands(activeCommands);
            userInput = this.getUserInput();
        }
        let [command, options] = FilledOption_1.FilledOption.decompose(userInput);
        // ...
        let activeCmd = Command_1.Command.find(command, activeCommands);
        await this.runCommand(activeCmd, undefined, options, userInput);
    }
    async runCommand(activeCmd, validOptions = {}, options, userInput) {
        let self = this;
        this.clearScreen(userInput);
        if (activeCmd) {
            this.setActiveCommand(activeCmd);
            if (options) {
                validOptions = Option_1.Option.validOptions(options, activeCmd._options);
            }
            this.nextcommand = await this.controllers[activeCmd._controller][activeCmd._method](validOptions);
            this.printLineSeparator();
        }
        else {
            console.log('Command not found');
            process.exit(); // breakpoint
            return undefined;
        }
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
     * @param  commands Command[]
     * @return          void
     */
    setCommands(commands) {
        this.commands = commands;
        this.addPath(commands);
        this.defaultCommands = defaultCommands_1.defaultCommands;
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
