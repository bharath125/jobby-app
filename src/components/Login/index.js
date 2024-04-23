import './index.css'

import Cookie from 'js-cookie'

import {Component} from 'react'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    isLoginError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = token => {
    Cookie.set('jwt_token', token, {
      expires: 30,
      path: '/',
    })

    const {history} = this.props
    history.replace('/')
  }

  renderFailureView = () => {}

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data.error_msg)
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else if (response.status === 400) {
      this.renderFailureView()
      this.setState({
        username: '',
        password: '',
        errorMsg: data.error_msg,
        isLoginError: true,
      })
    }
  }

  renderErrorMessage = () => {
    const {errorMsg} = this.state
    return <p className="error-msg">{`* ${errorMsg}`}</p>
  }

  render() {
    const {username, password, isLoginError} = this.state
    return (
      <div className="app-container">
        <div className="login-container">
          <form onSubmit={this.onSubmitLoginForm}>
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
            <div className="username-container">
              <label htmlFor="username">USERNAME</label>
              <br />
              <input
                className="username-input"
                type="text"
                placeholder="Username"
                id="username"
                onChange={this.onChangeUsername}
                value={username}
              />
            </div>
            <div className="password-container">
              <label htmlFor="current_password">PASSWORD</label>
              <br />
              <input
                className="password-input"
                type="password"
                placeholder="Password"
                id="current_password"
                onChange={this.onChangePassword}
                value={password}
              />
            </div>
            <div>
              <button type="submit" className="login-btn">
                Login
              </button>
              {isLoginError && this.renderErrorMessage()}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
