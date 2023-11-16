import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import * as Actions from '../actions/action_constants'
import login from './login'
import accounts from './accounts'
import transactions from './transactions'
import register from './registration'

const Message = (state = null, action) => {
  const { type, error } = action
  if (type === Actions.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return error
  }
  return state
}

const rootReducer = combineReducers({
  Message,
  routing,
  login,
  register,
  accounts,
  transactions
})

export default rootReducer