const _     = require("lodash");


function add_id(item){
  item.id = _.uniqueId("navitem");
  return item
}

function checkSubs(navitems){
  let check = false;
  _.forEach(navitems, (ni)=>{
    if(_.has(ni, "sub")){
       check = true;
       return false;
    }
  });

  return check;
}

function checkLevels(navitem){

  if(!_.has(navitem, "sub")) return navitem.level;
  let level = 1;
  let check = false;
  _.forEach(navitem.sub, (ni)=>{
    if(_.has(ni, "sub") && checkSubs(ni.sub)){
      level = 2;
      return false;
    }
  });

  return level
}

function findNavItem(navitems, id, item){
  if(item) return item;
  if(_.isEmpty(navitems)) return null;
  return _.reduce(navitems, (prev, curr)=>{
    if(curr.id === id){
      return curr;
    }
    let sub;
    if(_.has(curr, "sub")){
      sub = findNavItem(curr.sub, id, prev);
    }

    return (_.isObject(sub)) ? sub : prev
  }, item);
}

function processItems(data, level=0){
  if(!data) return null;
  return _.map(data, (ni)=>{
    ni        = add_id(ni);
    ni.level  = level;
    ni.active = false;
    if(_.has(ni, "sub")){
      ni.sub = processItems(ni.sub, level+1);
    }

    return ni;
  });
}

function setActive(data, id){
  let active = false;
  data = _.map(data, (ni)=>{
    ni.active = (ni.id === id);
    if(ni.active){
      active = true;
      return ni;
    }

    if(_.has(ni, "sub")){
      let sub = setActive(ni.sub, id);
      if(sub.active){
        ni.sub = sub.data
        ni.active = active =  sub.active;
      }
    }

    return ni;
  });

  return {data:data, active:active}
}

module.exports = function(data){
  let navitems = processItems(data);
  navitems = _.map(navitems, (ni)=>{
    ni.fullLevels = checkLevels(ni);
    return ni;
  });


  let obj = {
      findItem:(id)=>findNavItem(navitems, id)
    , getSub:(id)=>{
      let item = findNavItem(navitems, id);
      // console.log("sub", item)
      if(item && _.has(item, "sub")) return item.sub;
    }
    , setActive:(id)=>{
      navitems = setActive(navitems, id).data;
    }
    , getRoots:()=>navitems
    , getLevels:()=>{
      return _.find(navitems, (ni)=>ni.active).fullLevels
    }
    , getLevelType:(id)=>{
      let item = findNavItem(navitems, id);
      if(item){
        return (_.has(item, "fullLevels")) ? item.fullLevels : item.level;
      }

      return null;
    }
  }

  return obj;

}