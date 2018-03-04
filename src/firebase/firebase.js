import * as firebase from 'firebase';

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyDR3vFkRx8HRc3OkT4y-zj8T2SQFfjfvfw",
    authDomain: "egginhouseapp-d59c9.firebaseapp.com",
    databaseURL: "https://egginhouseapp-d59c9.firebaseio.com",
    projectId: "egginhouseapp-d59c9",
    storageBucket: "egginhouseapp-d59c9.appspot.com",
    messagingSenderId: "28672955655"
  };

//   const devConfig = {
//       apiKey: "AIzaSyAV5XT13NWqyFvZ3rPIM9I9AfR-Ybvo-dQ",
//       authDomain: "egg-in-house-app-react.firebaseapp.com",
//       databaseURL: "https://egg-in-house-app-react.firebaseio.com",
//       projectId: "egg-in-house-app-react",
//       storageBucket: "",
//       messagingSenderId: "173862977081"
//     };

    //const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
 
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  const db = firebase.database();
  const auth = firebase.auth();

  export { db, fbProvider, auth };

