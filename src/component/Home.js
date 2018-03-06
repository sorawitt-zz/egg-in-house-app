import React, { Component } from 'react'
import firebase from 'firebase';
import { auth, db } from '../firebase';
import withAuthorization from './withAuthorization';


class HomePage extends Component {
  constructor(props) {
      super(props)



      this.state = {
          user: ""
      }
      this.getCurrentUser = this.getCurrentUser.bind(this)
      //this.authenticate = this.authenticate.bind(this)
    }

    componentWillMount(){
        console.log("willMount")
        this.getCurrentUser()


    }

    componentDidMount(){
        console.log("didMount")
        this.getCurrentUser()


    }

getCurrentUser() {
    var thisUser = this
    var user = firebase.auth().currentUser;
    let messagesRef = db.onceGetUsers(user.uid).then(function(userResult) {
        thisUser.setState({
            user: userResult.val()
        })
        console.log("user:", userResult.val().level )
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("errorCode", errorCode)
        console.log("errorMsg", errorMessage)

      });
  console.log("message:",messagesRef)
}

render() {
    var userCur = this.state.user
  return (
      <div>
        <h1>home</h1>
          <h5>welcome: {userCur.name}</h5>
          <div>
        <img src={userCur.profileUrl} />
      </div>
      </div>

  )
}

}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);
