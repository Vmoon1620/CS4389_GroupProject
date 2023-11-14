import React, { Component } from 'react';
import { browserHistory, IndexLink } from 'react-router'
import { TextField, RaisedButton, SelectField, MenuItem } from 'material-ui'; // Import Material-UI components for "0.17.1"
import { attemptRegister } from '../actions'

class RegistrationPage extends Component {
    state = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
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

    handleRegister = () => {
        console.log('Registration filed:', this.state);
        attemptRegister(this.state)
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
                    floatingLabelText="Birthday"
                    hintText="mm/dd/yyyy"
                    value={this.state.dateOfBirth}
                    onChange={this.handleInputChange('dateOfBirth')}
                /><br />
                <TextField
                    floatingLabelText="Address"
                    value={this.state.address}
                    onChange={(this.handleInputChange('address'))}
                /><br />
                <SelectField
                    value={this.state.addressType}
                    hintText="Select Address Type"
                    name="Address Type"
                    floatingLabelText="Address Type"
                    onChange={(event, index, value) => this.setState({ ["addressType"]: value })}
                >
                    <MenuItem value="Residential" label="Residential">Residential</MenuItem>
                    <MenuItem value="Commercial" label="Commercial">Commercial</MenuItem>
                </SelectField><br />
                <TextField
                    floatingLabelText="Phone Number"
                    hintText="(xxx)-nnn-nnnn"
                    value={this.state.phoneNumber}
                    onChange={this.handleInputChange('phoneNumber')}
                /><br />
                <SelectField
                    value={this.state.phoneType}
                    hintText="Select Phone Type"
                    name="Phone Type"
                    floatingLabelText="Phone Type"
                    onChange={(event, index, value) => this.setState({ ["phoneType"]: value })}
                >
                    <MenuItem value="Home" label="Home">Home</MenuItem>
                    <MenuItem value="Cell" label="Cell">Cell</MenuItem>
                    <MenuItem value="Business" label="Business">Business</MenuItem>
                </SelectField><br />
                <TextField
                    floatingLabelText="Username"
                    value={this.state.username}
                    onChange={this.handleInputChange('username')}
                /><br />
                <TextField
                    floatingLabelText="Password"
                    value={this.state.password}
                    onChange={this.handleInputChange('password')}
                /><br />
                <RaisedButton label="Register User" primary={true} onClick={this.handleRegister} /><br />
                <div>
                    Already have an account? <IndexLink to="/">login</IndexLink>
                </div>
            </div>
        );
    }
}

export default RegistrationPage;
