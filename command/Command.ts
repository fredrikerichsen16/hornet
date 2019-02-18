/**
 * User-defined commands. A command has a name, action, multiple options, and multiple sub commands.
 *
 * TO DO:
 *  - technically I have to write super strict code (wrt error-handling) (because it is to be used by other people)
 *      - for example, I have to check that the parameter passed to .action() is in the format
 *        controllerName.methodName with only characters that are legal class and method names.
 */

import {DeclaredOption} from '../option/DeclaredOption';

export class Command {
    _name!: string; // name of command, i.e. what user types to access the command
    _description?: string; // description of command, shown in the CLI to help user navigate it
    _action!: string; // path to method which handles the command - Format: 'controller.method'
    _controller!: string;
    _method!: string;
    _options: DeclaredOption[] = []; // option such as '-l, --limit' but in a structured format
    _sub: Command[] = []; // sub commands
    _path: string[] = [];

    /**
     * Setter for _name property - name of command
     * @param  name        [description]
     * @param  description [description]
     * @return             this (for chaining)
     */
    name(name: string, description?: string) {
        this._name = name;
        this._description = description;

        return this;
    }

    /**
     * Setter for _action property
     * @param  action function with the command functionality or string with location of function
     * @return        this (for chaining)
     */
    action(action: any) {
        action = action.trim();
        this._action = action;

        // Set ._controller and ._method properties
        let actionAr : string[] = action.split('.');
        if(actionAr.length !== 2) {
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
    option(flags: string, description: string, required: boolean = false) {
        this._options.push(new DeclaredOption(flags, description, required));

        return this;
    }

    /**
     * Insert Subcommands
     * @param  ...subcommands
     * @return
     */
    sub(...subcommands : Command[]) {
        var self = this;

        for(let i = 0; i < subcommands.length; i++)
        {
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

    static find(command : string, activeCommands : Command[]) : Command | null {
        for(let activeCmd of activeCommands) {
            if(command === activeCmd._name) {
                return activeCmd;
            }
        }

        return null;
    }


}
