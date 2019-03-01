import {FreeObjectLiteral} from './types';

export class Session {

    values : FreeObjectLiteral = {};

    get(key : string) {
        if(this.values.hasOwnProperty(key)) {
            return this.values[key];
        } else {
            return undefined;
        }
    }

    set(key : string, value : any, overwrite : boolean = true) {
        if(overwrite) {
            this.values[key] = value;
            return value;
        } else {
            if(!this.get(key)) {
                this.values[key] = value;
                return value;
            } else {
                return this.values[key];
            }
        }
    }

    getOrSet(key : string, value : any) {
        return this.set(key, value, false);
    }

    remove(key : string) {
        this.values[key] = undefined;
    }

}
