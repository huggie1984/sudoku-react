import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import { formatTime } from '../../scripts/utils';

export const LeaderBoard = (props) => {

    let tableData = null;
    if (props.players) {
        tableData = props.players.map((player, i) => (
                <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{player.userName}</td>
                    <td>{formatTime(player.time)}</td>
                    <td>{player.difficulty}</td>
                </tr>
            ));
    }


    return (
        <div className={'table-responsive'}>
            <Table>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Time</th>
                        <th scope="col">Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData}
                </tbody>
            </Table>
        </div>
    )
}

LeaderBoard.propTypes = {
    players: PropTypes.array.isRequired
};