"use strict";
/**
 * The Command class contains a property which is an array of Option instances.
 * A command can have a number of options, for example -s, --save and -l, --limit=[number].
 * This class encapsulates those options in a structured format rather than as strings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var includes = require('lodash.includes');
var find = require('lodash.find');
class Option {
    constructor() { }
    /**
     * Take the user's input and decompose it into the command itself, and the flags.
     * @param  input For example: command --limit=20 -s argument1 argument2 array1 array2 array3
     * @return       For example:
     * {
     *    'command': 'command',
     *    'flags': {
     *      'limit': '20',
     *      's': null
     *      'argument1': 'argument1Val',
     *      'argument2': 'argument 2 val',
     *      'arrayArgument': [1, 2, 3, 4]
     *    }
     * }
     */
    static decompose(input) {
        input = input.trim();
        let returnObj = {
            command: '',
            arguments: [],
            flags: {}
        };
        /**
         * Extract command
         */
        let commandRegex = /^[\w-]+($|(?=\s))/.exec(input);
        if (commandRegex) {
            let command = commandRegex[0];
            returnObj.command = command;
            input = input.replace(command, '').trim();
        }
        else {
            throw new Error('No command found.');
        }
        /**
         * Extract flags
         * flagsPattern matches: -k, -k=value, --key, --key=value, --key="value value"
         */
        let flags = []; // instantiate array of flags object literals
        let flagsPattern = /((?<=\s)|^)-{1,2}[\w]+(=([\w]+|"[\w\s]+"))?/g;
        let flagsRegex = input.match(flagsPattern);
        if (flagsRegex && flagsRegex.length) { // if any flags were found
            for (let flag of flagsRegex) { // iterate over flags
                let pattern, result; // pattern = regex, result = result of regex
                // check if it's a shortie '-g' etc, return 'g'
                pattern = /(?<=-)\w$/;
                result = pattern.exec(flag);
                if (result) {
                    returnObj.flags[result[0]] = null;
                    continue;
                }
                // check if it's a longie --key or --key=value or key="string with spaces"
                pattern = /(?<=--)\w+(=(["'](\w|\s)+["'])|(=[\w-]+))?/;
                result = pattern.exec(flag);
                if (result) {
                    let resultStr = result[0]; // either '--key' or '--key=value'
                    let [name, value] = resultStr.split('=');
                    if (value) {
                        value = value.replace(/"/g, ''); // '"with spaces"' ->  'with spaces'
                        returnObj.flags[name] = value;
                    }
                    else {
                        console.log(resultStr, name, value, returnObj);
                        throw new Error('Long flags like: --key need a value. I.e. --key=value');
                    }
                }
            }
        }
        /**
         * Extract arguments
         * argsPattern matches "args in this form" this-form thisform "4324"
         */
        let argsPattern = /(?<=(^|\s))("([\w\s]+)"|([\w-]+)|([\d.]+))(?=($|\s))/g;
        let args = input.match(argsPattern);
        if (args && args.length > 0) {
            returnObj.arguments = args;
            input = input.replace(argsPattern, '').trim();
        }
        return returnObj;
    }
    /**
     * Convert value in string format to either boolean, number or string
     * "some string" -> "some string"
     * "false" -> false
     * "0" -> false
     * "324" -> 324
     * @param  datatype Datatype to convert to, if possible
     * @param  value    Value to convert
     * @return          Value in correct datatype. If conversion is possible, otherwise undefined.
     */
    static convertValueToType(datatype, value) {
        switch (datatype) {
            case 'boolean':
                if (value === 'false' || value === '0') {
                    return false;
                }
                else {
                    return true;
                }
                break;
            case 'number':
                let intVal = parseFloat(value);
                if (!isNaN(intVal)) {
                    return intVal;
                }
                else {
                    return undefined;
                    // throw new Error('Must pass a number to arguments of type "number". Error #9104');
                }
                break;
            case 'string':
                return value;
                break;
            default:
                throw new Error('Error #4821');
                break;
        }
    }
    /**
     * Return valid options in their right data type.
     * @param  userOptions    [description]
     * @param  commandOptions [description]
     * @return                [description]
     */
    static validOptions(activeCmd, options) {
        let validOptions = {};
        /**
         * Arguments
         */
        let commandArgs = activeCmd._arguments; // 'arguments' can't be a variable because of a weird TS bug
        let passedArgs = options.arguments;
        for (let arg of commandArgs) {
            if (arg.array) {
                let values = passedArgs.map((val) => {
                    return Option.convertValueToType(arg.type, val);
                });
                if (arg.required && values.length < 1) {
                    // return {'error': `Argument ${arg.name} is required.`};
                    throw new Error(`Argument ${arg.name} is required.`);
                }
                validOptions[arg.name] = values;
            }
            else {
                let value = passedArgs.shift();
                if (arg.required && !value) {
                    // return {'error': `Argument ${arg.name} is required.`};
                    throw new Error(`Argument ${arg.name} is required.`);
                }
                if (value) {
                    let convertedValue = Option.convertValueToType(arg.type, value);
                    validOptions[arg.name] = convertedValue;
                }
                else {
                    validOptions[arg.name] = undefined;
                }
            }
        }
        /**
         * Flags
         */
        let commandFlags = activeCmd._flags;
        let passedFlags = options.flags;
        let flagValue;
        for (let flagName in passedFlags) {
            flagValue = passedFlags[flagName];
            let correctCommandFlag = find(commandFlags, (flag) => {
                return flag.short === flagName || flag.long === flagName;
            });
            if (correctCommandFlag) {
                validOptions[correctCommandFlag.long] = Option.convertValueToType(correctCommandFlag.type, flagValue);
            }
        }
        return validOptions;
    }
}
exports.Option = Option;
