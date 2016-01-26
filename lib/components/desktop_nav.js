"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react"),
    ReactDOM = require('react-dom'),
    _ = require("lodash");

var mixins = require("morse-react-mixins");
var checker = mixins.checker;
var cssMixins = mixins.css_mixins;
var textMixins = mixins.text_mixins;
var widthsMixins = mixins.widths_mixins;

//Flux

var NavItemsActions = require("../actions/navitems_actions"),
    NavItemsStore = require("../stores/navitems_store");

//Compenents
var Navitem = require("./nav_item"),
    TouchNav = require("touch-nav");

var DesktopNav = function (_React$Component) {
  _inherits(DesktopNav, _React$Component);

  function DesktopNav(props) {
    _classCallCheck(this, DesktopNav);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DesktopNav).call(this, props));

    _this.clearNav;
    _this.state = {
      device: "mobile",
      roots: [],
      secondary: [],
      tertiary: [],
      quaternary: []
    };
    return _this;
  }

  // Lifecycle

  _createClass(DesktopNav, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setState({ roots: NavItemsStore._getRoots() });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      NavItemsStore.addChangeListener("fetched", this._getNavItems.bind(this));
    }

    // Morse defined

  }, {
    key: "_renderLinks",
    value: function _renderLinks(items, cb) {
      var _this2 = this;

      if (checker.checkArray(items)) {
        return _.map(items, function (ri) {
          return React.createElement(Navitem, { key: ri.id, ref: ri.id, item: ri, mouseEnter: cb, device: _this2.props.device });
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
    key: "_closeNav",
    value: function _closeNav(e) {
      var _this3 = this;

      this.clearNav = window.setTimeout(function () {
        // console.log("mouse out")
        NavItemsActions.setActive(null);
        _this3._getNavItems();
      }, 500);
    }
  }, {
    key: "_leaveOpen",
    value: function _leaveOpen(e) {
      // console.log('mouse enter');
      clearTimeout(this.clearNav);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "desktopNav", onMouseLeave: this._closeNav.bind(this), onMouseEnter: this._leaveOpen.bind(this) },
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

  return DesktopNav;
}(React.Component);

Object.assign(DesktopNav.prototype, cssMixins);
Object.assign(DesktopNav.prototype, textMixins);
Object.assign(DesktopNav.prototype, widthsMixins);

module.exports = DesktopNav;
//# sourceMappingURL=desktop_nav.js.map