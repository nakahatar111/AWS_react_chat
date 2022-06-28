import react from 'react';
import React, { Component } from 'react';
import Message from '../chat/message';
import Box from './box';
import CreateChat from '../create_chat/create_chat';

class Inbox extends Component {
  state = {
    chat_ids: [],
    chat_id: [],
    receiver: [],
    name: [],
    create_chat: [],
    time_stamp: '',
    user: '',
    all_user: '',
  }

  componentDidMount(){
    let name = '';
    let user = '';
    let all_user = '';
    if(!this.props.user){
      name = JSON.parse(window.sessionStorage.getItem('name'));
      user = JSON.parse(window.sessionStorage.getItem('user'));
      all_user = JSON.parse(window.sessionStorage.getItem('all_user'));
      if(!user){
        name = '';
        user = '';
        all_user  = '';
      }
      else{
      }
    }
    else{
      window.sessionStorage.setItem('name', JSON.stringify(this.props.name));
      window.sessionStorage.setItem('user', JSON.stringify(this.props.user));
      window.sessionStorage.setItem('all_user', JSON.stringify(this.props.all_user));
      name = this.props.name;
      user = this.props.user;
      all_user = this.props.all_user;
    }
    this.props.onChangeUser(user, name);
    this.setState({user: user, all_user: all_user}, ()=>{
      this.getChats();
    });
  }

  getChats= async ()=>{
    await fetch(`https://ec2-54-159-151-111.compute-1.amazonaws.com:5000/inbox/get-chats?user=${this.state.user}`)
    .then(response => response.json())
    .then(response => this.setState({chat_ids: response.data}))
    .catch(err => console.error(err))
  }

  handleIdChange = (chat_id) => {
    const time_stamp = this.state.chat_ids.filter(id => id.chat_id === chat_id).map(id=>id.time);
    const arr = chat_id.split('_').filter(id => id !== this.state.user);
    const name = this.state.all_user.filter(user => arr.includes(`${user.id}`));
    this.setState({name: name});
    this.setState({create_chat: []});
    this.setState({chat_id: [chat_id]});
    this.setState({time_stamp: time_stamp[0]});
  }

  handleAddChat=()=>{
    this.setState({chat_id: [], create_chat:[1]});
  }
  handleChatDelete=()=>{
    this.setState({chat_id: [], create_chat:[]});
  }
  
  timeComparison(time1, time2){
    const month = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6,
    "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12};
    const arr1 = time1.time.split(', ');
    const arr2 = time2.time.split(', ');
    const date1 = arr1[1].split(' ');
    const date2 = arr2[1].split(' ');
    if(month[date1[0]] < month[date2[0]])
      return 1;
    else if (month[date1[0]] > month[date2[0]])
      return -1;
    else{
      if(date1[1] < date2[1])
        return 1;
      else if(date1[1] > date2[1])
        return -1;
      else{
        const t1 = arr1[2].substring(0,5).split(':');
        const t2 = arr2[2].substring(0,5).split(':');
        if(arr1[2].substring(6,8) === 'PM' && arr2[2].substring(6,8) !== 'PM')
          return -1;
        else if(arr1[2].substring(6,8) !== 'PM' && arr2[2].substring(6,8) === 'PM')
          return 1;
        else{
        if(t1[0] < t2[0])
          return 1;
        else if(t1[0] > t2[0])
          return -1;
        else{
          if(t1[1] < t2[1])
            return 1;
          else if(t1[1] > t2[1])
            return -1;
          else 
            return 0;
        }}
      } 
    }
  }

  handleTime_Msg = async (time,msg) =>{
    await fetch(`https://ec2-54-159-151-111.compute-1.amazonaws.com:5000/time_stamp?chat_id=${this.state.chat_id[0]}&time=${time}&msg=${msg}`)
    .then(this.setState({time_stamp: time}))
    .catch(err => console.error(err))
  }
  //col-md-6 col-sm-12
  // d-none d-md-block
  render() {
    return (
    <react.Fragment>
      <div className='container-fluid p-0' style={{height:'92vh'}}>
        <div className='row m-0 g-0'>
          <div className='col-6 p-0 g-0 border border-right border-light'>
            <h4 className='p-3 m-0' style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#TF7FTF', color: '#0398dc', height: '6vh'}}>Chats
            <button onClick={this.handleAddChat} className='bg-white badge rounded-pill float-end p-0 m-1' style={{fontWeight: '400', fontSize:'25px',border:'none', color: 'black'}}>+</button></h4>
            <div  style={{height: '85vh', width: '100%', overflow: 'auto'}} className="bg-light list-group m-0 p-0">
              {this.state.user && this.state.chat_ids.sort(this.timeComparison).map(chat_id =>
                <Box
                  key = {chat_id.id}
                  user = {this.state.user}
                  chat_id = {chat_id.chat_id}
                  current_id = {this.state.chat_id}
                  onChange = {this.handleIdChange}
                  all_user = {this.state.all_user}
                  time_stamp = {chat_id.time}
                  msg = {chat_id.msg}
                  notification = {chat_id.notification}
                />
              )}
              

            </div>
          </div>
          {<div className=' p-0 col-6'>
          {this.state.user && this.state.chat_id.map(chat => (
            <Message
              key = {chat}
              user = {this.state.user}
              chat_id = {this.state.chat_id}
              name = {this.state.name}
              time_stamp = {this.state.time_stamp}
              setTime_Msg = {this.handleTime_Msg}
              update_inbox = {this.getChats}
              onChatDelete = {this.handleChatDelete}
            />)
          )}
          {this.state.user && this.state.create_chat.map(()=>
            <CreateChat
              key = {1}
              chat_ids = {this.state.chat_ids}
              onChange = {this.handleIdChange}
              user = {this.state.user}
              getChats = {this.getChats}
              time_stamp = {this.state.time_stamp}
              setTime_Msg = {this.handleTime_Msg}
            />
          )}
          </div>}
        </div>
      </div>
    </react.Fragment>);
  }
}
export default Inbox;