import React from 'react';

class Register extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      registerFirstName: '',
      registerLastname: '',
      registerEmail: '',
      registerPassword: ''
    }
  }

  onRegisterFirstNameChange = (event) => {
    this.setState({registerFirstName: event.target.value});
  }

  onRegisterLastNameChange = (event) => {
    this.setState({registerLastname: event.target.value});
  }

  onRegisterEmailChange = (event) => {
    this.setState({registerEmail: event.target.value});
  }

  onRegisterPasswordChange = (event) => {
    this.setState({registerPassword: event.target.value});
  }

  onSubmitRegister = () => {
    fetch('http://localhost:3000/register', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        firstname: this.state.registerFirstName,
        lastname: this.state.registerLastname,
        email: this.state.registerEmail,
        password: this.state.registerPassword
      })
    })
    .then(response => response.json())
    .then(user => {
      if (user){
        this.props.loadUser(user)
        this.props.onRouteChange('home');
      }
    })
  }

  render () {
    return (
      <article className="br3 b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="First Name">First Name</label>
                <input onChange={this.onRegisterFirstNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="first-name"  id="first-name"/>
                <label className="db fw6 lh-copy f6" htmlFor="Last name">Last Name</label>
                <input onChange={this.onRegisterLastNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="last-name"  id="last-name"/>
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input onChange={this.onRegisterEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input onChange={this.onRegisterPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
              </div>
            </fieldset>
            <div className="">
              <input onClick={this.onSubmitRegister} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" />
            </div>
          </div>
        </main>
      </article>
    );
  }
  
}

export default Register;