"use strict";
/**
 * Flag
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Option_1 = require("./Option");
class Argument extends Option_1.Option {
    constructor(text, description, required = false) {
        super();
        this.array = false;
        let self = this;
        text = text.trim();
        let single = /(?<=(<))(\w+)((:)(string|boolean|number))?(?=(>))/.exec(text);
        if (single) {
            let [name, type] = single[0].split(':');
            set(name, type, false);
            return;
        }
        let array = /(?<=(\[))(\w+)(:)(string|boolean|number)(?=(]))/.exec(text);
        if (array) {
            let [name, type] = array[0].split(':');
            set(name, type, true);
            return;
        }
        function set(name, type = undefined, array) {
            self.name = name;
            self.type = type ? type : 'string';
            self.array = array;
            self.description = description;
            self.required = required;
        }
        throw new Error("Bad argument. Error #7410");
    }
}
exports.Argument = Argument;
