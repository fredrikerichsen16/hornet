let includes = require('lodash.includes');

import {hornet} from '../main/hornet';
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
    // name?: string; // name of command, i.e. what user types to access the command
    // action?: string; // path to method which handles the command - Format: 'controller.method'
    // command?: string;

    command ?: Command;
    input ?: string;
    options : types.FreeObjectLiteral = {};
    hornet : hornet;
    output : string = "";

    /**
     * @todo
     * Don't use switch statement - tedious solution. But for some reason it's not possible to set a property like this:
     * this[key] = obj[key]; (Can't use bracket notation with a variable inside to set a property)
     * @param obj type: ContructorObject
     */
    constructor(hornet : hornet, obj : ConstructorObject = {}, _command ?: Command) {
        this.hornet = hornet;

        if(_command) // && obj === {} doesn't work for some reason
        {
            this.command = _command;
        }
        else
        {
            let name, action, command;
            if(obj.hasOwnProperty('default') && typeof obj.default === 'string')
            {
                obj.action = 'DEFAULT.' + obj.default;

                this.find(undefined, obj.action);
            }
            else if(obj.hasOwnProperty('name') && typeof obj.name === 'string')
            {
                this.find(obj.name);
            }
            else if(obj.hasOwnProperty('action') && typeof obj.action === 'string')
            {
                if(obj.action.split('.').length !== 2) {
                    console.log('Error #8321');
                    process.exit();
                }

                this.find(obj.action);
            }
            else if(obj.hasOwnProperty('command') && typeof obj.command === 'string')
            {
                this.input = obj.command;
            }
            else
            {
                console.log('Return command needs to include either "name", "action", "default", or "command" - error #6174');
            }

            if(obj.hasOwnProperty('options') && typeof obj.options === 'object')
            {
                this.options = obj.options;
            }

            if(!this.input && this.command) {
                /**
                 * Set default "input" to just the name of the command so that when user goes "back"
                 * to that input it shows the name of the command they are on.
                 * This input is overwritten when
                 */
                let input = this.command._name;

                let value;
                for (let key in this.options) {
                    value = this.options[key];
                    input += ` --${key}=${value} `;
                }

                input = input.trim();

                this.input = input;
            }
        }
    }

    // let activeCmd = self.nextcommand.find(this.getAllCommands(), obj);

    find(name ?: string, action ?: string) : Command | undefined {
        let self = this;
        let searchBy = name ? 'name' : 'action';

        let allCommands = this.hornet.getAllCommands();
        let flattenedCommands = flatten(allCommands, '_sub');

        for(let activeCmd of flattenedCommands) {
            if(searchBy === 'name' && activeCmd._name === name) {
                self.command = activeCmd;
                return;
            }
            if(searchBy === 'action' && activeCmd._action === action) {
                self.command = activeCmd;
                return;
            }
        }

        console.log('return command not found. Error #2134');

        return undefined;
    }

    isInput()
    {
        return this.input && !this.command;
    }

    isCommand()
    {
        return this.command;
    }
}
