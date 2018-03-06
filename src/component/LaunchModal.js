import React, { Component } from 'react';
import PropTypes from 'prop-types';


class LaunchModal extends React.Component {

    render() {
        return(
            <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">{this.props.title}</h4>
                <p>{this.props.msg}</p>
            </div>
        )
    }

}

LaunchModal.propTypes = {
    title: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired
}

export default LaunchModal




