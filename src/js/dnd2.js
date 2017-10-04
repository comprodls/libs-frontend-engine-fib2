/* global $ */
/* global jQuery */
import * as utils from './utils.js';

class dnd2 {

    /********************************************************/
    /*                  ENGINE-SHELL INIT FUNCTION
        
        "elRoot" :->        DOM Element reference where the engine should paint itself.
        "params" :->        Startup params passed by platform. Include the following sets of parameters:
                        (a) State (Initial launch / Resume / Gradebook mode ).
                        (b) TOC parameters (videoRoot, contentFile, keyframe, layout, etc.).
        "adaptor" :->        An adaptor interface for communication with platform (__saveResults, closeActivity, savePartialResults, getLastResults, etc.).
        "htmlLayout" :->    Activity HTML layout (as defined in the TOC LINK paramter). 
        "jsonContent" :->    Activity JSON content (as defined in the TOC LINK paramter).
        "callback" :->      To inform the shell that init is complete.
    */
    /********************************************************/  
    init(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
        /* ---------------------- BEGIN OF INIT ---------------------------------*/

        //Clone the JSON so that original is preserved.
        var jsonContent = jQuery.extend(true, {}, jsonContentObj);

        //Store the adaptor
        utils.activityAdaptor = adaptor;

        /* ------ VALIDATION BLOCK START -------- */    
        if (jsonContent.content === undefined) {
            if (callback) {
                callback();
            }
            //TODO - In future more advanced schema validations could be done here        
            return; /* -- EXITING --*/
        }

        /* ------ VALIDATION BLOCK END -------- */        

        /* Apply the layout HTML to the dom */

        $(elRoot).html(utils.__constants.TEMPLATES[htmlLayout]);

        /* Inform the shell that init is complete */
        if (callback) {
            callback();
        }

        /* ---------------------- END OF INIT ---------------------------------*/
    } /* init() Ends. */

    /**
     * ENGINE-SHELL Interface
     *
     * Return configuration
     */
    getConfig() {
        return utils.__config;
    }

    /**
     * ENGINE-SHELL Interface
     *
     * Return the current state (Activity Submitted/ Partial Save State.) of activity.
     */
    getStatus() {
        return utils.__state.activitySubmitted || utils.__state.activityPariallySubmitted;
    }
}

export {dnd2};
