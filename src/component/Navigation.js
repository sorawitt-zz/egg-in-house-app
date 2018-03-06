import React, {Component} from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types';

import * as routes from '../constants/routes'
import SignOutButton from './SignOut';
import { auth } from '../firebase/index';

const Navigation = (props, { authUser }) => 
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  {
    authUser ? <NavigationAuth /> : <NavigationNonAuth />
  }
  </nav>
  Navigation.contextTypes = {
    authUser: PropTypes.object,
  };

const NavigationAuth = () => 
 <div className="container">
  <ul className="nav navbar-nav">
      <li className="ml-3"><Link to={routes.HOME}>HOME</Link></li>
      <li className="ml-3"><Link to={routes.LIST_APP}>List App</Link></li>
      <li className="ml-3"><Link to={routes.CREATE_NEW_APP}>Create New App</Link></li>
  </ul>
  <ul className="nav navbar-nav navbar-right">
      <SignOutButton />
    </ul>
</div>


const NavigationNonAuth = () => 

<ul className="nav navbar-nav">
   <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
</ul>


 export default Navigation