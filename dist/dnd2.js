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

            /* ------ VALIDATION BLOCK START -------- */
            if (jsonContent.content === undefined) {
                if (callback) {
                    callback();
                }
                //TODO - In future more advanced schema validations could be done here        
                return; /* -- EXITING --*/
            }
            /* ------ VALIDATION BLOCK END -------- */

            //Store the adaptor
            utils.activityAdaptor = adaptor;

            /* Parse and update content JSON. */
            var processedJsonContent = utils.parseAndUpdateJSONContent(jsonContent, params);

            /* Apply the content JSON to the htmllayout */
            var processedHTML = utils.processLayoutWithContent(utils.__constants.TEMPLATES[htmlLayout], processedJsonContent);

            /* Update the DOM and render the processed HTML - main body of the activity */
            $(elRoot).html(processedHTML);

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
exports.processLayoutWithContent = processLayoutWithContent;
exports.parseAndUpdateJSONContent = parseAndUpdateJSONContent;
/* global Handlebars */
/* global $ */
var dnd2TemplateRef = __webpack_require__(2);

__webpack_require__(3);

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

/***************************************************************************/

/**
     * Function to process HandleBars template with JSON.
     */
function processLayoutWithContent(layoutHTML, contentJSON) {

    /* Compiling Template Using Handlebars. */
    var compiledTemplate = Handlebars.compile(layoutHTML);

    /*Compiling HTML from Template. */
    var compiledHTML = compiledTemplate(contentJSON);

    return compiledHTML;
}

/**
 *  Function to modify JSON as per the activity / template requirement.
 */
