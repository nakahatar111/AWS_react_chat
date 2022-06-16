import react from 'react';
import React, { Component } from 'react';
import Inbox from '../src/inbox/inbox';
import { Navbar, Container } from 'react-bootstrap';
import Logo from '../msg_app.png';
import Signup from './signup';
import Signin from './signin';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

class Login extends Component {
  state = {
    count: 1,
    name: '',
    user: '',
    users: [],
    all_user: []
  }

  componentDidMount(){
    this.getUsers();
  }

  async getUser(){
    await fetch(`http://localhost:4000/users/get-name?id=${this.state.user}`)
    .then(response => response.json())
    .then(response => this.setState({name: response.data}))
    .catch(err => console.error(err))
  }

  async getUsers(){
    await fetch('http://localhost:4000/users/get-all')
    .then(response => response.json())
    .then(response => this.setState({all_user: response.data}))
    .catch(err => console.error(err))
  }
  
  handleLogout(){
    return <react.Fragment>
      <a href="/" className="btn btn-info btn-sm m-2">Log out
      </a>
    </react.Fragment>
  }
  
  render() { 
    return (<react.Fragment>
      <Router>
      <Navbar bg="dark" variant="dark" className='p-0 m-0'>
        <Container className='m-0' style={{height: '70px', maxWidth: '100%'}}>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src= {Logo}
              width="40"
              height="40"
              className="d-inline-block align-top"
            />{' '}
            <span style={{color:'#03a9f4', fontWeight:'540', fontSize:'25px'}}>TextNet</span>
          </Navbar.Brand>
          <span className='float-end' style={{color: '#ecebe9'}}>{this.state.name && 'Welcome, '+ this.state.name} {this.state.name && this.handleLogout()}</span>
        </Container> 
      </Navbar>

      <Routes>
        <Route path = '/' element = {<Signup/>}/>
        <Route path = '/signin/err' element = {<Signin valid_login = {false} signup = {false}/>}/>
        <Route path = '/signin/success' element = {<Signin valid_login = {true} signup = {true}/>}/>
        <Route path = '/signin' element = {<Signin valid_login = {true} signup = {false}/>}/>
        <Route path = '/textnet' element = {<Inbox/>}/>
      </Routes>

      </Router>
    </react.Fragment>);
  }
}
 
export default Login;