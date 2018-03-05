import React from 'react';
import withAuthorization from './withAuthorization';
const ListAppPage = () =>
  <div>
    <h1>ListAppPage Page</h1>
  </div>
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ListAppPage);
