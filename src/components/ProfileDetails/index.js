import './index.css'

import Cookies from 'js-cookie'

import {Component} from 'react'

class ProfileDetails extends Component {
  state = {
    profile: {},
    isApiSuccess: true,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      methods: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profile: updatedData})
    } else {
      this.setState({isApiSuccess: false})
    }
  }

  render() {
    const {profile, isApiSuccess} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return isApiSuccess ? (
      <div className="profile-container">
        <div>
          <img className="profile-logo" src={profileImageUrl} alt={name} />
        </div>
        <h1 className="profile-name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    ) : (
      <button type="button" className="jobs-btn">
        Retry
      </button>
    )
  }
}

export default ProfileDetails
