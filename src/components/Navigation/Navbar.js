import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import * as actions from '../../store/actions/index';
import classes from './Navbar.module.css'

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
        this.props.removeNotification();
        this.props.onLogout();
    };

    render() {
        return (
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
            <Navbar.Brand className={classes.brand} to={"/home"}>Sudoku</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    { this.props.isAuth && <NavLink activeClassName={classes.activeLink} className={'nav-link'} to={"/home"}>Home</NavLink> }
                    { this.props.isAuth && this.props.isPuzzle && <NavLink activeClassName={classes.activeLink} className={'nav-link'} to={"/game"}>Game</NavLink> }
                    { this.props.isAuth && <NavLink activeClassName={classes.activeLink} className={'nav-link'} to={"/leader-boards"}>Leader boards</NavLink> }
                </Nav>
                <Nav className="mr-sm-2">
                    {this.props.isAuth && <Nav.Link onClick={() => this.logoutHandler()}>Logout</Nav.Link>}
                </Nav>
            </Navbar.Collapse>
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
