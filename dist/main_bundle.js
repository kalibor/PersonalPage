/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_JHmodal_css__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_JHmodal_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_JHmodal_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_mypage_css_aaa__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_mypage_css_aaa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_mypage_css_aaa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_JHmodal__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scripts_JHmodal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__scripts_JHmodal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scripts_mypage__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scripts_mypage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__scripts_mypage__);

/*css*/
 


/*scripts*/



$(function () {
   
            var skillowl = $('.skill-box >.owl-carousel');

            skillowl.owlCarousel({
                loop: true,
                margin: 10,
                dotsData: true,
                responsive: {
                    0: {
                        items: 1
                    }
                },

            })

            skillowl.on('changed.owl.carousel', function (event) {
                var me = $(this);
                var selectContainer = $(this).find('.owl-item.active > .skill-container')

            })

            var toolowl = $('.footer-item .owl-carousel');
            toolowl.owlCarousel({
                loop: false,
                margin: 10,
                navigation: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 5
                    }
                },

            })


            $('.portfolio-card').each(function () {

                var me = $(this);

                var modalgorup = me.find('.modal-group');
                if (modalgorup.length) {

                    var btnModalOpenArray = modalgorup.find('.JHmodal-open');

                    btnModalOpenArray.each(function () {
                        var btn = $(this);
                        btn.ModalOption({
                            Content: btn.find('> *'),
                        });

                        btn.find('> *').remove();
                    });

                    me.on('click', function () {
                        btnModalOpenArray.first().trigger('click');
                    })
                }

            });
        })

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./JHmodal.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./JHmodal.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".JHmodal {\r\n    position: fixed;\r\n    display: none;\r\n    z-index: 1;\r\n    width: 100%;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    background-color: rgba(5,5,5,.7);\r\n    padding: 10px;\r\n    z-index:3;\r\n}\r\n\r\n    .JHmodal.open {\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: center;\r\n        overflow: auto;\r\n      \r\n    }\r\n\r\n.JHmodal-open {\r\n    cursor: pointer;\r\n}\r\n\r\n\r\n.JHmodal-content {\r\n    position: relative;\r\n    max-width: 100%;\r\n    min-height: 50px;\r\n    /*background-color: #fff;*/\r\n    /*box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px;*/\r\n    padding: 5px;\r\n    text-align: center;\r\n    z-index: 4;\r\n}\r\n\r\n\r\n\r\n\r\n.JH-nav > .JH-prev,\r\n.JH-nav > .JH-next {\r\n    position: absolute;\r\n    display: inline-block;\r\n    top: calc(50% - 50px);\r\n    padding:50px 25px;\r\n    font-size: 30px;\r\n    color: #fff;\r\n    cursor: pointer;\r\n    z-index: 2;\r\n    text-decoration: none;\r\n}\r\n\r\n\r\n    .JH-nav > .JH-prev:hover,\r\n    .JH-nav > .JH-next:hover {\r\n        opacity: .5;\r\n    }\r\n\r\n.JH-nav > .JH-prev {\r\n    left: 0px;\r\n}\r\n\r\n.JH-nav > .JH-next {\r\n    right: 0px;\r\n}\r\n", ""]);

