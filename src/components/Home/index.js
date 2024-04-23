import './index.css'

import {Component} from 'react'

import {Link} from 'react-router-dom'

import Header from '../Header'

class Home extends Component {
  render() {
    return (
      <>
        <div className="home-container">
          <Header />
          <div className="info">
            <h1 className="info-heading">Find The Job That Fits Your Life</h1>
            <p>
              Millions of people are searching for jobs, salary information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button type="button" className="jobs-btn">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }
}

export default Home
