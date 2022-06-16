import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function SignupFn(props) {
  let navigate = useNavigate();
  const [valid_user, setValid_user] = useState('');
  const [valid_email, setValid_email] = useState('');
  const [valid_c_email, setValid_c_email] = useState('');
  const [valid_password, setValid_password] = useState('');
  const [valid_c_password, setValid_c_password] = useState('');
  const [msg_user, setMsg_user] = useState('');
  const [msg_email, setMsg_email] = useState('');
  const [msg_c_email, setMsg_c_email] = useState('');
  const [msg_password, setMsg_password] = useState('');
  const [msg_c_password, setMsg_c_password] = useState('');
  const [v_user, setUser] = useState('');
  const [v_email, setEmail] = useState('');
  const [v_c_email, setC_email] = useState('');
  const [v_password, setPassword] = useState('');
  const [v_c_password, setC_password] = useState('');
  const [login, setLogin] = useState();

  const input_style = {
    borderWidth: '0px 0px 1px 0px',
    borderRadius: '0px'
  }

  function validateUser(user){
    // longer than 4 character
    if(user.length > 3){
      setValid_user(true);
      setUser(user);
      setMsg_user('');
    }
    else{
      setValid_user(false);
      setUser('');
      setMsg_user('Must be 4 or more characters');

    }
  }
  function validateEmail(email){
    const char1 = email.indexOf('@');
    const char2 = email.indexOf('.');
    if(char1 > 1 && char2 - char1 > 1){
      setValid_email(true);
      setEmail(email);
      setMsg_email('');
    }
    else{
      setValid_email(false);
      setEmail('');
      setMsg_email('Invalid email format')
    }

  }
  function validateCEmail(c_email){
    if(v_email){
      if(v_email !== c_email){
        setValid_c_email(false);
        setC_email('');
        setMsg_c_email('Please re-enter your email');
      }
      else{
        setValid_c_email(true);
        setC_email(c_email);
        setMsg_c_email('');
      }
    }
    else{
      setValid_c_email(false);
        setC_email('');
        setMsg_c_email('Please enter a valid email');
    }
  }
  function validatePassword(password){
    const messages = [];
    const special = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/g.test(password);
    const lower = /[a-z]/.test(password);
    const upper = /[A-Z]/.test(password);
    if(password.length < 6){
      messages.push('Must be 6 or more characters'); 
    }
    if(!special){
      messages.push('Must contain a special character'); 
    }
    if(!lower){
      messages.push('Must contain a lower case character'); 
    }
    if(!upper){
      messages.push('Must contain an upper case character'); 
    }
    if(messages.length){
      setValid_password(false);
      setPassword('');
    }
    else{
      setValid_password(true);
      setPassword(password);
    }
    const listMsg = messages.map(msg => <li key={messages.indexOf(msg)} style={{color: '#dc3545'}}>{msg}</li>);
    setMsg_password(<ul>{listMsg}</ul>);

  }
  function validateCPassword(c_password){
    //===
    //Please re-enter the password
    if(v_password){
      if(v_password !== c_password){
        setValid_c_password(false);
        setC_password('');
        setMsg_c_password('Please re-enter the password');
      }
      else{
        setValid_c_password(true);
        setC_password(c_password);
        setMsg_c_password('');
      }
    }
    else{
      setValid_c_password(false);
      setC_password('');
      setMsg_c_password('Please enter a valid password');
    }
  }
  //users/add
  const handleSignup = ()=>{
    if(valid_user && valid_email && valid_c_email &&
      valid_password && valid_c_password && document.getElementById('invalidCheck3').checked){
        handleFetch();
      }
  }
  const handleFetch = async () =>{
    if(v_user && v_email && v_password){
      await fetch(`http://localhost:4000/users/add?name=${v_user}&email=${v_email}&password=${v_password}`)
      //.then(handleLogin())
      .catch(err => console.error(err));
      navigate(`../signin/log`, { replace: true });
    }
  }
  
  const handleLogin = async () =>{
    await fetch(`http://localhost:4000/users/get?username=${v_user}&password=${v_password}`)
    .then(response => response.json())
    .then(response => setLogin(response.data))
    .catch(err => console.error(err));
  }

  useEffect(()=>{
    if(v_user && v_password){
      console.log(login);
      if(login.length !== 0){
        props.onChangeUser(login.id,login.name);
        navigate(`../textnet`, { replace: true });
      }
      else{
        console.log('error 404');
      }
    }
  },[login])

  return <React.Fragment>
  <div className="container mt-5" style={{ display: 'flex', alignItems: 'center', width: '80vw' }}>
    <div className="row">
      <div className="col-xs-12 col-md-6 order-12 mb-5">

          <div style={{minWidth: '300px', width: '70%', margin: '0 auto', boxShadow:'0px 8px 15px #888888'}} className='p-3'>
          <h2 className='p-2' style={{fontWeight: '700'}}>Sign Up</h2>
            <div className="input-group mb-3">
              <input name="username" className= {`form-control ${valid_user && 'is-valid'} ${valid_user === false && 'is-invalid'}`}
               type="text" id="username" placeholder="Username" style={input_style} onChange={e => {validateUser(e.target.value)}} required/>
              <div className="invalid-feedback">
                {msg_user}
              </div>
            </div>
            
            <div className="input-group mb-3">
              <input name="email1" className={`form-control ${valid_email && 'is-valid'} ${valid_email === false && 'is-invalid'}`} 
              type="email" id="emails1" placeholder="Email" style={input_style} onChange={e => {validateEmail(e.target.value)}} required/>
              <div className="invalid-feedback">
                {msg_email}
              </div>
            </div>
        
            <div className="input-group mb-3">
              <input name="email2" className={`form-control ${valid_c_email && 'is-valid'} ${valid_c_email === false && 'is-invalid'}`} 
              type="email" id="emails2" placeholder="Confirm Email" style={input_style} onChange={e => {validateCEmail(e.target.value)}} required/>
              <div className="invalid-feedback">
                {msg_c_email}
              </div>
            </div>

            <div className="input-group mb-3">
              <input name="password1" className={`form-control ${valid_password && 'is-valid'} ${valid_password === false && 'is-invalid'}`}
              type="password" id="psword1" placeholder="Password" style={input_style} onChange={e => {validatePassword(e.target.value)}} required/>
              <div className="invalid-feedback">
                {msg_password}
              </div>
            </div>

            <div className="input-group mb-2">
              <input name="password2" className={`form-control ${valid_c_password && 'is-valid'} ${valid_c_password === false && 'is-invalid'}`}
              type="password" id="psword2" placeholder="Confirm Password" style={input_style} onChange={e => {validateCPassword(e.target.value)}} required/>
              <div className="invalid-feedback">
                {msg_c_password}
              </div>
            </div>

            <div className="form-group">

              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" value="checked" id="invalidCheck3" required/>
                <label className="form-check-label">
                  Agree to terms and conditions
                </label>

                <div className="invalid-feedback">
                  You must agree before submitting.
                </div>
              </div>
            </div>
            <div>
              <button className="btn btn-primary ml-4 mb-1" type="button" id="registerbttn" onClick={()=>handleSignup()}>Sign Up</button>
            </div>
            <label style={{fontSize:'13px'}}>Already have an account?&nbsp;</label><a style = {{fontSize:'13px'}} href="/signin" className="text-decoration-non">Log In</a>

          </div>
      </div>
      <div className="col-xs-12 col-md-6 order-xs-first order-md-last">
        <h2><b>About Registering</b></h2>
        <p>Registration is completely free though we can't promise that we won't sell all your data to Google and other companies that pay us for your information!</p>
        <p>Most of our apps are free. However, if you want to calculate your approximate age and play a fun game, you will have to pay.</p>
      </div>
    </div>
  </div>
</React.Fragment>;
}

export default SignupFn;