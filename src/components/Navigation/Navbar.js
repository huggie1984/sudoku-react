import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import * as actions from '../../store/actions/index';


class NavBar extends Component {

    logoutHandler = () => {
        if(this.props.isPuzzle) {
            const settings = {
                text: 'Have you saved your game?',
                buttons: [
                    {text: 'Save', callback:  this.onSaveProgressHandler, variant: 'success'},
                    {text: 'Quit', callback: this.onLogoutHandler, variant: 'warning'},
                ]
            };
            return this.props.notification(settings);
        }
        this.props.onLogout();
        this.props.onClearPuzzle();
        this.props.history.push('/');
    };

    onSaveProgressHandler = () => {
        const saveData = {
            puzzle: JSON.stringify(this.props.puzzle),
            userId: this.props.userId,
            time: this.props.time,
        };
        this.props.removeNotification();
        return this.props.onSaveAndLogout(saveData, this.props.token);
    };

    onLogoutHandler = () => {
        console.log('called');
        this.props.removeNotification();
        this.props.onLogout();
    };

    render() {
        return (
            <Navbar variant="dark">
                <Link className={'navbar-brand'} to={"/"}>Sudoku</Link>
                <Nav className="mr-auto">
                 { this.props.isAuth && this.props.isPuzzle && <Link className={'nav-link'} to={"/game"}>Game</Link> }
                 { this.props.isAuth && <Link className={'nav-link'} to={"/leader-boards"}>Leader boards</Link> }
                </Nav>
                <Nav className="mr-sm-2">
                    {this.props.isAuth && <Nav.Link onClick={() => this.logoutHandler()}>Logout</Nav.Link>}
                </Nav>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      isAuth: state.auth.token !== null,
      isPuzzle: state.game.puzzle.length > 0,
        puzzle: state.game.puzzle,
        time: state.game.time,
        userId: state.auth.userId,
        token: state.auth.token
    }
};

const mapDispatchToProps = (dispatch) => {
  return {
      logout: () => dispatch(actions.logout()),
      onSaveAndLogout: (data, token) => dispatch(actions.saveGameAndLogout(data, token)),
      notification: (messageSettings) => dispatch(actions.createNotifiactionModal(messageSettings)),
      removeNotification: () => dispatch(actions.removeNotification()),
      onLogout: () => dispatch(actions.logout()),
      onClearPuzzle: () => dispatch(actions.clearPuzzle())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));