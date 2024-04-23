import './index.css'

import Cookies from 'js-cookie'

import {FaSearch} from 'react-icons/fa'

import Loader from 'react-loader-spinner'

import {Component} from 'react'

import JobItemDetails from '../JobItemDetails'
import ProfileDetails from '../ProfileDetails'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchValue: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  onChangeSearch = event => {
    this.setState({searchValue: event.target.value})
  }

  onClickSearch = () => {
    const {jobsList, searchValue} = this.state

    const newJobsList = jobsList.filter(each =>
      each.title.toLowerCase().includes(searchValue.toLowerCase()),
    )
    this.setState({jobsList: [...newJobsList]})
  }

  onChangeCheckBox = event => {
    const {jobsList} = this.state
    console.log(event.target.value)

    const newJobsList = jobsList.filter(each =>
      each.employmentType.includes(event.target.value),
    )
    this.setState({jobsList: [...newJobsList]})
  }

  onRetry = () => {
    this.getJobDetails()
  }

  onChangeRadio = event => {
    const {jobsList} = this.state
    const newJobsList = jobsList.filter(
      each =>
        Number(each.packagePerAnnum.slice(0, 2)) >
        Number(event.target.value.slice(0, 2)),
    )

    this.setState({jobsList: [...newJobsList]})
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const url = 'https://apis.ccbp.in/jobs'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const updatedData = data.jobs.map(eachJob => ({
      companyLogoUrl: eachJob.company_logo_url,
      employmentType: eachJob.employment_type,
      id: eachJob.id,
      jobDescription: eachJob.job_description,
      location: eachJob.location,
      packagePerAnnum: eachJob.package_per_annum,
      rating: eachJob.rating,
      title: eachJob.title,
    }))
    if (response.ok) {
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsList = () => {
    const {jobsList, searchValue} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile">
            <ProfileDetails />
            <hr />
            <div className="employment-type">
              <h1 className="heading">Type of Employment</h1>

              <ul className="employement-list">
                {employmentTypesList.map(eachType => (
                  <li key={eachType.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={eachType.employmentTypeId}
                      value={eachType.label}
                      onChange={this.onChangeCheckBox}
                    />
                    <label htmlFor={eachType.employmentTypeId}>
                      {eachType.label}
                    </label>
                    <br />
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="employment-type">
              <h1 className="heading">Salary Range</h1>

              <ul className="employement-list">
                {salaryRangesList.map(eachType => (
                  <li key={eachType.salaryRangeId}>
                    <input
                      type="radio"
                      value={eachType.salaryRangeId}
                      id={eachType.salaryRangeId}
                      onChange={this.onChangeRadio}
                    />
                    <label htmlFor={eachType.salaryRangeId}>
                      {eachType.label}
                    </label>
                    <br />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="job-item">
            <div className="search-container">
              <input
                className="search-input"
                type="search"
                placeholder="Search"
                onChange={this.onChangeSearch}
                value={searchValue}
              />
              <button
                data-testid="searchButton"
                className="search-btn"
                type="button"
                onClick={this.onClickSearch}
              >
                S<FaSearch />
              </button>
            </div>
            {jobsList.map(eachJob => (
              <JobItemDetails key={eachJob.id} JobDetails={eachJob} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops, Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="jobs-btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default Jobs
