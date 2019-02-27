/**
 * Default Controller for default commands which the user doesn't have to implement
 * himself. Commands like 'back'.
 */

import {controller} from './controller';
import {hornet} from '../main/hornet';
import {FreeObjectLiteral} from '../main/types';

export class DefaultController extends controller {

    /**
     * @todo
     * Default controller method calls generally shouldn't be tracked in the breadcrumb or the path.
     * Because then 'back' and traverseBack etc. are not reliable.
     * So add that functionality either in this class somehow or hornet.ts.
     */

    constructor(hornet: hornet) {
        super(hornet);
    }

    /**
     * Name of controller (could take name of class, but if code is minified that doesn't work)
     */
    name: string = 'DEFAULT';

    /**
     * Go back to the previous command that was run
     * @return [description]
     */
    back(options : FreeObjectLiteral) {
        if(options.hasOwnProperty('previous') && options.previous)
        {
            this.removeBreadcrumb(); // remove the command user was on when they wrote "back"

            try {
                var toCommand = this.hornet.breadcrumb[this.hornet.breadcrumb.length - 1];
                return new this.cmd({'name': toCommand._name});
            } catch(e) {
                this.hornet.path = [];
                return undefined;
            }
        }
        else if(options.hasOwnProperty('start') && options.start)
        {
            this.hornet.path = [];
            return undefined;
        }
        else
        {
            this.hornet.path.pop();
            return undefined;
        }
    }

}
