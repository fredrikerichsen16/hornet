import {controller} from '../controller/controller';
import {hornet} from '../main/hornet';
import {FreeObjectLiteral, cmd} from '../main/types';

let rootRequire = require('root-require');
let CompanyType = rootRequire('node/mongoose/models/companyTypes');
let Domain = rootRequire('node/mongoose/models/domains');

var includes = require('lodash/includes');

export class domains extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    /**
     * Name of controller (could take name of class, but if code is minified that doesn't work)
     */
    name: string = 'domains';

    create() {
        let domain = this.readline('Insert domain name to add: ').trim();

        if(domain === '') {
            console.log('Type in a domain name');
            this.create();
        }

        this.domains.push(domain);

        return new this.cmd({'name': 'domain-detail', 'options': {
            'name': domain
        }});
    }

    detail(options : FreeObjectLiteral) {
        let name = options.name || null;

        if(name) {
            if(includes(this.domains, name)) {
                console.log(`Found domain ${name}, showing details:`);
                this.traverseForward();
                return;
            } else {
                console.log(`Couldn't find domain ${name}.`);
                let newName = this.readline("Try to input a different domain name or type 'exit' to go back.");

                if(newName === 'exit') {
                    return new this.cmd({'command': 'list-domains'});
                } else {
                    this.detail({'name': newName});
                }
            }
        } else {
            console.log('No name passed.');
            return new this.cmd({'command': 'list-domains'});
        }
    }

    domains : string[] = [];

    async list() {
        let self = this;

        return new Promise((resolve, reject) => {
            console.log('Loading...');
            setTimeout(async () => {
                var domains = await Domain.find({});
                for(let domain of domains) {
                    self.domains.push(domain.name);
                    console.log(domain.name);
                }
                self.traverseForward();
                resolve(undefined);
            }, 2000);
        });
    }

    delete(options : FreeObjectLiteral) {
        return new this.cmd({'name': 'signin'});
    }

    update(options : FreeObjectLiteral) {
        return new this.cmd({'name': 'list-domains'});
    }

}
