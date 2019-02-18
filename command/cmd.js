"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let includes = require('lodash/includes');
const helperFunctions_1 = require("../main/helperFunctions");
class cmd {
    /**
     * @todo
     * Don't use switch statement - tedious solution. But for some reason it's not possible to set a property like this:
     * this[key] = obj[key]; (Can't use bracket notation with a variable inside to set a property)
     * @param obj type: ContructorObject
     */
    constructor(obj) {
        this.options = {};
        for (const key of Object.keys(obj)) {
            switch (key) {
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
    find(commands, obj) {
        let self = this;
        let searchBy = obj.name ? 'name' : 'action';
        var flattenedCommands = helperFunctions_1.flat(commands, '_sub');
        for (let activeCmd of flattenedCommands) {
            if (searchBy === 'name' && activeCmd._name === obj.name) {
                return activeCmd;
            }
            if (searchBy === 'action' && activeCmd._action === obj.action) {
                return activeCmd;
            }
        }
    }
}
exports.cmd = cmd;
