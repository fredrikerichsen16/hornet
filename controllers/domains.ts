import {controller} from '../controller';
import {hornet} from '../hornet';
import {FreeObjectLiteral} from '../types';

var includes = require('lodash/includes');

export class domains extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    /**
     * Name of controller (could take name of class, but if code is minified that doesn't work)
     */
    name: string = 'domains';

    // ...

    domains: string[] = ['greetings', 'booking', 'contact'];

    list() {
        console.log('Domains:');
        this.domains.forEach(function(domain) {
            console.log(domain);
        });

        this.traverseForward();
    }

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
                    return new this.cmd({'command': 'domain-detail'});
                } else {
                    this.detail({'name': newName});
                }
            }
        }
    }

    delete(options : FreeObjectLiteral) {
        return new this.cmd({'name': 'signin'});
    }

    update(options : FreeObjectLiteral) {
        return new this.cmd({'name': 'list-domains'});
    }

}
