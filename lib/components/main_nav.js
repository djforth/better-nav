"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react"),
    ReactDOM = require('react-dom'),
    _ = require("lodash");

// Morse Libraies
var ViewportDetect = require("viewport-detection-es6");

var checker = require("../utils/checker");

var mixins = require("morse-react-mixins");
var cssMixins = mixins.css_mixins;
var textMixins = mixins.text_mixins;
var widthsMixins = mixins.widths_mixins;

//Flux

var NavItemsActions = require("../actions/navitems_actions"),
    NavItemsStore = require("../stores/navitems_store");

//Compenents
var Navitem = require("./nav_item"),
    TouchNav = require("touch-nav");

var MainNav = (function (_React$Component) {
  _inherits(MainNav, _React$Component);

  function MainNav(props) {
    _classCallCheck(this, MainNav);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MainNav).call(this, props));

    NavItemsActions.prerenderItem(_this.props.navitems);
    var root = NavItemsStore._getRoots();
    _this.state = {
      roots: root,
      secondary: [],
      tertiary: [],
      quaternary: []
    };
    return _this;
  }

  //Lifecycle

  _createClass(MainNav, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.detect = new ViewportDetect();
      this.device = this.detect.getDevice();
      this.id = this.detect.trackSize(this._onDeviceChange.bind(this));
      NavItemsStore.addChangeListener("api_set", this._fetchData.bind(this));
      NavItemsStore.addChangeListener("fetched", this._getNavItems.bind(this));
      NavItemsActions.setApi(this.props.navitemsApi);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.detect.removeCallback(this.id);
      NavItemsStore.removeChangeListener("fetched", this._getNavItems);
      NavItemsStore.removeChangeListener("api_set", this._fetchData);
    }

    // event handlers

  }, {
    key: "_onDeviceChange",
    value: function _onDeviceChange(device, size) {
      if (this.device !== device) {
        this.device = device;
      }

      this.size = size;
    }
  }, {
    key: "_fetchData",
    value: function _fetchData() {

      NavItemsStore.removeChangeListener("api_set", this._fetchData);
      _.defer(function () {
        NavItemsActions.fetchData();
      });
    }
  }, {
    key: "_getNavItems",
    value: function _getNavItems() {
      this.setState({
        roots: NavItemsStore._getRoots(),
        secondary: [],
        tertiary: [],
        quaternary: []
      });
    }
  }, {
    key: "_setSecondary",
    value: function _setSecondary(id) {
      console.log(NavItemsStore.getSubs(id));
      this.setState({
        activeRoot: NavItemsStore.getItem(id),
        secondary: NavItemsStore.getSubs(id),
        tertiary: [],
        quaternary: []
      });
    }
  }, {
    key: "_setTertiary",
    value: function _setTertiary(id) {
      this.setState({
        activeSecondary: NavItemsStore.getItem(id),
        tertiary: NavItemsStore.getSubs(id),
        quaternary: []
      });
    }
  }, {
    key: "_setQuaternary",
    value: function _setQuaternary(id) {
      this.setState({
        activeTertiary: NavItemsStore.getItem(id),
        quaternary: NavItemsStore.getSubs(id)
      });
    }
  }, {
    key: "_renderLinks",
    value: function _renderLinks(items, cb) {
      if (checker.checkArray(items)) {
        return _.map(items, function (ri) {
          return React.createElement(Navitem, { key: ri.id, ref: ri.id, item: ri, mouseEnter: cb });
        });
      }

      return "";
    }
  }, {
    key: "_renderSecondary",
    value: function _renderSecondary() {
      if (checker.checkArray(this.state.secondary)) {
        var root = this.state.activeRoot;
        if (NavItemsStore._getLevels() === 1) {
          return React.createElement(
            "div",
            { className: "nav-list level-1" },
            this._renderTitle(root, "home-link"),
            React.createElement(TouchNav, {
              ref: "touch-nav",
              navitems: NavItemsStore.prepForTouchNav(this.state.secondary),
              ul_css: "secondary-nav-touch-list",
              main_css: "touch-sub-nav"
            })
          );
        }
        // console.log("eh?")
        return React.createElement(
          "div",
          { className: "levels level-2" },
          this._renderTitle(root, "clearfix home-link"),
          React.createElement(
            "ul",
            { className: "nav-list secondary-nav-list" },
            this._renderLinks(this.state.secondary, this._setTertiary.bind(this))
          )
        );
      }

      return "";
    }
  }, {
    key: "_renderTertiary",
    value: function _renderTertiary() {
      if (checker.checkArray(this.state.tertiary)) {
        return React.createElement(
          "div",
          { className: "levels level-3" },
          this._renderTitle(this.state.activeSecondary),
          React.createElement(
            "ul",
            { className: "nav-list tertiary-nav-list" },
            this._renderLinks(this.state.tertiary, this._setQuaternary.bind(this))
          )
        );
      }

      return "";
    }
  }, {
    key: "_renderQuaternary",
    value: function _renderQuaternary() {
      if (checker.checkArray(this.state.quaternary)) {
        return React.createElement(
          "div",
          { className: "levels level-4" },
          this._renderTitle(this.state.activeTertiary),
          React.createElement(
            "ul",
            { className: "nav-list quaternary-nav-list" },
            this._renderLinks(this.state.quaternary, null)
          )
        );
      }

      return "";
    }
  }, {
    key: "_renderTitle",
    value: function _renderTitle(root) {
      var css = arguments.length <= 1 || arguments[1] === undefined ? "title-link" : arguments[1];

      if (root) return React.createElement(
        "div",
        { className: css },
        React.createElement(
          "a",
          { href: root.path },
          "In ",
          root.title
        )
      );

      return "";
    }
  }, {
    key: "render",
    value: function render() {
      console.log("rendering");
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "nav-holder" },
          React.createElement(
            "ul",
            { className: "nav-list primary-nav-list" },
            this._renderLinks(this.state.roots, this._setSecondary.bind(this))
          )
        ),
        React.createElement(
          "div",
          { className: "clearfix sub-holder single" },
          this._renderSecondary(),
          this._renderTertiary(),
          this._renderQuaternary()
        )
      );
    }
  }]);

  return MainNav;
})(React.Component);

Object.assign(MainNav.prototype, cssMixins);
Object.assign(MainNav.prototype, textMixins);
Object.assign(MainNav.prototype, widthsMixins);

module.exports = MainNav;
//# sourceMappingURL=main_nav.js.map