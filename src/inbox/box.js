import react from 'react';
import React, { Component } from 'react';


class Box extends React.Component {
  state={
    name: ''
  }
  constructor(props){
    super(props);  
  }

  componentDidMount(){ 
    const arr = this.props.chat_id.split('_').filter(id => id!=this.props.user);
    const name = this.props.all_user.filter(user => arr.includes(`${user.id}`)).map(user => user.name).join(', ');
    this.setState({name: name});
  }

  show_time(){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    const time_arr = this.props.time_stamp.split(', ');
    if(time_arr[1] === `${monthNames[d.getMonth()]} ${d.getDate()}`){
      return time_arr[2];
    }
    else{
      return time_arr[1];
    }
  }

  last_msg(){
    if(this.props.msg){
      if(this.props.msg.length > 30){
        return this.props.msg.substring(0,30)+'...';
      }
      return this.props.msg;
    }
    return
  }

  render() { 
    return (<react.Fragment>
      <a style={{fontSize:'18px'}} onClick= {() => {this.props.onChange(this.props.chat_id)}}
      className="list-group-item list-group-item-action ps-4">
        <div className='containter' style={{height: '50px'}}>
          <div className='row'>
            <div className='col flex grow-1'>
              <span className='row' style={{fontSize: '19px', fontWeight:'600'}}>{this.state.name}</span>
              <span className='row' style={{fontSize: '15px'}}>{this.last_msg()}</span>
            </div>
            <div className='col-3 float-end' style={{minWidth:'130px'}}>
              <span className='float-end' style={{fontSize: '18px'}}>{this.show_time()}</span>
              <span className=" float-end badge bg-primary m-1">{this.props.notification!==0 && this.props.chat_id != this.props.current_id && this.props.notification}</span>
            </div>
          </div>
        </div>
        </a>
    </react.Fragment>);
  }
}
 
export default Box;