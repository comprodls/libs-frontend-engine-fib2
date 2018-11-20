/* global $ */
/* global jQuery */

import * as utils from './fib2-utils.js';

/**
 *  Engine initialization Class. Provides public functions
 *  -getConfig()
 *  -getStatus()
 */

class fib2 {

    /**  ENGINE-SHELL CONSTRUCTOR FUNCTION
     *   @constructor
     *   @param {String} elRoot - DOM Element reference where the engine should paint itself.
     *   @param {Object} params - Startup params passed by platform. Include the following sets of parameters:
     *                   (a) State (Initial launch / Resume / Gradebook mode ).
     *                   (b) TOC parameters (contentFile, layout, etc.).
     *   @param {Object} adaptor - An adaptor interface for communication with platform (__saveResults, closeActivity, savePartialResults, getLastResults, etc.).
     *   @param {String} htmlLayout - Activity HTML layout (as defined in the TOC LINK paramter).
     *   @param {Object} jsonContent - Activity JSON content (as defined in the TOC LINK paramter).
     *   @param {Function} callback - To inform the shell that init is complete.
     */

    constructor(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {

        /**
          * @member {Object}
          * Clone the JSON so that original is preserved.
          */
        this.jsonContent = jQuery.extend(true, {}, jsonContentObj);

        /**
          * Validation block.
          */
        if (this.jsonContent.content === undefined) {
            if (callback) {
                callback();
            }
            //TODO - In future more advanced schema validations could be done here.
            return;
        }

        /**
          * Store the adaptor.
          */
        utils.activityAdaptor = adaptor;

        /**
          * Setting theme configurations.
          */
        utils.themeConfig = {};
        if (htmlLayout.indexOf('_LIGHT') !== -1) {
            utils.themeConfig = utils.__constants.THEME_CONFIG['LIGHT'];
        } else if (htmlLayout.indexOf('_DARK') !== -1) {
            utils.themeConfig = utils.__constants.THEME_CONFIG['DARK'];
        }

        /**
          * @member {Object}
          * Parse and update content JSON.
          */
        this.processedJsonContent = utils.parseAndUpdateJSONContent(this.jsonContent, params);

        /**
          * @member {String}
          * Apply the content JSON to the htmllayout.
          */
        this.processedHTML = utils.processLayoutWithContent(utils.__constants.TEMPLATES[htmlLayout], this.processedJsonContent);

        /**
          * Update the DOM and render the processed HTML - main body of the activity.
          */
        $(elRoot).html(this.processedHTML);

        /** Inform the shell that initialization is complete */
        if (callback) {
            callback(utils.themeConfig);
        }
    }

    /**
     * ENGINE-SHELL Interface
     * @return {String} - Configuration
     */
    getConfig() {
        return utils.__config;
    }

    /**
     * ENGINE-SHELL Interface
     * @return {Boolean} - The current state (Activity Submitted/ Partial Save State.) of activity.
     */
    getStatus() {
        return utils.__state.activitySubmitted || utils.__state.activityPariallySubmitted;
    }
}

export default fib2;
