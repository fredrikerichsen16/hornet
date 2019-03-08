/**
 * Flag
 */

import {Option} from './Option';

export class Argument extends Option {
    name!: string;
    type!: string;
    array: boolean = false;
    description!: string;
    required!: boolean;

    constructor(text: string, description: string, required: boolean = false) {
        super();
        let self = this;

        text = text.trim();

        let single = /(?<=(<))(\w+)((:)(string|boolean|number))?(?=(>))/.exec(text);
        if(single)
        {
            let [name, type] = single[0].split(':');
            set(name, type, false);
            return;
        }

        let array = /(?<=(\[))(\w+)(:)(string|boolean|number)(?=(]))/.exec(text);
        if(array)
        {
            let [name, type] = array[0].split(':');
            set(name, type, true);
            return;
        }

        function set(name : string, type : string | undefined = undefined, array : boolean) {
            self.name = name;
            self.type = type ? type : 'string';
            self.array = array;

            self.description = description;
            self.required = required;
        }

        throw new Error("Bad argument. Error #7410");
    }
}
