/**
 * Default Controller for default commands which the user doesn't have to implement
 * himself. Commands like 'back'.
 */

import {controller} from './controller';
import {hornet} from '../hornet';

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
    back() : string {
        return 'back';
    }

    /**
     * Run the parent command of the current command
     * @return [description]
     */
    traverseBack() {
        return 'traverseBack';
    }

}
