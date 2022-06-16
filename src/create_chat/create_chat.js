import react from 'react';
import React, { Component } from 'react';
import Create_chat_box from './create_chat_box';

class Create_chat extends Component {
  state = {
    added_users: [],
    friends: [],
    msg: '',
    time_stamp: '',
    filter_name: ''
  }

  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.getFriends();
  }

  getFriends = async _ =>{
    await fetch('http://localhost:4000/users/get-all')
    .then(response => response.json())
    .then(response => this.setState({friends: response.data}))
    .catch(err => console.error(err))

  }

  handleAdd = (user) =>{
    this.setState({added_users: [...this.state.added_users,user]});
  }
  
  handleRemove = (user) =>{
    this.setState({added_users: [...this.state.added_users].filter(x => x!=user)});
  }

  handleCreate=()=>{
    if(this.state.added_users.length != 0){
      const chat_id = this.state.added_users.map(user => user.id);
      chat_id.push(parseInt(this.props.user));
      const id = chat_id.sort().join('_');
      this.createChat(id);
    }
  }

  async createChat(chat_id){
    console.log(chat_id);
    if(this.props.chat_ids.some(id => id.chat_id === chat_id)){
      this.addMessages(chat_id);
    }
    else{
      const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const d = new Date();
      const time = `${weekday[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })}`;
      await fetch(`http://localhost:4000/chat/create?chat_id=${chat_id}&time=${time}&msg=${this.state.msg}`)
      .then(this.addMessages(chat_id))
      .catch(err => console.error(err))
    }
  }
  timeComparison(time1, time2){
    const arr1 = time1.split(', ');
    const arr2 = time2.split(', ');
    if(arr1[1] !== arr2[1]){return true}
    const t1 = arr1[2].substring(0,5).split(':');
    const t2 = arr2[2].substring(0,5).split(':');
    if(t1[1] <= t2[1]){
      if(t1[0] < t2[0]){return true}
      else{return false}}
    else{
      if(t2[0] - t1[0] > 1){return true}
      else{return false}}
  }

  addTimestamp = async (chat_id)=>{
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    const time = `${weekday[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })}`;
    const time_stamp = this.props.chat_ids.filter(id => id.chat_id === chat_id).map(id=>id.time);
    if(!time_stamp[0]){
      await fetch(`http://localhost:4000/message/add?id=0&sender=-1&msg=${time}&chat_id=${chat_id}`)
      .catch(err => console.error(err))
    }
    else{
      if(this.timeComparison(time_stamp[0], time)){
        await fetch(`http://localhost:4000/message/add?id=0&sender=-1&msg=${time}&chat_id=${chat_id}`)
        .catch(err => console.error(err))
      }
    }
    this.props.setTime_Msg(time,this.state.msg);
  }

  async addMessages(chat_id){
    this.addTimestamp(chat_id);
    this.updateNotifiaction(chat_id);
    await fetch(`http://localhost:4000/message/add?id=0&sender=${this.props.user}&msg=${this.state.msg}&chat_id=${chat_id}`)
    .then(this.props.getChats)
    .then(this.props.onChange(chat_id))
    .catch(err => console.error(err))
  }

  async updateNotifiaction(chat_id){
    await fetch(`http://localhost:4000/notification/update?user=${this.props.user}&chat_id=${chat_id}`)
    .catch(err => console.error(err))
  }


  handleDisable(){
    if(this.state.msg.length !== 0 && this.state.added_users.length !== 0){
      return 'btn btn-primary';
    }
    return 'btn btn-outline-primary disabled';
  }

  styles = {
    height: '75vh',
    overflow: 'auto',
    margin: '0px'
  };

  handleKeyPress = (e)=>{
    if(this.state.msg.length !== 0 && this.state.added_users.length !== 0 && e.code === 'Enter'){
      this.handleCreate();
    }
  }

  render() { 
    return <react.Fragment>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand p-2" href="#">To: {this.state.added_users.map(user => user.name).join(', ')}</a>
        
      </nav>
      <input className='form-control' placeholder='Type to filter...' onChange={e => this.setState({filter_name: e.target.value})}/>
      <div id='message' style={this.styles}>
        {this.state.friends.filter(friend => friend.id != this.props.user)
        .filter(friend => !this.state.filter_name || friend.name.startsWith(this.state.filter_name))
        .map(friend =>(
          <Create_chat_box
            key = {friend.id}
            user = {friend}
            onAdd = {this.handleAdd}
            onRemove = {this.handleRemove}
          />)
          )}
      </div>
      <div style={{width: '50vw', right: 0, height: '5vh'}} className='input-group md-3'>
        <input id = 'msg-box' className='form-control' placeholder='message' value={this.state.msg} onKeyPress={this.handleKeyPress} onChange={e => this.setState({msg:e.target.value})}/>
          <div className='input-group-append'>
            <button className= {this.handleDisable()} style={{height: '5vh'}} onClick={this.handleCreate}>Send</button>
          </div>
    </div>
    </react.Fragment>;
  }
}
 //<button className='btn btn-primary badge rounded-pill p-2 m-2 bg-primary float-end' onClick={this.handleCreate}>Create</button>
export default Create_chat;