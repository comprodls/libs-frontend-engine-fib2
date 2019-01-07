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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var interactionReferenceString = exports.interactionReferenceString = 'http://www.comprodls.com/m1.0/interaction/fib2';

var constantInputClass = exports.constantInputClass = {
  DOM_SEL_INPUT_BOX: 'userAnswer'
};

var feedbackPresets = exports.feedbackPresets = [{ key: 'correct', value: 'Perfect. You got it correct !!!', showDropdown: true, order: 1 }, { key: 'incorrect', value: 'Sorry, Wrong Responses. Try Again After some time !!!', showDropdown: true, order: 2 }, { key: 'partiallyCorrect', value: 'You are almost done. Try Again !!!', showDropdown: true, order: 3 }, { key: 'partiallyIncorrect', value: 'Sorry, Wrong responses', showDropdown: true, order: 4 }, { key: 'empty', value: 'You did not enter anything.', showDropdown: true, order: 5 }];

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fib2Editor = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _fib2editorTransform = __webpack_require__(19);

var _fib2editorTransform2 = _interopRequireDefault(_fib2editorTransform);

var _fib2editorModelview = __webpack_require__(20);

var _fib2editorModelview2 = _interopRequireDefault(_fib2editorModelview);

var _fib2editorUtils = __webpack_require__(24);

