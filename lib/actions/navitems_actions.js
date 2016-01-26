"use strict";

var NavitemsDispatcher = require("../dispatchers/navitems_dispatcher");

module.exports = {
  fetchData: function fetchData(progress) {
    NavitemsDispatcher.fetchData({
      type: "FETCH_DATA",
      progress: progress
    });
  },

  prerenderItem: function prerenderItem(data) {
    NavitemsDispatcher.prerenderData({
      type: "PRERENDER_DATA",
      data: data
    });
  },

  setActive: function setActive(id, level) {
    NavitemsDispatcher.setActive({
      type: "SET_ACTIVE",
      id: id,
      level: level
    });
  },

  setApi: function setApi(url) {
    NavitemsDispatcher.setApi({
      type: "SET_API",
      url: url
    });
  }
};