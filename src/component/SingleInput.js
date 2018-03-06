import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SingleInput extends React.Component {


  render() {
    return (
      <div className="form-group">
      <label className="form-label">{this.props.title}</label>
      <input
      
        className="form-control"
        name={this.props.name}
        type={this.props.inputType}
        onChange={this.props.controlFunc}
        placeholder={this.props.placeholder} 
        required={this.props.required}
        />
    </div>
    )
  }

  
}


SingleInput.propTypes = {  
  inputType: PropTypes.oneOf(['text', 'file']).isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.string.isRequired
};

export default SingleInput;  