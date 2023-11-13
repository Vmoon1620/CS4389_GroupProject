import { browserHistory } from 'react-router'
import {
    requestLogin,
    loginSuccessful,
    loginFailed,
    requestLogout,
    logoutSuccessful,
    invalidCreateAccountRequest,
    hideTransferFunds,
    invalidTransferFundsRequest
} from './actionCreators'

import * as actionTypes from './action_constants'

import formatMoney from '../formatMoney'
import { CALL_API, getFormConfig } from '../middleware/api'

const tryLogin = (credentials) => {
    let formdata = new FormData()
    formdata.append("_username", credentials.username)
    formdata.append("_password", credentials.password)

    let config = getFormConfig('POST', formdata, 'application/json')
    return fetch("/api/login", config).then((response) => {
        return response.json().then(data => ({
            data: data,
            status: response.status
        })).then(res => { return res.data['login'] === 'SUCCESS' });
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
                tryLogin(credentials).then(isSuccessful => {
                    result.isValid = isSuccessful;

                    if (!result.isValid) {
                        result.loginValidationMessage = "Unauthorized. Login Failed.";
                        return Promise.resolve(dispatch(loginFailed(result)));
                    }
            
                    dispatch(requestLogin(credentials));
            
                    dispatch(loginSuccessful());
                    browserHistory.push('/accounts');
                    return Promise.resolve() ;
                });
            } catch(e) {
                console.log(e);
                result.loginValidationMessage = "An error occurred.";
                return Promise.resolve(dispatch(loginFailed(result)));
            }
        }
        return Promise.resolve(dispatch(loginFailed(result)));
    }
}

export const attemptLogout = () => {
    return (dispatch) => {
        dispatch(requestLogout())
        dispatch(logoutSuccessful())
        browserHistory.push('/')
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
