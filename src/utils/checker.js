var _        = require("lodash")
  , React    = require("react")
  , ReactDOM = require('react-dom');

module.exports = {
  checkArray:(array, greater_than=0)=>{
    return (array && _.isArray(array) && array.length > greater_than);
  }

  , checkOject:(obj, keys=[])=>{
    let check = _.isObject(obj);
    if(!check || _.isEmpty(keys)) return check;

    return _.reduce(keys, (prev, curr)=>{
      let ch = (_.isBoolean(prev)) ? prev : _.has(obj, prev);
      if(!_.has(obj, curr)) ch = false;
      return ch
    })
  }

  , isMounted:(component)=>{
    try {
      ReactDOM.findDOMNode(component);
      return true;
    } catch (e) {
      // Error: Invariant Violation: Component (with keys: props,context,state,refs,_reactInternalInstance) contains `render` method but is not mounted in the DOM
      return false;
    }
  }
}