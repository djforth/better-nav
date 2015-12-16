"use strict";

var _ = require("lodash"),
    React = require("react"),
    ReactDOM = require('react-dom');

module.exports = {
  checkArray: function checkArray(array) {
    var greater_than = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    return array && _.isArray(array) && array.length > greater_than;
  },

  checkOject: function checkOject(obj) {
    var keys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    var check = _.isObject(obj);
    if (!check || _.isEmpty(keys)) return check;

    return _.reduce(keys, function (prev, curr) {
      var ch = _.isBoolean(prev) ? prev : _.has(obj, prev);
      if (!_.has(obj, curr)) ch = false;
      return ch;
    });
  },

  isMounted: function isMounted(component) {
    try {
      ReactDOM.findDOMNode(component);
      return true;
    } catch (e) {
      // Error: Invariant Violation: Component (with keys: props,context,state,refs,_reactInternalInstance) contains `render` method but is not mounted in the DOM
      return false;
    }
  }
};
//# sourceMappingURL=checker.js.map