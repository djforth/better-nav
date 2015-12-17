 const NavitemsDispatcher = require("../dispatchers/navitems_dispatcher");

 module.exports = {
  fetchData:(progress)=>{
    NavitemsDispatcher.fetchData({
      type: "FETCH_DATA",
      progress:progress
    });
  }

  , prerenderItem:(data)=>{
    NavitemsDispatcher.prerenderData({
      type: "PRERENDER_DATA",
      data:data
    });
  }

  , setActive:(id)=>{
    NavitemsDispatcher.setActive({
      type : "SET_ACTIVE",
      id   : id
    });
  }

  , setApi:(url)=>{
    NavitemsDispatcher.setApi({
      type : "SET_API",
      url  : url
    });
  }
}