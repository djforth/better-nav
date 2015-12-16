//Libraries
const React    = require("react")
    , ReactDom = require('react-dom')
    , _        = require("lodash");

// Morse Libraies
const ViewportDetect = require("viewport-detection-es6");

const checker = require("../utils/checker");

let mixins = require("morse-react-mixins");
const [cssMixins, textMixins, widthsMixins]  = [mixins.css_mixins, mixins.text_mixins, mixins.widths_mixins];

//Flux
const NavItemsActions = require("../actions/navitems_actions")
    , NavItemsStore   = require("../stores/navitems_store");

//Compenents
const Navitem = require("./nav_item")
     , TouchNav = require("touch-nav");


class MainNav extends React.Component {
  constructor(props) {
    super(props);
    NavItemsActions.prerenderItem(this.props.navitems)
    let root = NavItemsStore._getRoots();
    this.state = {
      roots:root
    , secondary:[]
    , tertiary:[]
    , quaternary:[]
    };
  }

  _setSecondary(id){

    this.setState({
      activeRoot:NavItemsStore.getItem(id)
    , secondary:NavItemsStore.getSubs(id)
    , tertiary:[]
    , quaternary:[]
    });
  }

  _setTertiary(id){
    this.setState({
      activeSecondary:NavItemsStore.getItem(id)
    , tertiary:NavItemsStore.getSubs(id)
    , quaternary:[]
    });
  }

  _setQuaternary(id){
    this.setState({
      activeTertiary:NavItemsStore.getItem(id)
    , quaternary:NavItemsStore.getSubs(id)
    });
  }

  _renderLinks(items, cb){
    if(checker.checkArray(items)){
      return _.map(items, (ri)=>{
        return (<Navitem key={ri.id} item={ri} mouseEnter={cb} />);
      })
    }

    return ""
  }

  _renderSecondary(){
    if(checker.checkArray(this.state.secondary)){
      let root = this.state.activeRoot
      if(NavItemsStore._getLevels() === 1){
        return(
          <div className="nav-list level-1">
            <div className="home-link"><a href={root.path}>In {root.title}</a></div>
            {this._renderTitle(root, "home-link")}
            <TouchNav
              ref      = "touch-nav"
              navitems = {NavItemsStore.prepForTouchNav(this.state.secondary)}
              ul_css   = "secondary-nav-touch-list"
              main_css = "touch-sub-nav"
            />
          </div>

        );
      }
      // console.log("eh?")
      return (
        <div className="levels level-2">
          {this._renderTitle(root, "clearfix home-link")}

          <ul className="nav-list secondary-nav-list">
            {this._renderLinks(this.state.secondary, this._setTertiary.bind(this))}
          </ul>
        </div>);
    }

    return "";
  }

  _renderTertiary(){
    if(checker.checkArray(this.state.tertiary)){
      return (
        <div className="levels level-3">
          {this._renderTitle(this.state.activeSecondary)}
          <ul className="nav-list tertiary-nav-list">
            {this._renderLinks(this.state.tertiary, this._setQuaternary.bind(this))}
          </ul>
        </div>);
    }

    return "";
  }

  _renderQuaternary(){
    if(checker.checkArray(this.state.quaternary)){
      return (
        <div className="levels level-4">
          {this._renderTitle(this.state.activeTertiary)}
          <ul className="nav-list quaternary-nav-list">
            {this._renderLinks(this.state.quaternary, null)}
          </ul>
        </div>
      );
    }

    return "";
  }

  _renderTitle(root, css="title-link"){
    if(root) return (<div className={css}><a href={root.path}>In {root.title}</a></div>);

    return ""
  }

  render(){
    return (
      <div>
        <div className="nav-holder">
          <ul className="nav-list primary-nav-list">
            {this._renderLinks(this.state.roots, this._setSecondary.bind(this))}
          </ul>
        </div>
        <div className="clearfix sub-holder single">
          {this._renderSecondary()}
          {this._renderTertiary()}
          {this._renderQuaternary()}
        </div>
      </div>
    );

  }

}

Object.assign(MainNav.prototype, cssMixins);
Object.assign(MainNav.prototype, textMixins);
Object.assign(MainNav.prototype, widthsMixins);

module.exports = MainNav;