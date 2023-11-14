import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import Home from './containers/Home'
import AccountsPage from './containers/AccountsPage'
import ProfilePage from './containers/ProfilePage'
import TransactionsPage from './containers/TransactionsPage'
import RegistrationPage from './containers/RegistrationPage'

export default
  <Route path="/" component={App}>
  <IndexRoute component={Home} />
  <Route path="/accounts" component={AccountsPage} />
  <Route path="/profile" component={ProfilePage} />
  <Route path="/accounts/:accountId/transactions" component={TransactionsPage} />
  <Route path="/register" component={RegistrationPage} />
  </Route>
