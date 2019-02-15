"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller");
var includes = require('lodash/includes');
class domains extends controller_1.controller {
    constructor(hornet) {
        super(hornet);
        /**
         * Name of controller (could take name of class, but if code is minified that doesn't work)
         */
        this.name = 'domains';
        // ...
        this.domains = ['greetings', 'booking', 'contact'];
    }
    list() {
        console.log('Domains:');
        this.domains.forEach(function (domain) {
            console.log(domain);
        });
        this.traverseForward();
    }
    create() {
        let domain = this.readline('Insert domain name to add: ').trim();
        if (domain === '') {
            console.log('Type in a domain name');
            this.create();
        }
        this.domains.push(domain);
        return new this.cmd({ 'name': 'domain-detail', 'options': {
                'name': domain
            } });
    }
    detail(options) {
        let name = options.name || null;
        if (name) {
            if (includes(this.domains, name)) {
                console.log(`Found domain ${name}, showing details:`);
                this.traverseForward();
                return;
            }
            else {
                console.log(`Couldn't find domain ${name}.`);
                let newName = this.readline("Try to input a different domain name or type 'exit' to go back.");
                if (newName === 'exit') {
                    return new this.cmd({ 'command': 'domain-detail' });
                }
                else {
                    this.detail({ 'name': newName });
                }
            }
        }
    }
    delete(options) {
        return new this.cmd({ 'name': 'signin' });
    }
    update(options) {
        return new this.cmd({ 'name': 'list-domains' });
    }
}
exports.domains = domains;
