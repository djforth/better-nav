"use strict";

var Dispatcher = require("flux").Dispatcher;
var assign = require("react/lib/Object.assign");

var NavItemDispatcher = assign(new Dispatcher(), {

  fetchData: function fetchData(action) {
    var payload = {
      source: "FETCH_DATA",
      action: action
    };
    this.dispatch(payload);
  },

  prerenderData: function prerenderData(action) {
    var payload = {
      source: "PRERENDER_DATA",
      action: action
    };
    this.dispatch(payload);
  },

  setActive: function setActive(action) {
    var payload = {
      source: "SET_ACTIVE",
      action: action
    };
    this.dispatch(payload);
  },

  setApi: function setApi(action) {
    var payload = {
      source: "SET_API",
      action: action
    };
    this.dispatch(payload);
  }

});

module.exports = NavItemDispatcher;