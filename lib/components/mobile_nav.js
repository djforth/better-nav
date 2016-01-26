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
var Navitem = require("./nav_item");

var MobileNav = function (_React$Component) {
  _inherits(MobileNav, _React$Component);

  function MobileNav(props) {
    _classCallCheck(this, MobileNav);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MobileNav).call(this, props));

    _this.nav = ["nav-list", "mobile-nav-list", { hidden: true }];
    _this.state = {
      active: null,
      device: "mobile",
      level: 0,
      nav_css: _this.getClasses(_this.nav),
      nav_items: [],
      previous: [],
      roots: []
    };
    return _this;
  }

  // Lifecycle

  _createClass(MobileNav, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setState({ roots: NavItemsStore._getRoots() });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      NavItemsStore.addChangeListener("fetched", this._getNavItems.bind(this));
    }

    // Morse

  }, {
    key: "_getNavItems",
    value: function _getNavItems() {
      if (checker.isMounted(this)) {
        this.setState({
          roots: NavItemsStore._getRoots(),
          nav_items: [],
          secondary: [],
          tertiary: [],
          quaternary: []
        });
      }
    }
  }, {
    key: "_getPrevious",
    value: function _getPrevious() {
      return this.state.previous[this.state.level];
    }
  }, {
    key: "_getVisible",
    value: function _getVisible() {
      return this.state.level === 0 ? this.state.roots : this.state.nav_items;
    }
  }, {
    key: "_setPrevious",
    value: function _setPrevious(level) {
      var previous = this.state.previous;
      previous[level] = _.cloneDeep(this.state.active);
      return previous;
    }

    // Events

  }, {
    key: "_nextLevel",
    value: function _nextLevel(id) {
      // console.log(NavItemsStore.getSubs(id), id)
      // let active = NavItemsStore.getItem(id)
      this.setState({
        active: NavItemsStore.getItem(id),
        level: this.state.level + 1,
        nav_items: NavItemsStore.getSubs(id),
        previous: this._setPrevious(this.state.level + 1)
      });
    }
  }, {
    key: "_openNav",
    value: function _openNav(e) {
      e.preventDefault();
      this.nav = this.toggleCss(this.nav);
      this.setState({ nav_css: this.getClasses(this.nav) });
    }
  }, {
    key: "_upLevel",
    value: function _upLevel(e) {
      e.preventDefault();
      var previous = this._getPrevious();
      if (previous) {
        var id = previous.id;
        this.setState({
          active: previous,
          level: this.state.level - 1,
          nav_items: NavItemsStore.getSubs(id)
        });
      } else {
        this.setState({ active: null, level: this.state.level - 1 });
      }
    }

    // Render functions

  }, {
    key: "_renderActive",
    value: function _renderActive() {
      if (checker.checkOject(this.state.active)) {
        return React.createElement(
          "li",
          { className: "current-section" },
          React.createElement(
            "a",
            { href: this.state.active.path },
            "In ",
            this.state.active.title
          )
        );
      }

      return "";
    }
  }, {
    key: "_renderBack",
    value: function _renderBack() {
      var previous = this._getPrevious();
      var title = previous ? previous.title : "Main Menu";
      if (this.state.level > 0) {
        return React.createElement(
          "li",
          { className: "previous-section" },
          React.createElement(
            "a",
            { href: "#", onClick: this._upLevel.bind(this) },
            "Back to ",
            title
          )
        );
      }

      return "";
    }
  }, {
    key: "_renderLinks",
    value: function _renderLinks() {
      var _this2 = this;

      var links = this._getVisible();
      if (checker.checkArray(links)) {
        return _.map(links, function (ni) {
          return React.createElement(Navitem, { key: ni.id, item: ni, onClick: _this2._nextLevel.bind(_this2), device: _this2.props.device });
        });
      }

      return "";
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "nav-holder" },
        React.createElement(
          "a",
          { className: "open-nav", href: "#", onClick: this._openNav.bind(this) },
          React.createElement("i", { className: "icon-hamburger" }),
          React.createElement(
            "span",
            { className: "hidden" },
            "Open Nav"
          )
        ),
        React.createElement(
          "ul",
          { className: this.state.nav_css },
          this._renderBack(),
          this._renderActive(),
          this._renderLinks()
        )
      );
    }
  }]);

  return MobileNav;
}(React.Component);

Object.assign(MobileNav.prototype, cssMixins);
Object.assign(MobileNav.prototype, textMixins);
Object.assign(MobileNav.prototype, widthsMixins);

module.exports = MobileNav;