import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class Signin extends Component {
  state = {
    username: '',
    password: '',
  } 
  input_style = {
    borderWidth: '0px 0px 1px 0px',
    borderRadius: '0px'
  }
  err_msg(){
    return !this.props.valid_login && <div className="alert alert-danger" role="alert">
    Incorrect username or password.
    </div>
  }

  handleLogin(){
    console.log(this.state.username);
    console.log(this.state.password);
    fetch(`http://localhost:4000/users/get?username=${this.state.username}&password=${this.state.password}`)
    .then(response => response.json())
    .then(response =>  this.login_result(response.data))
    .catch(err => console.error(err));
  }

  login_result=(data)=>{
    console.log(data);
    <Login_Result result = {data}/>
  }
  
  render() { 
    return <React.Fragment>
      <div className="container justify-content-center" style={{height:'60vh', display: 'flex', alignItems: 'center',width: '80vw' }}>
          <div style={{minWidth: '350px', width: '30vw'}}>
              <div style={{width: '90%', margin: '0 auto', boxShadow:'0px 8px 15px #888888'}} className='p-5'>
              <h2 className='p-2' style={{fontWeight: '700'}}>Sign In</h2>
                <div>
                  {this.err_msg()}
                </div>
                <div className="input-group mb-3">
                  <input name="username" className={`form-control ${!this.props.valid_login && !this.state.username && 'is-invalid'}`}
                   type="text" id="username" placeholder="Username" style={this.input_style} onChange={e => {this.setState({username: e.target.value})}} required/>
                </div>

                <div className="input-group mb-3">
                  <input name="password1" className={`form-control ${!this.props.valid_login && !this.state.password && 'is-invalid'}`}
                   type="password" id="psword1" placeholder="Password" style={this.input_style} onChange={e => {this.setState({password: e.target.value})}} required/>
                </div>

                <div>
                  <button className="btn btn-primary ml-4 mb-1" type="submit" onClick={()=>this.handleLogin()}>Log In</button>
                </div>
                <label style={{fontSize:'13px'}}>Don't have an account?&nbsp;</label><a style = {{fontSize:'13px'}} href="/" className="text-decoration-non">Sign Up</a>

              </div>
          </div>
        </div>
    </React.Fragment>;
  }
}


const Login_Result = (props) =>{
  console.log('hi');
  console.log(props.result);
  if(props.result.length){
    console.log('success');
  }
  else{
    console.log('failed');
  }
}
 
export default Signin;