// exports


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

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./mypage.css?aaa", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./mypage.css?aaa");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*全域*/\r\nbody {\r\n    background-color: rgb(243,243,243);\r\n    font-family: 'Microsoft JhengHei';\r\n}\r\n\r\n.block {\r\n    background-color: #fff;\r\n    box-shadow: 0px 2px 5px rgba(3,3,3,.1), 0px 2px 4px rgba(3,3,3,.1);\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.box {\r\n    display: inline-block;\r\n    padding: 20px 0;\r\n}\r\n\r\n.box-title {\r\n    padding: 5px 15px;\r\n    font-size: 20px;\r\n    font-weight: 700;\r\n}\r\n\r\n\r\n    .box-title > .fa {\r\n        color: #fff;\r\n        background-color: #555;\r\n        padding: 5px;\r\n        margin-right: 10px;\r\n        box-shadow: 2px 2.5px 2.5px rgba(155,155,155,.6);\r\n    }\r\n\r\n    .box-title.lg {\r\n        color: rgba(70,70,70,.6);\r\n        padding: 5px 15px;\r\n        font-size: 2em;\r\n        font-weight: 700;\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n        .box-title.lg > .fa {\r\n            padding: 10px;\r\n            margin-right: 20px;\r\n        }\r\n\r\n\r\n\r\n\r\n/*Information*/\r\n.photo-box {\r\n    text-align: center;\r\n}\r\n\r\n    .photo-box > img {\r\n        max-width: 100%;\r\n        max-height: 200px;\r\n        border-radius: 100%;\r\n    }\r\n\r\n\r\n.information-list {\r\n    position: relative;\r\n    padding: 5px 15px;\r\n    display: inline-block;\r\n    width: 100%;\r\n    list-style-type: none;\r\n}\r\n\r\n    .information-list > .information-item {\r\n        padding: 5px 0px;\r\n        font-size: 16px;\r\n    }\r\n\r\n.information-item > .information-infocolumn {\r\n    position: relative;\r\n    display: inline-block;\r\n    color: #555;\r\n    font-weight: 700;\r\n    width: 30%;\r\n}\r\n\r\n\r\n/*skill*/\r\n\r\n.skill-area {\r\n    z-index: unset !important;\r\n}\r\n\r\n    .skill-area .owl-dots {\r\n        position: relative;\r\n        width: 100%;\r\n        max-width: 100%;\r\n        padding: 10px 5px;\r\n        top: 0;\r\n        display: inline-block;\r\n        white-space: nowrap;\r\n        overflow-x: auto;\r\n        overflow-y: hidden;\r\n    }\r\n\r\n\r\n    .skill-area .owl-dot {\r\n        position: relative;\r\n        display: inline-block;\r\n        color: #fff;\r\n        padding: 5px;\r\n        margin: 2.5px;\r\n        transition: background-color ease .2s;\r\n        font-size: 1px;\r\n        font-weight: 500;\r\n        font-family: 'Microsoft JhengHei';\r\n        overflow: hidden;\r\n        letter-spacing: 3px;\r\n        border-radius: 2px;\r\n        background-color: #555;\r\n        box-shadow: 2px 2.5px 2.5px rgba(155,155,155,.6);\r\n    }\r\n\r\n        .skill-area .owl-dot:hover,\r\n        .skill-area .owl-dot:active,\r\n        .skill-area .owl-dot:focus {\r\n            background-color: rgba(5,5,5,.6);\r\n            box-shadow: 2px 5px 5px rgba(155,155,155,.6);\r\n        }\r\n\r\n        .skill-area .owl-dot.active {\r\n            background-color: rgba(255,255,255,1);\r\n            color: #555;\r\n            box-shadow: 2px 5px 5px rgba(155,155,155,.6);\r\n        }\r\n\r\n\r\n@media screen and (max-width:768px) {\r\n    .skill-area .owl-dot {\r\n        font-size: 7px;\r\n    }\r\n}\r\n\r\n\r\n.skill-area {\r\n    padding: 5px 15px;\r\n}\r\n\r\n.skill-group {\r\n    list-style-type: none;\r\n    padding: 0;\r\n}\r\n\r\n.skill-item > .skill-name {\r\n    display: inline-block;\r\n    margin: 15px 0px;\r\n}\r\n\r\n.skill-item > .skill-bar {\r\n    height: 10px;\r\n    border-radius: 2px;\r\n}\r\n\r\n.skill-bar > .skill-percent {\r\n    position: relative;\r\n    background-color: #555;\r\n    width: 0%;\r\n    height: 10px;\r\n    border-radius: 2px;\r\n}\r\n\r\n    .skill-bar > .skill-percent > .show {\r\n        position: absolute;\r\n        display: flex !important;\r\n        align-items: center;\r\n        justify-content: center;\r\n        width: 45px;\r\n        height: 30px;\r\n        bottom: calc(100% + 10px);\r\n        right: -22.5px;\r\n        background-color: #555;\r\n        color: #fff;\r\n        border-radius: 5px;\r\n        box-shadow: 1px 1px 4px rgba(3,3,3,.1), 1px 1px 2px rgba(3,3,3,.1);\r\n    }\r\n\r\n        .skill-bar > .skill-percent > .show:before {\r\n            position: absolute;\r\n            display: inline-block;\r\n            content: ' ';\r\n            top: calc(100% - 5px);\r\n            width: 10px;\r\n            height: 10px;\r\n            transform: rotate(45deg);\r\n            background-color: #555;\r\n            box-shadow: 1px 1px 4px rgba(3,3,3,.1), 1px 1px 2px rgba(3,3,3,.1);\r\n        }\r\n\r\n\r\n/*Language*/\r\n\r\n.language-box {\r\n    position: relative;\r\n    display: inline-block;\r\n}\r\n\r\n\r\n.language-item {\r\n    color: #555;\r\n    font-size: 16.5px;\r\n    font-weight: 700;\r\n    padding: 10px 5px;\r\n}\r\n\r\n    .language-item > .language-circle {\r\n        display: flex;\r\n        justify-content: center;\r\n        align-items: center;\r\n    }\r\n\r\n.language-circle > .language-percent {\r\n    position: absolute;\r\n}\r\n\r\n.language-item > .language-name {\r\n    text-align: center;\r\n}\r\n\r\n\r\n/*timeLine*/\r\n\r\n.timeline-box {\r\n    position: relative;\r\n    width: 100%;\r\n}\r\n\r\n\r\n\r\n    .timeline-box .timeline-area {\r\n        position: relative;\r\n        display: inline-block;\r\n        width: 50%;\r\n        color: black;\r\n    }\r\n\r\n.timeline-container {\r\n    position: relative;\r\n}\r\n\r\n\r\n    .timeline-container:before {\r\n        position: absolute;\r\n        display: inline-block;\r\n        content: ' ';\r\n        width: 4px;\r\n        height: calc(100% -40px);\r\n        top: 20px;\r\n        bottom: 20px;\r\n        left: calc(50% - 2px);\r\n        background-color: rgba(105,105,105,.7);\r\n    }\r\n\r\n\r\n.timeline-area.left {\r\n    left: 0%;\r\n}\r\n\r\n.timeline-area.right {\r\n    left: 50%;\r\n}\r\n\r\n.timeline-area:before {\r\n    position: absolute;\r\n    content: ' ';\r\n    display: inline-block;\r\n    width: 30px;\r\n    height: 30px;\r\n    font-size: 30px;\r\n    border-radius: 100%;\r\n    background-color: #fff;\r\n    border: solid 5px rgb(144, 144, 144);\r\n}\r\n\r\n\r\n\r\n\r\n.timeline-area.left:before {\r\n    left: calc(100% - 15px);\r\n}\r\n\r\n\r\n.timeline-area.right:before {\r\n    left: -15px;\r\n}\r\n\r\n\r\n.timeline-area > .timeline-content {\r\n    margin-bottom: 20px;\r\n    position: relative;\r\n    color: #fff;\r\n    display: inline-block;\r\n    width: calc(100% - 50px);\r\n    background-color: #555;\r\n    padding: 10px;\r\n    transition: box-shadow ease .2s;\r\n    box-shadow: 2px 5px 5px rgba(155,155,155,.6);\r\n}\r\n\r\n    .timeline-area > .timeline-content:hover {\r\n    }\r\n\r\n.timeline-area.left > .timeline-content {\r\n    margin-left: 0%;\r\n}\r\n\r\n.timeline-area.right > .timeline-content {\r\n    margin-left: 50px;\r\n}\r\n\r\n\r\n.timeline-area > .timeline-content > .title {\r\n    position: relative;\r\n    display: inline-block;\r\n    color: #fff;\r\n    font-size: 1.5em;\r\n    font-weight: 700;\r\n}\r\n\r\n.timeline-area > .timeline-content > .content {\r\n    display: inline-block;\r\n    width: 100%;\r\n    color: #fff;\r\n    font-size: 16px;\r\n}\r\n\r\n.timeline-area > .timeline-content > .title,\r\n.timeline-area > .timeline-content > .content,\r\n.timeline-area > .timeline-content > .time {\r\n    width: 100%;\r\n    padding: 5px 5px;\r\n}\r\n\r\n.timeline-area > .timeline-content > .time {\r\n    position: relative;\r\n    display: inline-block;\r\n    width: 100%;\r\n    font-size: 16px;\r\n    color: #fff;\r\n    text-align: right;\r\n}\r\n\r\n    .timeline-area > .timeline-content > .time > .fa {\r\n        position: relative;\r\n        display: inline-block;\r\n        margin-right: 10px;\r\n    }\r\n\r\n\r\n\r\n@media screen and (max-width:768px) {\r\n    .timeline-box {\r\n        padding: 0;\r\n    }\r\n\r\n        .timeline-box .timeline-container:before {\r\n            left: calc(10% - 4px + 12px);\r\n        }\r\n\r\n        .timeline-box .timeline-area {\r\n            left: calc(10%) !important;\r\n            width: 80%;\r\n        }\r\n\r\n    .timeline-area:before {\r\n        width: 20px;\r\n        height: 20px;\r\n        left: -12px !important;\r\n    }\r\n\r\n\r\n\r\n    .timeline-area > .timeline-content {\r\n        top: -20px;\r\n        width: calc(100% - 20px);\r\n        margin-left: 0 !important;\r\n        left: 30px;\r\n    }\r\n\r\n        .timeline-area > .timeline-content:before {\r\n            width: 15px;\r\n            height: 15px;\r\n            left: -15px !important;\r\n            transform: rotate(-135deg) !important;\r\n        }\r\n\r\n\r\n        .timeline-area > .timeline-content > .title {\r\n            font-size: 23px;\r\n        }\r\n\r\n    .timeline-content > .time,\r\n    .timeline-content > .title,\r\n    .timeline-content > .content {\r\n        text-align: left;\r\n    }\r\n}\r\n\r\n\r\n/*關於我*/\r\n\r\n.about_me-box > .content {\r\n    padding: 15px;\r\n}\r\n\r\n    .about_me-box > .content > p {\r\n        padding: 15px;\r\n        font-size: 18px;\r\n        line-height: 30px;\r\n    }\r\n\r\n\r\n\r\n/*作品集*/\r\n\r\n.portfolio-box {\r\n}\r\n\r\n    .portfolio-box .portfolio-card {\r\n        position: relative;\r\n        box-shadow: rgba(3, 3, 3, 0.1) 0px 1px 8px, rgba(3, 3, 3, .1) 0px 1px 6px;\r\n        margin: 20px 0px;\r\n        overflow: hidden;\r\n        font: normal normal normal 14px/1 FontAwesome;\r\n        text-rendering: auto;\r\n        -webkit-font-smoothing: antialiased;\r\n    }\r\n\r\n\r\n\r\n.card-tag {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    padding: 5px;\r\n    transition: left ease .5s;\r\n    z-index: 2;\r\n}\r\n\r\n.portfolio-card:hover > .card-tag {\r\n    left: -100%;\r\n}\r\n\r\n\r\n\r\n.tag {\r\n    position: relative;\r\n    display: inline-block;\r\n    font-size: 16px;\r\n    padding: 5px 10px;\r\n    margin: 5px;\r\n    border-radius: 5px;\r\n    transition: opacity ease .2s;\r\n    box-shadow: rgba(253, 253, 253, 0.1) 0px 1px 8px, rgba(253,253, 253, .1) 0px 1px 6px;\r\n}\r\n\r\n    .tag:hover {\r\n        opacity: 1;\r\n    }\r\n\r\n.card-img {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 200px;\r\n    overflow: hidden;\r\n    text-align: center;\r\n    background-position: center;\r\n    background-repeat: no-repeat;\r\n    background-size: cover;\r\n    cursor: pointer;\r\n}\r\n\r\n    .card-img:before {\r\n        position: absolute;\r\n        display: flex;\r\n        justify-content: center;\r\n        align-items: center;\r\n        font-size: 50px;\r\n        text-shadow: 100px 100px 100px #333;\r\n        content: \"\\F002\";\r\n        top: 0;\r\n        bottom: 0;\r\n        right: 0;\r\n        left: 0;\r\n        background-color: rgba(3,3,3,.5);\r\n        z-index: 3;\r\n        opacity: 0;\r\n        transition: opacity ease .5s;\r\n        color: #fff;\r\n    }\r\n\r\n    .card-img:hover:before {\r\n        opacity: 1;\r\n    }\r\n\r\n.portfolio-card > .card-introduction {\r\n    position: relative;\r\n    width: 100%;\r\n    bottom: 0;\r\n    padding: 5px;\r\n}\r\n\r\n\r\n    .portfolio-card > .card-introduction > .title {\r\n        padding: 10px;\r\n        font-size: 16px;\r\n    }\r\n\r\n    .portfolio-card > .card-introduction > .content {\r\n        padding: 10px;\r\n        font-size: 14px;\r\n    }\r\n\r\n/*portfolio Modal內容*/\r\n.portfolio-youtubevideo {\r\n    width: 854px;\r\n    height: 480px;\r\n    max-width: 100%;\r\n}\r\n\r\n@media screen and (max-width:960px) {\r\n    .portfolio-youtubevideo {\r\n        width: 640px;\r\n        height: 360px;\r\n    }\r\n}\r\n\r\n@media screen and (max-width:640px) {\r\n    .portfolio-youtubevideo {\r\n        width: 360px;\r\n        height: 202px;\r\n    }\r\n}\r\n\r\n@media screen and (max-width:360px) {\r\n    .portfolio-youtubevideo {\r\n        width: px;\r\n        height: 202px;\r\n    }\r\n}\r\n\r\n\r\n/*Footer*/\r\n\r\n.footer {\r\n    position: relative;\r\n    width: 100%;\r\n    background-color: #555;\r\n}\r\n\r\n.footer-item {\r\n    position: relative;\r\n    padding: 20px 15px;\r\n}\r\n\r\n    .footer-item .lg {\r\n        color: #fff !important;\r\n    }\r\n\r\n        .footer-item .lg > .fa {\r\n            color: #555;\r\n            background-color: #fff;\r\n            box-shadow: 2px 2.5px 2.5px rgba(5,5,5,.2);\r\n        }\r\n\r\n    .footer-item .tool {\r\n        position: relative;\r\n        padding: 15px 20px;\r\n        list-style-type: none;\r\n        color: #fff;\r\n        font-size: 20px;\r\n    }\r\n\r\n        .footer-item .tool .item {\r\n            text-align: center;\r\n            padding: 5px;\r\n        }\r\n\r\n            .footer-item .tool .item > a,\r\n            .footer-item .tool .item > a:active,\r\n            .footer-item .tool .item > a:hover {\r\n                color: #fff;\r\n            }\r\n\r\n\r\n        .footer-item .tool .icon {\r\n            margin-right: 15px;\r\n        }\r\n\r\n\r\n    .footer-item .social-list {\r\n        position: relative;\r\n        display: inline-block;\r\n        list-style-type: none;\r\n        margin: 0;\r\n    }\r\n\r\n        .footer-item .social-list > li {\r\n            position: relative;\r\n            display: inline-block;\r\n            color: #555;\r\n            font-size: 20px;\r\n            height: 40px;\r\n            width: 40px;\r\n            text-align: center;\r\n            margin-right: 5px;\r\n            border-radius: 100%;\r\n            background-color: #fff;\r\n            overflow: hidden;\r\n            cursor: pointer;\r\n        }\r\n\r\n            .footer-item .social-list > li > .fa {\r\n                position: absolute;\r\n                display: flex;\r\n                justify-content: center;\r\n                align-items: center;\r\n                height: 100%;\r\n                width: 100%;\r\n                transition: color ease .5s;\r\n            }\r\n\r\n\r\n            .footer-item .social-list > li:hover > .fa {\r\n                color: rgb(28, 148, 204);\r\n            }\r\n\r\n\r\n\r\n\r\n    .footer-item .right {\r\n        padding-top: 10px;\r\n        text-align: right;\r\n        color: rgba(255,255,255,.8);\r\n    }\r\n\r\n\r\n\r\n/*頁面載入進度條**/\r\n.pageloading-background {\r\n    position: fixed;\r\n    display: inline-block;\r\n    height: 100%;\r\n    width: 100%;\r\n    background-color: rgb(243,243,243);\r\n    z-index: 999;\r\n}\r\n\r\n.pageloading-progress {\r\n    height: 3px;\r\n    position: absolute;\r\n    top: 0;\r\n    width: 10px;\r\n    border-top-left-radius: 10px;\r\n    border-bottom-left-radius: 10px;\r\n    background-color: #333;\r\n}\r\n\r\n.pageloading-content {\r\n    position: absolute;\r\n    display: flex;\r\n    height: 100%;\r\n    width: 100%;\r\n    justify-content: center;\r\n    align-items: center;\r\n    font-size: 2.5em;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports) {

﻿(function ($) {
    /************************************************擴充方法**************************************/
    $.fn.extend({
        Init: function () {
            var me = $(this);
            if (me.hasClass('JHmodal-open')) {

                var opt = {
                    Content: {},
                };

                me.on('click', function (e) {
                    e.stopPropagation();
                    opt = $.extend(true, opt, me.data('option'));
                    var modalTarget = me.data('modal-target');
                    var modal = GetModal(modalTarget);
                    SetModalContent(modalTarget, opt);
                    modal.Open();
                    modal.focus();

                    SetModalPage(modalTarget, me.data('modal-index'));


                });

            }

        },

        ModalOption: function (option) {
            var me = $(this);

            if (me.hasClass('JHmodal-open')) {

                var opt = $.extend(true, {
                    Content: {},
                }, option);

                me.data('option', opt);
            }
        },
        Open: function () {

            var me = $(this);
            if (me.hasClass('JHmodal')) {

                var id = me.prop('id');
                var content = GetModalContent(id);

                me.removeClass('fadeOut');
                content.removeClass('fadeOutUp');

                me.addClass('open fadeIn ');
                content.addClass('bounceInDown  ');

            }

        },

        Close: function () {
            var me = $(this);
            if (me.hasClass('JHmodal')) {
                var id = me.prop('id');
                var content = GetModalContent(id);

                me.removeClass('fadeIn');
                me.addClass('fadeOut ');

                setTimeout(function () {
                    me.removeClass('open');
                    content.empty();
                }, 500);

            }
        },
        Move: function (index) {
            var me = $(this);
            if (me.hasClass('JHmodal')) {
                var id = me.prop('id');

                var GroupLength = me.data('group-length');

                if ((!index) || index < 0)
                    index == 0;
                else if (index >= GroupLength.length)
                    index = GroupLength - 1;

                var target = GetOpenModalButton(id, index);

                SetModalContent(id, target.data('option'))

                SetModalPage(id, index);
            }
        }

    });







    /***********************************************Modal項目取得************************************************/

    var GetModal = function (id) {
        var modal = $(document.getElementById(id));

        return modal;
    }

    var GetModalContent = function (id) {

        var modal = GetModal(id);
        return modal.find('.JHmodal-content');
    }


    var GetOpenModalButtons = function (id) {
        var group = $('.JHmodal-open[data-modal-target="' + id + '"]');
        return group;

    }

    var GetOpenModalButton = function (id, index) {
        var group = GetOpenModalButtons(id);
        return $(group[index]);

    }



    /****************************************************Modal設定********************************************************/

    var CreateModal = function (id) {

        var modal = $('<div class="JHmodal animated"  tabindex="-1"></div >');

        var modalContent = $('<div class="JHmodal-content animated col-lg-8 col-sm-10 col-xs-12"></div >');



        modal.attr('id', id);
        modal.on('click , keydown', function (e) {
            if (e.type == 'click') {
                modal.Close();
            }
            else if (e.type == 'keydown' && e.keyCode == '27') {
                modal.Close();
            }
        });

        modalContent.on('click', function (e) {
            e.stopPropagation();
        });


        modalContent.appendTo(modal);
        modal.appendTo('body');


        return modal;
    };





    /************************************************Modal內容設定****************************************/
    var SetModalContent = function (id, option) {
        var opt = $.extend(true, {
            ModalContentClass: '',
            Content: null,
        }, option);

        var modal = GetModal(id);
        var modalContent = GetModalContent(id);



        modalContent.empty();

        if (modalContent.length) {
            if (!opt.Content || $.isEmptyObject(opt.Content)) {
                opt.Content = $('<div class="template">')
            }


            opt.Content.addClass('zoomIn animated');
            modalContent.append(opt.Content)

        }
    }

    var SetModalContentSource = function (btnOpen) {

        var source = btnOpen.data('source');
        if (source) {
            var content = $(document.getElementById(source));

            btnOpen.ModalOption({
                Content: content,
            });

            content.remove();
        }

    }



    var SetModalContentCss = function (id, css) {

        var modalContent = GetModalContent(id);

        if (modalContent.length && css) {
            modalContent.css({ 'animation-duration': '1s' });
            modalContent.css(css);

        }
        modalContent.on('click', function (e) {
            e.stopPropagation();
        })
    }





    /*****************************************Modal 上一頁、下一頁功能*************************************/
    var SetModalPage = function (id, nowIndex) {


        var modal = GetModal(id);

        var groupLength = parseInt(modal.data('group-length'));

        var navBtnGroup = GetNavButtonGroup(nowIndex, modal);


        var Nav = modal.find('.JH-nav');

        if (Nav) {
            Nav.remove();
        }

        if (navBtnGroup) {
            Nav = $('<div class="JH-nav">');
            Nav.append(navBtnGroup.Prev);
            Nav.append(navBtnGroup.Next);
            Nav.appendTo(GetModalContent(modal.prop('id')));
        }


    };

    var GetNavButtonGroup = function (nowIndex, modal) {

        var groupLength = modal.data('group-Length');

        var Nav = {
            Prev: '',
            Next: ''
        };

        if (nowIndex > 0) {
            Nav.Prev = GetNewButton('', 'JH-prev fa fa-arrow-left', function () {
                modal.Move(nowIndex - 1)
            });
        }

        if (nowIndex < groupLength - 1) {
            Nav.Next = GetNewButton('', 'JH-next fa fa-arrow-right', function () {
                modal.Move(nowIndex + 1)
            });
        }

        if (Nav.Prev === '' && Nav.Next === '') {

            return null;
        }

        else {

            return Nav;
        }


    };

    var GetNewButton = function (text, btnClass, func) {
        var btn = $('<a>').html(text);
        btn.addClass(btnClass);
        btn.on('click', function (e) {
            e.stopPropagation();

            if (typeof func == 'function') {
                func();
            }

        });

        return btn;
    }






    /***************************************Modal初始化********************************************/


    var InitModal = function () {

        var btn = $('.JHmodal-open');

        btn.each(function () {
            var me = $(this);
            var modalId = me.data('modal-target');
            var modal = GetModal(modalId);
           
            SetModalContentSource(me);

            if (!modal.length) {
                modal = CreateModal(modalId);
            }

            me.Init();
        });

    };



    var InitGroupIndex = function () {
        var model = $('.JHmodal');
        model.each(function () {
            var me = $(this);
            var id = me.prop('id');
            var btnGroup = GetOpenModalButtons(id);

            me.data('group-length', btnGroup.length);

            btnGroup.each(function (index) {
                var btn = $(this);
                btn.data('modal-index', index);
            });
        });
    };


    $(function () {
        InitModal();
        InitGroupIndex();
    });



})(jQuery);

/***/ }),
/* 10 */
/***/ (function(module, exports) {

﻿(function ($) {
    
    $.fn.extend({
        LoadSkillbar: function (percent) {
            var canvas = $(this);


            var circle_width = canvas.width() / 2;
            var circle_height = canvas.height() / 2;
            var circle_lenght = (canvas.height() / 2) - 20;

            var ctx = canvas.get(0).getContext('2d');
            ctx.clearRect(0, 0, canvas.width(), canvas.height());
            ctx.lineWidth = 10;




            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.strokeStyle = 'rgb(241, 241, 241)';
            ctx.arc(circle_width, circle_height, circle_lenght, d2r(-90), d2r(270));
            ctx.stroke();


            var grd = ctx.createLinearGradient(circle_width * 2, circle_width * 2, 0, 0);
            grd.addColorStop(0, "#555");

            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.strokeStyle = grd;
            ctx.arc(circle_width, circle_height, circle_lenght, d2r(-90), d2r(360 * percent / 100 - 90));
            ctx.stroke();

            function d2r(deg) {
                var ran = (Math.PI / 180) * deg;
                return ran;
            };

        },

        AnimateSkillBar: function () {

            var canvas = $(this);
            var percent = canvas.data('now_percent');
            if (!percent && percent != '0') {
                percent = 0;
                canvas.data('now_percent', percent);
            }
            else {
                var limit_percent = canvas.data('percent');
                if (!limit_percent) {
                    limit_percent = 0;
                }


                if (percent < limit_percent) {
                    percent += 3;
                    if (percent > limit_percent) {
                        percent = limit_percent;
                    }

                    canvas.data('now_percent', percent);
                }
                else {
                    return false;
                }

            }
            canvas.LoadSkillbar(percent);

            return true;
        },
    });


    /********************************************************************************************************/
    var animate = function () {
        var canvas = $('.mycanvas:not(.finished)');

        canvas.each(function () {
            var NeedAnimate = $(this).AnimateSkillBar();
            if (!NeedAnimate) {
                $(this).addClass('finished')
            }
        });

        canvas = $('.mycanvas:not(.finished)');

        if (canvas.length) {
            setTimeout(function () { timer = requestAnimationFrame(animate); }, 1000 / 60)

        } else {
            cancelAnimationFrame(timer);
        }

    }



    $.fn.extend({
        LoadSkillBar: function () {
            var me = $(this);

            if (me.hasClass('skill-container')) {

                var skillitem = me.find('.skill-item');
                skillitem.each(function () {
                    var item = $(this);
                    var progressRate = item.data('percent');

                    if (progressRate) {
                        var skillpercent = item.find('.skill-bar > .skill-percent');
                        skillpercent.css('width', 0);
                        skillpercent.animate({
                            width: progressRate,

                        }, 1000, function () {
                            var span = $('<span class="show">');
                            span.html(progressRate);
                            skillpercent.html(span);

                        });
                    }
                    else {
                        item.html('請設定data-percent屬性')
                    }

                });

            }

        },

    });
    /*******************************************************************************************************/
    var setPageLoadProgress = function (rate, duration, compelete) {

        if (!duration) {
            duration = 1000;
        }

        var progressbar = $('.pageloading-progress');


        progressbar.animate({
            width: rate + '%'
        }, duration, function () {
            if (typeof compelete == 'function') {
                compelete(progressbar);
            }

        });


    };


    /*
     * *************************************************************************************************/

    $.fn.extend({
        setText: function (text) {
            var me = $(this).find('canvas');

            if (me.length) {
                var ctx = me[0].getContext('2d');
                var w = me.width();
                var h = me.height();

                ctx.clearRect(0, 0, w, h);

                ctx.font = '30px Georgia';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 0, (h / 2));


            }
        }
    });

    var setLoadingText = function () {
        var content = $('.pageloading-content ')
        var textArray = ['載入中，請稍後','載入中，請稍後.', '載入中，請稍後..', '載入中，請稍後...'];

        setInterval(function () {
            var index = content.data('TextIndex');
            if (!index || index >= textArray.length) {
                index = 0;
            }
            content.setText(textArray[index]);
            index++;
            content.data('TextIndex', index);
        }, 300);
    };


    /****************************************************************************************************/

    var Init = function () {
        setPageLoadProgress(80, 2000);
        setLoadingText();
    };

    Init();

    /****************************************************************************************************/
    var timer;
    $(function () {
        setPageLoadProgress(100, 500, function (progressbar) {
            progressbar.parent().slideUp();
            $('.skill-container').LoadSkillBar();
            timer = requestAnimationFrame(animate);
        });


    });


})(jQuery);



/***/ })
/******/ ]);