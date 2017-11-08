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

var _dnd = __webpack_require__(1);

var _dnd2 = _interopRequireDefault(_dnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.dnd2 = _dnd2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */
/* global jQuery */

var _utils = __webpack_require__(2);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Engine initialization Class. Provides public functions
 *  -getConfig()
 *  -getStatus()
 */

var dnd2 = function () {

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

    function dnd2(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
        _classCallCheck(this, dnd2);

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


    _createClass(dnd2, [{
        key: 'getConfig',
        value: function getConfig() {
            return utils.__config;
        }

        /**
         * ENGINE-SHELL Interface
         * @return {Boolean} - The current state (Activity Submitted/ Partial Save State.) of activity.
         */

    }, {
        key: 'getStatus',
        value: function getStatus() {
            return utils.__state.activitySubmitted || utils.__state.activityPariallySubmitted;
        }
    }]);

    return dnd2;
}();

exports.default = dnd2;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processLayoutWithContent = processLayoutWithContent;
exports.parseAndUpdateJSONContent = parseAndUpdateJSONContent;
/* global Handlebars */
/* global $ */

/* DND2 Template Reference */
var dnd2TemplateRef = __webpack_require__(3);
/* DND2 Light Theme Template Reference */
var dnd2LightTemplateRef = __webpack_require__(4);
/* DND2 Dark Theme Template Reference */
var dnd2DarkTemplateRef = __webpack_require__(5);

__webpack_require__(6);

/**
 * @type {Object}
 * Reference to platform's activity adaptor (initialized using constructor).
 */
var activityAdaptor = exports.activityAdaptor = void 0;

/**
 * @type {Object}
 * Theme Configurations.
 */
var themeConfig = exports.themeConfig = {};

/**
 * @const {Object}
 * Internal Engine Config.
 */
var __config = exports.__config = {
    MAX_RETRIES: 10, /** Maximum number of retries for sending results to platform for a particular activity. */
    RESIZE_MODE: 'auto', /** Possible values - "manual"/"auto". Default value is "auto". */
    RESIZE_HEIGHT: '580' /** Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will overrides. */
    /** If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
};

/**
 * @type {Object}
 * Internal Engine State.
 */
var __state = exports.__state = {
    currentTries: 0, /** Current try of sending results to platform */
    activityPariallySubmitted: false, /** State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
    activitySubmitted: false, /** State whether activity has been submitted. Possible Values: true/false(Boolean) */
    radioButtonClicked: false /** State whether radio button is clicked.  Possible Values: true/false(Boolean) */
};

/**
 * @type {Object}
 * Content (loaded / initialized using constructor).
 */
var __content = exports.__content = {
    directionsJSON: '', /** Contains the directions obtained from content JSON. */
    questionsJSON: [], /** Contains the question obtained from content JSON. */
    optionsJSON: [], /** Contains all the options for a particular question obtained from content JSON. */
    answersJSON: [], /** Contains the answer for a particular question obtained from content JSON. */
    userAnswersJSON: [], /** Contains the user answer for a particular question. */
    feedbackJSON: {}, /** Contains the feedback for question. */
    activityType: null /** Type of DND activity. */
};

/**
 * @const {Object}
 * Constants
 */
var __constants = exports.__constants = {
    TEMPLATES: {
        DND2: dnd2TemplateRef, /** Regular DND Layout */
        DND2_LIGHT: dnd2LightTemplateRef, /** Regular DND Light Layout */
        DND2_DARK: dnd2DarkTemplateRef /** Regular DND Dark Layout */
    },
    THEME_CONFIG: {
        'LIGHT': {
            'backgroundColor': '#F7F1CF' /** Background color for LIGHT Theme */
        },
        'DARK': {
            'backgroundColor': '#8967F3' /** Background color for DARK Theme */
        }
    }
};

/** 
 * @type {Array}
 * Array of all interaction tags in question 
 */
var __interactionIds = exports.__interactionIds = [];

/** 
 *  <-----------------PRIVATE FUNCTIONS----------------->
 */

/**
 *  Function to process HandleBars template with JSON.
 *
 *  @param {String} layoutHTML -  Activity HTML template.
 *  @param {Object} contentJSON - Updated JSON content as per the activity/template requirement.
 *  @return {String} compiledHTML - Activity HTML layout compiled with JSON content.  
 */
function processLayoutWithContent(layoutHTML, contentJSON) {

    /** 
     * @type {Function}
     * Compiling Template Using Handlebars. 
     */
    var compiledTemplate = Handlebars.compile(layoutHTML);

    /** 
     * @type {String} 
     * Compiling HTML from Template. 
     */
    var compiledHTML = compiledTemplate(contentJSON);

    return compiledHTML;
}

/**
 *  Function to modify JSON as per the activity / template requirement.
 *
 *  @param {Object} jsonContent - Activity JSON content.
 *  @param {Object} params - Startup params passed by platform.
 *  @return {Object} jsonContent - Modified activity JSON content.
 */
function parseAndUpdateJSONContent(jsonContent, params) {

    /** Make "options" node in JSON. */
    jsonContent.content.options = [];

    /** Type of DND activity */
    __content.activityType = params.variation;

    /** Activity Instructions. */
    if (jsonContent.content.instructions[0].tag) {
        __content.directionsJSON = jsonContent.content.instructions[0].tag;
    }

    jsonContent.content.directions = {};
    jsonContent.content.directions.text = __content.directionsJSON;

    $.each(jsonContent.content.canvas.data.questiondata, function (num) {
        var questionData = this.text;
        /** Extract interaction id's and tags from question text. */
        var interactionId = [];
        var interactionTag = [];

        /** String present in href of interaction tag. */
        var interactionReferenceString = 'http://www.comprodls.com/m1.0/interaction/dnd2';
        /** Parse questiontext as HTML to get HTML tags. */
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
/* 3 */
/***/ (function(module, exports) {

module.exports = "<!-- Engine Renderer Template -->\r\n{{#with content}}\r\n<div class=\"activity-body kdnd-body\">    \r\n    <p class=\"instructions\">{{{directions.text}}} </p>\r\n    <div class=\"smart-form inline-input\" id=\"test\">\r\n        <ol>\r\n            <li>    \r\n                <label class=\"input\">\r\n                     <span class=\"question_content\">{{{questionData.text}}}</span>\r\n                </label>\r\n            </li>\r\n        </ol>\r\n    </div>\r\n</div>\r\n{{/with}}";

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<!-- Engine Renderer Template -->\r\n{{#with content}}\r\n<div class=\"activity-body kdnd-body\" style=\"background-color:#f7f1cf;\">\r\n    <p class=\"instructions\">{{{directions.text}}} </p>\r\n    <div class=\"smart-form inline-input\" id=\"test\">\r\n        <ol>\r\n            <li>\r\n                <label class=\"input\">\r\n                     <span class=\"question_content\">{{{questionData.text}}}</span>\r\n                </label>\r\n            </li>\r\n        </ol>\r\n    </div>\r\n</div>\r\n{{/with}}";

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "<!-- Engine Renderer Template -->\r\n{{#with content}}\r\n<div class=\"activity-body kdnd-body\" style=\"background-color:#8967F3;\">\r\n    <p class=\"instructions\">{{{directions.text}}} </p>\r\n    <div class=\"smart-form inline-input\" id=\"test\">\r\n        <ol>\r\n            <li>\r\n                <label class=\"input\">\r\n                     <span class=\"question_content\">{{{questionData.text}}}</span>\r\n                </label>\r\n            </li>\r\n        </ol>\r\n    </div>\r\n</div>\r\n{{/with}}";

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(9)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(undefined);
// imports


// module
exports.push([module.i, "/*******************************************************\r\n * \r\n * ----------------------\r\n * Engine Renderer Styles\r\n * ----------------------\r\n *\r\n * These styles do not include any product-specific branding\r\n * and/or layout / design. They represent minimal structural\r\n * SCSS which is necessary for a default rendering of an\r\n * DND2 activity\r\n *\r\n * The styles are linked/depending on the presence of\r\n * certain elements (classes / ids / tags) in the DOM (as would\r\n * be injected via a valid DND2 layout HTML and/or dynamically\r\n * created by the DND2 engine JS)\r\n *\r\n *\r\n *******************************************************/\n/*******************************************************\r\n * \r\n * ----------------------\r\n * Engine Renderer Styles\r\n * ----------------------\r\n *\r\n * These styles do not include any product-specific branding\r\n * and/or layout / design. They represent minimal structural\r\n * SCSS which is necessary for a default rendering of an\r\n * DND2 activity\r\n *\r\n * The styles are linked/depending on the presence of\r\n * certain elements (classes / ids / tags) in the DOM (as would\r\n * be injected via a valid DND2 layout HTML and/or dynamically\r\n * created by the DND2 engine JS)\r\n *\r\n *\r\n *******************************************************/\n#test {\n  background-color: #eeffcc; }\n\n.kdnd-body {\n  background-color: #d3d3d3; }\n\n#test span {\n  background-color: pink;\n  border: 2px solid #ff0000; }\n", ""]);

// exports


/***/ }),
/* 8 */
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
/* 9 */
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

var	fixUrls = __webpack_require__(10);

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
/* 10 */
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