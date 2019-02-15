"use strict";
/**
 * The Command class contains a property which is an array of Option instances.
 * A command can have a number of options, for example -s, --save and -l, --limit=[number].
 * This class encapsulates those options in a structured format rather than as strings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var includes = require('lodash/includes');
class Option {
    constructor(short = null, long = null) {
        if (short)
            this.short = short;
        if (long)
            this.long = long;
    }
    /**
     * [validOptions description]
     * @param  userOptions    [description]
     * @param  commandOptions [description]
     * @return                [description]
     */
    static validOptions(userOptions, commandOptions) {
        let options = {};
        let key;
        let userOption;
        for (let i = 0; i < userOptions.length; i++) {
            userOption = userOptions[i];
            let commandOption;
            for (let j = 0; j < commandOptions.length; j++) {
                commandOption = commandOptions[j];
                if (userOption.short === commandOption.short || userOption.long === commandOption.long) {
                    key = commandOption.long;
                    if (userOption.type === 'number' && (userOption.value === 1 || userOption.value === 0)
                        && includes(commandOption.types, 'boolean') && !includes(commandOption.types, 'number')) {
                        options[key] = userOption.value === 1 ? true : false;
                    }
                    else {
                        options[key] = userOption.value;
                    }
                    break;
                }
            }
        }
        return options;
    }
}
exports.Option = Option;
