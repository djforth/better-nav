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

// const checker = require("../utils/checker");

var mixins = require("morse-react-mixins");
var checker = mixins.checker;
var cssMixins = mixins.css_mixins;
var textMixins = mixins.text_mixins;
var widthsMixins = mixins.widths_mixins;

//Flux

var NavItemsActions = require("../actions/navitems_actions"),
    NavItemsStore = require("../stores/navitems_store");

//Compenents
var Desktop = require("./desktop_nav"),
    Mobile = require("./mobile_nav");

var MainNav = (function (_React$Component) {
  _inherits(MainNav, _React$Component);

  function MainNav(props) {
    _classCallCheck(this, MainNav);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MainNav).call(this, props));

    NavItemsActions.prerenderItem(_this.props.navitems);
    // let root = NavItemsStore._getRoots();
    _this.state = {
      device: "mobile"
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

      this.setState({ device: this.device });
      NavItemsStore.addChangeListener("api_set", this._fetchData.bind(this));
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
      console.log(device, this.state.device !== device);
      if (this.state.device !== device) {
        this.device = device;
        this.setState({ device: this.device });
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
    key: "render",
    value: function render() {
      if (this.state.device === "mobile") {
        return React.createElement(Mobile, { device: this.state.device });
      }

      return React.createElement(Desktop, { device: this.state.device });
    }
  }]);

  return MainNav;
})(React.Component);

Object.assign(MainNav.prototype, cssMixins);
Object.assign(MainNav.prototype, textMixins);
Object.assign(MainNav.prototype, widthsMixins);

module.exports = MainNav;
//# sourceMappingURL=main_nav.js.map