var _fib2editorUtils2 = _interopRequireDefault(_fib2editorUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var load = Symbol('loadFIB2');
var transform = Symbol('transformFIB2Editor');
var renderView = Symbol('renderFIB2Editor');
var setUtils = Symbol('setUtils');

var fib2Editor = function () {
    function fib2Editor(elRoot, params, adaptor, htmlLayout, jsonContentObj) {
        var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function () {};

        _classCallCheck(this, fib2Editor);

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

    _createClass(fib2Editor, [{
        key: load,
        value: function value() {
            this[transform]();
            this[setUtils]();
            this[renderView]();
        }
    }, {
        key: transform,
        value: function value() {
            this.fib2Transformer = new _fib2editorTransform2.default(this.jsonContent);

            var _fib2Transformer$tran = this.fib2Transformer.transform();

            var _fib2Transformer$tran2 = _slicedToArray(_fib2Transformer$tran, 2);

            this.fib2EditedJSONContent = _fib2Transformer$tran2[0];
            this.interactionIds = _fib2Transformer$tran2[1];
        }
    }, {
        key: setUtils,
        value: function value() {
            this.utils = new _fib2editorUtils2.default(this.fib2EditedJSONContent, this.interactionIds, this.adaptor);
        }
    }, {
        key: renderView,
        value: function value() {
            var fib2ModelAndView = new _fib2editorModelview2.default(this.fib2EditedJSONContent, this.adaptor, this.utils);
            var htmltemplate = fib2ModelAndView.template;

            /**
             * @member {String}
             * Apply the content JSON to the htmllayout.
             */
            $(this.elRoot).html(htmltemplate);
            fib2ModelAndView.bindData();
        }
    }, {
        key: 'getConfig',
        value: function getConfig() {
            this.utils.getConfig();
        }
    }, {
        key: 'getStatus',
        value: function getStatus() {
            this.utils.getStatus();
        }
    }, {
        key: 'saveItemInEditor',
        value: function saveItemInEditor() {
            this.utils.saveItemInEditor();
        }
    }]);

    return fib2Editor;
}();

exports.fib2Editor = fib2Editor;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _fib2editorConstants = __webpack_require__(7);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var buildModelandViewContent = Symbol('ModelandViewContent');
var parseAndUpdateJSONForRivets = Symbol('parseAndUpdateJSONForRivets');
var parseQuestionTextJSONForRivets = Symbol('parseQuestionTextJSONForRivets');
var parseInstructionTextJSONForRivets = Symbol('parseInstructionTextJSONForRivets');
var parseGlobalFeedbackJSONForRivets = Symbol('parseGlobalFeedbackJSONForRivets');
var icon = {
  correct: 'fa-smile-o',
  incorrect: 'fa-frown-o',
  partiallyIncorrect: 'fa-frown-o',
  partiallyCorrect: 'fa-smile-o',
  empty: 'fa-meh-o',
  generic: 'fa-comment-o'
};

var Fib2Transformer = function () {
  function Fib2Transformer(jsonContent) {
    _classCallCheck(this, Fib2Transformer);

    this.editedJsonContent = jsonContent;
    this.interactionIds = [];
  }

  _createClass(Fib2Transformer, [{
    key: 'transform',
    value: function transform() {
      this[buildModelandViewContent]();
      return [this.editedJsonContent, this.interactionIds];
    }
  }, {
    key: buildModelandViewContent,
    value: function value() {
      //Process JSON for easy iteration in template
      this[parseAndUpdateJSONForRivets]();
    }

    /*
    This function creates content for the editor from the base JSON data recieved
    */

  }, {
    key: parseAndUpdateJSONForRivets,
    value: function value() {
      this.editedJsonContent.FIBSR = false;
      this.editedJsonContent.isInstructionEmpty = true;
      this.editedJsonContent.enableFeedBack = false;

      // Process JSON to initiate interactionIds and parse questionText
      this[parseQuestionTextJSONForRivets]();
      this[parseInstructionTextJSONForRivets]();
      this[parseGlobalFeedbackJSONForRivets]();

      for (var i = 0; i < this.interactionIds.length; i++) {
        var interaction = this.editedJsonContent.content.interactions[this.interactionIds[i]];
        var type = interaction.type;

        this.editedJsonContent[type] = true;
      }
    }
  }, {
    key: parseQuestionTextJSONForRivets,
    value: function value() {
      var _this = this;

      this.editedJsonContent.content.questiondata = [];

      this.editedJsonContent.content.canvas.data.questiondata.forEach(function (element, index) {
        if (element.text !== '') {
          element.questionText = element.text;
          element.answerText = element.text;

          var parsedQuestionArray = $('<div>' + element['text'] + '</div>');
          var interactionsReferences = $(parsedQuestionArray).find('a[href=\'' + _fib2editorConstants.interactionReferenceString + '\']');

          interactionsReferences.each(function (id, el) {
            var interactionId = $(el).text().trim();

            _this.interactionIds.push(interactionId);

            var interactionTag = el.outerHTML;

            interactionTag = interactionTag.replace(/"/g, '\'');

            var answer = _this.editedJsonContent.responses[interactionId].correct;

            var questionBlank = '\n            <span class="response-blank" contenteditable="false"><span class="drag">' + interactionId.substring(1) + '</span><span id="' + interactionId + '" class="answer">Response</span></span>\n          ';

            element.questionText = element.questionText.replace(interactionTag, questionBlank);

            var answerBlank = '<span class="input">' + '<input type="text" value="' + answer + '" class=" ' + interactionId + ' input-sm ' + _fib2editorConstants.constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + '</span>';

            element.answerText = element.answerText.replace(interactionTag, answerBlank);
          });
          _this.editedJsonContent.content.questiondata.push(element);
        }
      });
    }
  }, {
    key: parseInstructionTextJSONForRivets,
    value: function value() {
      this.editedJsonContent.content.instructions = this.editedJsonContent.content.instructions.map(function (element) {
        var text = 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question';

        if (element.text !== '' || element.tag === 'html') {
          text = element.text || element[element['tag']];
        }
        return {
          text: text,
          tag: element.tag
        };
      });

      this.editedJsonContent.isInstructionEmpty = this.editedJsonContent.content.instructions.length <= 0;
    }
  }, {
    key: parseGlobalFeedbackJSONForRivets,
    value: function value() {
      if (this.editedJsonContent.feedback.global === undefined) {
        this.editedJsonContent.feedback.global = [];
        return;
      }
      var tempObj = this.editedJsonContent.feedback.global;
      var tempArr = [];

      if (tempObj && Object.keys(tempObj).length > 0) {
        Object.keys(tempObj).forEach(function (key, index) {
          var processedObj = {};

          processedObj.customAttribs = {};
          processedObj.customAttribs.key = key;
          processedObj.customAttribs.value = tempObj[key];
          processedObj.customAttribs.index = index;
          if (key === 'correct') {
            processedObj.customAttribs.order = 1;
            _fib2editorConstants.feedbackPresets[0].showDropdown = false;
          } else if (key === 'incorrect') {
            processedObj.customAttribs.order = 4;
            _fib2editorConstants.feedbackPresets[1].showDropdown = false;
          } else if (key === 'partiallyCorrect') {
            processedObj.customAttribs.order = 2;
            _fib2editorConstants.feedbackPresets[2].showDropdown = false;
          } else if (key === 'partiallyIncorrect') {
            processedObj.customAttribs.order = 3;
            _fib2editorConstants.feedbackPresets[3].showDropdown = false;
          } else if (key === 'empty') {
            processedObj.customAttribs.order = 5;
            _fib2editorConstants.feedbackPresets[4].showDropdown = false;
          } else {
            processedObj.customAttribs.order = 100;
          }
          processedObj.customAttribs.icon = icon[key];
          tempArr.push(processedObj);
        });
        tempArr.sort(function (a, b) {
          return a.customAttribs.order - b.customAttribs.order;
        });
        this.editedJsonContent.feedback.global = tempArr;
        this.editedJsonContent.enableFeedBack = true;
      }
    }
  }]);

  return Fib2Transformer;
}();

exports.default = Fib2Transformer;
module.exports = exports['default'];

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _rivets = __webpack_require__(2);

var _rivets2 = _interopRequireDefault(_rivets);

var _fib2editorConstants = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(21);

var fib2TemplateRef = __webpack_require__(23);
var initializeRivets = Symbol('initializeRivets');
var bindEvents = Symbol('bindEvents');
var constantTemplateRef = {
  TEMPLATES: {
    /* Regular fib2 Layout */
    FIB2_EDITOR: fib2TemplateRef
  }
};

var Fib2ModelAndView = function () {
  function Fib2ModelAndView(jsonContent, activityAdaptor, utils) {
    _classCallCheck(this, Fib2ModelAndView);

    this.editedJsonContent = jsonContent;
    this.utils = utils;
    this.sendItemChangeNotification = false;
    this.activityAdaptor = activityAdaptor;
  }

  _createClass(Fib2ModelAndView, [{
    key: 'bindData',
    value: function bindData() {
      var data = this[initializeRivets]();

      _rivets2.default.bind($('#fib-editor'), data);
      this[bindEvents]();
    }
  }, {
    key: initializeRivets,
    value: function value() {
      var _this3 = this;

      var _self = this;
      /*
       * Formatters for rivets
       */

      /* Appends custom arguments to function calls*/
      _rivets2.default.formatters.args = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);

        return function () {
          return fn.apply(this, Array.prototype.concat.call(arguments, args));
        };
      };

      _rivets2.default.binders['content'] = {
        bind: function bind(el) {
          var _this = this;

          this.callback = function (e) {
            _this.publish();
          };
          $(el).on('focusout', '.userAnswer', _self.utils.userAnswerInputEventListener.bind(_self.utils));
          el.addEventListener('blur', this.callback);
        },
        unbind: function unbind(el) {
          el.removeEventListener('blur', this.callback);
        },
        getValue: function getValue(el) {
          return el.innerHTML;
        },
        routine: function routine(el, value) {
          el.innerHTML = value;
        }
      };

      _rivets2.default.binders['content-editable'] = {
        bind: function bind(el) {
          var _this2 = this;

          if (el.className === 'question-data mb-sm') {
            el.addEventListener('paste', _self.utils.questionDataEventListener.bind(_self.utils));
            $(el).on('mouseenter', '.drag', function () {
              $(this).next().css('color', 'dodgerblue');
            }).on('mouseleave', '.drag', function () {
              $(this).next().css('color', '');
            }).on('mouseenter', '.answer', function () {
              $(this).prev().css('background-color', 'dodgerblue');
            }).on('mouseleave', '.answer', function () {
              $(this).prev().css('background-color', '');
            });
          }

          el.setAttribute('contenteditable', true);
          this.callback = function (e) {
            _this2.publish();
          };
          el.addEventListener('blur', this.callback);
        },
        unbind: function unbind(el) {
          el.removeEventListener('blur', this.callback);
        },
        getValue: function getValue(el) {
          return el.innerHTML;
        },
        routine: function routine(el, value) {
          if (_this3.sendItemChangeNotification) {
            if (el.className === 'question-data mb-sm') {
              _this3.utils.updateAnswerTextJSON();
            }
            _this3.utils.handleItemChangedInEditor();
          }
          el.innerHTML = value;
        }
      };

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

      return {
        editorContent: this.editedJsonContent,
        feedback: this.editedJsonContent.feedback,
        isInstructionEmpty: this.editedJsonContent.isInstructionEmpty,
        removeInstruction: this.utils.removeInstruction.bind(this.utils),
        addInstruction: this.utils.addInstruction.bind(this.utils),
        addQuestion: this.utils.addQuestion.bind(this.utils),
        removeQuestion: this.utils.removeQuestion.bind(this.utils),
        feedbackPresets: _fib2editorConstants.feedbackPresets
      };
    }
  }, {
    key: bindEvents,
    value: function value() {
      var _this4 = this;

      $(document).ready(function () {
        _this4.sendItemChangeNotification = true;
      });
    }
  }, {
    key: 'template',
    get: function get() {
      return constantTemplateRef.TEMPLATES.FIB2_EDITOR;
    }
  }]);

  return Fib2ModelAndView;
}();

exports.default = Fib2ModelAndView;
module.exports = exports['default'];

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
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
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./fib2-editor.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./fib2-editor.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "#fib-editor {\n  /* styling for inline input box */ }\n  #fib-editor .global {\n    font-size: 1.3em;\n    font-family: Open Sans;\n    color: #585858;\n    padding: 10px; }\n  #fib-editor .outline-none {\n    outline: none; }\n  #fib-editor .color-gray {\n    color: #343434; }\n  #fib-editor .color-white {\n    color: #fff; }\n  #fib-editor .color-lightslategray {\n    color: #d5d5d5; }\n  #fib-editor .color-lightgray {\n    color: #585858; }\n  #fib-editor .bg-white {\n    background-color: #fff; }\n  #fib-editor .bg-capecode {\n    background-color: #3f3f3f;\n    color: #fff; }\n  #fib-editor .bg-zanah {\n    color: #2e2e2e;\n    background-color: #def2d3; }\n  #fib-editor .global-border {\n    border: 1px solid lightslategray; }\n  #fib-editor .font-semibold {\n    font-weight: 600; }\n  #fib-editor .font-normal {\n    font-weight: 400; }\n  #fib-editor .noborder {\n    border: none; }\n  #fib-editor .adjusted-width {\n    width: 96%; }\n  #fib-editor .mt-sm {\n    margin-top: 15px; }\n  #fib-editor .mt-md {\n    margin-top: 20px; }\n  #fib-editor .ml-md {\n    margin-left: 20px; }\n  #fib-editor .ml-xl {\n    margin-left: 40px; }\n  #fib-editor .mt-xs {\n    margin-top: 5px; }\n  #fib-editor .ml-xxl {\n    margin-left: 60px; }\n  #fib-editor .mr-xs {\n    margin-right: 5px; }\n  #fib-editor .ml-sm {\n    margin-left: 15px; }\n  #fib-editor .mb-sm {\n    margin-bottom: 15px; }\n  #fib-editor .mb-md {\n    margin-bottom: 20px; }\n  #fib-editor .mb-add-offset {\n    margin-bottom: 25px; }\n  #fib-editor .mr-1em {\n    margin-right: 1em; }\n  #fib-editor .pl-0 {\n    padding-left: 0; }\n  #fib-editor .pl-md {\n    padding-left: 25px; }\n  #fib-editor .pl-sm {\n    padding-left: 15px; }\n  #fib-editor .pr-0 {\n    padding-right: 0; }\n  #fib-editor .pr-3pc {\n    padding-right: 3%; }\n  #fib-editor .pr-7pc {\n    padding-right: 3%; }\n  #fib-editor .plr-1pc {\n    padding-left: 1%;\n    padding-right: 1%; }\n  #fib-editor .plr-md {\n    padding-left: 20px;\n    padding-right: 20px; }\n  #fib-editor .ptb-sm {\n    padding-top: 10px;\n    padding-bottom: 10px; }\n  #fib-editor .pb-1pc {\n    padding-bottom: 1%; }\n  #fib-editor .border-bottom-dashed {\n    border-bottom: 1px dashed #d5d5d5;\n    transition: border-color 0.5s ease-in-out; }\n  #fib-editor .border-bottom-blue {\n    border-bottom: 1px solid #6778e3;\n    transition: border-color 0.5s ease-in-out; }\n  #fib-editor .border-dashed {\n    border: 1px dashed; }\n  #fib-editor .border-top {\n    border-top: 1px solid #d5d5d5; }\n  #fib-editor .border-left {\n    border-left: 1px solid #d5d5d5; }\n  #fib-editor .border-right {\n    border-right: 1px solid #d5d5d5; }\n  #fib-editor .border-bottom {\n    border-bottom: 1px solid #d5d5d5; }\n  #fib-editor .border-bottom-shadow {\n    border-bottom: 1px solid #f3f3f3;\n    box-shadow: 0 12px 15px -20px #2e2e2e; }\n  #fib-editor .font-medium {\n    font-size: 14px; }\n  #fib-editor .text-underline {\n    text-decoration: underline; }\n  #fib-editor .correct {\n    color: green; }\n  #fib-editor .incorrect {\n    color: red; }\n  #fib-editor [contentEditable=true]:focus {\n    border: none;\n    outline: none; }\n  #fib-editor [contentEditable=true]:empty:not(:focus):before {\n    content: attr(data-text); }\n  #fib-editor .option-div {\n    line-height: 1.8em;\n    width: 94%; }\n  #fib-editor .ribbon-adjustments {\n    margin: 0 15px 0 15px !important; }\n  #fib-editor .icon-horizontal-align {\n    position: absolute;\n    right: 14px; }\n  #fib-editor .hide-option {\n    position: absolute;\n    left: -9999px; }\n  #fib-editor .fa-frown-o {\n    color: #a94442; }\n  #fib-editor .fa-smile-o {\n    color: #3c763d; }\n  #fib-editor .fa-meh-o {\n    color: #8a6d3b; }\n  #fib-editor .round-icon {\n    border-radius: 50%; }\n  #fib-editor .vertical-center-align {\n    display: flex;\n    align-items: center; }\n  #fib-editor .vertical-bottom-align {\n    display: flex;\n    align-items: flex-end; }\n  #fib-editor .vertical-top-align {\n    display: flex;\n    align-items: flex-start; }\n  #fib-editor .vertical-align-self {\n    align-self: center; }\n  #fib-editor .option-icon-pencil {\n    position: relative;\n    left: 15px; }\n  #fib-editor .icon-box {\n    width: 7%;\n    position: absolute;\n    right: -25px; }\n  #fib-editor .icon-pencil {\n    position: absolute; }\n  #fib-editor .bottom {\n    bottom: 0; }\n  #fib-editor .no-margin-left {\n    margin-left: 0; }\n  @media (max-width: 1240px) {\n    #fib-editor .icon-box {\n      width: 7%;\n      right: -10px; }\n    #fib-editor .option-div {\n      width: 92%; } }\n  @media (max-width: 980px) {\n    #fib-editor .icon-box {\n      width: 8%;\n      right: 0; }\n    #fib-editor .option-div {\n      width: 90%; } }\n  @media (max-width: 720px) {\n    #fib-editor .icon-box {\n      width: 10%;\n      right: -10px; }\n    #fib-editor .option-div {\n      width: 86%; } }\n  #fib-editor .linkenabled {\n    color: #585858; }\n  #fib-editor .linkdisabled {\n    color: #dfdddd;\n    pointer-events: none;\n    cursor: default; }\n  #fib-editor .qq-gallery .qq-progress-bar {\n    background: #d5d5d5; }\n  #fib-editor .qq-gallery .qq-upload-button {\n    color: #2e2e2e;\n    background-color: #fff;\n    min-width: 150px;\n    display: inline-block;\n    padding: 6px 12px;\n    line-height: 1.42857143;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: middle;\n    touch-action: manipulation;\n    cursor: pointer;\n    user-select: none;\n    background-image: none;\n    border: 1px dashed #2e2e2e;\n    border-radius: 4px;\n    box-shadow: none;\n    outline: none;\n    font-weight: 600;\n    font-size: 1.1em; }\n  #fib-editor .fa-pencil:before {\n    color: lightslategray; }\n  #fib-editor .textEditable[contentEditable=true]:not(:focus) {\n    border-bottom: 1px dashed #d5d5d5; }\n  #fib-editor .option-div[contentEditable=true]:focus {\n    border: none;\n    border-bottom: 1px solid #162375;\n    outline: none; }\n  #fib-editor a:hover {\n    text-decoration: none;\n    cursor: pointer; }\n  #fib-editor li.highlight i.choices {\n    border-color: green; }\n    #fib-editor li.highlight i.choices:after {\n      opacity: 0.7; }\n  #fib-editor .fa-thumbs-o-up:before {\n    content: \"\\F087\"; }\n  #fib-editor .smart-form input {\n    border-width: 0 0 1px 0; }\n  #fib-editor .inline-input ol > li input[type=\"text\"] {\n    text-align: center;\n    width: 150px;\n    border: none; }\n  #fib-editor .inline-input span {\n    display: inline; }\n  #fib-editor .inline-input input {\n    display: inline;\n    font-size: 14px; }\n  #fib-editor .inline-input ol > li span.input {\n    text-align: center;\n    width: 150px;\n    display: inline-block;\n    font-size: 14px;\n    border-bottom: 1px solid black; }\n  #fib-editor .remove-icon {\n    float: right; }\n  #fib-editor .nav-tabs {\n    border-bottom: 2px solid #DDD; }\n  #fib-editor .nav-tabs > li.active > a, #fib-editor .nav-tabs > li.active > a:focus, #fib-editor .nav-tabs > li.active > a:hover {\n    border-width: 0; }\n  #fib-editor .nav-tabs > li > a {\n    border: none;\n    color: #666; }\n  #fib-editor .nav-tabs > li.active > a, #fib-editor .nav-tabs > li > a:hover {\n    border: none;\n    color: #4285F4 !important;\n    background: transparent; }\n  #fib-editor .nav-tabs > li > a::after {\n    content: \"\";\n    background: #4285F4;\n    height: 2px;\n    position: absolute;\n    width: 100%;\n    left: 0;\n    bottom: -1px;\n    transition: all 250ms ease 0s;\n    transform: scale(0); }\n  #fib-editor .nav-tabs > li.active > a::after, #fib-editor .nav-tabs > li:hover > a::after {\n    transform: scale(1); }\n  #fib-editor .tab-nav > li > a::after {\n    background: #21527d none repeat scroll 0 0;\n    color: #fff; }\n  #fib-editor .tab-pane {\n    padding: 15px 0; }\n  #fib-editor .tab-content {\n    padding: 20px; }\n  #fib-editor .dls-media .carousel .carousel-control.left > i,\n  #fib-editor .dls-media .carousel .carousel-control.left > i {\n    /*position: absolute;*/\n    left: 12px;\n    top: 50%;\n    transform: translateY(-50%);\n    width: 30px !important;\n    height: 30px !important; }\n  #fib-editor .dls-media .carousel .carousel-control.left > i {\n    left: auto;\n    right: 12px; }\n  #fib-editor .nounderline {\n    text-decoration: none;\n    outline: none; }\n  #fib-editor .preview-empty {\n    min-height: 200px;\n    margin: 0 auto;\n    position: relative; }\n  #fib-editor .flex-center {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n    -ms-flex-align: center;\n    align-items: center;\n    -webkit-box-pack: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n    -ms-flex-direction: column;\n    flex-direction: column; }\n  #fib-editor .response-blank {\n    font-size: 14px; }\n    #fib-editor .response-blank .drag {\n      cursor: move;\n      background-color: #808B96;\n      color: white;\n      padding: 0.3em; }\n    #fib-editor .response-blank .drag:hover {\n      background-color: dodgerblue; }\n    #fib-editor .response-blank .answer {\n      background-color: #f0f0f0;\n      padding: 0.3em; }\n    #fib-editor .response-blank .answer:hover {\n      color: dodgerblue; }\n  #fib-editor .answer-data {\n    color: #666666;\n    user-select: none; }\n  #fib-editor .question-alert {\n    padding: 10px;\n    margin-bottom: 10px;\n    border: none; }\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<!-- Engine Editor Template -->\r\n<div class=\"fib-body main-container\" id=\"fib-editor\">\r\n  <main class=\"main global\">\r\n    <section id=\"instruction\" class=\"section instruction border-bottom-shadow\">\r\n      <div class=\"section-box mt-sm\">\r\n        <div class=\"row\">\r\n          <div class=\"col-sm-12\" id=\"instructionLabel\" rv-hide=\"isInstructionEmpty\">\r\n            <header>\r\n              <h4 class=\"headerlabel font-semibold color-gray\">Instruction Text</h4>\r\n            </header>\r\n          </div>\r\n          <div class=\"col-sm-12\">\r\n            <ul class=\"list-unstyled nested-list\">\r\n              <li class=\"text-box colborder mt-sm mb-add-offset\"\r\n                  rv-each-instruction=\"editorContent.content.instructions\" rv-instructionIndex=\"%instruction%\">\r\n                <div class=\"vertical-top-align\">\r\n                  <span class=\"pull-left icon-pencil\">\r\n                    <i class=\"fa fa-pencil\"></i>\r\n                  </span>\r\n                  <div rv-content-editable=\"instruction.text\" style=\"width: 100%;\"\r\n                       data-text='Placeholder Instruction text. Update \"Me\" with a valid Instruction text for this question.'\r\n                       class=\"pr-3pc pb-1pc pl-md border-bottom-dashed\" role=\"button\"></div>\r\n                  <span class=\"pull-right icon-horizontal-align\">\r\n                    <a class=\"color-lightgray fa fa-times outline-none\" data-toggle=\"tooltip\"\r\n                       title=\"Click to remove this option\"\r\n                       rv-on-click=\"removeInstruction | args instruction %instruction%\"></a>\r\n                  </span>\r\n                </div>\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n        <div class=\"row mb-add-offset\">\r\n          <div class=\"col-sm-12 dropdown\">\r\n            <button class=\"btn btn-primary btn-sm dropdown-toggle\" type=\"button\" id=\"menu1\" data-toggle=\"dropdown\">Add\r\n            </button>\r\n            <ul class=\"dropdown-menu\" role=\"menu\" id=\"instructionmenu\" aria-labelledby=\"menu1\" style=\"left: 15px;\">\r\n              <li class=\"border-bottom-dashed\" role=\"presentation\">\r\n                <a class='dropdown-toggle disabled' role=\"menuitem\" href=\"#\" rv-on-click=\"addInstruction\">Instruction\r\n                  Text</a>\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n    <section id=\"question\" class=\"section question\">\r\n      <!-- Loop over all instructions text -->\r\n      <div class=\"section-box\">\r\n        <div class=\"row\">\r\n          <div class=\"col-sm-12\">\r\n            <header>\r\n              <h4 class=\"headerlabel font-semibold color-gray\">Questions</h4>\r\n            </header>\r\n          </div>\r\n          <!-- Loop over all question data text -->\r\n          <div class=\"col-sm-12 mt-sm smart-form inline-input\">\r\n            <ol class=\"list-unstyled nested-list\">\r\n              <li class=\"text-box vertical-top-align mt-md mb-add-offset\" rv-each-qdata=\"editorContent.content.questiondata\">\r\n                <span class=\"pull-left icon-pencil\">\r\n                  <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>\r\n                </span>\r\n                <div style=\"width: 100%;\" data-text=\"Please Enter Question Test here.\"\r\n                     class=\"question-container pl-md border-bottom-dashed\" role=\"button\">\r\n                  <div class=\"question-data mb-sm\" rv-content-editable=\"qdata.questionText\"></div>\r\n                  <div class=\"answer-data mb-sm\" rv-content=\"qdata.answerText\"></div>\r\n                  <div class=\"alert alert-danger question-alert\" role=\"alert\" rv-show=\"qdata.alert\" rv-text=\"qdata.alert\"></div>\r\n                </div>\r\n                <span class=\"pull-right icon-horizontal-align\">\r\n                  <a class=\"color-lightgray fa fa-times outline-none\" data-toggle=\"tooltip\"\r\n                     title=\"Remove Question\" rv-on-click=\"removeQuestion | args qdata %qdata%\"></a>\r\n                </span>\r\n              </li>\r\n            </ol>\r\n          </div>\r\n        </div>\r\n        <div class=\"row mb-add-offset\">\r\n          <div class=\"col-sm-12 dropdown\">\r\n            <button class=\"btn btn-primary btn-sm dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\"\r\n                    rv-on-click=\"addQuestion\">Add Question\r\n            </button>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n    <section id=\"feedback\" class=\"section feedback  border-bottom-shadow\">\r\n      <div class=\"section-box\">\r\n        <div class=\"row mt-sm mb-sm\">\r\n          <div class=\"col-sm-12\" rv-hide=\"editorContent.enableFeedBack\">\r\n            <a class=\"enable-feedback\">\r\n              <button type=\"button\" class=\"btn btn-default active-btn border-dashed\" rv-on-click=\"showFeedBack\">\r\n                <h4 class=\"font-semibold color-gray\">Enable Feedback</h4>\r\n              </button>\r\n            </a>\r\n          </div>\r\n          <div class=\"col-sm-12 pl-0 pr-0\" rv-show=\"editorContent.enableFeedBack\">\r\n            <div class=\"col-sm-12 mb-md\">\r\n              <header>\r\n                <h4 class=\"headerlabel font-semibold color-gray\">Feedback</h4>\r\n              </header>\r\n            </div>\r\n            <ul class=\"list-unstyled nested-list\">\r\n              <li class=\"vertical-center-align col-xs-12 col-sm-12 bg-white  mb-add-offset pl-0 pr-0\"\r\n                  rv-each-element=\"editorContent.feedback.global\">\r\n                <div class=\"vertical-top-align\" style=\"width: 100%\">\r\n                  <span class=\"pull-left option-icon-pencil\"><i class=\"fa fa-pencil\"></i></span>\r\n                  <div rv-content-editable=\"element.customAttribs.value\" style=\"width: 100%;\"\r\n                       data-text='Placeholder Feedback text. Update \"Me\" with a valid Feedback text for this question.'\r\n                       class=\"pr-3pc pb-1pc pl-md border-bottom-dashed\" role=\"button\"></div>\r\n                </div>\r\n                <span class=\"pull-right\">\r\n                    <i class=\"fa fa-2x\" rv-addclass='element.customAttribs.icon'></i>\r\n                </span>\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </main>\r\n</div>\r\n";

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */

var _fib2editorConstants = __webpack_require__(7);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = {
  RESIZE_MODE: 'auto', /* Possible values - "manual"/"auto". Default value is "auto". */
  RESIZE_HEIGHT: '580' /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will override. */
};

var Fib2EditorUtils = function () {
  function Fib2EditorUtils(jsonContent, interactionIds, activityAdaptor) {
    _classCallCheck(this, Fib2EditorUtils);

    this.editedJsonContent = jsonContent;
    this.activityAdaptor = activityAdaptor;
    this.uniqueId = this.activityAdaptor.getId();
    this.interactionIds = interactionIds;
    this.state = {
      'hasUnsavedChanges': false
    };
  }

  _createClass(Fib2EditorUtils, [{
    key: 'questionDataEventListener',
    value: function questionDataEventListener(e) {
      // Get the clipboard data
      var pattern = new RegExp('^[0-9]*Response$', 'i');
      var paste = (e.clipboardData || window.clipboardData).getData('text');

      if (paste.search(pattern) !== -1) {

        // Prevent the default pasting event and stop bubbling
        e.preventDefault();
        e.stopPropagation();

        var selection = window.getSelection();

        // Cancel the paste operation if the cursor or highlighted area isn't found
        if (!selection.rangeCount) return false;

        var interactionId = this.getInteractionId();
        var questionBlank = document.createElement('span');

        questionBlank.setAttribute('class', 'response-blank');
        questionBlank.setAttribute('contenteditable', 'false');

        var dragNode = document.createElement('span');
        var newNode = document.createElement('span');

        dragNode.setAttribute('class', 'drag');
        dragNode.textContent = interactionId.substr(1);

        newNode.setAttribute('id', interactionId);
        newNode.setAttribute('class', 'answer');
        newNode.textContent = 'Response';

        questionBlank.appendChild(dragNode);
        questionBlank.appendChild(newNode);
        selection.getRangeAt(0).insertNode(questionBlank);
        return true;
      }
      return false;
    }

    /* Function to get next interaction id and create the corresponding response node. */

  }, {
    key: 'getInteractionId',
    value: function getInteractionId() {
      var id = 'i' + (this.interactionIds.length + 1);

      this.interactionIds.push(id);
      this.editedJsonContent.responses[id] = { correct: '' };
      return id;
    }

    /* Event listener to input box - update the correct response corresponding to the input entered */

  }, {
    key: 'userAnswerInputEventListener',
    value: function userAnswerInputEventListener(e) {
      var answer = e.currentTarget.value;
      var interactionId = e.currentTarget.classList[0];

      this.editedJsonContent.responses[interactionId].correct = answer;
    }

    /* Transform the processedJSON to originally received form so that the platform
    * can use it to repaint the updated json.
    */

  }, {
    key: 'transformJSONtoOriginalForm',
    value: function transformJSONtoOriginalForm() {
      var _this = this;

      var JSONContent = $.extend(true, {}, this.editedJsonContent);
      var finalJSONContent = {};

      finalJSONContent.meta = JSONContent.meta;
      finalJSONContent.content = JSONContent.content;
      finalJSONContent.content.interactions = {};
      finalJSONContent.content.canvas.data.questiondata = [];
      finalJSONContent.responses = {};
      finalJSONContent['learning-objectives'] = JSONContent['learning-objectives'];
      finalJSONContent['tags'] = JSONContent['tags'];
      finalJSONContent.feedback = {
        global: {}
      };

      var splitCharacterPosStart = void 0;
      var splitCharacterPosEnd = void 0;
      var prefix = new RegExp('<span class=(\'|")input(\'|")><input');
      var suffix = '</span>';

      finalJSONContent.content.instructions = finalJSONContent.content.instructions.map(function (el) {
        if (el.tag === 'html') {
          el[el.tag] = el.text;
        }
        return el;
      });

      var i = 1;

      finalJSONContent.content.questiondata.forEach(function (el, index) {
        var question = el.answerText.trim();

        while (true) {
          splitCharacterPosStart = question.search(prefix);
          splitCharacterPosEnd = question.indexOf(suffix);
          if (splitCharacterPosStart === -1) {
            break;
          } else {
            var questionBlank = question.slice(splitCharacterPosStart, splitCharacterPosEnd + suffix.length);
            var interactionId = 'i' + i++;
            var interactionTag = '<a href=\'' + _fib2editorConstants.interactionReferenceString + '\'>' + interactionId + '</a>';

            question = question.replace(questionBlank, interactionTag);
            finalJSONContent.content.interactions[interactionId] = { type: 'FIBSR' };

            finalJSONContent.responses[interactionId] = {
              correct: _this.editedJsonContent.responses[interactionId].correct,
              ignorecase: _this.editedJsonContent.responses[interactionId].ignorecase || false,
              ignorewhitespace: _this.editedJsonContent.responses[interactionId].ignorewhitespace || false
            };
          }
        }
        finalJSONContent.content.canvas.data.questiondata.push({ text: question });
      });

      JSONContent.feedback.global.forEach(function (el) {
        var key = el.customAttribs.key;

        finalJSONContent.feedback.global[key] = el.customAttribs.value;
      });

      delete finalJSONContent.content.questiondata;
      return finalJSONContent;
    }

    /** Handles the add Instruction button click from the editor */

  }, {
    key: 'addInstruction',
    value: function addInstruction() {
      this.editedJsonContent.content.instructions.push({
        'tag': 'text',
        'text': 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question'
      });
      this.editedJsonContent.isInstructionEmpty = false;
      $('#instructionLabel').show();
      this.state.hasUnsavedChanges = true;
      this.handleItemChangedInEditor();
    }

    /* Handles the remove Instruction item text from the editor */

  }, {
    key: 'removeInstruction',
    value: function removeInstruction(event, instruction, index) {
      this.editedJsonContent.content.instructions.splice(index, 1);

      if (this.editedJsonContent.content.instructions.length > 0) {
        this.editedJsonContent.isInstructionEmpty = false;
        $('#instructionLabel').show();
      } else {
        this.editedJsonContent.isInstructionEmpty = true;
        $('#instructionLabel').hide();
      }

      this.state.hasUnsavedChanges = true;
      this.handleItemChangedInEditor();
    }

    /** Handles the add question button click from the editor */

  }, {
    key: 'addQuestion',
    value: function addQuestion() {
      var interactionId = this.getInteractionId();

      var questionBlank = '\n      <span class="response-blank" contenteditable="false"><span class="drag">' + interactionId.substring(1) + '</span><span id="' + interactionId + '" class="answer">Response</span></span>\n    ';
      var questionText = 'Placeholder question text. update "Me" with a valid' + questionBlank + 'text for this question';

      var answerBlank = '<span class="input">' + '<input type="text" value="answer" class="' + interactionId + ' input-sm ' + _fib2editorConstants.constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + '</span>';
      var answerText = 'Placeholder question text. update "Me" with a valid' + answerBlank + 'text for this question';

      this.editedJsonContent.content.questiondata.push({
        questionText: questionText,
        answerText: answerText
      });

      this.state.hasUnsavedChanges = true;
      this.handleItemChangedInEditor();
    }

    /* Handles the remove question item text from the editor */

  }, {
    key: 'removeQuestion',
    value: function removeQuestion(event, question, index) {
      if (this.editedJsonContent.content.questiondata.length === 1) {
        this.editedJsonContent.content.questiondata[0].alert = 'Minimum one question required';
        this.activityAdaptor.autoResizeActivityIframe();
        return;
      }
      this.editedJsonContent.content.questiondata.splice(index, 1);
      this.state.hasUnsavedChanges = true;
      this.handleItemChangedInEditor();
    }
  }, {
    key: 'updateAnswerTextJSON',
    value: function updateAnswerTextJSON() {
      var _this2 = this;

      this.editedJsonContent.content.questiondata.forEach(function (el, index) {
        var splitCharacterPosStart = void 0,
            splitCharacterPosEnd = void 0;
        var numOfInteractions = 0;
        var prefix = new RegExp('<span class=(\'|")response-blank(\'|") contenteditable=(\'|")false(\'|")>');
        var suffix = '</span></span>';

        el.answerText = el.questionText;
        el.alert = '';

        while (true) {
          splitCharacterPosStart = el.answerText.search(prefix);
          splitCharacterPosEnd = el.answerText.indexOf(suffix);
          if (splitCharacterPosStart === -1) {
            break;
          } else {

            numOfInteractions += 1;

            var questionBlank = el.answerText.slice(splitCharacterPosStart, splitCharacterPosEnd + suffix.length);
            var span = $.parseHTML(questionBlank);

            var interactionId = 'i' + $.parseHTML(span[0].innerHTML)[0].innerHTML;
            var answer = _this2.editedJsonContent.responses[interactionId] ? _this2.editedJsonContent.responses[interactionId].correct : '';

            if (answer === undefined) {
              answer = '';
            }
            var answerBlank = '<span class="input">' + '<input type="text" value="' + answer + '" class="' + interactionId + ' input-sm ' + _fib2editorConstants.constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + '</span>';

            el.answerText = el.answerText.replace(questionBlank, answerBlank);
          }
        }

        if (numOfInteractions === 0) {
          el.alert = 'Minimum one blank required';
        }
      });

      this.state.hasUnsavedChanges = true;
    }
  }, {
    key: 'handleItemChangedInEditor',
    value: function handleItemChangedInEditor() {
      this.activityAdaptor.autoResizeActivityIframe();
      this.activityAdaptor.itemChangedInEditor(this.transformJSONtoOriginalForm(), this.uniqueId);
    }
  }, {
    key: 'validateEditedJsonContent',
    value: function validateEditedJsonContent() {
      /*
      *  Minimum one question required
      */
      if (this.editedJsonContent.content.questiondata.length !== 0) {
        /*
        *  Minimum one blank required in each question
        */
        return this.editedJsonContent.content.questiondata.every(function (el) {
          var splitCharacterPosStart = void 0,
              splitCharacterPosEnd = void 0;
          var isAtLeastOneInteractionExist = false;
          var prefix = new RegExp('<span class=(\'|")response-blank(\'|") contenteditable=(\'|")false(\'|")>');
          var suffix = '</span></span>';

          splitCharacterPosStart = el.questionText.search(prefix);
          splitCharacterPosEnd = el.questionText.indexOf(suffix);
          if (splitCharacterPosStart !== -1 && splitCharacterPosEnd !== -1 && splitCharacterPosEnd > splitCharacterPosStart) {
            isAtLeastOneInteractionExist = true;
          }

          return isAtLeastOneInteractionExist;
        });
      }

      return false;
    }
  }, {
    key: 'saveItemInEditor',
    value: function saveItemInEditor() {
      if (this.validateEditedJsonContent()) {
        this.activityAdaptor.submitEditChanges(this.transformJSONtoOriginalForm(), this.uniqueId);
      } else {
        // Validation Failed
      }
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      return config;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this.state.hasUnsavedChanges;
    }
  }]);

  return Fib2EditorUtils;
}();

exports.default = Fib2EditorUtils;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=fib2-editor.js.map