import * as Actions from '../actions/action_constants'
const transactions = (state = {
  loading: false,
  items: []
}, action) => {
  switch (action.type) {
    case Actions.REQUEST_TRANSACTIONS:
      return Object.assign({}, state, {
        loading: true
      })
    case Actions.RECEIVE_TRANSACTIONS:
      return Object.assign({}, state, {
        loading: false,
        items: action.response
      })
    default:
      return state
  }
}
export default transactions