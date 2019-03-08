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
const Flag_1 = require("../option/Flag");
const Argument_1 = require("../option/Argument");
var findLast = require('lodash.findLast');
class Command {
    constructor() {
        this._flags = []; // option such as '-l, --limit' but in a structured format
        this._arguments = []; // option such as '-l, --limit' but in a structured format
        this._sub = []; // sub commands
        this._path = [];
        /**
         * Pass through commands aren't registered in the breadcrumb and don't update the path.
         * Only use-case so far is for the default "back" command.
         * @setter passThrough
         */
        this._passThrough = false;
        /**
         * Don't show it when displaying available commands
         * @setter hidden
         */
        this._hidden = false;
        /**
         * Default start command. This command runs as soon as program runs.
         */
        this._default = false;
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
     *
     * @todo Rename to flag
     */
    flag(flag, description, required = false) {
        this._flags.push(new Flag_1.Flag(flag, description, required));
        return this;
    }
    /**
     * Add argument such as <name:type> or [name:type]
     * @param  text        [description]
     * @param  description [description]
     * @param  required    [description]
     * @return             [description]
     */
    argument(text, description, required = false) {
        this._arguments.push(new Argument_1.Argument(text, description, required));
        return this;
    }
    passThrough() {
        this._passThrough = true;
        return this;
    }
    hidden() {
        this._hidden = true;
        return this;
    }
    default() {
        this._default = true;
        return this;
    }
    /**
     * Insert Subcommands
     * @param  ...subcommands
     * @return
     */
    sub(...subcommands) {
        if (this._default)
            return this;
        var self = this;
        for (let i = 0; i < subcommands.length; i++) {
            let subcommand = subcommands[i];
            self._sub.push(subcommand);
        }
        return this;
    }
    /**
     * Take command _arguments and if it contains more than one array argument remove all
     * but the last one and move the array argument to the last element in _arguments.
     * @param  commands [description]
     * @return          [description]
     */
    static arrangeArguments(commands) {
        for (let command of commands) {
            let last = findLast(command._arguments, { 'array': true });
            command._arguments = command._arguments.filter((arg) => {
                return arg.array === false;
            });
            if (last) {
                command._arguments.push(last);
            }
            let foundOptional = false;
            for (let arg of command._arguments) {
                if (!arg.required) {
                    foundOptional = true;
                }
                else {
                    if (foundOptional) {
                        throw new Error("Can't have required arguments after optional arguments.");
                    }
                }
            }
        }
    }
    /**
     * Find command with specified name among list of commands
     * @param  command        string - command name
     * @param  activeCommands Command[] - active commands
     * @param  force          boolean - Throw error if command isn't found.
     * @return                Command
     */
    static find(command, activeCommands, force = false) {
        for (let activeCmd of activeCommands) {
            if (command === activeCmd._name) {
                return activeCmd;
            }
        }
        if (force) {
            console.log("Couldn't find command. Error #2043");
            process.exit();
        }
        return undefined;
    }
}
exports.Command = Command;
