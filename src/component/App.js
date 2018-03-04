import React, { Component } from 'react';
import { 
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import Navigation from './Navigation'
import SignInPage from './SignIn'
import HomePage from './Home'
import CreateNewAppPage from './CreateNewApp'
import ListAppPage from './ListApp'

import * as routes from '../constants/routes'
import ListApp from './ListApp';

import { firebase } from '../firebase';
//import withAuthentication from './withAuthentication';

import withAuthentication from './withAuthentication';

const App = () =>
  <Router>
    <div>
    <Navigation/>
      <hr/>
        <Route exact path={routes.SIGN_IN} component={() => <SignInPage/> } />
        <Route exact path={routes.HOME} component={() => <HomePage/> } />
        <Route exact path={routes.LIST_APP} component={() => <ListAppPage/> } />
        <Route exact path={routes.CREATE_NEW_APP} component={() => <CreateNewAppPage/> } />
      </div>
    </Router>
export default withAuthentication(App);

// class App extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       authUser: null,
//     };
//   }

//   componentDidMount() {
//     firebase.auth.onAuthStateChanged(authUser => {
//       authUser
//         ? this.setState(() => ({ authUser }))
//         : this.setState(() => ({ authUser: null }));
//     });
//   }

//   render() {
//     return (
//       <Router>
//         <div>
//           <Navigation authUser={this.state.authUser} />

//           <hr/>
//           <Route exact path={routes.SIGN_IN} component={() => <SignInPage/> } />
//           <Route exact path={routes.HOME} component={() => <HomePage/> } />
//           <Route exact path={routes.LIST_APP} component={() => <ListAppPage/> } />
//           <Route exact path={routes.CREATE_NEW_APP} component={() => <CreateNewAppPage/> } />
//         </div>
//       </Router>
//     )
//     }
//   }
 // export default App;
//     );
//   }




// const App = () =>
//   <Router>
//     <div>
//     <Navigation authUser={this.state.authUser} />
//       <hr/>
//         <Route exact path={routes.SIGN_IN} component={() => <SignInPage/> } />
//         <Route exact path={routes.HOME} component={() => <HomePage/> } />
//         <Route exact path={routes.LIST_APP} component={() => <ListAppPage/> } />
//         <Route exact path={routes.CREATE_NEW_APP} component={() => <CreateNewAppPage/> } />

//       </div>
//     </Router>

