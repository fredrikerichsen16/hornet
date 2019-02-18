"use strict";
/**
 * Filled Option
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class FilledOption extends Option_1.Option {
    constructor(short = null, long = null, value = null, type) {
        super(short, long);
        this.value = value;
        this.type = type;
    }
    /**
     * Take the user's input and decompose it into the command itself, and the flags.
     * @example
     * input: 'command-name -s --game=40 --cat=true -z --fiat'
     * return: ['command-name', [{
     *   'short': false, 'name': 'game', 'value': 40
     * }, ...]]
     * @param  input [description]
     * @return       array - index 0: command, index 1: array of flags
     */
    static decompose(input) {
        /**
         * Extract command
         */
        let commandPattern = /^[\w-]+($|(?=\s))/; // regex to find command
        let commandRegex = commandPattern.exec(input); // command regex
        let command;
        if (commandRegex) {
            command = commandRegex[0]; // command string
        }
        else {
            throw new Error('No command found.');
        }
        let flags = []; // instantiate array of flags object literals
        let flagsStr = input.replace(command, '').trim(); // string of the flags only, command removed
        let flagsPattern = /((?<=\s)|^)-{1,2}([\w=]+)/g; // regex to find flags of any kind (-k, -k=value, --key, --key=value)
        let flagsRegex = flagsStr.match(flagsPattern);
        if (flagsRegex && flagsRegex.length > 0) { // if any flags were found
            for (let flag of flagsRegex) { // iterate over flags
                let pattern, result; // pattern = regex, result = result of regex
                // check if it's a shortie '-g' etc.
                pattern = /(?<=-)\w$/;
                result = pattern.exec(flag);
                if (result) {
                    flags.push(new FilledOption(result[0], null, true, 'boolean'));
                    continue;
                }
                // check if it's a longie --key or --key=value
                pattern = /(?<=--)\w+(=\w+)?/;
                result = pattern.exec(flag);
                if (result) {
                    // args corresponding to the argument order in the constructor of this class
                    let args = [null, null, null, null];
                    let resultStr = result[0]; // either '--key' or '--key=value'
                    let resultAr = resultStr.split('='); // split --key=value into ['key', 'value'] or just ['key'] if there's no value
                    if (resultAr.length === 1) {
                        throw new Error('Long flags like: --key need a value. I.e. --key=value');
                        // args[1] = resultAr[0];
                    }
                    else if (resultAr.length === 2) {
                        args[1] = resultAr[0];
                        let value = resultAr[1];
                        [args[2], args[3]] = this.returnCorrectDataType(value);
                    }
                    else {
                        throw new Error('Flag error. #2321');
                    }
                    flags.push(new FilledOption(args[0], args[1], args[2], args[3]));
                }
            }
        }
        return [command, flags];
    }
    /**
     * Take string and return it as the correct datatype
     * @example
     *   "str1" -> "str1"
     *   "42" -> 42
     *   true -> true
     * @param  s [description]
     * @return   [description]
     */
    static returnCorrectDataType(s) {
        let sLower = s.toLowerCase();
        // check if boolean
        if (sLower === 'true' || sLower == 'false') {
            return [sLower === 'true' ? true : false, 'boolean'];
        }
        // check if int
        let result = /^(\d+)$/.test(s);
        if (result) {
            return [parseInt(s), 'number'];
        }
        return [s, 'string'];
    }
}
exports.FilledOption = FilledOption;
