"use strict";
/**
 * DeclaredOption
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class DeclaredOption extends Option_1.Option {
    constructor(flags, description, required = false) {
        super();
        let returnObj = this.deconstructFlags(flags);
        // super(returnObj.short, returnObj.long);
        this.short = returnObj.short;
        this.long = returnObj.long;
        this.types = returnObj.types;
        this.description = description;
        this.required = required;
    }
    /**
     * @example
     * Take a flag string like this: '-l --limit=[number:boolean]' and use regular expressions to
     * set the properties short=l, long=limit, and types=[number, boolean].
     * @todo
     * More error handling, if someone writes the wrong syntax, like --limit=[number, boolean] or something
     * @param  flags string like '-l, --limit' etc.
     * @return       void
     */
    deconstructFlags(flags) {
        let self = this;
        let returnObj = {
            short: undefined, long: undefined,
            types: ['boolean'] // default if no types are defined
        };
        var patt = /(?<=(\s|^)-)\w(=\[\w+\]|(?=\s)|(?=,))/;
        var short = patt.exec(flags);
        if (short)
            returnObj.short = short[0];
        /**
         * (?<=\s) -> positive lookbehind - checks pattern that is preceded by \s (whitespace), but
         *            doesn't include that whitespace in the returned pattern
         * --      -> long flags start with two dashes, like --save
         * \w+     -> then one or more characters for the name of the flag
         * (=\[\w+\]|(?=\s))
         *         -> =[one-or-more-characters] OR single whitespace (positive lookahead)
         */
        var patt = /(?<=(\s|^)--)\w+(=\[[\w:]+\]|(?=\s|$))/;
        var long = patt.exec(flags);
        if (long) {
            let longStr = returnObj.long = long[0];
            var patt = /(?<=(=\[))[\w:]+(?=(\]))/;
            var val = patt.exec(longStr);
            if (val) {
                var vals = val[0].split(':');
                returnObj.types = vals;
            }
            returnObj.long = returnObj.long.replace(/=\[[[\w:]*\]/, '');
        }
        return returnObj;
    }
}
exports.DeclaredOption = DeclaredOption;
