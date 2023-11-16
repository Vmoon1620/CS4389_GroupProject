import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui'; // Import Material-UI components for "0.17.1"
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { fetchProfile } from '../actions'

class ProfilePage extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchProfile())
  }

  state = {
    firstNameField: '',
    lastNameField: '',
    addressField: '',
    phoneNumberField: '',
  };

  handleInputChange = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };

  handleSaveProfile = () => {
    // Logic to save profile information
    console.log('Profile Saved:', this.state);
  };

  render() {
    const { firstName, lastName, address, phoneNumber } = this.props
    return (
      <div>
        <TextField
          floatingLabelText="First Name"
          value={firstName}
          onChange={this.handleInputChange('firstNameField')}
        /><br />
        <TextField
          floatingLabelText="Last Name"
          value={lastName}
          onChange={this.handleInputChange('lastNameField')}
        /><br />
        <TextField
          floatingLabelText="Address"
          value={address}
          onChange={this.handleInputChange('addressField')}
        /><br />
        <TextField
          floatingLabelText="Phone Number"
          value={phoneNumber}
          onChange={this.handleInputChange('phoneNumberField')}
        /><br />
        <RaisedButton label="Save Profile" primary={true} onClick={this.handleSaveProfile} />
      </div>
    );
  }
}

const mapStateToProps = (fields) => {
  const { profile } = fields
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    address: profile.address,
    phoneNumber: profile.phoneNumber
  }
}

export default connect(mapStateToProps)(ProfilePage) 
