import React, {Component} from 'react';
import { connect } from "react-redux";

import AppButton from "../UI/Button/Button";
import Modal from '../UI/Modal/Modal';
import * as actions from "../../store/actions";

class Notification extends Component {

        render() {
            let modal;
            if(this.props.show) {
                modal = <Modal show={this.props.show} modalClosed={() => this.props.destroyNotification()}>
                    <div>
                        <p>{this.props.messageText}</p>

                        {this.props.messageButtons.map((btn, index) =>
                            <AppButton
                                key={index}
                                loading={btn.loading}
                                label={btn.text}
                                clicked={btn.callback}
                                variant={btn.variant}
                                type={'button'}/>
                        )}
                    </div>
                </Modal>
            } else {
                modal = null;
            }
            return modal;
        }

}

const mapStateToProps = (state) => {
    return {
        show: state.notificationModal.show,
        messageText: state.notificationModal.text,
        messageButtons: state.notificationModal.buttons
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        destroyNotification: () => dispatch(actions.removeNotification())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
