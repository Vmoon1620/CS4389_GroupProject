import * as Actions from '../actions/action_constants'

const register = (state, action) => {
    switch (action.type) {
        case Actions.REQUEST_REGISTER:
            console.log("requested")
            return Object.assign({}, state, {
                disabled: true,
                error: null
            })
        case Actions.REQUEST_REGISTER_SUCCESS:
            console.log("success")
            return Object.assign({}, state, {
                disabled: true,
                error: null
            })
        case Actions.REQUEST_REGISTER_FAILED:
            console.log("failed")
            return Object.assign({}, state, {
                disabled: false,
                error: action.error
            })
        default:
            console.log("default")
            return state = {disabled: false}
    }
}

export default register