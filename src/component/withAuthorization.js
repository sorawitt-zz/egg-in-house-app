import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';


import firebase from 'firebase'
import { db, fbProvider, auth } from '../firebase';
import * as routes from '../constants/routes';

const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {

      firebase.auth().onAuthStateChanged(authUser => {

        if(authUser) {

        console.log("user log", authUser.uid)
        db.getUserData(authUser.uid).then(function(usr){
          var userLevel = usr.val().level
          console.log("user db",usr.val().level)
          if (userLevel == 'developer'){
            if (!authCondition(authUser)) {
              this.props.history.push(routes.SIGN_IN);
            }
          }
        })
      }else {
        if (!authCondition(authUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
      }
      });

    }

    render() {
      return this.context.authUser ? <Component /> : null;
    }
  }

  WithAuthorization.contextTypes = {
    authUser: PropTypes.object,
  };

  return withRouter(WithAuthorization);
}

export default withAuthorization;
