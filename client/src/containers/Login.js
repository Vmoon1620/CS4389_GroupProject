import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { attemptLogin } from '../actions'

class Login extends Component {
    onLoginClick() {
        const { dispatch } = this.props

        let username = this.refs.username.input.value
        let password = this.refs.password.input.value

        dispatch(attemptLogin({
            username,
            password
        }))
    }

    render() {
        const { usernameValidationMessage, passwordValidationMessage, loginValidationMessage } = this.props
        return (
            <div>
                <h3>Secure Login</h3>
                <h4>
                    Enter your username and password <span style={{color: 'grey', fontSize: 'smaller'}}></span>
                </h4>
                
                <div>
                    <TextField
                        hintText="Username"
                        ref="username"
                        errorText={usernameValidationMessage}
                    />
                </div>
                <div>
                    <TextField
                        hintText="Password"
                        floatingLabelText="Password"
                        type="password"
                        ref="password"
                        errorText={passwordValidationMessage}
                    />
                </div>
                <RaisedButton 
                    label="Login" 
                    primary={true} 
                    onClick={() => this.onLoginClick()}
                    errorText={loginValidationMessage}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { login } = state
    return {
        usernameValidationMessage: login.usernameValidationMessage,
        passwordValidationMessage: login.passwordValidationMessage,
        loginValidationMessage: login.loginValidationMessage
    }
}

export default connect(mapStateToProps)(Login) 