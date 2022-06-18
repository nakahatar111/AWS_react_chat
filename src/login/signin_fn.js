import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function SigninFn(props) {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState();
  const input_style = {
    borderWidth: '0px 0px 1px 0px',
    borderRadius: '0px'
  }
  const handleLogin = async () =>{
    await fetch(`http://ec2-54-159-151-111.compute-1.amazonaws.com:5000/users/get?username=${username}&password=${password}`)
    .then(response => response.json())
    .then(response => setLogin(response.data))
    .catch(err => console.error(err));
  }

  useEffect(()=>{
    if(username && password){
      if(login.length!==0){
        props.onChangeUser(login.id,login.name);
        navigate(`../textnet`, { replace: true });
      }
      else{
        navigate("../signin/err", { replace: true });
      }
    }
  },[login])

  return <React.Fragment>
  <div className="container justify-content-center" style={{height:'60vh', display: 'flex', alignItems: 'center',width: '80vw' }}>
      <div style={{minWidth: '350px', width: '30vw'}}>
          <div style={{width: '90%', margin: '0 auto', boxShadow:'0px 8px 15px #888888'}} className='p-5'>
          <h2 className='p-2' style={{fontWeight: '700'}}>Sign In</h2>
            <div>
              <ErrMsg valid_login = {props.valid_login}/>
              <SignupMsg signup = {props.signup}/>
            </div>
            <div className="input-group mb-3">
              <input name="username" className={`form-control ${!props.valid_login && !username && 'is-invalid'}`}
               type="text" id="username" placeholder="Username" style={input_style} onChange={e => {setUsername(e.target.value)}} required/>
            </div>

            <div className="input-group mb-3">
              <input name="password1" className={`form-control ${!props.valid_login && !password && 'is-invalid'}`}
               type="password" id="psword1" placeholder="Password" style={input_style} onChange={e => {setPassword(e.target.value)}} required/>
            </div>

            <div>
              <button className="btn btn-primary ml-4 mb-1" type="submit" onClick={handleLogin}>Log In</button>
            </div>
            <label style={{fontSize:'13px'}}>Don't have an account?&nbsp;</label><a style = {{fontSize:'13px'}} href="/" className="text-decoration-non">Sign Up</a>

          </div>
      </div>
    </div>
  </React.Fragment>;
}

function ErrMsg({valid_login}){
  return !valid_login && <div className="alert alert-danger" role="alert">
  Incorrect username or password.
  </div>
}

function SignupMsg({signup}){
  return signup && <div className="alert alert-success" role="alert">
  Successfully Signed Up
  </div>
}

export default SigninFn;