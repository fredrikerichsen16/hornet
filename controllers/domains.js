"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller/controller");
var includes = require('lodash.includes');
class domains extends controller_1.controller {
    constructor(hornet) {
        super(hornet);
        /**
         * Name of controller (could take name of class, but if code is minified that doesn't work)
         */
        this.name = 'domains';
    }
    a1(options) {
        this.log('Heisann!');
        let tilstand = this.readline('Hvordan har du det?');
        this.log('Tilstanden din er: ' + tilstand, 'magenta');
        this.traverseForward();
    }
    a2(options) {
        this.makePassThrough();
        return this.cmd({ 'name': 'a3', options: {
                dog: true,
                cat: 10,
                man: 'listen'
            } });
        this.log('Next level');
        let tilstand = this.readline('Hvordan gammel er du a?');
        this.log('Alderen din er: ' + tilstand, 'green');
        this.traverseForward();
    }
    a3(options) {
        this.log('Neste level hehe');
        let tilstand = this.readline('Hva driver du med om dagen?');
        this.log('Du driver med: ' + tilstand, 'red');
    }
}
exports.domains = domains;