function parseAndUpdateJSONContent(jsonContent, params) {

    /* Make "options" node in JSON. */
    jsonContent.content.options = [];

    /* Type of DND activity */
    __content.activityType = params.variation;

    /* Activity Instructions. */
    if (jsonContent.content.instructions[0].tag) {
        __content.directionsJSON = jsonContent.content.instructions[0].tag;
    }

    __content.maxscore = jsonContent.meta.score.max;
    jsonContent.content.directions = {};
    jsonContent.content.directions.text = __content.directionsJSON;

    $.each(jsonContent.content.canvas.data.questiondata, function (num) {
        var questionData = this.text;
        /* Extract interaction id's and tags from question text. */
        var interactionId = [];
        var interactionTag = [];

        /* String present in href of interaction tag. */
        var interactionReferenceString = 'http://www.comprodls.com/m1.0/interaction/kdnd';
        /* Parse questiontext as HTML to get HTML tags. */
        var parsedQuestionArray = $.parseHTML(questionData);
        var j = 0;

        $.each(parsedQuestionArray, function (i) {
            if (this.href === interactionReferenceString) {
                interactionId[j] = this.childNodes[0].nodeValue.trim();
                interactionTag[j] = this.outerHTML;
                interactionTag[j] = interactionTag[j].replace(/"/g, "'");
                j++;
            }
        });
        __content.questionsJSON = parsedQuestionArray[0].data;
        jsonContent.content.questionData = {};
        jsonContent.content.questionData.text = parsedQuestionArray[0].data;
    });
    return jsonContent;
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "{{#with content}}\r\n<div class=\"activity-body kdnd-body\">    \r\n    <p class=\"instructions\">{{{directions.text}}} </p>\r\n    <div class=\"smart-form inline-input\">\r\n        <ol>\r\n            <li>    \r\n                <label class=\"input\">\r\n                     <span class=\"question_content\" id=\"test\">{{{questionData.text}}}</span>\r\n                </label>\r\n            </li>\r\n        </ol>\r\n    </div>\r\n</div>\r\n{{/with}}";

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./dnd2.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./dnd2.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "/*******************************************************\r\n * \r\n * ----------------------\r\n * Engine Renderer Styles\r\n * ----------------------\r\n *\r\n * These styles do not include any product-specific branding\r\n * and/or layout / design. They represent minimal structural\r\n * CSS which is necessary for a default rendering of an\r\n * MCQSC activity\r\n *\r\n * The styles are linked/depending on the presence of\r\n * certain elements (classes / ids / tags) in the DOM (as would\r\n * be injected via a valid MCQSC layout HTML and/or dynamically\r\n * created by the MCQSC engine JS)\r\n *\r\n *\r\n *******************************************************/\r\n#test{\r\n    background-color: red;\r\n}\r\n\r\n.kdnd-body .form *{\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n.kdnd-body .form .kdnd-img{\r\n    padding-top: 10px;\r\n}\r\n\r\n.kdnd-body .form .kdnd-img-options{\r\n    padding: 5px;\r\n    max-height: 200px;\r\n}\r\n\r\n.kdnd-body .form ul.img-options{\r\n    margin-top: 30px;\r\n}\r\n\r\n.kdnd-body .form ul li{\r\n    padding: .7em .4em .4em 1.8em;\r\n    position: relative;\r\n}\r\n\r\n.kdnd-body .form ul.img-options li{ \r\n    margin-right: 30px;\r\n    padding-bottom: 2em;\r\n}\r\n\r\n.kdnd-body .form ul li.highlight{\r\n    background-color: #F2F2F2;\r\n    border-radius: 6px;\r\n}\r\n\r\n.kdnd-body .form ul li i{\r\n    height: 1.8em;\r\n    width: 1.8em;\r\n    border-radius: 50%;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    display: block;\r\n    outline: 0;\r\n    border: 1px solid #BDBDBD;\r\n    background: #FFF;\r\n    padding: 10px;\r\n}\r\n\r\n.kdnd-body .form ul li i:after {\r\n    background-color: #3276B1;\r\n    content: '';\r\n    border-radius: 50%;\r\n    height: 1.1em;\r\n    width: 1.1em;\r\n    top: .29em;\r\n    left: .29em;\r\n    position: absolute;\r\n    opacity: 0;\r\n}\r\n\r\n.kdnd-body .form ul li.highlight i{\r\n    border-color: #3276B1;\r\n}\r\n\r\n.kdnd-body .form ul li.highlight i:after{\r\n    opacity: 1;\r\n}\r\n\r\n.kdnd-body .form ul li .radio{\r\n    line-height: 1.8em;\r\n    font-weight: normal;\r\n    cursor: pointer;\r\n    padding-left: 25px;\r\n}\r\n\r\n\r\n.kdnd-body .form ul li .radio input {\r\n    position: absolute;\r\n    left: -9999px;\r\n}\r\n\r\n.kdnd-body .form ul li .radio span.content {\r\n   padding-left: 10px;\r\n}\r\n\r\n.kdnd-body .form ul li .radio.state-error i{\r\n    background: #fff0f0;\r\n    border-color: #a90329;\r\n}\r\n\r\n.kdnd-body .form ul li .radio.state-error i:after {\r\n    background-color: #a90329;\r\n}\r\n\r\n.kdnd-body .form ul li .radio.state-success i{\r\n    background: #f0fff0;\r\n    border-color: #7DC27D;\r\n}\r\n\r\n.kdnd-body .form ul li .radio.state-success i:after {\r\n    background-color: #7DC27D;\r\n}\r\n\r\n.kdnd-body span.correct:before {\r\n    content: \"\\F00C\";\r\n    font-family: fontawesome;\r\n    display: inline-block;\r\n    margin: 0 3.5em auto -3.2em;\r\n    color: green;\r\n}\r\n\r\n.kdnd-body span.wrong:before {\r\n    content: \"\\F00D\";\r\n    font-family: fontawesome;\r\n    display: inline-block;\r\n    margin: 0 3.6em auto -3.2em;\r\n    color: red;\r\n}\r\n\r\n.kdnd-body span.wrong.options:before {\r\n    position: absolute;\r\n    top: 0;\r\n}\r\n\r\n.kdnd-body .answer{\r\n    margin-left: 20px;\r\n}\r\n\r\n.kdnd-body span.correct, .kdnd-body span.wrong{\r\n    margin-left: 0;\r\n    width: 0;\r\n}\r\n\r\n.kdnd-body .col-md-6.last-child {\r\n    min-height: 200px;\r\n    border-left: 1px solid #C2C2C2;\r\n    padding-left: 20px;\r\n}\r\n\r\n.kdnd-body .stimulus {\r\n    margin: 25px 0 25px 0;\r\n}\r\n#feedback-area {\r\n    margin-top: 18px;   \r\n    border: 1px solid #ddd;\r\n    border-radius: 4px;\r\n    padding: 20px;\r\n    margin: 10px 0px 10px 0px;\r\n    background-color: #eee;\r\n    color: #3D3D3D;\r\n}\r\n#feedback-area > h4 {\r\n    padding-bottom: 10px;\r\n    font-weight: 700;\r\n}\r\n/* CORRECT ANSWER icon/mark */\r\n.kdnd-body #feedback-area span.correct:before {\r\n    content: \"\\F00C\";\r\n    font-family: fontawesome;\r\n    display: inline-block;\r\n    margin-right: 10px;\r\n    color: #009900;\r\n    float: left;\r\n    font-size: 18px;\r\n    border: 2px solid #009900;\r\n    padding: 3px 5px 3px 5px;\r\n    border-radius: 16px;\r\n    margin: 10px;\r\n}\r\n.kdnd-body #feedback-area span.wrong:before {\r\n    content: \"\\F00D\";\r\n    font-family: fontawesome;\r\n    display: inline-block;\r\n    margin-right: 10px;\r\n    color: red;\r\n    float: left;\r\n    font-size: 18px;\r\n    border: 2px solid red;\r\n    padding: 2px 6px 2px 6px;\r\n    border-radius: 16px;\r\n    margin: 10px;\r\n}\r\n\r\n.kdnd-body .activity-toolbar{\r\n    padding-top: 20px;\r\n}\r\n\r\n.kdnd-body .activity-toolbar .btn-primary{\r\n    font-size: 18px;\r\n}", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=dnd2.js.map