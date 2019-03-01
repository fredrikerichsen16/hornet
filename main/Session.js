"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Session {
    constructor() {
        this.values = {};
    }
    get(key) {
        if (this.values.hasOwnProperty(key)) {
            return this.values[key];
        }
        else {
            return undefined;
        }
    }
    set(key, value, overwrite = true) {
        if (overwrite) {
            this.values[key] = value;
            return value;
        }
        else {
            if (!this.get(key)) {
                this.values[key] = value;
                return value;
            }
            else {
                return this.values[key];
            }
        }
    }
    getOrSet(key, value) {
        return this.set(key, value, false);
    }
    remove(key) {
        this.values[key] = undefined;
    }
}
exports.Session = Session;
