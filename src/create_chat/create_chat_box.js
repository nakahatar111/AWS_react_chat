import react from 'react';
import React, { Component } from 'react';
class Create_chat_box extends Component {
  state = {
    add_remove: true
  }
  style = {
    padding: '14px',
    fontSize:'18px',
    height: '55px'
  }

  handleAddBtn=()=>{
    if(this.state.add_remove){
      return <button style={{fontSize: '14px'}} onClick= {() => {this.props.onAdd(this.props.user); this.setState({add_remove: false})}} className='btn btn-primary rounded-pill p-1 float-end'>&nbsp;Add&nbsp;</button>;
    }
    return <button style={{fontSize: '14px'}} onClick= {() => {this.props.onRemove(this.props.user); this.setState({add_remove: true})}} className='btn btn-warning rounded-pill p-1 float-end'>Remove</button>;
  }

  render() { 
    return (<react.Fragment>
      <a style={this.style} className="list-group-item list-group-item-action">{this.props.user.name}
        {this.handleAddBtn()}
      </a>
    </react.Fragment>);
  }
}
 
export default Create_chat_box;