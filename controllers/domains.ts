import {controller} from '../controller/controller';
import {hornet} from '../main/hornet';
import {FreeObjectLiteral, cmd} from '../main/types';

var includes = require('lodash.includes');

export class domains extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    /**
     * Name of controller (could take name of class, but if code is minified that doesn't work)
     */
    name: string = 'domains';

    a1(options : FreeObjectLiteral)
    {
        this.log('Heisann!');
        let tilstand = this.readline('Hvordan har du det?');
        this.log('Tilstanden din er: ' + tilstand, 'magenta');

        this.traverseForward();
    }

    a2(options : FreeObjectLiteral)
    {
        this.makePassThrough();
        return this.cmd({'name': 'a3', options: {
            dog: true,
            cat: 10,
            man: 'listen'
        }});

        this.log('Next level');
        let tilstand = this.readline('Hvordan gammel er du a?');
        this.log('Alderen din er: ' + tilstand, 'green');

        this.traverseForward();
    }

    a3(options : FreeObjectLiteral)
    {
        this.log('Neste level hehe');
        let tilstand = this.readline('Hva driver du med om dagen?');
        this.log('Du driver med: ' + tilstand, 'red');
    }

}
