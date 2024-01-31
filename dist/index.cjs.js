'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var mollitia = require('mollitia');

/**
 * Custom error class representing a Forbidden error (HTTP 403).
 *
 * @class ForbiddenError
 * @extends {Error}
 */
var ForbiddenError = /*#__PURE__*/function (_Error) {
  _inherits(ForbiddenError, _Error);
  var _super = _createSuper(ForbiddenError);
  /**
   * Creates an instance of ForbiddenError.
   *
   * @constructor
   * @param {string} [message] - Optional error message.
   */
  function ForbiddenError(message) {
    var _this;
    _classCallCheck(this, ForbiddenError);
    _this = _super.call(this, message);
    _this.code = 403;
    _this.name = 'ForbiddenError';
    return _this;
  }
  return _createClass(ForbiddenError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Custom error class representing an Unauthorized error (HTTP 401).
 *
 * @class UnauthorizedError
 * @extends {Error}
 */
var UnauthorizedError = /*#__PURE__*/function (_Error2) {
  _inherits(UnauthorizedError, _Error2);
  var _super2 = _createSuper(UnauthorizedError);
  /**
   * Creates an instance of UnauthorizedError.
   *
   * @constructor
   * @param {string} [message] - Optional error message.
   */
  function UnauthorizedError(message) {
    var _this2;
    _classCallCheck(this, UnauthorizedError);
    _this2 = _super2.call(this, message);
    _this2.code = 401;
    _this2.name = 'UnauthorizedError';
    return _this2;
  }
  return _createClass(UnauthorizedError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Custom error class representing a Network error (HTTP 503).
 *
 * @class NetworkError
 * @extends {Error}
 */
var NetworkError = /*#__PURE__*/function (_Error3) {
  _inherits(NetworkError, _Error3);
  var _super3 = _createSuper(NetworkError);
  /**
   * Creates an instance of NetworkError.
   *
   * @constructor
   * @param {string} [message] - Optional error message.
   */
  function NetworkError(message) {
    var _this3;
    _classCallCheck(this, NetworkError);
    _this3 = _super3.call(this, message);
    _this3.code = 503;
    _this3.name = 'NetworkError';
    return _this3;
  }
  return _createClass(NetworkError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Custom error class for creating specific errors with a custom name and code.
 *
 * @class CustomError
 * @extends {Error}
 */
var CustomError = /*#__PURE__*/function (_Error4) {
  _inherits(CustomError, _Error4);
  var _super4 = _createSuper(CustomError);
  /**
   * Creates an instance of CustomError.
   *
   * @constructor
   * @param {string} name - The custom name of the error.
   * @param {number} code - The custom error code.
   * @param {string} [message] - Optional error message.
   */
  function CustomError(name, code, message) {
    var _this4;
    _classCallCheck(this, CustomError);
    _this4 = _super4.call(this, message);
    _this4.code = code;
    _this4.name = name;
    return _this4;
  }
  return _createClass(CustomError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Checks if the provided error is an instance of any Liquid errors.
 *
 * @function
 * @param {Error} error - The error object to check.
 * @returns {boolean} True if the error is a ForbiddenError, UnauthorizedError, or NetworkError; otherwise, false.
 */
function isLiquidError(error) {
  return error instanceof ForbiddenError || error instanceof UnauthorizedError || error instanceof NetworkError;
}
var FIVE_MINUTES = 300;

/**
 * Cache class for storing and retrieving data with an external redis instance.
 *
 * @class
 */
var Cache = /*#__PURE__*/function () {
  /**
   * Creates an instance of the Cache class.
   *
   * @constructor
   * @param {Object} [cacheOptions] - Options for configuring the cache.
   * @param {Object} [cacheOptions.client] - The caching client (e.g., Redis client) to use.
   * @param {number} [cacheOptions.expire] - The expiration time for cached items in seconds.
   */
  function Cache(cacheOptions) {
    _classCallCheck(this, Cache);
    if (cacheOptions) {
      this.cachePrefix = "liquid_node_connector:";
      this.cacheClient = cacheOptions.client;
      this.cacheExpiry = cacheOptions.expire || FIVE_MINUTES;
    }
  }

  /**
   * Retrieves data from the cache using the specified key.
   *
   * @async
   * @param {string} key - The key used to retrieve data from the cache.
   * @returns {Promise<Object|null>} The cached data, or null if the cache is not configured.
   */
  _createClass(Cache, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(key) {
        var cacheResult;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (this.cacheClient) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return", null);
            case 2:
              _context.next = 4;
              return this.cacheClient.get("".concat(this.cachePrefix).concat(key));
            case 4:
              cacheResult = _context.sent;
              if (!cacheResult) {
                _context.next = 7;
                break;
              }
              return _context.abrupt("return", JSON.parse(cacheResult));
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
    /**
     * Stores data in the cache with the specified key.
     *
     * @async
     * @param {string} key - The key used to store data in the cache.
     * @param {Object} data - The JSON data to be stored in the cache.
     * @returns {Promise<undefined>} A Promise indicating the completion of the set operation.
     */
  }, {
    key: "set",
    value: function () {
      var _set = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(key, data) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (this.cacheClient) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              _context2.next = 4;
              return this.cacheClient.set("".concat(this.cachePrefix).concat(key), JSON.stringify(data), 'EX', this.cacheExpiry);
            case 4:
              return _context2.abrupt("return", _context2.sent);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function set(_x2, _x3) {
        return _set.apply(this, arguments);
      }
      return set;
    }()
  }]);
  return Cache;
}();
/**
 * Logger class for handling logging in the Liquid Node Connector.
 *
 * @class
 */
var Logger = /*#__PURE__*/function () {
  /**
   * Creates an instance of the Logger class.
   *
   * @constructor
   * @param {boolean} [debugging=true] - A flag indicating whether debugging is enabled.
   */
  function Logger() {
    var debugging = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    _classCallCheck(this, Logger);
    /**
     * A flag indicating whether debugging is enabled.
     * @type {boolean}
     * @private
     */
    this.debugging = debugging;

    /**
     * The prefix to be added to log messages.
     * @type {string}
     * @private
     */
    this.prefix = "[Liquid Node Connector]";
  }

  /**
   * Logs messages to the console with the "debug" level.
   *
   * @param {...*} args - The messages or values to be logged.
   */
  _createClass(Logger, [{
    key: "debug",
    value: function debug() {
      if (!this.debugging) {
        return;
      }
      var args = Array.from(arguments);
      args.unshift(this.prefix);
      console.log.apply(console, args);
    }

    /**
     * Logs messages to the console with the "info" level.
     *
     * @param {...*} args - The messages or values to be logged.
     */
  }, {
    key: "info",
    value: function info() {
      if (!this.debugging) {
        return;
      }
      var args = Array.from(arguments);
      args.unshift(this.prefix);
      console.log.apply(console, args);
    }

    /**
     * Logs warning messages to the console with the "warn" level.
     *
     * @param {...*} args - The warning messages or values to be logged.
     */
  }, {
    key: "warn",
    value: function warn() {
      if (!this.debugging) {
        return;
      }
      var args = Array.from(arguments);
      args.unshift(this.prefix);
      console.warn.apply(console, args);
    }

    /**
    * Logs error messages to the console with the "error" level.
    *
    * @param {...*} args - The error messages or values to be logged.
    */
  }, {
    key: "error",
    value: function error() {
      if (!this.debugging) {
        return;
      }
      var args = Array.from(arguments);
      args.unshift(this.prefix);
      console.error.apply(console, args);
    }
  }]);
  return Logger;
}();
/**
 * @typedef {Object} Scope
 * @property {string} name - The name of the scope.
 * @property {string} description - The description of the scope.
 * @property {string} [parent] - The parent scope's name.
 */
/**
 * Manages scopes and provides methods for checking if a scope is allowed.
 *
 * @class
 */
var ScopeManager = /*#__PURE__*/function () {
  /**
   * Creates an instance of the ScopeManager class.
   *
   * @constructor
   * @param {string} host - The base URL where the scopes can be fetched.
   */
  function ScopeManager(host, logger) {
    _classCallCheck(this, ScopeManager);
    /**
     * The base URL where the scopes can be fetched.
     * @type {string}
     * @private
     */
    this.host = host;

    /**
     * The loaded scopes.
     * @type {Object}
     * @private
     */
    this.scopes = {};

    /**
     * The logger.
     * @type {Object}
     * @private
     */
    this.logger = logger;
    this.logger.debug("Initializing scope manager with host: " + this.host);
    var circuit = new mollitia.Circuit({
      options: {
        modules: [new mollitia.Retry({
          attempts: 8,
          interval: 500,
          mode: mollitia.RetryMode.LINEAR,
          factor: 2,
          onRejection: function onRejection() {
            return true;
          }
        })]
      }
    });
    circuit.fn(this.initializeScopes.bind(this)).execute();
  }

  /**
   * Recursively generates a tree structure of scopes.
   *
   * @param {Scope[]} scopes - The array of scopes to process.
   * @param {string|null|undefined} [root=null] - The root scope's name.
   * @returns {Object} The tree structure of scopes.
   * @private
   */
  _createClass(ScopeManager, [{
    key: "getScopeTree",
    value: function getScopeTree(scopes) {
      var _this5 = this;
      var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return Object.fromEntries(scopes.filter(function (scope) {
        return scope.parent == root;
      }).map(function (s) {
        return [s.name, _this5.getScopeTree(scopes, s.name)];
      }));
    }

    /**
     * Initializes scopes by fetching them from the server.
     *
     * @private
     */
  }, {
    key: "initializeScopes",
    value: function () {
      var _initializeScopes = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var response;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return fetch("".concat(this.host, "/user/scopes"));
            case 3:
              response = _context3.sent;
              if (response.ok) {
                _context3.next = 6;
                break;
              }
              throw new Error("Failed to fetch scopes. Status: ".concat(response.status));
            case 6:
              _context3.next = 8;
              return response.json();
            case 8:
              this.scopes = _context3.sent.data.scopes;
              this.logger.error("Scopes initialized.");
              _context3.next = 16;
              break;
            case 12:
              _context3.prev = 12;
              _context3.t0 = _context3["catch"](0);
              this.logger.error("Error initializing scopes:", _context3.t0.message);
              throw _context3.t0;
            case 16:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[0, 12]]);
      }));
      function initializeScopes() {
        return _initializeScopes.apply(this, arguments);
      }
      return initializeScopes;
    }()
    /**
     * Gets all the loaded scopes.
     *
     * @returns {Object} The loaded scopes.
     */
  }, {
    key: "getScopes",
    value: function getScopes() {
      return this.scopes;
    }

    /**
     * Checks if a given scope is allowed based on the user's allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {Object} token - The token object.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
  }, {
    key: "checkTokenScope",
    value: function checkTokenScope(scope) {
      var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        scope: []
      };
      if (!this.scopes) {
        this.logger.warn("Scope list not ready");
        return false;
      }
      var allowedScopes = token.scope;
      if (this.isScopeAllowed(scope, allowedScopes)) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * Checks if a given scope is allowed based on a list of allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {string[]} [allowedScopes=[]] - The array of allowed scopes.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
  }, {
    key: "isScopeAllowed",
    value: function isScopeAllowed(scope) {
      var allowedScopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var scopeObject = this.scopes[scope];
      if (!scopeObject) {
        this.logger.warn("Unknown scope ".concat(scope, ". Did you forget to configure this scope in your Liquid server?"));
        return false;
      }
      if (allowedScopes.includes(scopeObject.name) || allowedScopes.includes(scopeObject.parent)) {
        return true;
      } else if (scopeObject.parent) {
        return this.isScopeAllowed(scopeObject.parent, allowedScopes);
      } else {
        return false;
      }
    }
  }]);
  return ScopeManager;
}();
/**
 * LiquidNodeAuthenticator provides methods for authenticating and obtaining access tokens
 * from a Liquid OAuth server.
 *
 * @class
 */
var LiquidNodeAuthenticator = /*#__PURE__*/function () {
  /**
   * Creates an instance of LiquidNodeAuthenticator.
   *
   * @constructor
   * @param {Object} options - Configuration options for the LiquidNodeAuthenticator.
   * @param {string} options.host - The base URL of the Liquid OAuth server.
   * @param {string} options.clientId - The client ID for authentication.
   * @param {string} options.clientSecret - The client secret for authentication.
   * @param {(string|string[])} [options.scope="*"] - The OAuth scope(s) for authentication.
   * @param {Object} [options.cacheOptions] - Options for configuring the cache.
   * @param {Object} [options.cacheOptions.client] - The caching client (e.g., Redis client) to use.
   * @param {number} [options.cacheOptions.expire] - The expiration time for cached items in seconds.
   * @param {boolean} [options.debugging] - Specifies if logs should be printed to console.
   */
  function LiquidNodeAuthenticator(_ref) {
    var host = _ref.host,
      clientId = _ref.clientId,
      clientSecret = _ref.clientSecret,
      _ref$scope = _ref.scope,
      scope = _ref$scope === void 0 ? "*" : _ref$scope,
      cacheOptions = _ref.cacheOptions,
      _ref$debugging = _ref.debugging,
      debugging = _ref$debugging === void 0 ? true : _ref$debugging;
    _classCallCheck(this, LiquidNodeAuthenticator);
    _defineProperty(this, "accessToken", null);
    _defineProperty(this, "accessTokenExpiry", new Date(0));
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
    if (Array.isArray(this.scope)) {
      this.scope = this.scope.join(",");
    }
    this.host = host;
    this.cache = new Cache(cacheOptions);
    this.logger = new Logger(debugging);
    this.scopeManager = new ScopeManager(this.host, this.logger);
    this.logger.info('Initialized Liquid Node Connector for client ' + clientId);
  }

  /**
  * Authenticates a user using the provided token.
  *
  * @async
  * @param {string} token - The authentication token to be validated.
  * @throws {ForbiddenError} If the token is invalid or unauthorized.
  * @throws {NetworkError} If a network error occurs during the authentication process.
  * @returns {Object} The user's token information if authentication is successful.
  */
  _createClass(LiquidNodeAuthenticator, [{
    key: "authenticate",
    value: function () {
      var _authenticate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(token) {
        var cacheKey, cacheResult, api, headers, body, response, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              if (token) {
                _context4.next = 3;
                break;
              }
              throw new ForbiddenError();
            case 3:
              cacheKey = "token:".concat(token);
              _context4.next = 6;
              return this.cache.get(cacheKey);
            case 6:
              cacheResult = _context4.sent;
              if (!cacheResult) {
                _context4.next = 13;
                break;
              }
              if (!(cacheResult.ok === 1)) {
                _context4.next = 12;
                break;
              }
              return _context4.abrupt("return", cacheResult.data.tokenInfo);
            case 12:
              throw new ForbiddenError();
            case 13:
              api = "".concat(this.host, "/oauth/introspect");
              _context4.t0 = "Bearer ";
              _context4.next = 17;
              return this.getAccessToken();
            case 17:
              _context4.t1 = _context4.sent.accessToken;
              _context4.t2 = _context4.t0.concat.call(_context4.t0, _context4.t1);
              headers = {
                'Content-Type': 'application/json',
                Authorization: _context4.t2
              };
              body = JSON.stringify({
                token: token
              });
              _context4.prev = 21;
              _context4.next = 24;
              return fetch(api, {
                method: "POST",
                headers: headers,
                body: body
              });
            case 24:
              response = _context4.sent;
              _context4.next = 30;
              break;
            case 27:
              _context4.prev = 27;
              _context4.t3 = _context4["catch"](21);
              throw new NetworkError();
            case 30:
              _context4.next = 32;
              return response.json();
            case 32:
              result = _context4.sent;
              // No need to await. Cache can always be set again if failed.
              this.cache.set(cacheKey, result);
              this.logger.debug("Cache written for ".concat(cacheKey));
              if (!(response.status !== 200 || !result.ok)) {
                _context4.next = 37;
                break;
              }
              throw new ForbiddenError();
            case 37:
              return _context4.abrupt("return", result.data.tokenInfo);
            case 40:
              _context4.prev = 40;
              _context4.t4 = _context4["catch"](0);
              this.logger.error(_context4.t4);
              if (!isLiquidError(_context4.t4)) {
                _context4.next = 45;
                break;
              }
              throw _context4.t4;
            case 45:
              throw new CustomError('UnknownError', 500);
            case 46:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[0, 40], [21, 27]]);
      }));
      function authenticate(_x4) {
        return _authenticate.apply(this, arguments);
      }
      return authenticate;
    }()
    /**
     * Retrieves an access token, either from memory or by making a request to the Liquid instance.
     *
     * @async
     * @throws {NetworkError} If a network error occurs during the access token retrieval.
     * @throws {UnauthorizedError} If the OAuth server returns an unauthorized status.
     * @returns {Object} The access token and its expiration details.
     */
  }, {
    key: "getAccessToken",
    value: function () {
      var _getAccessToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        var now, expiry, api, headers, body, response, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              now = new Date();
              if (!(this.accessTokenExpiry.getTime() <= now.getTime())) {
                _context5.next = 31;
                break;
              }
              expiry = new Date();
              api = "".concat(this.host, "/oauth/token");
              headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
              };
              body = new URLSearchParams();
              body.append('grant_type', 'client_credentials');
              body.append('client_id', this.clientId);
              body.append('client_secret', this.clientSecret);
              body.append('scope', this.scope);
              _context5.prev = 11;
              _context5.next = 14;
              return fetch(api, {
                method: 'POST',
                headers: headers,
                body: body
              });
            case 14:
              response = _context5.sent;
              _context5.next = 20;
              break;
            case 17:
              _context5.prev = 17;
              _context5.t0 = _context5["catch"](11);
              throw new NetworkError();
            case 20:
              if (!(response.status !== 200)) {
                _context5.next = 22;
                break;
              }
              throw new UnauthorizedError();
            case 22:
              _context5.next = 24;
              return response.json();
            case 24:
              result = _context5.sent;
              this.accessToken = result.access_token;
              expiry.setSeconds(expiry.getSeconds() + result.expires_in);
              this.accessTokenExpiry = expiry;
              this.logger.debug('Access token returned from remote.');
              _context5.next = 32;
              break;
            case 31:
              this.logger.debug('Access token returned from memory.');
            case 32:
              return _context5.abrupt("return", {
                accessToken: this.accessToken,
                accessTokenExpiry: this.accessTokenExpiry
              });
            case 35:
              _context5.prev = 35;
              _context5.t1 = _context5["catch"](0);
              this.logger.error(_context5.t1);
              if (!isLiquidError(_context5.t1)) {
                _context5.next = 40;
                break;
              }
              throw _context5.t1;
            case 40:
              throw new CustomError('UnknownError', 500);
            case 41:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[0, 35], [11, 17]]);
      }));
      function getAccessToken() {
        return _getAccessToken.apply(this, arguments);
      }
      return getAccessToken;
    }()
    /**
     * Checks if a given scope is allowed based on the user's allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {Object} token - The Express response object.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
  }, {
    key: "checkTokenScope",
    value: function checkTokenScope(scope, token) {
      return this.scopeManager.checkTokenScope(scope, token);
    }
  }]);
  return LiquidNodeAuthenticator;
}();
module.exports = LiquidNodeAuthenticator;
//# sourceMappingURL=index.cjs.js.map
