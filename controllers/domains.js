"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller/controller");
let rootRequire = require('root-require');
let CompanyType = rootRequire('node/mongoose/models/companyTypes');
let Domain = rootRequire('node/mongoose/models/domains');
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
        return __awaiter(this, void 0, void 0, function* () {
            new Promise((resolve, reject) => {
                Domain.find({}).then(function (domains) {
                    console.log('Hei');
                    process.exit();
                    resolve(domains);
                });
            })
                .then((res) => {
                for (let item of res) {
                    console.log(item.name);
                }
                this.traverseForward();
                process.exit();
                return;
            })
                .catch((err) => {
                console.log(err);
                process.exit();
            });
        });
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
