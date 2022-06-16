import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import Logo from '../msg_app.png';
import SigninFn from './signin_fn';
import Inbox from '../inbox/inbox';
import SignupFn from './signup_fn';

function LoginFn() {
  const [user, setUser] = useState('');
  const [alluser, setAlluser] = useState([]);

  function handleUser(id,name){
   setUser({id: id,name: name});
  }

  function HandleLogOut(){
    return <React.Fragment>
        <a href="/" className="btn btn-info btn-sm m-2">Log out
        </a>
      </React.Fragment>
  }
  
  const fetchUsers = async () =>{
    await fetch('http://localhost:4000/users/get-all')
    .then(response => response.json())
    .then(response =>  setAlluser(response.data))
    .catch(err => console.error(err));
  }

  useEffect(()=>{
    fetchUsers();
  },[])
  
  return <React.Fragment>
    <Router>
      <Navbar bg="dark" variant="dark" className='' style={{height: '8vh'}}>
        <Container className='m-0' style={{width:'100%'}}>
          <Navbar.Brand>
            <img
              alt=""
              src= {Logo}
              width="40"
              height="40"
              className="d-inline-block align-top"
            />{' '}
            <span style={{color:'#03a9f4', fontWeight:'540', fontSize:'25px'}}>TextNet</span>
          </Navbar.Brand>
        </Container> 
        <span className='float-end' style={{color: '#ecebe9', minWidth:'240px'}}>{user && 'Welcome, '+ user.name} {user && <HandleLogOut/>}</span>
      </Navbar>

      <Routes>
        <Route path = '/' element = {<SignupFn onChangeUser = {handleUser}/>}/>
        <Route path = '/signin/err' element = {<SigninFn onChangeUser = {handleUser} valid_login = {false} signup = {false}/>}/>
        <Route path = '/signin' element = {<SigninFn onChangeUser = {handleUser} valid_login = {true} signup = {false}/>}/>
        <Route path = '/signin/log' element = {<SigninFn onChangeUser = {handleUser} valid_login = {true} signup = {true}/>}/>
        <Route path = '/textnet' element = {<Inbox onChangeUser = {handleUser} name ={user.name} user = {user.id} all_user = {alluser}/>}/>
      </Routes>

      </Router>
  </React.Fragment>;
}

export default LoginFn;