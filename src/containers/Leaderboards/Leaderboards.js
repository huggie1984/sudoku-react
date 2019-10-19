import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import { LeaderBoard } from '../../components/LeaderBoard/LeaderBoard';

class LeaderBoards extends Component {
    //for each of the difficulties render a table
    state = {
        playerData: []
    }

    componentDidMount() {
        const url = 'https://sudoku-19bcc.firebaseio.com/leaderboards.json?auth=' + this.props.token;
        axios.get(url)
        .then( res => {
            const playerData = []
            for(let key in res.data) {
                playerData.push(res.data[key])
            }
            console.log(playerData);
            this.setState({...this.state, playerData})
        })
        .catch( err => {
            console.log(err);
        })
    }

    render () {
        return (
            <LeaderBoard players={this.state.playerData} />
        )
    }
}

const mapStateToProps = state => {
    return{
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(LeaderBoards);

LeaderBoards.propTypes = {
    token: PropTypes.string,
};