"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Superclass of hornet with extra behind-the-scenes methods
 */
var Run = /** @class */ (function () {
    function Run() {
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
    Run.prototype.decompose = function (input) {
        /**
         * Extract command
         */
        var commandPattern = /^[\w-]+($|(?=\s))/; // regex to find command
        var commandRegex = commandPattern.exec(input); // command regex
        var command;
        if (commandRegex) {
            command = commandRegex[0]; // command string
        }
        else {
            throw new Error('No command found.');
        }
        var flags = []; // instantiate array of flags object literals
        var flagsStr = input.replace(command, '').trim(); // string of the flags only, command removed
        console.log(flagsStr);
        var flagsPattern = /((?<=\s)|^)-{1,2}([\w=]+)/g; // regex to find flags of any kind (-k, -k=value, --key, --key=value)
        var flagsRegex = flagsStr.match(flagsPattern);
        if (flagsRegex && flagsRegex.length > 0) { // if any flags were found
            for (var _i = 0, flagsRegex_1 = flagsRegex; _i < flagsRegex_1.length; _i++) { // iterate over flags
                var flag = flagsRegex_1[_i];
                var pattern = void 0, result = // pattern = regex, result = result of regex
                 void 0; // pattern = regex, result = result of regex
                // check if it's a shortie '-g' etc.
                pattern = /(?<=-)\w$/;
                result = pattern.exec(flag);
                if (result) {
                    flags.push({
                        'short': true,
                        'name': result[0],
                        'value': true
                    });
                    continue;
                }
                // check if it's a longie --key or --key=value
                pattern = /(?<=--)\w+(=\w+)?/;
                result = pattern.exec(flag);
                if (result) {
                    var flagObj = { 'short': false };
                    var resultStr = result[0];
                    var resultAr = resultStr.split('='); // split --key=value into ['key', 'value'] or just ['key'] if there's no value
                    if (resultAr.length === 1) {
                        flagObj.name = resultAr[0];
                    }
                    if (resultAr.length === 2) {
                        flagObj.name = resultAr[0];
                        var value = resultAr[1];
                        flagObj.value = this.returnCorrectDataType(value);
                    }
                    flags.push(flagObj);
                }
            }
        }
        return [command, flags];
    };
    /**
     * Take string and return it as the correct datatype
     * @example
     *   "str1" -> "str1"
     *   "42" -> 42
     *   true -> true
     * @param  s [description]
     * @return   [description]
     */
    Run.prototype.returnCorrectDataType = function (s) {
        var sLower = s.toLowerCase();
        // check if boolean
        if (sLower === 'true' || sLower == 'false') {
            return sLower === 'true' ? true : false;
        }
        // check if int
        var result = /^(\d+)$/.test(s);
        if (result) {
            return parseInt(s);
        }
        return s;
    };
    return Run;
}());
exports.Run = Run;
