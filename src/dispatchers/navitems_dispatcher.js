const Dispatcher = require("flux").Dispatcher;
const assign     = require("react/lib/Object.assign");

const NavItemDispatcher = assign(new Dispatcher(), {

  fetchData: function(action) {
    var payload = {
      source: "FETCH_DATA",
      action: action
    };
    this.dispatch(payload);
  }

  , prerenderData: function(action) {
    var payload = {
      source: "PRERENDER_DATA",
      action: action
    };
    this.dispatch(payload);
  }

  , setActive: function(action) {
    var payload = {
      source: "SET_ACTIVE",
      action: action
    };
    this.dispatch(payload);
  }

  , setApi: function(action) {
    var payload = {
      source: "SET_API",
      action: action
    };
    this.dispatch(payload);
  }

});

module.exports = NavItemDispatcher;