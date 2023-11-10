import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'; // Import getMuiTheme to customize the theme
import Root from './containers/Root';
import configureStore from './store/configureStore';

injectTapEventPlugin();

// Create a custom theme with your desired color palette
const customTheme = getMuiTheme({
  palette: {
    primary1Color: '#800080', // Purple color
    
  },
});

const conf_store = configureStore();
const store_history = syncHistoryWithStore(browserHistory, conf_store);

render(
  <MuiThemeProvider muiTheme={customTheme}>
    <Root store={conf_store} history={store_history} />
  </MuiThemeProvider>,
  document.getElementById('root')
);
