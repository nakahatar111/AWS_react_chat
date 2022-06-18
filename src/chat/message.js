import React, { Component,useEffect } from 'react';
import MessageBox from './messagebox';
import { Spinner } from 'react-bootstrap';

class Message extends Component {
  state = {
    isPending: true,
    isDelivered: true,
    sender: '',
    messages: [],
    msg: '',
    msg_num: 0
  }

  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.setState({sender: this.props.user});
    this.getMessages();
    this.clearNotification();
  }
  componentWillUnmount(){
    this.clearNotification();
  }

  async clearNotification(){
    await fetch(`http://ec2-54-159-151-111.compute-1.amazonaws.com:5000/notification/clear?user=${this.props.user}&chat_id=${this.props.chat_id}`)
    .catch(err => console.error(err))
    this.props.update_inbox();
  }
  
  checkScroll(){
    if(this.state.msg_num === 0){
      document.getElementById('message').scrollTop = document.getElementById('message').scrollHeight;
      this.setState({msg_num: this.state.messages.length});
    }
    else if(this.state.messages.length !== this.state.msg_num){
      document.getElementById('message').scrollTop = document.getElementById('message').scrollHeight;
      this.setState({msg_num: this.state.messages.length});
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

  addTimestamp = async (msg) =>{
    console.log("3:" + msg);
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    const time = `${weekday[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })}`;
    if(!this.props.time_stamp){
      await fetch(`http://ec2-54-159-151-111.compute-1.amazonaws.com:5000/message/add?id=0&sender=-1&msg=${time}&chat_id=${this.props.chat_id}`)
      .catch(err => console.error(err))
    }
    else{
      if(this.timeComparison(this.props.time_stamp, time)){
        await fetch(`http://ec2-54-159-151-111.compute-1.amazonaws.com:5000/message/add?id=0&sender=-1&msg=${time}&chat_id=${this.props.chat_id}`)
        .catch(err => console.error(err))
      }
    }
    this.props.setTime_Msg(time,msg);
  }

  addMessages = async (msg) =>{
    this.setState({isDelivered: false});
    this.updateNotifiaction();
    this.addTimestamp(msg);
    await fetch(`http://ec2-54-159-151-111.compute-1.amazonaws.com:5000/message/add?id=0&sender=${this.props.user}&msg=${this.state.msg}&chat_id=${this.props.chat_id}`)
    .then(this.getMessages)
    .then(this.setState({msg:''}))
    .then(this.setState({isDelivered:true}))
    .catch(err => console.error(err))

  }

  getMessages = async _ =>{
    await fetch(`http://ec2-54-159-151-111.compute-1.amazonaws.com:5000/message/get?chat_id=${this.props.chat_id}`)
    .then(response => response.json())
    .then(response => {this.setState({messages: response.data}); this.setState({isPending: false})})
    .catch(err => console.error(err))
    this.checkScroll();
    this.props.update_inbox();
  }

  async updateNotifiaction(){
    await fetch(`http://ec2-54-159-151-111.compute-1.amazonaws.com:5000/notification/update?user=${this.props.user}&chat_id=${this.props.chat_id}`)
    .catch(err => console.error(err))
  }

  styles = {
    height: '79vh',
    overflow: 'auto',
    margin: '0px',
  };

  handleDisable(){
    if(this.state.msg.length !== 0){
      return 'btn btn-primary';
    }
    return 'btn btn-outline-primary disabled';
  }

  handleKeyPress = (e)=>{
    if(this.state.msg.length !== 0 && e.code === 'Enter'){
      this.addMessages(this.state.msg);
    }
  }

  handleDelete= async ()=>{
    this.props.onChatDelete();
    console.log('delete');
    await fetch(`http://ec2-54-159-151-111.compute-1.amazonaws.com:5000/chat/delete?chat_id=${this.props.chat_id}`)
    .then(this.props.update_inbox())
    .catch(err => console.error(err))
  }

  render() { 
    const {messages} = this.state;
    return (
    <React.Fragment>
      <nav className="navbar navbar-light bg-light p-2" style={{}}>
        <div className="navbar-brand p-0" href="#">{this.props.name.map(user => user.name).join(', ')}</div>
        <button className='btn bg-warning ml-auto' type='button' onClick={this.handleDelete}>delete</button>
      </nav>
      <div id='message' style={this.styles} className=' scrollbar-light-blue'>
        {this.state.isPending && <div className='d-flex align-items-center justify-content-center'><Spinner animation="border" variant="info"style={{width: '10rem', height: '10rem'}}/></div>}
        {messages.map(chat => (
          <MessageBox
          key = {chat.id}
          chat = {chat}
          sender = {this.props.user}
          name = {this.props.name}
          chat_id = {this.props.chat_id}
          />
        ))}
        {!this.state.isDelivered && <div className='float-end' style={{fontSize: '11px', fontWeight:'400'}}>Sending...</div>}
        {this.state.isDelivered && <div className='float-end' style={{fontSize: '11px', fontWeight:'400'}}>Delivered&#10003;</div>}
      </div>
    <Refetch/>
    
    <div className='input-group md-3' style={{height:'5vh'}}>
      <input id = 'msg-box' className='form-control' placeholder='message' onKeyPress={this.handleKeyPress} onChange={e => this.setState({msg:e.target.value})}/>
      <div className='input-group-append'>
        <button style={{height:'5vh'}} className= {this.handleDisable()} onClick={this.addMessages}>Send</button>
      </div>
    </div>
    
    <button className='visually-hidden' id = 'refresh' onClick={this.getMessages}>Refresh</button>
    </React.Fragment>);
  }

}

function Refetch() {
  useEffect(() => {
    const interval = setInterval(() => {
      //console.log('Fetching Data...');
      document.getElementById('refresh').click();
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return null
}

export default Message;