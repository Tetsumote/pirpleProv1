"use strict";

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var Router = function Router(options) {
  var _this = this;

  _classCallCheck(this, Router);

  _defineProperty(this, "routes", []);

  _defineProperty(this, "mode", null);

  _defineProperty(this, "root", "/");

  _defineProperty(this, "add", function (path, cb) {
    _this.routes.push({
      path: path,
      cb: cb
    });

    return _this;
  });

  _defineProperty(this, "remove", function (path) {
    for (var i = 0; i < _this.routes.length; i += 1) {
      if (_this.routes[i].path === path) {
        _this.routes.slice(i, 1);

        return _this;
      }
    }

    return _this;
  });

  _defineProperty(this, "flush", function () {
    _this.routes = [];
    return _this;
  });

  _defineProperty(this, "clearSlashes", function (path) {
    return path.toString().replace(/\/$/, "").replace(/^\//, "");
  });

  _defineProperty(this, "getFragment", function () {
    var fragment = "";

    if (_this.mode === "history") {
      fragment = _this.clearSlashes(
        decodeURI(window.location.pathname + window.location.search)
      );
      fragment = fragment.replace(/\?(.*)$/, "");
      fragment =
        _this.root !== "/" ? fragment.replace(_this.root, "") : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : "";
    }

    return _this.clearSlashes(fragment);
  });

  _defineProperty(this, "navigate", function () {
    var path =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    if (_this.mode === "history") {
      window.history.pushState(
        null,
        null,
        _this.root + _this.clearSlashes(path)
      );
    } else {
      window.location.href = ""
        .concat(window.location.href.replace(/#(.*)$/, ""), "#")
        .concat(path);
    }

    return _this;
  });

  _defineProperty(this, "listen", function () {
    clearInterval(_this.interval);
    _this.interval = setInterval(_this.interval, 50);
  });

  _defineProperty(this, "interval", function () {
    if (_this.current === _this.getFragment()) return;
    _this.current = _this.getFragment();

    _this.routes.some(function (route) {
      var match = _this.current.match(route.path);

      if (match) {
        match.shift();
        route.cb.apply({}, match);
        return match;
      }

      return false;
    });
  });

  this.mode = window.history.pushState ? "history" : "hash";
  if (options.mode) this.mode = options.mode;
  if (options.root) this.root = options.root;
  this.listen();
}; // export default Router;

var router = new Router({
  mode: "hash",
  root: "/"
});
router
  .add(/about/, function () {
    var test = document.querySelector(".app");
    test.innerHTML = "about page";
    console.log("about");
  })
  .add(/products\/(.*)\/specification\/(.*)/, function (id, specification) {
    console.log(
      "products: ".concat(id, " specification: ").concat(specification)
    );
    var test = document.querySelector(".app");
    test.innerHTML = "detail page";
  })
  .add("", function () {
    // general controller
    console.log("welcome in catch all controller");
    var test = document.querySelector(".app");
    test.innerHTML = "main page";
  });
