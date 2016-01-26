"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Libraries
var React = require("react"),
    _ = require("lodash");

var mixins = require("morse-react-mixins");
var cssMixins = mixins.css_mixins;
var textMixins = mixins.text_mixins;
var widthsMixins = mixins.widths_mixins;
var checker = mixins.checker;

//Flux

var NavItemsActions = require("../actions/navitems_actions"),
    NavItemsStore = require("../stores/navitems_store");

var NavItem = function (_React$Component) {
  _inherits(NavItem, _React$Component);

  function NavItem(props) {
    _classCallCheck(this, NavItem);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NavItem).call(this, props));

    _this.mounted = false;
    var item = _this.props.item;
    _this.list = [{ active: item.active }];
    _this.state = { listcss: _this.getClasses(_this.list) };
    return _this;
  }

  // Lifecycle

  _createClass(NavItem, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //Data Changers

      NavItemsStore.addChangeListener("active_set", this._changeActive.bind(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      NavItemsStore.removeChangeListener("active_set", this._changeActive);
    }

    //Non-standard

  }, {
    key: "_changeActive",
    value: function _changeActive() {
      if (checker.isMounted(this)) {
        var active = NavItemsStore._isActive(this.props.item.id);
        // console.log("test" , checker.isMounted(this))
        if (active !== this.list[0].active && checker.isMounted(this)) {
          this.list = [{ active: active }];
          this.setState({ listcss: this.getClasses(this.list) });
        }
      }
    }
  }, {
    key: "_change",
    value: function _change() {
      if (checker.isMounted(this)) {
        this.list = [{ active: true }];
        this.setState({ listcss: this.getClasses(this.list) });
        NavItemsActions.setActive(this.props.item.id);
      }
    }
  }, {
    key: "_onClick",
    value: function _onClick(e) {
      if (this.props.device === "mobile") {
        e.preventDefault();
        this._change();
        if (_.isFunction(this.props.onClick)) {
          this.props.onClick(this.props.item.id);
        }
      }
    }
  }, {
    key: "_onMouseEnter",
    value: function _onMouseEnter() {
      if (this.props.device !== "mobile") {
        this._change();
        if (_.isFunction(this.props.mouseEnter)) {
          this.props.mouseEnter(this.props.item.id);
        }
      }
    }
  }, {
    key: "_renderLink",
    value: function _renderLink() {
      var item = this.props.item;
      if (checker.checkOject(item, ["sub"])) {
        return React.createElement(
          "a",
          { href: "#", onMouseEnter: this._onMouseEnter.bind(this), onClick: this._onClick.bind(this), className: "has-subs" },
          item.title
        );
      } else if (this.props.item) {
        return React.createElement(
          "a",
          { href: item.path },
          item.title
        );
      }

      return "";
    }

    // Render Function

  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "li",
        { className: this.state.listcss },
        this._renderLink()
      );
    }
  }]);

  return NavItem;
}(React.Component);

Object.assign(NavItem.prototype, cssMixins);
Object.assign(NavItem.prototype, textMixins);
Object.assign(NavItem.prototype, widthsMixins);

module.exports = NavItem;