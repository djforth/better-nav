const assign      = require("react/lib/Object.assign")
  , EventEmitter  = require("events").EventEmitter
  , _             = require("lodash");

const Ajax        = require("ajax-es6-module");
const ajaxManager = new Ajax();

const navItemsFcty = require("../factory/navitems_fcty")

//Flux
const NavitemsDispatcher = require("../dispatchers/navitems_dispatcher")
    , NavitemsAction     = require("../actions/navitems_actions");

let navitems;

let fetched     = false;
let requestMade = false;



const store = {

  // <<<<<<<<<<<<<<<< Event management >>>>>>>>>>
  emitChange(event) {
    this.emit(event);
  }

  , addChangeListener(event, callback) {
    this.on(event, callback);
  }

  , removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  }

  , _addItems(data){
    // console.log(data)
    navitems = navItemsFcty(data)
  }

  , _getLevels(){
    return navitems.getLevels()
  }

  , getItem:(id)=>{
    return navitems.findItem(id);
  }

  , getSubs:(id)=>{
    return navitems.getSub(id);
  }

  , _getRoots(){
    return navitems.getRoots();
  }

  , _isActive(id){
    return navitems.findItem(id).active;
  }

  , prepForTouchNav(items){
    return _.map(items, (item)=>{
      return {
          id    :item.id
        , name  : item.title
        , title : `Go to ${item.title}`
        , href  : item.path
        , active: item.active
      }

    })
  }

  , _setActive(id){
    navitems.setActive(id);
  }

  , _setApi(api){
    // ajaxManager = AjaxManager(api);
  }
}

const NavitemsStore = assign({}, EventEmitter.prototype, store);
NavitemsStore.setMaxListeners(0);

const registeredCallback = function(payload) {
  var action = payload.action;
  switch(action.type) {
    case "FETCH_DATA":
      if(action.progress) NavitemsStore._progress(action.progress)
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
