/* global $ */

import Fib2Transformer from './fib2editor-transform';
import Fib2ModelAndView from './fib2editor-modelview';
import Fib2EditorUtils from './fib2editor-utils';

const load = Symbol('loadFIB2');
const transform = Symbol('transformFIB2Editor');
const renderView = Symbol('renderFIB2Editor');
const setUtils = Symbol('setUtils');

class fib2Editor {

    constructor(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback = () => {}) {

        this.elRoot = elRoot;
        this.params = params;

        /**
        * Store the adaptor.
        */
        this.adaptor = adaptor;

        this.theme = htmlLayout;

        /**
         * @member {Object}
         * Clone the JSON so that original is preserved.
         */
        this.jsonContent = $.extend(true, {}, jsonContentObj);

        /**
         * Validation block.
         */
        if (this.jsonContent.content === undefined) {
            callback();
            return;
        }

        this[load]();

        /** Inform the shell that initialization is complete */
        callback();

    }

    [load]() {
        this[transform]();
        this[setUtils]();
        this[renderView]();
    }

    [transform]() {
        this.fib2Transformer = new Fib2Transformer(this.jsonContent);
        [this.fib2EditedJSONContent, this.interactionIds] = this.fib2Transformer.transform();
    }

    [setUtils]() {
        this.utils = new Fib2EditorUtils(this.fib2EditedJSONContent, this.interactionIds, this.adaptor);
    }

    [renderView]() {
        let fib2ModelAndView = new Fib2ModelAndView(this.fib2EditedJSONContent, this.adaptor, this.utils);
        let htmltemplate = fib2ModelAndView.template;

        /**
         * @member {String}
         * Apply the content JSON to the htmllayout.
         */
        $(this.elRoot).html(htmltemplate);
        fib2ModelAndView.bindData();
    }

    getConfig() {
        this.utils.getConfig();
    }

    getStatus() {
        this.utils.getStatus();
    }

    saveItemInEditor() {
        this.utils.saveItemInEditor();
    }
}

export {fib2Editor};
