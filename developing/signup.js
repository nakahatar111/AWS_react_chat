import React, { Component } from 'react';

class Signup extends Component {
  state = {
    valid_user: '',
    valid_email: '',
    valid_c_email: '',
    valid_password: '',
    valid_c_password: '',
    msg_user:'',
    msg_email:'',
    msg_c_email:'',
    msg_password:'',
    msg_c_password:'',
    user: '',
    email: '',
    c_email: '',
    password: '',
    c_password: '',
  } 
  input_style = {
    borderWidth: '0px 0px 1px 0px',
    borderRadius: '0px'
  }
  validateUser(user){
    // longer than 4 character
    if(user.length > 3){
      this.setState({valid_user: true});
      this.setState({user: user});
      this.setState({msg_user: ''});
    }
    else{
      this.setState({valid_user: false});
      this.setState({msg_user: 'Must be 4 or more characters'});
      this.setState({user:''});

    }
  }
  validateEmail(email){
    const char1 = email.indexOf('@');
    const char2 = email.indexOf('.');
    if(char1 > 1 && char2 - char1 > 1){
      this.setState({valid_email: true});
      this.setState({email: email});
      this.setState({msg_email: ''});
    }
    else{
      this.setState({valid_email: false});
      this.setState({email: ''});
      this.setState({msg_email: 'Invalid email format'});
    }

  }
  validateCEmail(c_email){
    if(this.state.email){
      if(this.state.email !== c_email){
        this.setState({valid_c_email: false});
        this.setState({c_email: ''});
        this.setState({msg_c_email: 'Please re-enter your email'});
      }
      else{
        this.setState({valid_c_email: true});
        this.setState({c_email: c_email});
        this.setState({msg_c_email: ''});
      }
    }
    else{
      this.setState({valid_c_email: false});
      this.setState({c_email: ''});
      this.setState({msg_c_email: 'Please enter a valid email'});
    }
  }
  validatePassword(password){
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
      this.setState({valid_password: false});
      this.setState({password: ''});
    }
    else{
      this.setState({valid_password: true});
      this.setState({password: password});
    }
    const listMsg = messages.map(msg => <li key={messages.indexOf(msg)} style={{color: '#dc3545'}}>{msg}</li>);
    this.setState({msg_password: <ul>{listMsg}</ul>});

  }
  validateCPassword(c_password){
    //===
    //Please re-enter the password
    if(this.state.password){
      if(this.state.password !== c_password){
        this.setState({valid_c_password: false});
        this.setState({c_password: ''});
        this.setState({msg_c_password: 'Please re-enter the password'});
      }
      else{
        this.setState({valid_c_password: true});
        this.setState({c_password: c_password});
        this.setState({msg_c_password: ''});
      }
    }
    else{
      this.setState({valid_c_password: false});
      this.setState({c_password: ''});
      this.setState({msg_c_password: 'Please enter a valid password'});
    }
  }
  
  user_msg(){
    return this.state.msg_user;
  }
  email_msg(){
    return this.state.msg_email;
  }
  email_c_msg(){
    return this.state.msg_c_email;
  }
  password_msg(){
    return this.state.msg_password;
  }
  password_c_msg(){
    return this.state.msg_c_password;
  }

  handleSignup(){
    if(this.state.valid_user && this.state.valid_email && this.state.valid_c_email &&
      this.state.valid_password && this.state.valid_c_password){
        console.log('successful sign up');
        console.log(this.state.valid_user);
        console.log(this.state.valid_email);
        console.log(this.state.valid_c_email);
        console.log(this.state.valid_password);
        console.log(this.state.valid_c_password);
      }
  }
  render() { 
    return <React.Fragment>
      <div className="container mt-5" style={{ display: 'flex', alignItems: 'center', width: '80vw' }}>
        <div className="row">
          <div className="col-xs-12 col-md-6 order-12 mb-5">

            <form method="post" action="Ryumaregistration.php">
              <div style={{minWidth: '300px', width: '70%', margin: '0 auto', boxShadow:'0px 8px 15px #888888'}} className='p-3'>
              <h2 className='p-2' style={{fontWeight: '700'}}>Sign Up</h2>
                <div className="input-group mb-3">
                  <input name="username" className= {`form-control ${this.state.valid_user && 'is-valid'} ${this.state.valid_user === false && 'is-invalid'}`}
                   type="text" id="username" placeholder="Username" style={this.input_style} onChange={e => {this.validateUser(e.target.value)}} required/>
                  <div className="invalid-feedback">
                    {this.user_msg()}
                  </div>
                </div>
                
                <div className="input-group mb-3">
                  <input name="email1" className={`form-control ${this.state.valid_email && 'is-valid'} ${this.state.valid_email === false && 'is-invalid'}`} 
                  type="email" id="emails1" placeholder="Email" style={this.input_style} onChange={e => {this.validateEmail(e.target.value)}} required/>
                  <div className="invalid-feedback">
                    {this.email_msg()}
                  </div>
                </div>
            
                <div className="input-group mb-3">
                  <input name="email2" className={`form-control ${this.state.valid_c_email && 'is-valid'} ${this.state.valid_c_email === false && 'is-invalid'}`} 
                  type="email" id="emails2" placeholder="Confirm Email" style={this.input_style} onChange={e => {this.validateCEmail(e.target.value)}} required/>
                  <div className="invalid-feedback">
                    {this.email_c_msg()}
                  </div>
                </div>

                <div className="input-group mb-3">
                  <input name="password1" className={`form-control ${this.state.valid_password && 'is-valid'} ${this.state.valid_password === false && 'is-invalid'}`}
                  type="password" id="psword1" placeholder="Password" style={this.input_style} onChange={e => {this.validatePassword(e.target.value)}} required/>
                  <div className="invalid-feedback">
                    {this.password_msg()}
                  </div>
                </div>

                <div className="input-group mb-2">
                  <input name="password2" className={`form-control ${this.state.valid_c_password && 'is-valid'} ${this.state.valid_c_password === false && 'is-invalid'}`}
                  type="password" id="psword2" placeholder="Confirm Password" style={this.input_style} onChange={e => {this.validateCPassword(e.target.value)}} required/>
                  <div className="invalid-feedback">
                    {this.password_c_msg()}
                  </div>
                </div>

                <div className="form-group">
                    
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" value="" id="invalidCheck3" required/>
                    <label className="form-check-label">
                      Agree to terms and conditions
                    </label>

                    <div className="invalid-feedback">
                      You must agree before submitting.
                    </div>
                  </div>
                </div>
                <div>
                  <button className="btn btn-primary ml-4 mb-1" type="submit" id="registerbttn" onClick={this.handleSignup()}>Sign Up</button>
                </div>
                <label style={{fontSize:'13px'}}>Already have an account?&nbsp;</label><a style = {{fontSize:'13px'}} href="/signin" className="text-decoration-non">Log In</a>

              </div>
            </form>
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
}
 
export default Signup;