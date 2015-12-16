"use strict";

var NavitemsDispatcher = require("../dispatchers/navitems_dispatcher");

module.exports = {
  fetchData: function fetchData(progress) {
    SessionsDispatcher.fetchData({
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

  setActive: function setActive(id) {
    NavitemsDispatcher.setActive({
      type: "SET_ACTIVE",
      id: id
    });
  },

  setApi: function setApi(url) {
    SessionsDispatcher.setApi({
      type: "SET_API",
      url: url
    });
  }
};
//# sourceMappingURL=navitems_actions.js.map