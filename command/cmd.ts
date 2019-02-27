let includes = require('lodash/includes');

import {Command} from './Command';
import * as types from '../main/types';
import {flatten} from '../main/helperFunctions';

/**
 * CMDs are contructed using an object inside controllers. For example in a user-defined
 * controller they can go to the next command by writing:
 * return this.cmd({name: 'houses.detail', options: {'id': 2}});
 */
interface ConstructorObject {
    name?: string,
    action?: string,
    command?: string,
    default?: string,
    options?: {[key: string] : any}
}

export class cmd {
    name?: string; // name of command, i.e. what user types to access the command
    action?: string; // path to method which handles the command - Format: 'controller.method'
    command?: string;
    options?: types.FreeObjectLiteral = {};

    /**
     * @todo
     * Don't use switch statement - tedious solution. But for some reason it's not possible to set a property like this:
     * this[key] = obj[key]; (Can't use bracket notation with a variable inside to set a property)
     * @param obj type: ContructorObject
     */
    constructor(obj : ConstructorObject) {
        for (const key of Object.keys(obj)) {
            switch(key) {
                case 'name':
                    this.name = obj[key];
                    break;
                case 'action':
                    this.action = obj[key];
                    break;
                case 'default':
                    this.action = 'DEFAULT.' + obj[key];
                    break;
                case 'command':
                    this.command = obj[key];
                    break;
                case 'options':
                    this.options = obj[key];
            }
        }
    }

    /**
     * Find the actual command object (Command class) corresponding to a cmd object.
     * @param  commands Command[] - List of commands to search
     * @param  obj      Object containing search parameters. Either the name of
     *                  the command or the action ("controllerName.methodName")
     * @return          Command
     */
    find(commands : Command[], obj : {name?: string, action?: string}) : Command | undefined {
        let self = this;
        let searchBy = obj.name ? 'name' : 'action';

        var flattenedCommands = flatten(commands, '_sub');

        for(let activeCmd of flattenedCommands) {
            if(searchBy === 'name' && activeCmd._name === obj.name) {
                return activeCmd;
            }
            if(searchBy === 'action' && activeCmd._action === obj.action) {
                return activeCmd;
            }
        }

        return undefined;
    }
}
