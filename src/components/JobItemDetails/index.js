import './index.css'

import {Component} from 'react'

import {FaShoppingBag, FaLocationArrow, FaStar} from 'react-icons/fa'

import {Link} from 'react-router-dom'

class JobItemDetails extends Component {
  render() {
    const {JobDetails} = this.props
    const {
      id,
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
    } = JobDetails
    return (
      <Link to={`/jobs/${id}`} className="link">
        <li className="job-detail-container">
          <div className="logo-job-name">
            <div>
              <img
                className="company-logo"
                src={companyLogoUrl}
                alt="job details company logo"
              />
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
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </li>
      </Link>
    )
  }
}

export default JobItemDetails
