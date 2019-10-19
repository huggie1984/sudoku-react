import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Toasts from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import './App.css';
import * as actions from './store/actions/index';
import Auth from './containers/Auth/Auth';
import Home from './containers/Home/Home';
import Game from './containers/Game/Game';
import LeaderBoards from './containers/Leaderboards/Leaderboards';
import NavBar from './components/Navigation/Navbar';
import Notification from "./components/Notification/notification";

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoLogin();
  }

  render() {

    let routes = (
      <Switch>
        <Route path={'/auth'} component={Auth} />
        <Route path={'/'} component={Auth} />
        <Redirect from="*" to={"/"} />
    </Switch>
    );

    if(this.props.isAuth) {
      routes = (
        <Switch>
          <Route path={'/home'} component={Home} />
          <Route path={'/leader-boards'} component={LeaderBoards} />
          {this.props.isPuzzle && <Route path={'/game'} component={Game} />}
          <Route path={'/'} component={Home} />
          <Redirect from="*" to={"/"} />
        </Switch>
      )
    }

    return (
        <BrowserRouter>

            <Toasts />
            <Notification />
            <NavBar/>
            <div className={"container container py-5 px-0"} >
              {routes}
            </div>
        </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
    isPuzzle: state.game.puzzle.length > 0
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoLogin: () => dispatch(actions.checkAuthState())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
  isPuzzle: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  onTryAutoLogin: PropTypes.func.isRequired,
};
