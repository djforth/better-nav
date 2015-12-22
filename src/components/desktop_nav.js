//Libraries
const React    = require("react")
    , ReactDOM = require('react-dom')
    , _        = require("lodash");


let mixins = require("morse-react-mixins");
const [checker, cssMixins, textMixins, widthsMixins]  = [mixins.checker, mixins.css_mixins, mixins.text_mixins, mixins.widths_mixins];

//Flux
const NavItemsActions = require("../actions/navitems_actions")
    , NavItemsStore   = require("../stores/navitems_store");


//Compenents
const Navitem = require("./nav_item")
     , TouchNav = require("touch-nav");


class DesktopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      device:"mobile"
    , roots:[]
    , secondary:[]
    , tertiary:[]
    , quaternary:[]
    };
  }

  // Lifecycle
  componentWillMount(){
    this.setState({roots:NavItemsStore._getRoots()})
  }

  componentDidMount(){
    NavItemsStore.addChangeListener("fetched", this._getNavItems.bind(this));
  }

  // Morse defined
  _renderLinks(items, cb){
    if(checker.checkArray(items)){
      return _.map(items, (ri)=>{
        return (<Navitem key={ri.id} ref={ri.id} item={ri} mouseEnter={cb} device={this.props.device} />);
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


  _getNavItems(){
    this.setState({
      roots:NavItemsStore._getRoots()
    , secondary:[]
    , tertiary:[]
    , quaternary:[]
    });
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


  render(){
    return (
      <div className="desktopNav">
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
      </div>)
  }

}

Object.assign(DesktopNav.prototype, cssMixins);
Object.assign(DesktopNav.prototype, textMixins);
Object.assign(DesktopNav.prototype, widthsMixins);

module.exports = DesktopNav;