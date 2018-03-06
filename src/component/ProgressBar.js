import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProgressBar extends React.Component {


//    <div className="progress-bar" role="progressbar" style={{width: this.state.downloadProgress+"%"}}>{'google'}</div>

  render() {
    return (
      <div className="form-group">
      <label className="form-label">{this.props.title}</label>
      <div className="progress">
      <div
      
        className="progress-bar"
        role="Progressbar"
        name={this.props.name}
        aria-valuemin="0"
        aria-valuenow="0"
        aria-valuemax="100"
        style={{width: this.props.downloadProgress+"%"}}  />
    </div>
    </div>
    )
  }

  
}


ProgressBar.propTypes = {  
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  downloadProgress: PropTypes.number.isRequired
  
};

export default ProgressBar;  