import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui'; // Import Material-UI components for "0.17.1"

class ProfilePage extends Component {
  state = {
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  };

  handleInputChange = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };

  handleSaveProfile = () => {
    // Logic to save profile information
    console.log('Profile Saved:', this.state);
  };

  render() {
    return (
      <div>
        <TextField
          floatingLabelText="First Name"
          value={this.state.firstName}
          onChange={this.handleInputChange('firstName')}
        /><br />
        <TextField
          floatingLabelText="Last Name"
          value={this.state.lastName}
          onChange={this.handleInputChange('lastName')}
        /><br />
        <TextField
          floatingLabelText="Address"
          value={this.state.address}
          onChange={this.handleInputChange('address')}
        /><br />
        <TextField
          floatingLabelText="Phone Number"
          value={this.state.phoneNumber}
          onChange={this.handleInputChange('phoneNumber')}
        /><br />
        <RaisedButton label="Save Profile" primary={true} onClick={this.handleSaveProfile} />
      </div>
    );
  }
}

export default ProfilePage;
