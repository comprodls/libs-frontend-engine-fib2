(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Constants = undefined;

var _fib = __webpack_require__(13);

var _fib2 = _interopRequireDefault(_fib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Constants = exports.Constants = {
  TEMPLATES: {
    FIB2: _fib2.default
  },
  THEMES: {
    FIB2: 'fib2',
    FIB2_LIGHT: 'fib2-light',
    FIB2_DARK: 'fib2-dark'
  },
  LAYOUT_COLOR: {
    'BG': {
      'FIB2': '#FFFFFF',
      'FIB2_LIGHT': '#f6f6f6',
      'FIB2_DARK': '#222222'
    }
  },
  MAX_RETRIES: 10, /* Maximum number of retries for sending results to platform for a particular activity. */
  INTERACTION_REFERENCE_STR: 'http://www.comprodls.com/m1.0/interaction/fib2',
  STATEMENT_STARTED: 'started',
  STATEMENT_ANSWERED: 'answered',
  STATEMENT_INTERACTED: 'interacted',
  STATEMENT_SUBMITTED: 'submitted',
  STATUS_NOERROR: 'NO_ERROR'
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {
  // Public sightglass interface.
  function sightglass(obj, keypath, callback, options) {
    return new Observer(obj, keypath, callback, options)
  }

  // Batteries not included.
  sightglass.adapters = {}

  // Constructs a new keypath observer and kicks things off.
  function Observer(obj, keypath, callback, options) {
    this.options = options || {}
    this.options.adapters = this.options.adapters || {}
    this.obj = obj
    this.keypath = keypath
    this.callback = callback
    this.objectPath = []
    this.update = this.update.bind(this)
    this.parse()

    if (isObject(this.target = this.realize())) {
      this.set(true, this.key, this.target, this.callback)
    }
  }

  // Tokenizes the provided keypath string into interface + path tokens for the
  // observer to work with.
  Observer.tokenize = function(keypath, interfaces, root) {
    var tokens = []
    var current = {i: root, path: ''}
    var index, chr

    for (index = 0; index < keypath.length; index++) {
      chr = keypath.charAt(index)

      if (!!~interfaces.indexOf(chr)) {
        tokens.push(current)
        current = {i: chr, path: ''}
      } else {
        current.path += chr
      }
    }

    tokens.push(current)
    return tokens
  }

  // Parses the keypath using the interfaces defined on the view. Sets variables
  // for the tokenized keypath as well as the end key.
  Observer.prototype.parse = function() {
    var interfaces = this.interfaces()
    var root, path

    if (!interfaces.length) {
      error('Must define at least one adapter interface.')
    }

    if (!!~interfaces.indexOf(this.keypath[0])) {
      root = this.keypath[0]
      path = this.keypath.substr(1)
    } else {
      if (typeof (root = this.options.root || sightglass.root) === 'undefined') {
        error('Must define a default root adapter.')
      }

      path = this.keypath
    }

    this.tokens = Observer.tokenize(path, interfaces, root)
    this.key = this.tokens.pop()
  }

  // Realizes the full keypath, attaching observers for every key and correcting
  // old observers to any changed objects in the keypath.
  Observer.prototype.realize = function() {
    var current = this.obj
    var unreached = false
    var prev

    this.tokens.forEach(function(token, index) {
      if (isObject(current)) {
        if (typeof this.objectPath[index] !== 'undefined') {
          if (current !== (prev = this.objectPath[index])) {
            this.set(false, token, prev, this.update)
            this.set(true, token, current, this.update)
            this.objectPath[index] = current
          }
        } else {
          this.set(true, token, current, this.update)
          this.objectPath[index] = current
        }

        current = this.get(token, current)
      } else {
        if (unreached === false) {
          unreached = index
        }

        if (prev = this.objectPath[index]) {
          this.set(false, token, prev, this.update)
        }
      }
    }, this)

    if (unreached !== false) {
      this.objectPath.splice(unreached)
    }

    return current
  }

  // Updates the keypath. This is called when any intermediary key is changed.
  Observer.prototype.update = function() {
    var next, oldValue

    if ((next = this.realize()) !== this.target) {
      if (isObject(this.target)) {
        this.set(false, this.key, this.target, this.callback)
      }

      if (isObject(next)) {
        this.set(true, this.key, next, this.callback)
      }

      oldValue = this.value()
      this.target = next

      // Always call callback if value is a function. If not a function, call callback only if value changed
      if (this.value() instanceof Function || this.value() !== oldValue) this.callback()
    }
  }

  // Reads the current end value of the observed keypath. Returns undefined if
  // the full keypath is unreachable.
  Observer.prototype.value = function() {
    if (isObject(this.target)) {
      return this.get(this.key, this.target)
    }
  }

  // Sets the current end value of the observed keypath. Calling setValue when
  // the full keypath is unreachable is a no-op.
  Observer.prototype.setValue = function(value) {
    if (isObject(this.target)) {
      this.adapter(this.key).set(this.target, this.key.path, value)
    }
  }

  // Gets the provided key on an object.
  Observer.prototype.get = function(key, obj) {
    return this.adapter(key).get(obj, key.path)
  }

  // Observes or unobserves a callback on the object using the provided key.
  Observer.prototype.set = function(active, key, obj, callback) {
    var action = active ? 'observe' : 'unobserve'
    this.adapter(key)[action](obj, key.path, callback)
  }

  // Returns an array of all unique adapter interfaces available.
  Observer.prototype.interfaces = function() {
    var interfaces = Object.keys(this.options.adapters)

    Object.keys(sightglass.adapters).forEach(function(i) {
      if (!~interfaces.indexOf(i)) {
        interfaces.push(i)
      }
    })

    return interfaces
  }

  // Convenience function to grab the adapter for a specific key.
  Observer.prototype.adapter = function(key) {
    return this.options.adapters[key.i] ||
      sightglass.adapters[key.i]
  }

  // Unobserves the entire keypath.
  Observer.prototype.unobserve = function() {
    var obj

    this.tokens.forEach(function(token, index) {
      if (obj = this.objectPath[index]) {
        this.set(false, token, obj, this.update)
      }
    }, this)

    if (isObject(this.target)) {
      this.set(false, this.key, this.target, this.callback)
    }
  }

  // Check if a value is an object than can be observed.
  function isObject(obj) {
    return typeof obj === 'object' && obj !== null
  }

  // Error thrower.
  function error(message) {
    throw new Error('[sightglass] ' + message)
  }

  // Export module for Node and the browser.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = sightglass
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return this.sightglass = sightglass
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else {
    this.sightglass = sightglass
  }
}).call(this);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Rivets.js
// version: 0.9.6
// author: Michael Richards
// license: MIT
(function() {
  var Rivets, bindMethod, jQuery, unbindMethod, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Rivets = {
    options: ['prefix', 'templateDelimiters', 'rootInterface', 'preloadData', 'handler', 'executeFunctions'],
    extensions: ['binders', 'formatters', 'components', 'adapters'],
    "public": {
      binders: {},
      components: {},
      formatters: {},
      adapters: {},
      prefix: 'rv',
      templateDelimiters: ['{', '}'],
      rootInterface: '.',
      preloadData: true,
      executeFunctions: false,
      iterationAlias: function(modelName) {
        return '%' + modelName + '%';
      },
      handler: function(context, ev, binding) {
        return this.call(context, ev, binding.view.models);
      },
      configure: function(options) {
        var descriptor, key, option, value;
        if (options == null) {
          options = {};
        }
        for (option in options) {
          value = options[option];
          if (option === 'binders' || option === 'components' || option === 'formatters' || option === 'adapters') {
            for (key in value) {
              descriptor = value[key];
              Rivets[option][key] = descriptor;
            }
          } else {
            Rivets["public"][option] = value;
          }
        }
      },
      bind: function(el, models, options) {
        var view;
        if (models == null) {
          models = {};
        }
        if (options == null) {
          options = {};
        }
        view = new Rivets.View(el, models, options);
        view.bind();
        return view;
      },
      init: function(component, el, data) {
        var scope, template, view;
        if (data == null) {
          data = {};
        }
        if (el == null) {
          el = document.createElement('div');
        }
        component = Rivets["public"].components[component];
        template = component.template.call(this, el);
        if (template instanceof HTMLElement) {
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
          el.appendChild(template);
        } else {
          el.innerHTML = template;
        }
        scope = component.initialize.call(this, el, data);
        view = new Rivets.View(el, scope);
        view.bind();
        return view;
      }
    }
  };

  if (window['jQuery'] || window['$']) {
    jQuery = window['jQuery'] || window['$'];
    _ref = 'on' in jQuery.prototype ? ['on', 'off'] : ['bind', 'unbind'], bindMethod = _ref[0], unbindMethod = _ref[1];
    Rivets.Util = {
      bindEvent: function(el, event, handler) {
        return jQuery(el)[bindMethod](event, handler);
      },
      unbindEvent: function(el, event, handler) {
        return jQuery(el)[unbindMethod](event, handler);
      },
      getInputValue: function(el) {
        var $el;
        $el = jQuery(el);
        if ($el.attr('type') === 'checkbox') {
          return $el.is(':checked');
        } else {
          return $el.val();
        }
      }
    };
  } else {
    Rivets.Util = {
      bindEvent: (function() {
        if ('addEventListener' in window) {
          return function(el, event, handler) {
            return el.addEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.attachEvent('on' + event, handler);
        };
      })(),
      unbindEvent: (function() {
        if ('removeEventListener' in window) {
          return function(el, event, handler) {
            return el.removeEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.detachEvent('on' + event, handler);
        };
      })(),
      getInputValue: function(el) {
        var o, _i, _len, _results;
        if (el.type === 'checkbox') {
          return el.checked;
        } else if (el.type === 'select-multiple') {
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            if (o.selected) {
              _results.push(o.value);
            }
          }
          return _results;
        } else {
          return el.value;
        }
      }
    };
  }

  Rivets.TypeParser = (function() {
    function TypeParser() {}

    TypeParser.types = {
      primitive: 0,
      keypath: 1
    };

    TypeParser.parse = function(string) {
      if (/^'.*'$|^".*"$/.test(string)) {
        return {
          type: this.types.primitive,
          value: string.slice(1, -1)
        };
      } else if (string === 'true') {
        return {
          type: this.types.primitive,
          value: true
        };
      } else if (string === 'false') {
        return {
          type: this.types.primitive,
          value: false
        };
      } else if (string === 'null') {
        return {
          type: this.types.primitive,
          value: null
        };
      } else if (string === 'undefined') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (string === '') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (isNaN(Number(string)) === false) {
        return {
          type: this.types.primitive,
          value: Number(string)
        };
      } else {
        return {
          type: this.types.keypath,
          value: string
        };
      }
    };

    return TypeParser;

  })();

  Rivets.TextTemplateParser = (function() {
    function TextTemplateParser() {}

    TextTemplateParser.types = {
      text: 0,
      binding: 1
    };

    TextTemplateParser.parse = function(template, delimiters) {
      var index, lastIndex, lastToken, length, substring, tokens, value;
      tokens = [];
      length = template.length;
      index = 0;
      lastIndex = 0;
      while (lastIndex < length) {
        index = template.indexOf(delimiters[0], lastIndex);
        if (index < 0) {
          tokens.push({
            type: this.types.text,
            value: template.slice(lastIndex)
          });
          break;
        } else {
          if (index > 0 && lastIndex < index) {
            tokens.push({
              type: this.types.text,
              value: template.slice(lastIndex, index)
            });
          }
          lastIndex = index + delimiters[0].length;
          index = template.indexOf(delimiters[1], lastIndex);
          if (index < 0) {
            substring = template.slice(lastIndex - delimiters[1].length);
            lastToken = tokens[tokens.length - 1];
            if ((lastToken != null ? lastToken.type : void 0) === this.types.text) {
              lastToken.value += substring;
            } else {
              tokens.push({
                type: this.types.text,
                value: substring
              });
            }
            break;
          }
          value = template.slice(lastIndex, index).trim();
          tokens.push({
            type: this.types.binding,
            value: value
          });
          lastIndex = index + delimiters[1].length;
        }
      }
      return tokens;
    };

    return TextTemplateParser;

  })();

  Rivets.View = (function() {
    function View(els, models, options) {
      var k, option, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.els = els;
      this.models = models;
      if (options == null) {
        options = {};
      }
      this.update = __bind(this.update, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.select = __bind(this.select, this);
      this.traverse = __bind(this.traverse, this);
      this.build = __bind(this.build, this);
      this.buildBinding = __bind(this.buildBinding, this);
      this.bindingRegExp = __bind(this.bindingRegExp, this);
      this.options = __bind(this.options, this);
      if (!(this.els.jquery || this.els instanceof Array)) {
        this.els = [this.els];
      }
      _ref1 = Rivets.extensions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        this[option] = {};
        if (options[option]) {
          _ref2 = options[option];
          for (k in _ref2) {
            v = _ref2[k];
            this[option][k] = v;
          }
        }
        _ref3 = Rivets["public"][option];
        for (k in _ref3) {
          v = _ref3[k];
          if ((_base = this[option])[k] == null) {
            _base[k] = v;
          }
        }
      }
      _ref4 = Rivets.options;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        option = _ref4[_j];
        this[option] = (_ref5 = options[option]) != null ? _ref5 : Rivets["public"][option];
      }
      this.build();
    }

    View.prototype.options = function() {
      var option, options, _i, _len, _ref1;
      options = {};
      _ref1 = Rivets.extensions.concat(Rivets.options);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        options[option] = this[option];
      }
      return options;
    };

    View.prototype.bindingRegExp = function() {
      return new RegExp("^" + this.prefix + "-");
    };

    View.prototype.buildBinding = function(binding, node, type, declaration) {
      var context, ctx, dependencies, keypath, options, pipe, pipes;
      options = {};
      pipes = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = declaration.match(/((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          pipe = _ref1[_i];
          _results.push(pipe.trim());
        }
        return _results;
      })();
      context = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = pipes.shift().split('<');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ctx = _ref1[_i];
          _results.push(ctx.trim());
        }
        return _results;
      })();
      keypath = context.shift();
      options.formatters = pipes;
      if (dependencies = context.shift()) {
        options.dependencies = dependencies.split(/\s+/);
      }
      return this.bindings.push(new Rivets[binding](this, node, type, keypath, options));
    };

    View.prototype.build = function() {
      var el, parse, _i, _len, _ref1;
      this.bindings = [];
      parse = (function(_this) {
        return function(node) {
          var block, childNode, delimiters, n, parser, text, token, tokens, _i, _j, _len, _len1, _ref1;
          if (node.nodeType === 3) {
            parser = Rivets.TextTemplateParser;
            if (delimiters = _this.templateDelimiters) {
              if ((tokens = parser.parse(node.data, delimiters)).length) {
                if (!(tokens.length === 1 && tokens[0].type === parser.types.text)) {
                  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
                    token = tokens[_i];
                    text = document.createTextNode(token.value);
                    node.parentNode.insertBefore(text, node);
                    if (token.type === 1) {
                      _this.buildBinding('TextBinding', text, null, token.value);
                    }
                  }
                  node.parentNode.removeChild(node);
                }
              }
            }
          } else if (node.nodeType === 1) {
            block = _this.traverse(node);
          }
          if (!block) {
            _ref1 = (function() {
              var _k, _len1, _ref1, _results;
              _ref1 = node.childNodes;
              _results = [];
              for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
                n = _ref1[_k];
                _results.push(n);
              }
              return _results;
            })();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              childNode = _ref1[_j];
              parse(childNode);
            }
          }
        };
      })(this);
      _ref1 = this.els;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        el = _ref1[_i];
        parse(el);
      }
      this.bindings.sort(function(a, b) {
        var _ref2, _ref3;
        return (((_ref2 = b.binder) != null ? _ref2.priority : void 0) || 0) - (((_ref3 = a.binder) != null ? _ref3.priority : void 0) || 0);
      });
    };

    View.prototype.traverse = function(node) {
      var attribute, attributes, binder, bindingRegExp, block, identifier, regexp, type, value, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
      bindingRegExp = this.bindingRegExp();
      block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE';
      _ref1 = node.attributes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          if (!(binder = this.binders[type])) {
            _ref2 = this.binders;
            for (identifier in _ref2) {
              value = _ref2[identifier];
              if (identifier !== '*' && identifier.indexOf('*') !== -1) {
                regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
                if (regexp.test(type)) {
                  binder = value;
                }
              }
            }
          }
          binder || (binder = this.binders['*']);
          if (binder.block) {
            block = true;
            attributes = [attribute];
          }
        }
      }
      _ref3 = attributes || node.attributes;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        attribute = _ref3[_j];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          this.buildBinding('Binding', node, type, attribute.value);
        }
      }
      if (!block) {
        type = node.nodeName.toLowerCase();
        if (this.components[type] && !node._bound) {
          this.bindings.push(new Rivets.ComponentBinding(this, node, type));
          block = true;
        }
      }
      return block;
    };

    View.prototype.select = function(fn) {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (fn(binding)) {
          _results.push(binding);
        }
      }
      return _results;
    };

    View.prototype.bind = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.bind();
      }
    };

    View.prototype.unbind = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.unbind();
      }
    };

    View.prototype.sync = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (typeof binding.sync === "function") {
          binding.sync();
        }
      }
    };

    View.prototype.publish = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.select(function(b) {
        var _ref1;
        return (_ref1 = b.binder) != null ? _ref1.publishes : void 0;
      });
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.publish();
      }
    };

    View.prototype.update = function(models) {
      var binding, key, model, _i, _len, _ref1;
      if (models == null) {
        models = {};
      }
      for (key in models) {
        model = models[key];
        this.models[key] = model;
      }
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (typeof binding.update === "function") {
          binding.update(models);
        }
      }
    };

    return View;

  })();

  Rivets.Binding = (function() {
    function Binding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.getValue = __bind(this.getValue, this);
      this.update = __bind(this.update, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.set = __bind(this.set, this);
      this.eventHandler = __bind(this.eventHandler, this);
      this.formattedValue = __bind(this.formattedValue, this);
      this.parseFormatterArguments = __bind(this.parseFormatterArguments, this);
      this.parseTarget = __bind(this.parseTarget, this);
      this.observe = __bind(this.observe, this);
      this.setBinder = __bind(this.setBinder, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
      this.model = void 0;
      this.setBinder();
    }

    Binding.prototype.setBinder = function() {
      var identifier, regexp, value, _ref1;
      if (!(this.binder = this.view.binders[this.type])) {
        _ref1 = this.view.binders;
        for (identifier in _ref1) {
          value = _ref1[identifier];
          if (identifier !== '*' && identifier.indexOf('*') !== -1) {
            regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
            if (regexp.test(this.type)) {
              this.binder = value;
              this.args = new RegExp("^" + (identifier.replace(/\*/g, '(.+)')) + "$").exec(this.type);
              this.args.shift();
            }
          }
        }
      }
      this.binder || (this.binder = this.view.binders['*']);
      if (this.binder instanceof Function) {
        return this.binder = {
          routine: this.binder
        };
      }
    };

    Binding.prototype.observe = function(obj, keypath, callback) {
      return Rivets.sightglass(obj, keypath, callback, {
        root: this.view.rootInterface,
        adapters: this.view.adapters
      });
    };

    Binding.prototype.parseTarget = function() {
      var token;
      token = Rivets.TypeParser.parse(this.keypath);
      if (token.type === Rivets.TypeParser.types.primitive) {
        return this.value = token.value;
      } else {
        this.observer = this.observe(this.view.models, this.keypath, this.sync);
        return this.model = this.observer.target;
      }
    };

    Binding.prototype.parseFormatterArguments = function(args, formatterIndex) {
      var ai, arg, observer, processedArgs, _base, _i, _len;
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(Rivets.TypeParser.parse(arg));
        }
        return _results;
      })();
      processedArgs = [];
      for (ai = _i = 0, _len = args.length; _i < _len; ai = ++_i) {
        arg = args[ai];
        processedArgs.push(arg.type === Rivets.TypeParser.types.primitive ? arg.value : ((_base = this.formatterObservers)[formatterIndex] || (_base[formatterIndex] = {}), !(observer = this.formatterObservers[formatterIndex][ai]) ? (observer = this.observe(this.view.models, arg.value, this.sync), this.formatterObservers[formatterIndex][ai] = observer) : void 0, observer.value()));
      }
      return processedArgs;
    };

    Binding.prototype.formattedValue = function(value) {
      var args, fi, formatter, id, processedArgs, _i, _len, _ref1, _ref2;
      _ref1 = this.formatters;
      for (fi = _i = 0, _len = _ref1.length; _i < _len; fi = ++_i) {
        formatter = _ref1[fi];
        args = formatter.match(/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g);
        id = args.shift();
        formatter = this.view.formatters[id];
        processedArgs = this.parseFormatterArguments(args, fi);
        if ((formatter != null ? formatter.read : void 0) instanceof Function) {
          value = (_ref2 = formatter.read).call.apply(_ref2, [this.model, value].concat(__slice.call(processedArgs)));
        } else if (formatter instanceof Function) {
          value = formatter.call.apply(formatter, [this.model, value].concat(__slice.call(processedArgs)));
        }
      }
      return value;
    };

    Binding.prototype.eventHandler = function(fn) {
      var binding, handler;
      handler = (binding = this).view.handler;
      return function(ev) {
        return handler.call(fn, this, ev, binding);
      };
    };

    Binding.prototype.set = function(value) {
      var _ref1;
      value = value instanceof Function && !this.binder["function"] && Rivets["public"].executeFunctions ? this.formattedValue(value.call(this.model)) : this.formattedValue(value);
      return (_ref1 = this.binder.routine) != null ? _ref1.call(this, this.el, value) : void 0;
    };

    Binding.prototype.sync = function() {
      var dependency, observer;
      return this.set((function() {
        var _i, _j, _len, _len1, _ref1, _ref2, _ref3;
        if (this.observer) {
          if (this.model !== this.observer.target) {
            _ref1 = this.dependencies;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              observer = _ref1[_i];
              observer.unobserve();
            }
            this.dependencies = [];
            if (((this.model = this.observer.target) != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
              _ref3 = this.options.dependencies;
              for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                dependency = _ref3[_j];
                observer = this.observe(this.model, dependency, this.sync);
                this.dependencies.push(observer);
              }
            }
          }
          return this.observer.value();
        } else {
          return this.value;
        }
      }).call(this));
    };

    Binding.prototype.publish = function() {
      var args, fi, fiReversed, formatter, id, lastformatterIndex, processedArgs, value, _i, _len, _ref1, _ref2, _ref3;
      if (this.observer) {
        value = this.getValue(this.el);
        lastformatterIndex = this.formatters.length - 1;
        _ref1 = this.formatters.slice(0).reverse();
        for (fiReversed = _i = 0, _len = _ref1.length; _i < _len; fiReversed = ++_i) {
          formatter = _ref1[fiReversed];
          fi = lastformatterIndex - fiReversed;
          args = formatter.split(/\s+/);
          id = args.shift();
          processedArgs = this.parseFormatterArguments(args, fi);
          if ((_ref2 = this.view.formatters[id]) != null ? _ref2.publish : void 0) {
            value = (_ref3 = this.view.formatters[id]).publish.apply(_ref3, [value].concat(__slice.call(processedArgs)));
          }
        }
        return this.observer.setValue(value);
      }
    };

    Binding.prototype.bind = function() {
      var dependency, observer, _i, _len, _ref1, _ref2, _ref3;
      this.parseTarget();
      if ((_ref1 = this.binder.bind) != null) {
        _ref1.call(this, this.el);
      }
      if ((this.model != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
        _ref3 = this.options.dependencies;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          dependency = _ref3[_i];
          observer = this.observe(this.model, dependency, this.sync);
          this.dependencies.push(observer);
        }
      }
      if (this.view.preloadData) {
        return this.sync();
      }
    };

    Binding.prototype.unbind = function() {
      var ai, args, fi, observer, _i, _len, _ref1, _ref2, _ref3, _ref4;
      if ((_ref1 = this.binder.unbind) != null) {
        _ref1.call(this, this.el);
      }
      if ((_ref2 = this.observer) != null) {
        _ref2.unobserve();
      }
      _ref3 = this.dependencies;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        observer = _ref3[_i];
        observer.unobserve();
      }
      this.dependencies = [];
      _ref4 = this.formatterObservers;
      for (fi in _ref4) {
        args = _ref4[fi];
        for (ai in args) {
          observer = args[ai];
          observer.unobserve();
        }
      }
      return this.formatterObservers = {};
    };

    Binding.prototype.update = function(models) {
      var _ref1, _ref2;
      if (models == null) {
        models = {};
      }
      this.model = (_ref1 = this.observer) != null ? _ref1.target : void 0;
      return (_ref2 = this.binder.update) != null ? _ref2.call(this, models) : void 0;
    };

    Binding.prototype.getValue = function(el) {
      if (this.binder && (this.binder.getValue != null)) {
        return this.binder.getValue.call(this, el);
      } else {
        return Rivets.Util.getInputValue(el);
      }
    };

    return Binding;

  })();

  Rivets.ComponentBinding = (function(_super) {
    __extends(ComponentBinding, _super);

    function ComponentBinding(view, el, type) {
      var attribute, bindingRegExp, propertyName, token, _i, _len, _ref1, _ref2;
      this.view = view;
      this.el = el;
      this.type = type;
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.locals = __bind(this.locals, this);
      this.component = this.view.components[this.type];
      this["static"] = {};
      this.observers = {};
      this.upstreamObservers = {};
      bindingRegExp = view.bindingRegExp();
      _ref1 = this.el.attributes || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (!bindingRegExp.test(attribute.name)) {
          propertyName = this.camelCase(attribute.name);
          token = Rivets.TypeParser.parse(attribute.value);
          if (__indexOf.call((_ref2 = this.component["static"]) != null ? _ref2 : [], propertyName) >= 0) {
            this["static"][propertyName] = attribute.value;
          } else if (token.type === Rivets.TypeParser.types.primitive) {
            this["static"][propertyName] = token.value;
          } else {
            this.observers[propertyName] = attribute.value;
          }
        }
      }
    }

    ComponentBinding.prototype.sync = function() {};

    ComponentBinding.prototype.update = function() {};

    ComponentBinding.prototype.publish = function() {};

    ComponentBinding.prototype.locals = function() {
      var key, observer, result, value, _ref1, _ref2;
      result = {};
      _ref1 = this["static"];
      for (key in _ref1) {
        value = _ref1[key];
        result[key] = value;
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        result[key] = observer.value();
      }
      return result;
    };

    ComponentBinding.prototype.camelCase = function(string) {
      return string.replace(/-([a-z])/g, function(grouped) {
        return grouped[1].toUpperCase();
      });
    };

    ComponentBinding.prototype.bind = function() {
      var k, key, keypath, observer, option, options, scope, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (!this.bound) {
        _ref1 = this.observers;
        for (key in _ref1) {
          keypath = _ref1[key];
          this.observers[key] = this.observe(this.view.models, keypath, ((function(_this) {
            return function(key) {
              return function() {
                return _this.componentView.models[key] = _this.observers[key].value();
              };
            };
          })(this)).call(this, key));
        }
        this.bound = true;
      }
      if (this.componentView != null) {
        this.componentView.bind();
      } else {
        this.el.innerHTML = this.component.template.call(this);
        scope = this.component.initialize.call(this, this.el, this.locals());
        this.el._bound = true;
        options = {};
        _ref2 = Rivets.extensions;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          option = _ref2[_i];
          options[option] = {};
          if (this.component[option]) {
            _ref3 = this.component[option];
            for (k in _ref3) {
              v = _ref3[k];
              options[option][k] = v;
            }
          }
          _ref4 = this.view[option];
          for (k in _ref4) {
            v = _ref4[k];
            if ((_base = options[option])[k] == null) {
              _base[k] = v;
            }
          }
        }
        _ref5 = Rivets.options;
        for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
          option = _ref5[_j];
          options[option] = (_ref6 = this.component[option]) != null ? _ref6 : this.view[option];
        }
        this.componentView = new Rivets.View(Array.prototype.slice.call(this.el.childNodes), scope, options);
        this.componentView.bind();
        _ref7 = this.observers;
        for (key in _ref7) {
          observer = _ref7[key];
          this.upstreamObservers[key] = this.observe(this.componentView.models, key, ((function(_this) {
            return function(key, observer) {
              return function() {
                return observer.setValue(_this.componentView.models[key]);
              };
            };
          })(this)).call(this, key, observer));
        }
      }
    };

    ComponentBinding.prototype.unbind = function() {
      var key, observer, _ref1, _ref2, _ref3;
      _ref1 = this.upstreamObservers;
      for (key in _ref1) {
        observer = _ref1[key];
        observer.unobserve();
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        observer.unobserve();
      }
      return (_ref3 = this.componentView) != null ? _ref3.unbind.call(this) : void 0;
    };

    return ComponentBinding;

  })(Rivets.Binding);

  Rivets.TextBinding = (function(_super) {
    __extends(TextBinding, _super);

    function TextBinding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.sync = __bind(this.sync, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
    }

    TextBinding.prototype.binder = {
      routine: function(node, value) {
        return node.data = value != null ? value : '';
      }
    };

    TextBinding.prototype.sync = function() {
      return TextBinding.__super__.sync.apply(this, arguments);
    };

    return TextBinding;

  })(Rivets.Binding);

  Rivets["public"].binders.text = function(el, value) {
    if (el.textContent != null) {
      return el.textContent = value != null ? value : '';
    } else {
      return el.innerText = value != null ? value : '';
    }
  };

  Rivets["public"].binders.html = function(el, value) {
    return el.innerHTML = value != null ? value : '';
  };

  Rivets["public"].binders.show = function(el, value) {
    return el.style.display = value ? '' : 'none';
  };

  Rivets["public"].binders.hide = function(el, value) {
    return el.style.display = value ? 'none' : '';
  };

  Rivets["public"].binders.enabled = function(el, value) {
    return el.disabled = !value;
  };

  Rivets["public"].binders.disabled = function(el, value) {
    return el.disabled = !!value;
  };

  Rivets["public"].binders.checked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) === (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !!value;
      }
    }
  };

  Rivets["public"].binders.unchecked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) !== (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !value;
      }
    }
  };

  Rivets["public"].binders.value = {
    publishes: true,
    priority: 3000,
    bind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        this.event = el.tagName === 'SELECT' ? 'change' : 'input';
        return Rivets.Util.bindEvent(el, this.event, this.publish);
      }
    },
    unbind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        return Rivets.Util.unbindEvent(el, this.event, this.publish);
      }
    },
    routine: function(el, value) {
      var o, _i, _len, _ref1, _ref2, _ref3, _results;
      if (el.tagName === 'INPUT' && el.type === 'radio') {
        return el.setAttribute('value', value);
      } else if (window.jQuery != null) {
        el = jQuery(el);
        if ((value != null ? value.toString() : void 0) !== ((_ref1 = el.val()) != null ? _ref1.toString() : void 0)) {
          return el.val(value != null ? value : '');
        }
      } else {
        if (el.type === 'select-multiple') {
          if (value != null) {
            _results = [];
            for (_i = 0, _len = el.length; _i < _len; _i++) {
              o = el[_i];
              _results.push(o.selected = (_ref2 = o.value, __indexOf.call(value, _ref2) >= 0));
            }
            return _results;
          }
        } else if ((value != null ? value.toString() : void 0) !== ((_ref3 = el.value) != null ? _ref3.toString() : void 0)) {
          return el.value = value != null ? value : '';
        }
      }
    }
  };

  Rivets["public"].binders["if"] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, declaration;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        declaration = el.getAttribute(attr);
        this.marker = document.createComment(" rivets: " + this.type + " " + declaration + " ");
        this.bound = false;
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        return el.parentNode.removeChild(el);
      }
    },
    unbind: function() {
      if (this.nested) {
        this.nested.unbind();
        return this.bound = false;
      }
    },
    routine: function(el, value) {
      var key, model, models, _ref1;
      if (!!value === !this.bound) {
        if (value) {
          models = {};
          _ref1 = this.view.models;
          for (key in _ref1) {
            model = _ref1[key];
            models[key] = model;
          }
          (this.nested || (this.nested = new Rivets.View(el, models, this.view.options()))).bind();
          this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
          return this.bound = true;
        } else {
          el.parentNode.removeChild(el);
          this.nested.unbind();
          return this.bound = false;
        }
      }
    },
    update: function(models) {
      var _ref1;
      return (_ref1 = this.nested) != null ? _ref1.update(models) : void 0;
    }
  };

  Rivets["public"].binders.unless = {
    block: true,
    priority: 4000,
    bind: function(el) {
      return Rivets["public"].binders["if"].bind.call(this, el);
    },
    unbind: function() {
      return Rivets["public"].binders["if"].unbind.call(this);
    },
    routine: function(el, value) {
      return Rivets["public"].binders["if"].routine.call(this, el, !value);
    },
    update: function(models) {
      return Rivets["public"].binders["if"].update.call(this, models);
    }
  };

  Rivets["public"].binders['on-*'] = {
    "function": true,
    priority: 1000,
    unbind: function(el) {
      if (this.handler) {
        return Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
    },
    routine: function(el, value) {
      if (this.handler) {
        Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
      return Rivets.Util.bindEvent(el, this.args[0], this.handler = this.eventHandler(value));
    }
  };

  Rivets["public"].binders['each-*'] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, view, _i, _len, _ref1;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        this.marker = document.createComment(" rivets: " + this.type + " ");
        this.iterated = [];
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        el.parentNode.removeChild(el);
      } else {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.bind();
        }
      }
    },
    unbind: function(el) {
      var view, _i, _len, _ref1;
      if (this.iterated != null) {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.unbind();
        }
      }
    },
    routine: function(el, collection) {
      var binding, data, i, index, key, model, modelName, options, previous, template, view, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      modelName = this.args[0];
      collection = collection || [];
      if (this.iterated.length > collection.length) {
        _ref1 = Array(this.iterated.length - collection.length);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          view = this.iterated.pop();
          view.unbind();
          this.marker.parentNode.removeChild(view.els[0]);
        }
      }
      for (index = _j = 0, _len1 = collection.length; _j < _len1; index = ++_j) {
        model = collection[index];
        data = {
          index: index
        };
        data[Rivets["public"].iterationAlias(modelName)] = index;
        data[modelName] = model;
        if (this.iterated[index] == null) {
          _ref2 = this.view.models;
          for (key in _ref2) {
            model = _ref2[key];
            if (data[key] == null) {
              data[key] = model;
            }
          }
          previous = this.iterated.length ? this.iterated[this.iterated.length - 1].els[0] : this.marker;
          options = this.view.options();
          options.preloadData = true;
          template = el.cloneNode(true);
          view = new Rivets.View(template, data, options);
          view.bind();
          this.iterated.push(view);
          this.marker.parentNode.insertBefore(template, previous.nextSibling);
        } else if (this.iterated[index].models[modelName] !== model) {
          this.iterated[index].update(data);
        }
      }
      if (el.nodeName === 'OPTION') {
        _ref3 = this.view.bindings;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          binding = _ref3[_k];
          if (binding.el === this.marker.parentNode && binding.type === 'value') {
            binding.sync();
          }
        }
      }
    },
    update: function(models) {
      var data, key, model, view, _i, _len, _ref1;
      data = {};
      for (key in models) {
        model = models[key];
        if (key !== this.args[0]) {
          data[key] = model;
        }
      }
      _ref1 = this.iterated;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.update(data);
      }
    }
  };

  Rivets["public"].binders['class-*'] = function(el, value) {
    var elClass;
    elClass = " " + el.className + " ";
    if (!value === (elClass.indexOf(" " + this.args[0] + " ") !== -1)) {
      return el.className = value ? "" + el.className + " " + this.args[0] : elClass.replace(" " + this.args[0] + " ", ' ').trim();
    }
  };

  Rivets["public"].binders['*'] = function(el, value) {
    if (value != null) {
      return el.setAttribute(this.type, value);
    } else {
      return el.removeAttribute(this.type);
    }
  };

  Rivets["public"].formatters['call'] = function() {
    var args, value;
    value = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return value.call.apply(value, [this].concat(__slice.call(args)));
  };

  Rivets["public"].adapters['.'] = {
    id: '_rv',
    counter: 0,
    weakmap: {},
    weakReference: function(obj) {
      var id, _base, _name;
      if (!obj.hasOwnProperty(this.id)) {
        id = this.counter++;
        Object.defineProperty(obj, this.id, {
          value: id
        });
      }
      return (_base = this.weakmap)[_name = obj[this.id]] || (_base[_name] = {
        callbacks: {}
      });
    },
    cleanupWeakReference: function(ref, id) {
      if (!Object.keys(ref.callbacks).length) {
        if (!(ref.pointers && Object.keys(ref.pointers).length)) {
          return delete this.weakmap[id];
        }
      }
    },
    stubFunction: function(obj, fn) {
      var map, original, weakmap;
      original = obj[fn];
      map = this.weakReference(obj);
      weakmap = this.weakmap;
      return obj[fn] = function() {
        var callback, k, r, response, _i, _len, _ref1, _ref2, _ref3, _ref4;
        response = original.apply(obj, arguments);
        _ref1 = map.pointers;
        for (r in _ref1) {
          k = _ref1[r];
          _ref4 = (_ref2 = (_ref3 = weakmap[r]) != null ? _ref3.callbacks[k] : void 0) != null ? _ref2 : [];
          for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
            callback = _ref4[_i];
            callback();
          }
        }
        return response;
      };
    },
    observeMutations: function(obj, ref, keypath) {
      var fn, functions, map, _base, _i, _len;
      if (Array.isArray(obj)) {
        map = this.weakReference(obj);
        if (map.pointers == null) {
          map.pointers = {};
          functions = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
          for (_i = 0, _len = functions.length; _i < _len; _i++) {
            fn = functions[_i];
            this.stubFunction(obj, fn);
          }
        }
        if ((_base = map.pointers)[ref] == null) {
          _base[ref] = [];
        }
        if (__indexOf.call(map.pointers[ref], keypath) < 0) {
          return map.pointers[ref].push(keypath);
        }
      }
    },
    unobserveMutations: function(obj, ref, keypath) {
      var idx, map, pointers;
      if (Array.isArray(obj) && (obj[this.id] != null)) {
        if (map = this.weakmap[obj[this.id]]) {
          if (pointers = map.pointers[ref]) {
            if ((idx = pointers.indexOf(keypath)) >= 0) {
              pointers.splice(idx, 1);
            }
            if (!pointers.length) {
              delete map.pointers[ref];
            }
            return this.cleanupWeakReference(map, obj[this.id]);
          }
        }
      }
    },
    observe: function(obj, keypath, callback) {
      var callbacks, desc, value;
      callbacks = this.weakReference(obj).callbacks;
      if (callbacks[keypath] == null) {
        callbacks[keypath] = [];
        desc = Object.getOwnPropertyDescriptor(obj, keypath);
        if (!((desc != null ? desc.get : void 0) || (desc != null ? desc.set : void 0))) {
          value = obj[keypath];
          Object.defineProperty(obj, keypath, {
            enumerable: true,
            get: function() {
              return value;
            },
            set: (function(_this) {
              return function(newValue) {
                var cb, map, _i, _len, _ref1;
                if (newValue !== value) {
                  _this.unobserveMutations(value, obj[_this.id], keypath);
                  value = newValue;
                  if (map = _this.weakmap[obj[_this.id]]) {
                    callbacks = map.callbacks;
                    if (callbacks[keypath]) {
                      _ref1 = callbacks[keypath].slice();
                      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        cb = _ref1[_i];
                        if (__indexOf.call(callbacks[keypath], cb) >= 0) {
                          cb();
                        }
                      }
                    }
                    return _this.observeMutations(newValue, obj[_this.id], keypath);
                  }
                }
              };
            })(this)
          });
        }
      }
      if (__indexOf.call(callbacks[keypath], callback) < 0) {
        callbacks[keypath].push(callback);
      }
      return this.observeMutations(obj[keypath], obj[this.id], keypath);
    },
    unobserve: function(obj, keypath, callback) {
      var callbacks, idx, map;
      if (map = this.weakmap[obj[this.id]]) {
        if (callbacks = map.callbacks[keypath]) {
          if ((idx = callbacks.indexOf(callback)) >= 0) {
            callbacks.splice(idx, 1);
            if (!callbacks.length) {
              delete map.callbacks[keypath];
              this.unobserveMutations(obj[keypath], obj[this.id], keypath);
            }
          }
          return this.cleanupWeakReference(map, obj[this.id]);
        }
      }
    },
    get: function(obj, keypath) {
      return obj[keypath];
    },
    set: function(obj, keypath, value) {
      return obj[keypath] = value;
    }
  };

  Rivets.factory = function(sightglass) {
    Rivets.sightglass = sightglass;
    Rivets["public"]._ = Rivets;
    return Rivets["public"];
  };

  if (typeof (typeof module !== "undefined" && module !== null ? module.exports : void 0) === 'object') {
    module.exports = Rivets.factory(__webpack_require__(1));
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(sightglass) {
      return this.rivets = Rivets.factory(sightglass);
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    this.rivets = Rivets.factory(sightglass);
  }

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 4 */
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
/* 5 */
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

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

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
/* 6 */
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


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fib2ResponseProcessor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _utils = __webpack_require__(9);

var _utils2 = _interopRequireDefault(_utils);

var _constant = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getAnswersJSON = Symbol('getAnswersJSON');
var getFibsrAnswersJSON = Symbol('getFibsrAnswersJSON');
var getUserAnswersStats = Symbol('getUserAnswersStats');
var markInput = Symbol('markInput');
var buildFeedbackResponse = Symbol('buildFeedbackResponse');

var __state = {
  currentTries: 0, /* Current try of sending results to platform */
  activityPartiallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
  activitySubmitted: false /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
};

var Fib2ResponseProcessor = function () {
  function Fib2ResponseProcessor(fib2Obj) {
    _classCallCheck(this, Fib2ResponseProcessor);

    this.fib2Obj = fib2Obj;
  }

  /**
   * Function called to send result JSON to adaptor (On Submit).
   */


  _createClass(Fib2ResponseProcessor, [{
    key: 'saveResults',
    value: function saveResults() {
      var _this = this;

      /*Getting answer in JSON format*/
      var answerJSONs = this[getAnswersJSON](false);
      var uniqueId = this.fib2Obj.adaptor.getId();

      /* Disabling entry(input) boxes on click of Submit. */
      $('.userAnswer').attr('disabled', true);
      $('label.input').addClass('state-disabled');

      answerJSONs.forEach(function (answerJSON, idx) {
        /* User clicked the Submit button*/
        answerJSON.statusProgress = 'attempted';
        /*Send Results to platform*/
        _this.fib2Obj.adaptor.submitResults(answerJSON, uniqueId, function (data, status) {
          if (status === _constant.Constants.STATUS_NOERROR) {
            __state.activitySubmitted = true;
            /*Close platform's session*/
            _this.fib2Obj.adaptor.closeActivity();
            __state.currentTries = 0;
          } else {
            /* There was an error during platform communication, so try again (till MAX_RETRIES) */
            if (__state.currentTries < _constant.Constants.MAX_RETRIES) {
              __state.currentTries++;
              _this.saveResults();
            }
          }
        });
      });
    }

    /**
     * Function called to send result JSON to adaptor (Partial Save ).
     */

  }, {
    key: 'savePartial',
    value: function savePartial() {
      var _this2 = this;

      /*Getting answer in JSON format*/
      var answerJSONs = this[getAnswersJSON](false);
      var uniqueId = this.fib2Obj.adaptor.getId();

      this.fib2Obj.adaptor.sendStatement(uniqueId, (0, _utils2.default)(_constant.Constants.STATEMENT_INTERACTED));

      answerJSONs.forEach(function (answerJSON, idx) {
        _this2.fib2Obj.adaptor.savePartialResults(answerJSON, uniqueId, function (data, status) {
          if (status === _constant.Constants.STATUS_NOERROR) {
            __state.activityPariallySubmitted = true;
          } else {
            // There was an error during platform communication, do nothing for partial saves
          }
        });
      });
    }

    /**
     *  Function used to create JSON from user Answers for submit(soft/hard).
     *  Called by :-
     *   1. saveResult or savePartial (internal).
     *   2. Multi-item-handler (external).
     *   3. Divide the maximum marks among interaction.
     *   4. Returns result objects.  [{ id: interactionId,  answer: answer,   score: score, maxscore: maximumScore }]
     */

  }, {
    key: getAnswersJSON,
    value: function value(skipQuestion) {
      var response = [];
      var fibsrAns = void 0;

      fibsrAns = this[getFibsrAnswersJSON]();
      response.push(fibsrAns);

      return response;
    }
  }, {
    key: getFibsrAnswersJSON,
    value: function value() {
      var _this3 = this;

      var maxScore = this.fib2Obj.jsonContent.meta.score.max;
      var perInteractionScore = maxScore / this.fib2Obj.fib2Model.interactionIds.length;
      var stats = this[getUserAnswersStats]();
      var resultArray = [];
      var feedback = void 0;
      var statusEvaluation = void 0;

      this.fib2Obj.fib2Model.interactionIds.forEach(function (interactionId) {
        var score = stats.userAnswersResult[interactionId] ? perInteractionScore : 0;

        resultArray.push({
          interactionId: interactionId,
          score: score,
          answer: _this3.fib2Obj.userAnswers[interactionId] || '',
          maxScore: perInteractionScore
        });
      });

      if (stats.isAllInteractionsEmpty) {
        statusEvaluation = 'empty';
        feedback = this[buildFeedbackResponse]('global.empty', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.empty);
      } else if (stats.totalQuestions === stats.countCorrectQuestionAttempt && stats.totalInteractions === stats.countCorrectInteractionsAttempt) {
        statusEvaluation = 'correct';
        feedback = this[buildFeedbackResponse]('global.correct', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.correct);
      } else if (stats.countCorrectQuestionAttempt >= Math.floor(stats.totalQuestions / 2)) {
        statusEvaluation = 'partially_correct';
        feedback = this[buildFeedbackResponse]('global.partiallyCorrect', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.partiallyCorrect);
      } else if (stats.countIncorrectQuestionAttempt >= Math.floor(stats.totalQuestions / 2)) {
        statusEvaluation = 'partially_incorrect';
        feedback = this[buildFeedbackResponse]('global.partiallyIncorrect', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.partiallyIncorrect);
      } else if (stats.countCorrectQuestionAttempt === 0) {
        statusEvaluation = 'incorrect';
        feedback = this[buildFeedbackResponse]('global.incorrect', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.incorrect);
      }

      return {
        response: {
          'interactions': resultArray,
          statusEvaluation: statusEvaluation,
          feedback: feedback
        }
      };
    }

    /**
     *  Function used to create User Answers stats.
     */

  }, {
    key: getUserAnswersStats,
    value: function value() {
      var _this4 = this;

      var questions = this.fib2Obj.fib2Model.questionData;
      var totalInteractions = this.fib2Obj.fib2Model.interactionIds.length;
      var totalQuestions = this.fib2Obj.fib2Model.questionData.length;
      var userAnswersResult = {};
      var countCorrectQuestionAttempt = 0;
      var countIncorrectQuestionAttempt = 0;
      var countCorrectInteractionsAttempt = 0;
      var countIncorrectInteractionsAttempt = 0;
      var isAllInteractionsEmpty = true;

      questions.forEach(function (question, index) {
        var isQuestionCorrect = true;

        question.interactions.forEach(function (interactionId) {
          var correctAnswer = _this4.fib2Obj.fib2Model.responses[interactionId].correct;
          var userAnswer = _this4.fib2Obj.userAnswers[interactionId];

          userAnswersResult[interactionId] = {
            correct: false
          };

          if (_this4.fib2Obj.fib2Model.responses[interactionId].ignorecase) {
            correctAnswer = correctAnswer.toLowerCase();
            userAnswer = correctAnswer.toLowerCase();
          }

          if (_this4.fib2Obj.fib2Model.responses[interactionId].ignorewhitespace) {
            correctAnswer = correctAnswer.replace(/ /g, '')();
            userAnswer = correctAnswer.replace(/ /g, '')();
          }

          if (userAnswer !== correctAnswer) {
            isQuestionCorrect = false;
            if (userAnswer !== undefined && userAnswer !== '') {
              isAllInteractionsEmpty = false;
            }
            countIncorrectInteractionsAttempt += 1;
          } else {
            isAllInteractionsEmpty = false;
            userAnswersResult[interactionId].correct = true;
            countCorrectInteractionsAttempt += 1;
          }
        });

        if (isQuestionCorrect) {
          countCorrectQuestionAttempt += 1;
        } else {
          countIncorrectQuestionAttempt += 1;
        }
      });

      return {
        userAnswersResult: userAnswersResult,
        totalInteractions: totalInteractions,
        countIncorrectInteractionsAttempt: countIncorrectInteractionsAttempt,
        countCorrectInteractionsAttempt: countCorrectInteractionsAttempt,
        totalQuestions: totalQuestions,
        countCorrectQuestionAttempt: countCorrectQuestionAttempt,
        countIncorrectQuestionAttempt: countIncorrectQuestionAttempt,
        isAllInteractionsEmpty: isAllInteractionsEmpty
      };
    }

    /**
     *  Static function to get User state.
     */

  }, {
    key: 'markAnswers',


    /**
     *  Function to mark User answers correct or wrong.
     */
    value: function markAnswers() {
      this[markInput]();
      this.fib2Obj.adaptor.autoResizeActivityIframe();
    }
  }, {
    key: markInput,
    value: function value() {
      var _this5 = this;

      var questions = this.fib2Obj.fib2Model.questionData;

      questions.forEach(function (question, index) {
        var isQuestionCorrect = true;

        question.interactions.forEach(function (interactionId) {
          var userAnswer = _this5.fib2Obj.userAnswers[interactionId];
          var correctAnswer = _this5.fib2Obj.fib2Model.responses[interactionId].correct;

          if (userAnswer !== correctAnswer) {
            isQuestionCorrect = false;
            $('#' + interactionId).addClass('wrongAnswer').removeClass('correctAnswer').attr('disabled', true).parent().after('<span class="grade" style="color:green;font-weight: bold"> (' + correctAnswer + ')</span>');
          } else {
            $('#' + interactionId).addClass('correctAnswer').removeClass('wrongAnswer').attr('disabled', true);
          }
        });

        if (isQuestionCorrect) {
          $('#answer' + index).next('label').addClass('state-success');
          $('#answer' + index).addClass('correct').removeClass('wrong').removeClass('invisible');
        } else {
          $('#answer' + index).next('label').addClass('state-error');
          $('#answer' + index).addClass('wrong').removeClass('correct').removeClass('invisible');
        }
      });
    }
  }, {
    key: buildFeedbackResponse,
    value: function value(id, status, content) {
      var feedback = {};

      feedback.id = id;
      feedback.status = status;
      feedback.content = content;
      return feedback;
    }

    /**
     *  Function to calculate feedback according to user Answers Stats.
     */

  }, {
    key: 'feedbackProcessor',
    value: function feedbackProcessor() {
      var type = this.fib2Obj.fib2Model.type;
      var stats = this[getUserAnswersStats]();

      this.fib2Obj.fib2Model.feedbackState.correct = false;
      this.fib2Obj.fib2Model.feedbackState.incorrect = false;
      this.fib2Obj.fib2Model.feedbackState.partiallyCorrect = false;
      this.fib2Obj.fib2Model.feedbackState.partiallyIncorrect = false;
      this.fib2Obj.fib2Model.feedbackState.empty = false;

      if (type === 'FIBSR') {
        if (stats.isAllInteractionsEmpty) {
          this.fib2Obj.fib2Model.feedbackState.empty = true;
        } else if (stats.totalQuestions === stats.countCorrectQuestionAttempt && stats.totalInteractions === stats.countCorrectInteractionsAttempt) {
          this.fib2Obj.fib2Model.feedbackState.correct = true;
        } else if (stats.countCorrectQuestionAttempt >= Math.floor(stats.totalQuestions / 2)) {
          this.fib2Obj.fib2Model.feedbackState.partiallyCorrect = true;
        } else if (stats.countIncorrectQuestionAttempt >= Math.floor(stats.totalQuestions / 2)) {
          this.fib2Obj.fib2Model.feedbackState.partiallyIncorrect = true;
        } else if (stats.countCorrectQuestionAttempt === 0) {
          this.fib2Obj.fib2Model.feedbackState.incorrect = true;
        }
      }

      this.fib2Obj.adaptor.autoResizeActivityIframe();
    }
  }], [{
    key: 'getState',
    value: function getState() {
      return __state;
    }

    /**
     *  Static function to reset user answers.
     */

  }, {
    key: 'resetView',
    value: function resetView() {
      var persistUserAnswers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


      $('label.question').removeClass('state-disabled');

      $('.userAnswer').each(function () {
        if (!persistUserAnswers) {
          $(this).val('');
        }
        $(this).removeClass('wrongAnswer correctAnswer').attr('disabled', false);
      });

      $('[id^="answer"]').removeClass('correct wrong').addClass('invisible').next('label').removeClass('state-success state-error');

      $('.grade').remove();
    }
  }]);

  return Fib2ResponseProcessor;
}();

exports.Fib2ResponseProcessor = Fib2ResponseProcessor;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateStatement;
/**
 * Function to generate XAPI statements.
 */
function generateStatement(verb) {
  return {
    'timestamp': new Date(),
    'verb': {
      'id': verb
    }
  };
}
module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fib2 = undefined;

var _fib = __webpack_require__(11);

var _fib2 = _interopRequireDefault(_fib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.fib2 = _fib2.default;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _fib = __webpack_require__(12);

var _fib2 = __webpack_require__(14);

var _fib3 = __webpack_require__(17);

var _fib4 = __webpack_require__(8);

var _utils = __webpack_require__(9);

var _utils2 = _interopRequireDefault(_utils);

var _constant = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var load = Symbol('loadFib2');
var transform = Symbol('transformFib2');
var renderView = Symbol('renderFib2');
var bindEvents = Symbol('bindEvents');
var fib2ModelAndView = void 0;

/**
 *  Engine initialization Class. Provides public functions
 *  -getConfig()
 *  -getStatus()
 *  -handleSubmit()
 *  -resetAnswers()
 *  -showGrades()
 *  -showFeedback()
 *  -clearGrades()
 */

var fib2 = function () {

  /**  ENGINE-SHELL CONSTRUCTOR FUNCTION
   *   @constructor
   *   @param {String} elRoot - DOM Element reference where the engine should paint itself.
   *   @param {Object} params - Startup params passed by platform. Include the following sets of parameters:
   *                                      (a) State (Initial launch / Resume / Gradebook mode ).
   *                   (b) TOC parameters (contentFile, layout, etc.).
   *   @param {Object} adaptor - An adaptor interface for communication with platform (__saveResults, closeActivity, savePartialResults, getLastResults, etc.).
   *   @param {String} htmlLayout - Activity HTML layout (as defined in the TOC LINK paramter).
   *   @param {Object} jsonContentObj - Activity JSON content (as defined in the TOC LINK paramter).
   *   @param {Function} callback - To inform the shell that init is complete.
   */

  function fib2(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
    _classCallCheck(this, fib2);

    adaptor.sendStatement(adaptor.getId(), (0, _utils2.default)(_constant.Constants.STATEMENT_STARTED));
    this.elRoot = elRoot;
    this.params = params;
    this.adaptor = adaptor;
    this.theme = htmlLayout;
    this.jsonContent = jsonContentObj;
    this.userAnswers = {};
    this[load]();
    if (callback) {
      callback({
        backgroundColor: _constant.Constants.LAYOUT_COLOR.BG[htmlLayout],
        fontFamily: 'open-sans-font'
      });
    }
  }

  _createClass(fib2, [{
    key: load,
    value: function value() {
      this[transform]();
      this[renderView]();
      this[bindEvents]();
    }
  }, {
    key: transform,
    value: function value() {
      var fib2Transformer = new _fib.FIB2Transformer(this.jsonContent, this.params, this.theme);

      this.fib2Model = fib2Transformer.transform();
    }
  }, {
    key: renderView,
    value: function value() {
      fib2ModelAndView = new _fib2.Fib2ModelAndView(this.fib2Model);

      $(this.elRoot).html(fib2ModelAndView.template);
      fib2ModelAndView.bindData();
    }
  }, {
    key: bindEvents,
    value: function value() {
      var fib2Events = new _fib3.Fib2Events(this);

      fib2Events.bindEvents();
    }

    /**
     * Bound to click of Activity submit button.
     */

  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      var fib2ResponseProcessor = new _fib4.Fib2ResponseProcessor(this);

      /* Saving Answers. */
      fib2ResponseProcessor.saveResults();
      this.adaptor.sendStatement(this.adaptor.getId(), (0, _utils2.default)(_constant.Constants.STATEMENT_SUBMITTED));
    }

    /**
     * ENGINE-SHELL Interface
     * @return {{MAX_RETRIES}} - Configuration
     */

  }, {
    key: 'getConfig',
    value: function getConfig() {
      return {
        MAX_RETRIES: _constant.Constants.MAX_RETRIES
      };
    }

    /**
     * ENGINE-SHELL Interface
     * @return {Boolean} - The current state (Activity Submitted/ Partial Save State.) of activity.
     */

  }, {
    key: 'getStatus',
    value: function getStatus() {
      var state = _fib4.Fib2ResponseProcessor.getState();

      return state.activityPartiallySubmitted || state.activitySubmitted;
    }

    /**
     * Bound to click of Activity reset button.
     */

  }, {
    key: 'resetAnswers',
    value: function resetAnswers() {
      this.userAnswers = {};
      _fib4.Fib2ResponseProcessor.resetView();
    }

    /**
     * Bound to click of Activity check-my-work button.
     */

  }, {
    key: 'showGrades',
    value: function showGrades() {
      var fib2ResponseProcessor = new _fib4.Fib2ResponseProcessor(this);

      $('label.question').addClass('state-disabled');
      fib2ResponseProcessor.markAnswers();
    }

    /**
     * Bound to click of Activity show-feedback button.
     */

  }, {
    key: 'showFeedback',
    value: function showFeedback() {
      var fib2ResponseProcessor = new _fib4.Fib2ResponseProcessor(this);

      fib2ResponseProcessor.feedbackProcessor();
    }
  }, {
    key: 'clearGrades',
    value: function clearGrades() {
      _fib4.Fib2ResponseProcessor.resetView(true);
      fib2ModelAndView.clearGrades();
    }
  }]);

  return fib2;
}();

exports.default = fib2;
module.exports = exports['default'];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIB2Transformer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _constant = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var buildModelandViewContent = Symbol('ModelandViewContent');
var setTheme = Symbol('engine-theme');
var setType = Symbol('setType');
var setInteractions = Symbol('setInteractions');
var setStimuli = Symbol('setStimuli');
var setInstructions = Symbol('setInstructions');
var setFeedback = Symbol('setFeedback');
var setScoring = Symbol('setScoring');
var setResponses = Symbol('setResponses');

var INTERACTION_REFERENCE_STR = _constant.Constants.INTERACTION_REFERENCE_STR;

var FIB2Transformer = function () {
  function FIB2Transformer(entity, params, themeObj) {
    _classCallCheck(this, FIB2Transformer);

    this.entity = entity;
    this.themeObj = themeObj;
    this.fib2Model = {
      instructions: [],
      questionData: [],
      stimuli: [],
      scoring: {},
      feedback: {},
      feedbackState: {
        'correct': false,
        'partiallyCorrect': false,
        'incorrect': false,
        'partiallyIncorrect': false,
        'empty': false
      },
      responses: {},
      type: '',
      theme: '',
      interactionIds: []
    };
  }

  _createClass(FIB2Transformer, [{
    key: 'transform',
    value: function transform() {
      this[buildModelandViewContent]();
      return this.fib2Model;
    }
  }, {
    key: buildModelandViewContent,
    value: function value() {
      this[setTheme](this.themeObj);
      this[setInteractions]();
      this[setType]();
      this[setStimuli]();
      this[setInstructions]();
      this[setFeedback]();
      this[setScoring]();
      this[setResponses]();
    }
  }, {
    key: setTheme,
    value: function value(themeKey) {
      this.fib2Model.theme = _constant.Constants.THEMES[themeKey];
    }
  }, {
    key: setType,
    value: function value() {
      this.fib2Model.type = this.entity.meta.type;
    }
  }, {
    key: setInstructions,
    value: function value() {
      this.fib2Model.instructions = this.entity.content.instructions.map(function (element) {
        return {
          text: element[element['tag']]
        };
      });
    }
  }, {
    key: setInteractions,
    value: function value() {
      var _this = this;

      var entity = this.entity;

      this.fib2Model.questionData = entity.content.canvas.data.questiondata.map(function (element, index) {
        var obj = {};
        var parsedQuestionArray = $('<div>' + element['text'] + '</div>');
        var interactionsReferences = $(parsedQuestionArray).find('a[href=\'' + INTERACTION_REFERENCE_STR + '\']');

        obj.interactions = [];
        obj.types = [];
        obj.numberOfInteractions = 0;
        interactionsReferences.each(function (idx, el) {
          var currinteractionid = $(el).text().trim();
          var newchild = $('<span  class=\'input answer\'><input type=\'text\' id=\'' + currinteractionid + '\' class=\'userAnswer\' autocomplete="off" spellcheck="false"/></span>')[0];

          $(el).replaceWith(newchild);
          obj.interactions.push(currinteractionid);
          obj.numberOfInteractions += 1;
          obj.types.push(entity.content.interactions[currinteractionid]);
          _this.fib2Model.interactionIds.push(currinteractionid);
        });

        obj.questionText = parsedQuestionArray[0].innerHTML;
        return obj;
      });
    }
  }, {
    key: setResponses,
    value: function value() {
      this.fib2Model.responses = this.entity.responses;
    }
  }, {
    key: setStimuli,
    value: function value() {
      this.fib2Model.stimuli = this.entity.content.stimulus.map(function (element) {
        var tagtype = element['tag'];
        var obj = void 0;

        if (tagtype) {
          obj = { 'src': element[tagtype] };
          obj[tagtype] = true;
        }
        if (!obj) {
          obj = element;
        }
        return obj;
      });
    }
  }, {
    key: setFeedback,
    value: function value() {
      this.fib2Model.feedback = this.entity.feedback;
    }
  }, {
    key: setScoring,
    value: function value() {
      this.fib2Model.scoring = this.entity.meta.score;
    }
  }]);

  return FIB2Transformer;
}();

exports.FIB2Transformer = FIB2Transformer;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<!-- Engine Renderer Template -->\r\n<div class=\"fib2-body\" id=\"fib2-engine\">\r\n  <main rv-addclass='content.theme'>\r\n    <section class=\"instructions\">\r\n      <p class=\"instruction\" rv-each-instruction=\"content.instructions\" rv-text-parse=\"instruction.text\"></p>\r\n    </section>\r\n\r\n    <section class=\"smart-form inline-input\">\r\n      <ol>\r\n        <li rv-each-question=\"content.questionData\" class=\"question-li\">\r\n          <span class=\"invisible pull-left\" rv-answer-id=\"index\"></span>\r\n          <label class=\"question\">\r\n            <span rv-text-parse=\"question.questionText\"></span>\r\n          </label>\r\n        </li>\r\n      </ol>\r\n    </section>\r\n\r\n    <section class=\"feedback\">\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-12 col-md-12\">\r\n          <div class=\"alert alert-success align-2-item\" role=\"alert\" rv-show=\"content.feedbackState.correct\">\r\n            <span>\r\n              <i class=\"fa fa-2x fa-smile-o vertical-align\"></i>\r\n            </span>\r\n            <span class=\"vertical-align pl-sm\" rv-text=\"content.feedback.global.correct\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-12 col-md-12\">\r\n          <div class=\"alert alert-danger align-2-item\" role=\"alert\" rv-show=\"content.feedbackState.incorrect\">\r\n            <span>\r\n              <i class=\"fa fa-2x  fa-smile-o vertical-align\"></i>\r\n            </span>\r\n            <span class=\"vertical-align pl-sm\" rv-text=\"content.feedback.global.incorrect\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-12 col-md-12\">\r\n          <div class=\"alert alert-danger align-2-item\" role=\"alert\" rv-show=\"content.feedbackState.partiallyCorrect\">\r\n            <span>\r\n              <i class=\"fa fa-2x fa-meh-o vertical-align\"></i>\r\n            </span>\r\n            <span class=\"vertical-align pl-sm\" rv-text=\"content.feedback.global.partiallyCorrect\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-12 col-md-12\">\r\n          <div class=\"alert alert-danger align-2-item\" role=\"alert\" rv-show=\"content.feedbackState.partiallyIncorrect\">\r\n            <span>\r\n              <i class=\"fa fa-2x fa-frown-o vertical-align\"></i>\r\n            </span>\r\n            <span class=\"vertical-align pl-sm\" rv-text=\"content.feedback.global.partiallyIncorrect\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-12 col-md-12\">\r\n          <div class=\"alert alert-warning align-2-item\" role=\"alert\" rv-show=\"content.feedbackState.empty\">\r\n            <span>\r\n              <i class=\"fa fa-2x fa-meh-o vertical-align\"></i>\r\n            </span>\r\n            <span class=\"vertical-align pl-sm\" rv-text=\"content.feedback.global.empty\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </main>\r\n</div>\r\n";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fib2ModelAndView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _constant = __webpack_require__(0);

var _rivets = __webpack_require__(2);

var _rivets2 = _interopRequireDefault(_rivets);

__webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var initializeRivets = Symbol('initializeRivets');

var Fib2ModelAndView = function () {
  function Fib2ModelAndView(fib2Model) {
    _classCallCheck(this, Fib2ModelAndView);

    this.model = fib2Model;
  }

  _createClass(Fib2ModelAndView, [{
    key: 'clearGrades',


    /**
     * Function to clear grades and reset feedback state
     */
    value: function clearGrades() {
      this.model.feedbackState = {
        'correct': false,
        'partiallyCorrect': false,
        'incorrect': false,
        'partiallyIncorrect': false,
        'empty': false
      };
    }

    /**
     * Function to bind data with rivets
     */

  }, {
    key: 'bindData',
    value: function bindData() {
      var data = this[initializeRivets]();

      /*Bind the data to template using rivets*/
      _rivets2.default.bind($('#fib2-engine'), data);
    }

    /**
     * Function to initialize rivets
     */

  }, {
    key: initializeRivets,
    value: function value() {
      _rivets2.default.binders.addclass = function (el, value) {
        if (el.addedClass) {
          $(el).removeClass(el.addedClass);
          delete el.addedClass;
        }

        if (value) {
          $(el).addClass(value);
          el.addedClass = value;
        }
      };

      _rivets2.default.binders['text-parse'] = function (el, value) {
        $(el).html(value);
      };

      _rivets2.default.binders['answer-id'] = function (el, value) {
        el.id = 'answer' + value;
      };

      return {
        content: this.model
      };
    }
  }, {
    key: 'template',
    get: function get() {
      return _constant.Constants.TEMPLATES.FIB2;
    }
  }, {
    key: 'themes',
    get: function get() {
      return _constant.Constants.THEMES;
    }
  }]);

  return Fib2ModelAndView;
}();

exports.Fib2ModelAndView = Fib2ModelAndView;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "/*******************************************************\r\n *\r\n * ----------------------\r\n * Engine Renderer Styles\r\n * ----------------------\r\n *\r\n * These styles do not include any product-specific branding\r\n * and/or layout / design. They represent minimal structural\r\n * SCSS which is necessary for a default rendering of an\r\n * FIB2 activity\r\n *\r\n * The styles are linked/depending on the presence of\r\n * certain elements (classes / ids / tags) in the DOM (as would\r\n * be injected via a valid FIB2 layout HTML and/or dynamically\r\n * created by the FIB2 engine JS)\r\n *\r\n *\r\n *******************************************************/\nmain {\n  font-size: 14px;\n  font-family: 'Open Sans', Verdana, sans-serif; }\n\n.instructions {\n  font-size: 1.1em;\n  color: #5c5c5c;\n  margin-bottom: 0.9em; }\n\n.smart-form {\n  line-height: 0.8em; }\n  .smart-form ol {\n    padding: 0; }\n  .smart-form .question-li {\n    padding: .7em .4em .7em 1.8em;\n    margin-left: 2em;\n    color: #666; }\n    .smart-form .question-li .wrong:before {\n      content: \"\\F00D\";\n      color: red;\n      font-family: fontawesome;\n      display: block;\n      margin: .15em .36em auto -4.5em; }\n    .smart-form .question-li .correct:before {\n      content: \"\\F00C\";\n      color: green;\n      display: block;\n      font-family: fontawesome;\n      margin: .15em .36em auto -4.5em; }\n  .smart-form .question {\n    font-weight: normal;\n    margin: 0;\n    line-height: 1.5em; }\n    .smart-form .question input {\n      border-width: 0 0 1px 0;\n      outline: none;\n      width: 150px;\n      text-align: center;\n      border-radius: 0; }\n    .smart-form .question input:disabled {\n      opacity: 0.6;\n      background: #ffffff; }\n  .smart-form .state-success input {\n    border-color: #7DC27D; }\n  .smart-form .state-success input:disabled {\n    background: #f0fff0; }\n  .smart-form .state-error input {\n    border-color: #A90329; }\n  .smart-form .state-error input:disabled {\n    background: #fff0f0; }\n\n.feedback .alert-success {\n  background-color: #f2fdee; }\n\n.feedback .alert-danger {\n  background-color: #fdeeee; }\n\n.feedback .vertical-align {\n  vertical-align: middle; }\n\n.feedback .pl-sm {\n  padding-left: 0.5em; }\n\n.fib2-dark .instruction,\n.fib2-dark .question-li {\n  color: #ffffff; }\n\n.fib2-dark .smart-form .state-success input {\n  background: #363636;\n  border-color: #7DC27D; }\n\n.fib2-dark .smart-form .state-error input {\n  background: #363636;\n  border-color: #A90329; }\n\n.fib2-dark .smart-form input {\n  background: #363636;\n  color: #ffffff; }\n\n.fib2-dark .smart-form input:disabled {\n  opacity: 0.6 !important;\n  background: #363636; }\n\n.fib2-dark .feedback .alert-success {\n  background-color: #363636;\n  color: #40fd21;\n  border: 1px solid #494949; }\n\n.fib2-dark .feedback .alert-danger {\n  background-color: #363636;\n  color: #e30e0e;\n  border: 1px solid #494949; }\n\n.fib2-light {\n  background-color: #f6f6f6; }\n  .fib2-light .instructions {\n    color: #535353; }\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fib2Events = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _constant = __webpack_require__(0);

var _fib = __webpack_require__(8);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fib2Events = function () {
  function Fib2Events(fib2Obj) {
    _classCallCheck(this, Fib2Events);

    this.fib2Obj = fib2Obj;
    this.fib2UserResponse = new _fib.Fib2ResponseProcessor(fib2Obj);
  }

  /**
   * Function to handle on input focus in
   */


  _createClass(Fib2Events, [{
    key: 'handleQuestionTextOnFocus',
    value: function handleQuestionTextOnFocus(event) {
      var _this = this;

      if (_constant.Constants.PARTIAL_SAVE_TIMER) {
        clearInterval(_constant.Constants.PARTIAL_SAVE_TIMER);
      }
      _constant.Constants.PARTIAL_SAVE_TIMER = setInterval(function () {
        var currentTarget = event.target;
        var newAnswer = currentTarget.value.replace(/^\s+|\s+$/g, '');
        var interactionId = currentTarget.attributes['id'].value;

        /* If user did not change answer don't soft save. */
        if (newAnswer === _this.fib2Obj.userAnswers[interactionId]) {
          return;
        }

        /* Save new Answer back in userAnswers. */
        _this.fib2Obj.userAnswers[interactionId] = newAnswer;

        /* Soft save answers. */
        _this.fib2UserResponse.savePartial();
      }, 10000);
    }

    /**
     * Function to handle on focus out
     */

  }, {
    key: 'handleQuestionTextLostFocus',
    value: function handleQuestionTextLostFocus(event) {
      /* Stop previous timer. */
      if (_constant.Constants.PARTIAL_SAVE_TIMER) {
        clearInterval(_constant.Constants.PARTIAL_SAVE_TIMER);
      }
      var currentTarget = event.currentTarget;
      var newAnswer = currentTarget.value.replace(/^\s+|\s+$/g, '');
      var interactionId = currentTarget.attributes['id'].value;

      /* If user did not change answer don't soft save. */
      if (newAnswer === this.fib2Obj.userAnswers[interactionId]) {
        return;
      }

      /* Save new Answer back in userAnswers. */
      this.fib2Obj.userAnswers[interactionId] = newAnswer;

      /* Soft save answers. */
      this.fib2UserResponse.savePartial();
    }

    /**
     * Function to bind focus in and focus out event handlers
     */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this2 = this;

      $('.userAnswer').focus(function (event) {
        _this2.handleQuestionTextOnFocus(event, _this2.fib2Obj);
      }).blur(function (event) {
        _this2.handleQuestionTextLostFocus(event, _this2.fib2Obj);
      });
    }
  }]);

  return Fib2Events;
}();

exports.Fib2Events = Fib2Events;

/***/ })
/******/ ]);
});
//# sourceMappingURL=fib2.js.map