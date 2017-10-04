(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dnd2 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */
/* global jQuery */


var _utils = __webpack_require__(1);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dnd2 = function () {
    function dnd2() {
        _classCallCheck(this, dnd2);
    }

    _createClass(dnd2, [{
        key: 'init',


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
        value: function init(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
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

    }, {
        key: 'getConfig',
        value: function getConfig() {
            return utils.__config;
        }

        /**
         * ENGINE-SHELL Interface
         *
         * Return the current state (Activity Submitted/ Partial Save State.) of activity.
         */

    }, {
        key: 'getStatus',
        value: function getStatus() {
            return utils.__state.activitySubmitted || utils.__state.activityPariallySubmitted;
        }
    }]);

    return dnd2;
}();

exports.dnd2 = dnd2;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var dnd2TemplateRef = __webpack_require__(2);

/*
* Reference to platform's activity adaptor (initialized during init() ).
*/
var activityAdaptor = exports.activityAdaptor = void 0;

/*
 * Internal Engine Config.
 */
var __config = exports.__config = {
    MAX_RETRIES: 10, /* Maximum number of retries for sending results to platform for a particular activity. */
    RESIZE_MODE: 'auto', /* Possible values - "manual"/"auto". Default value is "auto". */
    RESIZE_HEIGHT: '580' /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will overrides. */
    /* If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
};

/*
 * Internal Engine State.
 */
var __state = exports.__state = {
    currentTries: 0, /* Current try of sending results to platform */
    activityPariallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
    activitySubmitted: false, /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
    radioButtonClicked: false /* State whether radio button is clicked.  Possible Values: true/false(Boolean) */
};

/*
 * Content (loaded / initialized during init() ).
 */
var __content = exports.__content = {
    directionsJSON: '',
    questionsJSON: [], /* Contains the question obtained from content JSON. */
    optionsJSON: [], /* Contains all the options for a particular question obtained from content JSON. */
    answersJSON: [], /* Contains the answer for a particular question obtained from content JSON. */
    userAnswersJSON: [], /* Contains the user answer for a particular question. */
    feedbackJSON: {}, /* Contains the feedback for question*/
    activityType: null /* Type of FIB activity. Possible Values :- FIBPassage. */
};

/*
 * Constants.
 */
var __constants = exports.__constants = {
    /* CONSTANT for PLATFORM Save Status NO ERROR */
    STATUS_NOERROR: 'NO_ERROR',
    DOM_SEL_SUBMIT_BTN: '#submit',
    TEMPLATES: {
        /* Regular DND Layout */
        DND2: dnd2TemplateRef
    }
};

// Array of all interaction tags in question
var __interactionIds = exports.__interactionIds = [];
var __processedJsonContent = exports.__processedJsonContent = void 0;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "<!-- Engine Renderer Template -->\r\n<div>Hello ES6 !!</div>";

/***/ })
/******/ ]);
});
//# sourceMappingURL=dnd2.js.map