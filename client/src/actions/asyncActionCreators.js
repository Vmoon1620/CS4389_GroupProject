import { browserHistory } from 'react-router'
import {
    requestLogin,
    loginSuccessful,
    loginFailed,
    requestLogout,
    logoutSuccessful,
    invalidCreateAccountRequest,
    hideTransferFunds,
    invalidTransferFundsRequest,
    registerFailed,
    registerSuccess,
    requestRegister
} from './actionCreators'

import * as actionTypes from './action_constants'

import formatMoney from '../formatMoney'
import { CALL_API, getFormConfig } from '../middleware/api'

const submitForm = (url, form) => {
    let config = getFormConfig('POST', form, 'application/json')
    return fetch(url, config).then((response) => {
        if (response.status !== 200) {
            console.log(response)
            return false;
        }
        return response.json().then(data => ({
            data: data,
            status: response.status
        })).then(res => { return res.data['value'] === 'SUCCESS' });
    });
}

const constructLoginResult = (credentials) => {

    let result = {
        isValid: true,
        usernameValidationMessage: null,
        passwordValidationMessage: null,
        loginValidationMessage: null
    }

    if (!credentials.username) {
        result.usernameValidationMessage = 'Username is required'
        result.isValid = false;
    }
    if (!credentials.password) {
        result.passwordValidationMessage = 'Password is required'
        result.isValid = false;
    }
    return result
}

export const attemptLogin = (credentials) => {
    return (dispatch) => {

        let result = constructLoginResult(credentials);
        if (result.isValid) {
            try {
                dispatch(requestLogin(credentials));
                
                let form = new FormData()
                form.append("_username", credentials.username)
                form.append("_password", credentials.password)

                submitForm("/api/login", form).then(isSuccessful => {
                    result.isValid = isSuccessful;
                    if (!result.isValid) {
                        result.loginValidationMessage = "Unauthorized. Login Failed.";
                        return Promise.resolve(dispatch(loginFailed(result)));
                    }
                    browserHistory.push('/accounts');
                    return Promise.resolve(dispatch(loginSuccessful()));
                });
            } catch(e) {
                console.log(e);
                result.loginValidationMessage = "An error occurred.";
                return Promise.resolve(dispatch(loginFailed(result)));
            }
        } else {
            return Promise.resolve(dispatch(loginFailed(result)));
        }

        // return an empty promise while result is still pending
        return Promise.resolve();
    }
}

export const attemptRegister = (registration) => {
    return (dispatch) => {
        let form = new FormData()
        form.append("_fname", registration.firstName)
        form.append("_lname", registration.lastName)
        form.append("_dob", registration.dateOfBirth)
        form.append("_addr", registration.address)
        form.append("_addr_type", registration.addressType)
        form.append("_phone", registration.phoneNumber)
        form.append("_phone_type", registration.phoneType)
        form.append("_username", registration.username)
        form.append("_password", registration.password)

        dispatch(requestRegister(registration));
        submitForm("/api/register", form).then(isSuccessful => {
            if (isSuccessful) {
                browserHistory.push('/');
                return Promise.resolve(dispatch(registerSuccess()));
            }
            return Promise.resolve(dispatch(registerFailed("Registration Failed.")));
        });
        return Promise.resolve();
    }
}

export const attemptLogout = () => {
    return (dispatch) => {
        dispatch(requestLogout())
        let config = getFormConfig('POST', null)
        fetch('/api/logout', config).then((response) => {
            dispatch(logoutSuccessful())
            browserHistory.push('/')
        }).catch(e => {
            console.log(e)
        })
    }
}

export const fetchAccounts = () => ({
    [CALL_API]: {
        types: [actionTypes.REQUEST_ACCOUNTS, actionTypes.RECEIVE_ACCOUNTS, actionTypes.REQUEST_ACCOUNTS_FAILURE],
        endpoint: '/api/accounts'
    }
})

export const fetchTransactions = accountId => ({
    [CALL_API]: {
        types: ['REQUEST_TRANSACTIONS', 'RECEIVE_TRANSACTIONS', 'REQUEST_TRANSACTIONS_FAILURE'],
        endpoint: `api/transactions?accountId=${accountId}`
    }
})

const validateCreateAccountRequest = (name, openingBalance, existingAccounts) => {
    let result = {
        isValid: true,
        nameValidationMessage: null,
        openingBalanceValidationMessage: null
    }

    if (!name) {
        result.isValid = false;
        result.nameValidationMessage = 'Account Name is required'
    }

    if (existingAccounts.find(account => account.name.toLowerCase() === name.toLowerCase())) {
        result.isValid = false;
        result.nameValidationMessage = `Account Name ${name} already exists!`
    }

    if (typeof openingBalance === 'string' && openingBalance.trim().length === 0) {
        result.isValid = false;
        result.openingBalanceValidationMessage = 'Opening Balance is required'
    } else {
        openingBalance = parseFloat(openingBalance)
        if (Number.isNaN(openingBalance)) {
            result.isValid = false;
            result.openingBalanceValidationMessage = 'Opening Balance must be a number'

        } else if (openingBalance < 0.01) {
            result.isValid = false;
            result.openingBalanceValidationMessage = `Opening Balance cannot be less than ${formatMoney(0.01)}`
        } else if (openingBalance > 1000.00) {
            result.isValid = false;
            result.openingBalanceValidationMessage = `Jeez, I know this is a fake app, but we can't give out more than ${formatMoney(1000.00)}`
        }
    }

    return result
}

