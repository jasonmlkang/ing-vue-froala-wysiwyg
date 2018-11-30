(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("vue-froala-wysiwyg", [], factory);
	else if(typeof exports === 'object')
		exports["vue-froala-wysiwyg"] = factory();
	else
		root["vue-froala-wysiwyg"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = function (Vue) {
	  var Options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  var froalaEditorFunctionality = {

	    props: ['tag', 'value', 'config', 'onManualControllerReady'],

	    watch: {
	      value: function value() {
	        this.model = this.value;
	        this.updateValue();
	      }
	    },

	    render: function render(createElement) {
	      return createElement(this.currentTag, [this.$slots.default]);
	    },

	    created: function created() {
	      this.currentTag = this.tag || this.currentTag;
	      this.model = this.value;
	    },

	    mounted: function mounted() {
	      if (this.SPECIAL_TAGS.indexOf(this.currentTag) != -1) {

	        this.hasSpecialTag = true;
	      }

	      if (this.onManualControllerReady) {
	        this.generateManualController();
	      } else {
	        this.createEditor();
	      }
	    },

	    beforeDestroy: function beforeDestroy() {
	      this.destroyEditor();
	    },

	    data: function data() {

	      return {
	        currentTag: 'div',
	        listeningEvents: [],

	        _$element: null,

	        _$editor: null,

	        _$editorObject: null,

	        currentConfig: null,

	        defaultConfig: {
	          immediateVueModelUpdate: false,
	          vueIgnoreAttrs: null
	        },

	        editorInitialized: false,

	        SPECIAL_TAGS: ['img', 'button', 'input', 'a'],
	        INNER_HTML_ATTR: 'innerHTML',
	        hasSpecialTag: false,

	        model: null,
	        oldModel: null
	      };
	    },
	    methods: {
	      updateValue: function updateValue() {
	        if ((0, _stringify2.default)(this.oldModel) == (0, _stringify2.default)(this.model)) {
	          return;
	        }

	        this.setContent();
	      },

	      createEditor: function createEditor() {

	        if (this.editorInitialized) {
	          return;
	        }

	        this.currentConfig = this.config || this.defaultConfig;

	        this._$element = $(this.$el);

	        this.setContent(true);

	        this.registerEvents();
	        this._$editorObject = this._$element.froalaEditor(this.currentConfig).data('froala.editor');
	        this._$editor = this._$editorObject.$el;
	        this.initListeners();

	        this.editorInitialized = true;
	      },

	      setContent: function setContent(firstTime) {

	        if (!this.editorInitialized && !firstTime) {
	          return;
	        }

	        if (this.model || this.model == '') {

	          this.oldModel = this.model;

	          if (this.hasSpecialTag) {
	            this.setSpecialTagContent();
	          } else {
	            this.setNormalTagContent(firstTime);
	          }
	        }
	      },

	      setNormalTagContent: function setNormalTagContent(firstTime) {

	        var self = this;

	        function htmlSet() {

	          self._$element.froalaEditor('html.set', self.model || '', true);

	          self._$element.froalaEditor('undo.reset');
	          self._$element.froalaEditor('undo.saveStep');
	        }

	        if (firstTime) {
	          this.registerEvent(this._$element, 'froalaEditor.initialized', function () {
	            htmlSet();
	          });
	        } else {
	          htmlSet();
	        }
	      },

	      setSpecialTagContent: function setSpecialTagContent() {

	        var tags = this.model;

	        if (tags) {

	          for (var attr in tags) {
	            if (tags.hasOwnProperty(attr) && attr != this.INNER_HTML_ATTR) {
	              this._$element.attr(attr, tags[attr]);
	            }
	          }

	          if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
	            this._$element[0].innerHTML = tags[this.INNER_HTML_ATTR];
	          }
	        }
	      },

	      destroyEditor: function destroyEditor() {

	        if (this._$element) {

	          this.listeningEvents && this._$element.off(this.listeningEvents.join(" "));
	          this._$editor.off('keyup');
	          this._$element.froalaEditor('destroy');
	          this.listeningEvents.length = 0;
	          this._$element = null;
	          this.editorInitialized = false;
	        }
	      },

	      getEditor: function getEditor() {

	        if (this._$element) {
	          return this._$element.froalaEditor.bind(this._$element);
	        }
	        return null;
	      },

	      generateManualController: function generateManualController() {

	        var self = this;
	        var controls = {
	          initialize: this.createEditor,
	          destroy: this.destroyEditor,
	          getEditor: this.getEditor
	        };

	        this.onManualControllerReady(controls);
	      },

	      updateModel: function updateModel() {

	        var modelContent = '';

	        if (this.hasSpecialTag) {

	          var attributeNodes = this._$element[0].attributes;
	          var attrs = {};

	          for (var i = 0; i < attributeNodes.length; i++) {

	            var attrName = attributeNodes[i].name;
	            if (this.currentConfig.vueIgnoreAttrs && this.currentConfig.vueIgnoreAttrs.indexOf(attrName) != -1) {
	              continue;
	            }
	            attrs[attrName] = attributeNodes[i].value;
	          }

	          if (this._$element[0].innerHTML) {
	            attrs[this.INNER_HTML_ATTR] = this._$element[0].innerHTML;
	          }

	          modelContent = attrs;
	        } else {

	          var returnedHtml = this._$element.froalaEditor('html.get');
	          if (typeof returnedHtml === 'string') {
	            modelContent = returnedHtml;
	          }
	        }

	        this.oldModel = modelContent;
	        this.$emit('input', modelContent);
	      },

	      initListeners: function initListeners() {
	        var self = this;

	        this.registerEvent(this._$element, 'froalaEditor.contentChanged', function () {
	          self.updateModel();
	        });
	        if (this.currentConfig.immediateVueModelUpdate) {
	          this.registerEvent(this._$editor, 'keyup', function () {
	            self.updateModel();
	          });
	        }
	      },

	      registerEvent: function registerEvent(element, eventName, callback) {

	        if (!element || !eventName || !callback) {
	          return;
	        }

	        this.listeningEvents.push(eventName);
	        element.on(eventName, callback);
	      },

	      registerEvents: function registerEvents() {

	        var events = this.currentConfig.events;
	        if (!events) {
	          return;
	        }

	        for (var event in events) {
	          if (events.hasOwnProperty(event)) {
	            this.registerEvent(this._$element, event, events[event]);
	          }
	        }
	      }
	    }
	  };

	  Vue.component('froala', froalaEditorFunctionality);

	  var froalaViewFunctionality = {

	    props: ['tag', 'value'],

	    watch: {
	      value: function value(newValue) {
	        this._element.innerHTML = newValue;
	      }
	    },

	    created: function created() {
	      this.currentTag = this.tag || this.currentTag;
	    },

	    render: function render(createElement) {
	      return createElement(this.currentTag, {
	        class: 'fr-view'
	      });
	    },

	    mounted: function mounted() {
	      this._element = this.$el;

	      if (this.value) {
	        this._element.innerHTML = this.value;
	      }
	    },

	    data: function data() {

	      return {
	        currentTag: 'div',
	        _element: null
	      };
	    }
	  };

	  Vue.component('froalaView', froalaViewFunctionality);
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(3)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }
/******/ ])
});
;