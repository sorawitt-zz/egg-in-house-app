import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref('users/${id}').set({
    username,
    email,
  });

export const getUserData = (uid) =>
  db.ref(`Users/${uid}`).once('value')


  export const getApplication = () => 
  db.ref('Applications').once('value')

export const onceGetUsers = (uid) =>
  db.ref(`Users/${uid}`).once('value')

// Other Entity APIs ...