const submitCreateAccountRequest = (name, openingBalance) => ({
    [CALL_API]: {
        types: [actionTypes.CREATE_ACCOUNT_REQUEST, actionTypes.CREATE_ACCOUNT_SUCCESS, actionTypes.CREATE_ACCOUNT_FAILED],
        endpoint: 'api/accounts',
        method: 'POST',
        data: { name, balance: openingBalance }
    }
})

export const createAccount = (name, openingBalance) => {
    return (dispatch, getState) => {
        const { accounts } = getState()

        let validationResult = validateCreateAccountRequest(name, openingBalance, accounts.items || [])

        if (!validationResult.isValid) {
            return Promise.resolve(dispatch(invalidCreateAccountRequest(validationResult)))
        }

        name = name.trim()

        if (typeof openingBalance === 'string') {
            openingBalance = parseFloat(openingBalance.trim())
        }

        dispatch(submitCreateAccountRequest(name, openingBalance))
    }
}

const postTransaction = (transaction_type, amount, accountId) => ({
    [CALL_API]: {
        types: [actionTypes.CREATE_TRANSACTION_REQUEST, actionTypes.CREATE_TRANSACTION_SUCCESS, actionTypes.CREATE_TRANSACTION_FAILED],
        endpoint: 'api/transactions',
        method: 'POST',
        data: { date: new Date(), transaction_type, amount, accountId }
    }
})

const updateAccountBalance = (accountId, newBalance) => ({
    [CALL_API]: {
        types: [actionTypes.UPDATE_ACCOUNT_BALANCE_REQUEST, actionTypes.UPDATE_ACCOUNT_BALANCE_SUCCESS, actionTypes.UPDATE_ACCOUNT_BALANCE_FAILED],
        endpoint: `/accounts/${accountId}`,
        method: 'PATCH',
        data: { balance: newBalance }
    }
})

const creditAccount = (account, amount) => {
    const newBalance = (account.balance + amount);
    return updateAccountBalance(account.id, newBalance);
}

const debitAccount = (account, amount) => {
    const newBalance = account.balance - amount;
    return updateAccountBalance(account.id, newBalance);
}

const validateTransferFundsRequest = (fromAccount, toAccount, transferAmount) => {
    let result = {
        isValid: true,
        fromAccountValidationMessage: null,
        toAccountValidationMessage: null,
        transferAmountValidationMessage: null
    }

    if (!fromAccount) {
        result.isValid = false;
        result.fromAccountValidationMessage = 'From Account is required'
    }

    if (!toAccount) {
        result.isValid = false;
        result.toAccountValidationMessage = 'To Account is required'
    }

    if (typeof transferAmount === 'string' && transferAmount.trim().length === 0) {
        result.isValid = false;
        result.transferAmountValidationMessage = 'Transfer Amount is required'
    } else {
        transferAmount = parseFloat(transferAmount)
        if (Number.isNaN(transferAmount)) {
            result.isValid = false;
            result.transferAmountValidationMessage = 'Transfer Amount must be a number'
        } else if (transferAmount < 0.01) {
            result.isValid = false;
            result.transferAmountValidationMessage = `Transfer Amount cannot be less that ${formatMoney(0.01)}`
        } else if (fromAccount && transferAmount > fromAccount.balance) {
            result.isValid = false;
            result.transferAmountValidationMessage = `Insufficent funds in account ${fromAccount.name}.  You can transfer up to ${formatMoney(fromAccount.balance)}`
        }
    }

    if (result.isValid) {
        if (toAccount.id === fromAccount.id) {
            result.isValid = false
            result.toAccountValidationMessage = 'You cannot transfer funds to the same account'
        }
    }

    return result
}

export const transferFunds = (fromAccount, toAccount, transferAmount) => {
    return dispatch => {
        let validationResult = validateTransferFundsRequest(fromAccount, toAccount, transferAmount)

        if (!validationResult.isValid) {
            return Promise.resolve(dispatch(invalidTransferFundsRequest(validationResult)))
        }
        transferAmount = parseFloat(transferAmount)

        dispatch(postTransaction(`Transfer to ${toAccount.name}`, transferAmount, fromAccount.id))

        dispatch(debitAccount(fromAccount, transferAmount))

        dispatch(postTransaction(`Transfer from ${fromAccount.name}`, transferAmount, toAccount.id))

        dispatch(creditAccount(toAccount, transferAmount))

        dispatch(hideTransferFunds())
    }
}
