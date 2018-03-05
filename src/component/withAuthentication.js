import React from 'react';
import PropTypes from 'prop-types';
import { firebase, db } from '../firebase';


const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    getChildContext() {
      return {
        authUser: this.state.authUser,
      };
    }

    componentDidMount() {
      var thisa = this
      firebase.auth.onAuthStateChanged(authUser => {
          if(authUser) {

          
        db.getUserData(authUser.uid).then(function(usr){
          var userLevel = usr.val().level
          console.log("user db",usr.val().level)
          if (userLevel == 'developer'){

        thisa.setState(() => ({ authUser }))
        
          }
        })
      }else {
        thisa.setState(() => ({ authUser: null}))
      }

      });
    }

    render() {
      return (
        <Component />
      );
    }
  }

  WithAuthentication.childContextTypes = {
    authUser: PropTypes.object,
  };

  return WithAuthentication;
}

export default withAuthentication;