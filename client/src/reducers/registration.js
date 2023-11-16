import * as Actions from '../actions/action_constants'

const register = (state, action) => {
    switch (action.type) {
        case Actions.REQUEST_REGISTER:
            return Object.assign({}, state, {
                disabled: true,
                error: null
            })
        case Actions.REQUEST_REGISTER_SUCCESS:
            return Object.assign({}, state, {
                disabled: true,
                error: null
            })
        case Actions.REQUEST_REGISTER_FAILED:
            return Object.assign({}, state, {
                disabled: false,
                error: action.error
            })
        default:
            return state = {disabled: false}
    }
}

export default register