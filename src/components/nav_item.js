//Libraries
const React = require("react")
    , _     = require("lodash");


let mixins = require("morse-react-mixins");
const [cssMixins, textMixins, widthsMixins, checker]  = [mixins.css_mixins, mixins.text_mixins, mixins.widths_mixins, mixins.checker];

//Flux
const NavItemsActions = require("../actions/navitems_actions")
    , NavItemsStore   = require("../stores/navitems_store");

class NavItem extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    let item = this.props.item;
    this.list    = [{active:item.active}]
    this.state   = {listcss:this.getClasses(this.list)}
  }

  // Lifecycle
  componentDidMount() {
    //Data Changers

    NavItemsStore.addChangeListener("active_set", this._changeActive.bind(this));
  }

  componentWillUnmount() {
    this.mounted = false;
    NavItemsStore.removeChangeListener("active_set", this._changeActive);
  }


  //Non-standard
  _changeActive(){
    if(checker.isMounted(this)){
      let active = NavItemsStore._isActive(this.props.item.id)
      // console.log("test" , checker.isMounted(this))
      if(active !== this.list[0].active && checker.isMounted(this)){
        this.list = [{active:active}];
        this.setState({listcss:this.getClasses(this.list)})
      }
    }
  }

  _change(){
    if(checker.isMounted(this)){
      this.list = [{active:true}];
      this.setState({listcss:this.getClasses(this.list)});
      NavItemsActions.setActive(this.props.item.id)
    }

  }

  _onClick(e){
    if(this.props.device === "mobile"){
      e.preventDefault();
      this._change()
      if(_.isFunction(this.props.onClick)){
        this.props.onClick(this.props.item.id);
      }
    }
  }

  _onMouseEnter(){
    if(this.props.device !== "mobile"){
      this._change()
      if(_.isFunction(this.props.mouseEnter)){
        this.props.mouseEnter(this.props.item.id);
      }
    }
  }

  _renderLink(){
    let item = this.props.item;
    if(checker.checkOject(item, ["sub"])){
      return(<a href="#" onMouseEnter={this._onMouseEnter.bind(this)} onClick={this._onClick.bind(this)} className="has-subs">{item.title}</a>)
    } else if(this.props.item){
      return(<a href={item.path}>{item.title}</a>)
    }

    return "";
  }

  // Render Function
  render(){
    return (<li className={this.state.listcss}>{this._renderLink()}</li>);
  }

}

Object.assign(NavItem.prototype, cssMixins);
Object.assign(NavItem.prototype, textMixins);
Object.assign(NavItem.prototype, widthsMixins);

module.exports = NavItem;