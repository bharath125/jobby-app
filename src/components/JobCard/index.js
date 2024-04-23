import './index.css'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaShoppingBag, FaLocationArrow, FaStar} from 'react-icons/fa'

import {Component} from 'react'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobCard extends Component {
  state = {
    jobDetails: {},
    skills: [],
    similarJobs: [],
    companyLife: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobCard()
  }

  getJobCard = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      const updatedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        skills: data.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
      }

      const updatedData = {
        jobDetails: updatedJobDetails,
        similarJobs: data.similar_jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          rating: eachJob.rating,
          title: eachJob.title,
        })),
      }
      this.setState({
        jobDetails: updatedData.jobDetails,
        skills: updatedData.jobDetails.skills,
        similarJobs: updatedData.similarJobs,
        companyLife: updatedData.jobDetails.lifeAtCompany,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getJobCard()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

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

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return similarJobs.map(eachJob => (
      <li key={eachJob.id} className="in-similar-job">
        <div className="logo-job-name">
          <div>
            <img
              className="company-logo"
              src={eachJob.companyLogoUrl}
              alt="similar job company logo"
            />
          </div>
          <div>
            <h1 className="job-title">{eachJob.title}</h1>
            <p className="rating">
              <FaStar />
              {eachJob.rating}
            </p>
          </div>
        </div>
        <div>
          <h1>Description</h1>
          <p>{eachJob.jobDescription}</p>
        </div>
        <div className="loc-employment">
          <p>
            <FaLocationArrow />
            {eachJob.location}
          </p>
          <p>
            <FaShoppingBag />
            {eachJob.employmentType}
          </p>
        </div>
      </li>
    ))
  }

  renderAll = () => {
    const {jobDetails, skills, companyLife} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
    } = jobDetails

    return (
      <div className="job-card">
        <Header />
        <div className="card-container">
          <div className="logo-job-name">
            <div>
              <img className="company-logo" src={companyLogoUrl} alt={title} />
            </div>
            <div>
              <h1 className="job-title">{title}</h1>
              <p className="rating">
                <FaStar />
                {rating}
              </p>
            </div>
          </div>
          <div className="loc-salary-container">
            <div className="loc-job-type">
              <p className="location">
                {' '}
                <FaLocationArrow />
                {location}
              </p>
              <p>
                <FaShoppingBag />
                {employmentType}
              </p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <div className="website-url">
              <p>Description</p>
              <a href={companyWebsiteUrl} target="_self">
                Visit
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <div>
            <h1>Skills</h1>
            <ul className="skill-container">
              {skills.map(eachSkill => (
                <li key={eachSkill.name} className="skill-item">
                  <img
                    className="skill-logo"
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                  />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1>Life at Company</h1>
            <div className="company-life">
              <p>{companyLife.description}</p>
              <div>
                <img src={companyLife.imageUrl} alt="life at company" />
              </div>
            </div>
          </div>
        </div>
        <div className="similar-job-container">
          <h1>Similar Jobs</h1>
          <ul className="similar-job">{this.renderSimilarJobs()}</ul>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAll()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default JobCard
