"use strict";
/**
 * Flag
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class Flag extends Option_1.Option {
    constructor(flag, description, required = false) {
        super();
        let returnObj = this.deconstructFlag(flag);
        this.short = returnObj.short;
        this.long = returnObj.long;
        this.type = returnObj.type;
        this.description = description;
        this.required = required;
    }
    /**
     * @example
     * Take a flag string like this: '-l --limit=[number]' and use regular expressions to
     * set the properties short=l, long=limit, and types=[number, boolean].
     * @todo
     * More error handling, if someone writes the wrong syntax, like --limit=[number, boolean] or something
     * @param  flags string like '-l, --limit' etc.
     * @return       void
     */
    deconstructFlag(flag) {
        let self = this;
        let returnObj = {
            short: undefined, long: undefined,
            type: 'boolean' // default if no types are defined
        };
        let patt = /(?<=(\s|^)-)\w(=\[\w+\]|(?=\s)|(?=,))/;
        let short = patt.exec(flag);
        if (short)
            returnObj.short = short[0];
        /**
         * @cleanup - remove this or write it better
         * (?<=\s) -> positive lookbehind - checks pattern that is preceded by \s (whitespace), but
         *            doesn't include that whitespace in the returned pattern
         * --      -> long flags start with two dashes, like --save
         * \w+     -> then one or more characters for the name of the flag
         * (=\[\w+\]|(?=\s))
         *         -> =[one-or-more-characters] OR single whitespace (positive lookahead)
         */
        let long = /(?<=(\s|^)--)\w+(=\[[\w:]+\]|(?=\s|$))/.exec(flag);
        if (long) {
            let longStr = long[0]; // '--flagName=[type]'
            let longName = /\w+(?==)?/.exec(longStr); // 'flagName'
            if (longName) {
                returnObj.long = longName[0];
            }
            else {
                console.log('Error #2304');
                process.exit();
            }
            let longType = /(?<=(=\[))(string|number|boolean)(?=(\]))/.exec(longStr);
            if (longType) {
                returnObj.type = longType[0];
            }
            else {
                if (/^\w+$/.exec(longStr)) { // '--flagName' (default type then is boolean)
                    returnObj.type = 'boolean';
                }
                else {
                    console.log('Flags must have type "boolean", "number", or "string"');
                    process.exit();
                }
            }
        }
        return returnObj;
    }
}
exports.Flag = Flag;
