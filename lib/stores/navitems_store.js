"use strict";

var assign = require("react/lib/Object.assign"),
    EventEmitter = require("events").EventEmitter,
    _ = require("lodash");

var Ajax = require("ajax-es6-module");
var ajaxManager = new Ajax();

var navItemsFcty = require("../factory/navitems_fcty");

//Flux
var NavitemsDispatcher = require("../dispatchers/navitems_dispatcher"),
    NavitemsAction = require("../actions/navitems_actions");

var navitems = undefined;

var fetched = false;
var requestMade = false;

var store = {

  // <<<<<<<<<<<<<<<< Event management >>>>>>>>>>

  emitChange: function emitChange(event) {
    this.emit(event);
  },
  addChangeListener: function addChangeListener(event, callback) {
    this.on(event, callback);
  },
  removeChangeListener: function removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  },
  _addItems: function _addItems(data) {
    // console.log(data)
    navitems = navItemsFcty(data);
  },
  _getLevels: function _getLevels() {
    return navitems.getLevels();
  },
  getItem: function getItem(id) {
    return navitems.findItem(id);
  },

  getSubs: function getSubs(id) {
    return navitems.getSub(id);
  },

  _getRoots: function _getRoots() {
    return navitems.getRoots();
  },
  _isActive: function _isActive(id) {
    return navitems.findItem(id).active;
  },
  prepForTouchNav: function prepForTouchNav(items) {
    return _.map(items, function (item) {
      return {
        id: item.id,
        name: item.title,
        title: "Go to " + item.title,
        href: item.path,
        active: item.active
      };
    });
  },
  _setActive: function _setActive(id) {
    navitems.setActive(id);
  },
  _setApi: function _setApi(api) {
    // ajaxManager = AjaxManager(api);
  }
};

var NavitemsStore = assign({}, EventEmitter.prototype, store);
NavitemsStore.setMaxListeners(0);

var registeredCallback = function registeredCallback(payload) {
  var action = payload.action;
  switch (action.type) {
    case "FETCH_DATA":
      if (action.progress) NavitemsStore._progress(action.progress);
      NavitemsStore._fetchData(action.date);
      NavitemsStore.emitChange("fetching");
      break;

    case "PRERENDER_DATA":
      NavitemsStore._addItems(action.data);
      NavitemsStore.emitChange("prerender");
      break;

    case "SET_ACTIVE":
      NavitemsStore._setActive(action.id);
      NavitemsStore.emitChange("active_set");

      break;

    case "SET_API":
      NavitemsStore._setApi(action.url);
      NavitemsStore.emitChange("api_set");

      break;

  }
};

NavitemsStore.dispatchToken = NavitemsDispatcher.register(registeredCallback);
NavitemsStore.setMaxListeners(0);

module.exports = NavitemsStore;
//# sourceMappingURL=navitems_store.js.map