import React, { Component } from 'react';
import { IndexLink } from 'react-router'
import { connect } from 'react-redux'
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
        password: '',
        fnameError: '',
        lnameError: '',
        dobError: '',
        addressError: '',
        addrTypeError: '',
        phoneError: '',
        phoneTypeError: '',
        usernameError: '',
        passwordError: '',
    };

    validateField = (name, value) => {
        if (!value || value.length == 0) {
            this.setState({ [name]: "*Required Field" });
            return false;
        } else {
            this.setState({ [name]: null})
            return true;
        }
    }

    validateFields = (fields) => {
        console.log(fields);
        let fnameValid = this.validateField('fnameError', fields.firstName);
        let lnameValid = this.validateField('lnameError', fields.lastName);
        let dobValid = this.validateField('dobError', fields.dateOfBirth);
        let addrValid = this.validateField('addressError', fields.address);
        let addrTypeValid = this.validateField('addrTypeError', fields.addressType);
        let phoneValid = this.validateField('phoneError', fields.phoneNumber);
        let phoneTypeValid = this.validateField('phoneTypeError', fields.phoneType);
        let usernameValid = this.validateField('usernameError', fields.username);
        let passwordValid = this.validateField('passwordError', fields.password);

        return fnameValid && 
               lnameValid &&
               dobValid &&
               addrValid &&
               addrTypeValid &&
               phoneValid &&
               phoneTypeValid &&
               usernameValid &&
               passwordValid;
    }

    handleInputChange = (field) => (event) => {
        this.setState({ [field]: event.target.value });
    };

    handleRegister = () => {
        const { dispatch } = this.props;
        if (this.validateFields(this.state)) {
            console.log('Registration filed:', this.state);
            dispatch(attemptRegister(this.state))
        }
    };

    render() {
        const {disabled, error} = this.props;
        return (
            <div>
                <TextField
                    floatingLabelText="First Name"
                    value={this.state.firstName}
                    onChange={this.handleInputChange('firstName')}
                    errorText={this.state.fnameError}
                /><br />
                <TextField
                    floatingLabelText="Last Name"
                    value={this.state.lastName}
                    onChange={this.handleInputChange('lastName')}
                    errorText={this.state.lnameError}
                /><br />
                <TextField
                    floatingLabelText="Birthday"
                    hintText="yyyy-mm-dd"
                    value={this.state.dateOfBirth}
                    onChange={this.handleInputChange('dateOfBirth')}
                    errorText={this.state.dobError}
                /><br />
                <TextField
                    floatingLabelText="Address"
                    value={this.state.address}
                    onChange={(this.handleInputChange('address'))}
                    errorText={this.state.addressError}
                /><br />
                <SelectField
                    value={this.state.addressType}
                    hintText="Select Address Type"
                    name="Address Type"
                    floatingLabelText="Address Type"
                    onChange={(event, index, value) => this.setState({ ["addressType"]: value })}
                    errorText={this.state.addrTypeError}
                >
                    <MenuItem value="Residential" label="Residential">Residential</MenuItem>
                    <MenuItem value="Commercial" label="Commercial">Commercial</MenuItem>
                </SelectField><br />
                <TextField
                    floatingLabelText="Phone Number"
                    hintText="(xxx)-nnn-nnnn"
                    value={this.state.phoneNumber}
                    onChange={this.handleInputChange('phoneNumber')}
                    errorText={this.state.phoneError}
                /><br />
                <SelectField
                    value={this.state.phoneType}
                    hintText="Select Phone Type"
                    name="Phone Type"
                    floatingLabelText="Phone Type"
                    onChange={(event, index, value) => this.setState({ ["phoneType"]: value })}
                    errorText={this.state.phoneTypeError}
                >
                    <MenuItem value="Home" label="Home">Home</MenuItem>
                    <MenuItem value="Cell" label="Cell">Cell</MenuItem>
                    <MenuItem value="Business" label="Business">Business</MenuItem>
                </SelectField><br />
                <TextField
                    floatingLabelText="Username"
                    value={this.state.username}
                    onChange={this.handleInputChange('username')}
                    errorText={this.state.usernameError}
                /><br />
                <TextField
                    floatingLabelText="Password"
                    value={this.state.password}
                    onChange={this.handleInputChange('password')}
                    errorText={this.state.passwordError}
                /><br />
                <div style={{color: "red"}}>
                <RaisedButton label="Submit" primary={true} onClick={this.handleRegister} disabled={disabled}/><br />
                {error}
                </div>
                <div>
                    Already have an account? <IndexLink to="/">login</IndexLink>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { register } = state;
    console.log(register.error);
    return {
        disabled: register.disabled,
        error: register.error
    }
}

export default connect(mapStateToProps)(RegistrationPage);
