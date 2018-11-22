/* global $ */

class fib2Editor {
    constructor(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback = () => {}) {

        $(elRoot).html('FIB2 Editor');

        /** Inform the shell that initialization is complete */
        callback();

    }
}

export {fib2Editor};
