/**
 * Superclass of hornet with extra behind-the-scenes methods
 */
export class Run {
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
    decompose(input : string)
    {
        /**
         * Extract command
         */
        let commandPattern = /^[\w-]+($|(?=\s))/; // regex to find command
        let commandRegex = commandPattern.exec(input); // command regex
        let command;
        if(commandRegex) {
            command = commandRegex[0]; // command string
        } else {
            throw new Error('No command found.');
        }

        let flags = []; // instantiate array of flags object literals
        let flagsStr = input.replace(command, '').trim(); // string of the flags only, command removed
        console.log(flagsStr);

        let flagsPattern = /((?<=\s)|^)-{1,2}([\w=]+)/g; // regex to find flags of any kind (-k, -k=value, --key, --key=value)
        let flagsRegex = flagsStr.match(flagsPattern);
        if(flagsRegex && flagsRegex.length > 0) { // if any flags were found
            for(let flag of flagsRegex) { // iterate over flags
                let pattern, result; // pattern = regex, result = result of regex

                // check if it's a shortie '-g' etc.
                pattern = /(?<=-)\w$/;
                result = pattern.exec(flag);
                if(result) {
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
                if(result) {
                    let flagObj: {[key: string]: any} = {'short': false};
                    let resultStr = result[0];
                    let resultAr = resultStr.split('='); // split --key=value into ['key', 'value'] or just ['key'] if there's no value

                    if(resultAr.length === 1) {
                        flagObj.name = resultAr[0];
                    }
                    if(resultAr.length === 2) {
                        flagObj.name = resultAr[0];

                        let value = resultAr[1];
                        flagObj.value = this.returnCorrectDataType(value);
                    }
                    flags.push(flagObj);
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
    returnCorrectDataType(s : string)
    {
        let sLower = s.toLowerCase();

        // check if boolean
        if(sLower === 'true' || sLower == 'false') {
            return sLower === 'true' ? true : false;
        }

        // check if int
        let result = /^(\d+)$/.test(s);
        if(result) {
            return parseInt(s);
        }

        return s;
    }
}
