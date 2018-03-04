import { auth, fbProvider } from './firebase';


export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const doSignInWithFacebook = () => 
    auth.signInWithPopup(fbProvider);

// Sign out
export const doSignOut = () => {
  auth.signOut();
  console.log("sign out")
}
  
   