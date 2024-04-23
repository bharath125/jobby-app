import './index.css'

import Cookies from 'js-cookie'

import {Link, withRouter} from 'react-router-dom'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    // const jwtToken = Cookies.get()
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <ul className="nav-list">
      <li>
        <Link to="/" className="home-home">
          <img
            className="home-website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
      </li>
      <li className="home-jobs">
        <Link to="/" className="home-home">
          <p>Home</p>
        </Link>
        <Link to="/jobs" className="home-jobs">
          <p>Jobs</p>
        </Link>
      </li>
      <li>
        <button className="logout-btn" type="button" onClick={onClickLogOut}>
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
