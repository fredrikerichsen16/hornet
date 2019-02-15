"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readlineSync = require('readline-sync');
const Command_1 = require("./Command");
const Option_1 = require("./Option");
const DefaultController_1 = require("./DefaultController");
const Run_1 = require("./Run");
const FilledOption_1 = require("./FilledOption");
class hornet extends Run_1.Run {
    constructor() {
        super(...arguments);
        this.nextcommand = undefined;
    }
    run() {
        var self = this;
        while (true) {
            if (self.nextcommand) {
                /**
                 * ! is placed after nextcommand because:
                 * https://stackoverflow.com/questions/44147937/property-does-not-exist-on-type-never
                 * Basically compiled assumes this code is unreachable because nextcommand is initially set
                 * to null, so it changes its type to 'never'. ! is probably not an ideal solution.
                 */
                if (self.nextcommand.command) {
                    self.nextcommand = self.handleUserInput(self.nextcommand.command);
                    continue;
                }
                if (self.nextcommand.name || self.nextcommand.action) {
                    let obj = {};
                    if (self.nextcommand.name) {
                        obj.name = self.nextcommand.name;
                    }
                    else {
                        obj.action = self.nextcommand.action;
                    }
                    let activeCmd = self.nextcommand.find(this.commands, obj);
                    self.clearScreen();
                    if (activeCmd) {
                        self.setActiveCommand(activeCmd);
                        self.nextcommand = this.runCommand(activeCmd, self.nextcommand.options);
                    }
                    else {
                        console.log('Command not found');
                        self.nextcommand = undefined;
                    }
                    continue;
                }
            }
            else {
                self.nextcommand = self.handleUserInput();
            }
        }
    }
    getUserInput() {
        let inp = readlineSync.question('>').trim(); // get user input
        if (inp === '')
            this.getUserInput();
        return inp;
    }
    handleUserInput(userInput) {
        let activeCommands = this.getActiveCommands();
        if (!userInput) {
            this.printAvailableCommands(activeCommands);
            userInput = this.getUserInput();
        }
        /**
         * Might be a better place to put this once I involve more complex return commands
         */
        this.clearScreen(userInput);
        let [command, options] = FilledOption_1.FilledOption.decompose(userInput);
        // ...
        let activeCmd = Command_1.Command.find(command, activeCommands);
        if (activeCmd) {
            this.setActiveCommand(activeCmd);
            let validOptions = Option_1.Option.validOptions(options, activeCmd._options);
            this.nextcommand = this.runCommand(activeCmd, validOptions);
        }
        else {
            console.log('Command not found');
        }
        return this.nextcommand;
    }
    runCommand(activeCmd, validOptions = {}) {
        try {
            let nextcommand = this.controllers[activeCmd._controller][activeCmd._method](validOptions);
            this.printLineSeparator();
            return nextcommand;
        }
        catch (e) {
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
    register(...controllers) {
        for (let controller of controllers) {
            if (controller.name === 'DEFAULT')
                throw new Error('"DEFAULT" is a reserved controller name, use a different name.');
            this.controllers[controller.name] = new controller(this);
        }
        this.controllers['DEFAULT'] = new DefaultController_1.DefaultController(this);
    }
    setCommands(commands) {
        this.commands = commands;
        this.addPath(commands);
    }
    /**
     * Recursive function to add array with path to this particular object (i.e. the sequence of keys to access the object)
     * @relatesto setCommands
     * @todo Maybe make it more general form so I can reuse it on different nested arrays of objects. For now, though,
     * I only need it on commands
     */
    addPath(commands, path = []) {
        for (let i = 0, len = commands.length; i < len; i++) {
            let command = commands[i];
            command._path = path;
            if (command.hasOwnProperty('_sub') && command._sub !== []) {
                this.addPath(command._sub, path.concat([command._name]));
            }
        }
    }
}
exports.hornet = hornet;
