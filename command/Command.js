"use strict";
/**
 * User-defined commands. A command has a name, action, multiple options, and multiple sub commands.
 *
 * TO DO:
 *  - technically I have to write super strict code (wrt error-handling) (because it is to be used by other people)
 *      - for example, I have to check that the parameter passed to .action() is in the format
 *        controllerName.methodName with only characters that are legal class and method names.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const DeclaredOption_1 = require("../option/DeclaredOption");
class Command {
    constructor() {
        this._options = []; // option such as '-l, --limit' but in a structured format
        this._sub = []; // sub commands
        this._path = [];
    }
    /**
     * Setter for _name property - name of command
     * @param  name        [description]
     * @param  description [description]
     * @return             this (for chaining)
     */
    name(name, description) {
        this._name = name;
        this._description = description;
        return this;
    }
    /**
     * Setter for _action property
     * @param  action function with the command functionality or string with location of function
     * @return        this (for chaining)
     */
    action(action) {
        action = action.trim();
        this._action = action;
        // Set ._controller and ._method properties
        let actionAr = action.split('.');
        if (actionAr.length !== 2) {
            throw new Error('.action() must be in format "controllerName.methodName"');
        }
        this._controller = actionAr[0];
        this._method = actionAr[1];
        return this;
    }
    /**
     * Add an option to _options for this command. An option as in a flag such as -g/--global.
     * @param  flags
     * @param  description
     * @param  required
     * @return
     */
    option(flags, description, required = false) {
        this._options.push(new DeclaredOption_1.DeclaredOption(flags, description, required));
        return this;
    }
    /**
     * Insert Subcommands
     * @param  ...subcommands
     * @return
     */
    sub(...subcommands) {
        var self = this;
        for (let i = 0; i < subcommands.length; i++) {
            let subcommand = subcommands[i];
            self._sub.push(subcommand);
        }
        return this;
    }
    /**
     * [getValidFlags description]
     * @return [description]
     */
    getValidFlags() {
    }
    static find(command, activeCommands) {
        for (let activeCmd of activeCommands) {
            if (command === activeCmd._name) {
                return activeCmd;
            }
        }
        return null;
    }
}
exports.Command = Command;
