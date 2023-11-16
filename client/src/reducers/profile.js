import * as Actions from '../actions/action_constants'

const profile = (state, action) => {
    switch (action.type) {
        case Actions.REQUEST_PROFILE:
            return Object.assign({}, state, {
                firstName: state.firstName,
                lastName: state.lastName,
                address: state.address,
                phoneNumber: state.phoneNumber
            })
        case Actions.REQUEST_PROFILE_SUCCESS:
            return Object.assign({}, state, {
                firstName: action.response.firstName,
                lastName: action.response.lastName,
                address: action.response.address,
                phoneNumber: action.response.phoneNumber
            })
        case Actions.REQUEST_PROFILE_FAILED:
            return Object.assign({}, state, {
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: ''
            })
        default:
            return state = {firstName: '', lastName: '', address: '', phoneNumber: ''}
    }
}

export default profile