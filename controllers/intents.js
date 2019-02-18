"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller/controller");
class intents extends controller_1.controller {
    constructor(hornet) {
        super(hornet);
        /**
         * Name of controller (could take name of class, but if code is minified that doesn't work)
         */
        this.name = 'intents';
    }
    list() {
    }
    detail() {
    }
}
exports.intents = intents;
