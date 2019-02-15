/**
 * The Command class contains a property which is an array of Option instances.
 * A command can have a number of options, for example -s, --save and -l, --limit=[number].
 * This class encapsulates those options in a structured format rather than as strings.
 */

import {FilledOption} from './FilledOption';
import {DeclaredOption} from './DeclaredOption';
var includes = require('lodash/includes');

export class Option {
    short?: string; // shorthand name of option
    long?: string; // long name of option

    constructor(short: string | null = null, long: string | null = null) {
        if(short) this.short = short;
        if(long) this.long = long;
    }

    /**
     * [validOptions description]
     * @param  userOptions    [description]
     * @param  commandOptions [description]
     * @return                [description]
     */
    static validOptions(userOptions : FilledOption[], commandOptions : DeclaredOption[]) {
        let options: {[key: string] : any} = {};
        let key : string;

        let userOption : FilledOption;
        for(let i = 0; i < userOptions.length; i++)
        {
            userOption = userOptions[i];

            let commandOption : DeclaredOption;
            for(let j = 0; j < commandOptions.length; j++)
            {
                commandOption = commandOptions[j];

                if(userOption.short === commandOption.short || userOption.long === commandOption.long)
                {
                    key = <string> commandOption.long;

                    if(userOption.type === 'number' && (userOption.value === 1 || userOption.value === 0)
                         && includes(commandOption.types, 'boolean') && !includes(commandOption.types, 'number'))
                    {
                        options[key] = userOption.value === 1 ? true : false;
                    }
                    else
                    {
                        options[key] = userOption.value;
                    }

                    break;
                }
            }
        }

        return options;
    }

    // let validFlags = Option.validOptions(options, activeCmd._options);
}
