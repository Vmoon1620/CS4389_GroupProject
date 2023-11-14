import React, { Component } from 'react';
import { TextField, RaisedButton, SelectField } from 'material-ui'; // Import Material-UI components for "0.17.1"

class RegistrationPage extends Component {
    state = {
        firstName: '',
        lastName: '',
        address: '',
        addressType: '',
        phoneNumber: '',
        phoneType: '',
        username: '',
        password: ''
    };

    handleInputChange = (field) => (event) => {
        this.setState({ [field]: event.target.value });
    };

    handleSaveProfile = () => {
        console.log('Registration filed:', this.state);
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
                <SelectField
                    name="Address Type"
                    floatingLabelText="Address Type"
                    hintText="Select address type"
                    onChange={this.handleInputChange('addressType')}
                /><br />
                <TextField
                    floatingLabelText="Phone Number"
                    value={this.state.phoneNumber}
                    onChange={this.handleInputChange('phoneNumber')}
                /><br />
                <SelectField
                    name="Phone Type"
                    floatingLabelText="Phone Type"
                    hintText="Select phone type"
                    onChange={this.handleInputChange('phone_type')}
                /><br />
                <RaisedButton label="Register User" primary={true} onClick={this.handleSaveProfile} />
            </div>
        );
    }
}

export default RegistrationPage;
