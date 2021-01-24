import React from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';

import { Container } from '@material-ui/core';
import Nav from './components/Nav';
import routes from './routes';
import { getChannelFromPath } from './utils';
import ErrorPage from './pages/ErrorPage';

const ChannelRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();
  const channel = getChannelFromPath(location.pathname);
  document.title = rest.label + (channel ? ' - ' + channel : '');
  return (
    <Route
      {...rest}
      render={routeProps => <Component {...routeProps} channel={channel} />}
    />
  );
};

const App = () => {

  return (
    <BrowserRouter>
      <Nav />
      <br />
      <Container>
        <Switch>
          {routes.map(route => <ChannelRoute key={route.path} {...route} />)}
          <Route path="*"><ErrorPage /></Route>
        </Switch>
      </Container>
    </BrowserRouter>
  )
}

export default App;
