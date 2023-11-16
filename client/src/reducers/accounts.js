import * as Actions from '../actions/action_constants'

let accountSelection = {
    id: '',
    name: '',
    balance: 0
}

export const getAccount = () => {
    return accountSelection;
}

export const setAccount = ({id, name, balance}) => {
    accountSelection.id = id;
    accountSelection.name = name;
    accountSelection.balance = balance;
}

const accounts = (state = {
    loading: false,
    showTransferFundsButton: false,
    items: []
}, action) => {
    switch (action.type) {
        case Actions.REQUEST_ACCOUNTS:
            return Object.assign({}, state, {
                loading: true
            })
        case Actions.RECEIVE_ACCOUNTS:
            return Object.assign({}, state, {
                loading: false,
                items: action.response,
                showTransferFundsButton: Array.isArray(action.response) && action.response.length > 1
            })
        case Actions.SHOW_NEW_ACCOUNTS_FORM:
            return Object.assign({}, state, {
                showNewAccountForm: true
            })
        case Actions.HIDE_NEW_ACCOUNTS_FORM:
            return Object.assign({}, state, {
                showNewAccountForm: false,
                nameValidationMessage: null,
                openingBalanceValidationMessage: null
            })
        case Actions.CREATE_ACCOUNT_VALIDATION_FAILURE:
            return Object.assign({}, state, {
                nameValidationMessage: action.validationResult.nameValidationMessage,
                openingBalanceValidationMessage: action.validationResult.openingBalanceValidationMessage
            })
        case Actions.CREATE_ACCOUNT_SUCCESS:
            const items = [...state.items, action.response];
            return Object.assign({}, state, {
                items,
                showNewAccountForm: false,
                showTransferFundsButton: items.length > 1
            })
        case Actions.SHOW_TRANSFER_FUNDS:
            return Object.assign({}, state, {
                showTransferFunds: true
            })
        case Actions.HIDE_TRANSFER_FUNDS:
            return Object.assign({}, state, {
                showTransferFunds: false,
                fromAccountValidationMessage: null,
                toAccountValidationMessage: null,
                transferAmountValidationMessage: null
            })
        case Actions.TRANSFER_FUNDS_VALIDATION_FAILURE:
            return Object.assign({}, state, {
                fromAccountValidationMessage: action.validationResult.fromAccountValidationMessage,
                toAccountValidationMessage: action.validationResult.toAccountValidationMessage,
                transferAmountValidationMessage: action.validationResult.transferAmountValidationMessage
            })
        case Actions.UPDATE_ACCOUNT_BALANCE_SUCCESS:
            let index = state.items.indexOf(state.items.find(a => a.id === action.response.id))
            let account = Object.assign({}, state.items[index], { balance: action.response.balance })
            let result = Object.assign({}, state, {
                items: [
                    ...state.items.slice(0, index),
                    account,
                    ...state.items.slice(index + 1)
                ]
            })
            return result
        default:
            return state
    }
}

export default accounts