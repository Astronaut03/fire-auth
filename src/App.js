
import './App.css';
import * as firebase from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from './firebase.Config';
import { getAuth, signInWithPopup} from "firebase/auth";
import { useState } from 'react';
import { signOut } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";


firebase.initializeApp(firebaseConfig);

function App() {
  const[newUser, setNewUser] = useState(false);

  const [user, setUser] = useState({
    isSignedIn: false,
   
    name:'',
    email:'',
    password:'',
    photo:'',
    error:'',
    success: false
  })

const googleProvider =  new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
const handleSignIn = () => {
  const auth = getAuth();
  signInWithPopup(auth, googleProvider)
  .then((res) => {
    const {displayName, email, photoURL} = res.user;
    const signedInUser ={
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
    };
    setUser(signedInUser); 
})
  .catch((error) => {
    console.log(error.code); 
    console.log(error.message);
  })
}

const handleFbSignIn =() =>{
const auth = getAuth();
signInWithPopup(auth, fbProvider)
  .then((res) => {
    // The signed-in user info.
    const user = res.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    // const credential = FacebookAuthProvider.credentialFromResult(result);
    // const accessToken = credential.accessToken;

    console.log('fb user after sign in', user);
  })
  .catch((error) => {
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // The email of the user's account used.
    // const email = error.email;
    // The AuthCredential type that was used.
    // const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });

}


const handleSignOut = () =>{

  const auth = getAuth();
  signOut(auth)
  .then((res) => {
  const signedOutUser ={
    isSignedIn: false,
    name:'',
    email:'',
    photo:''
  }
  setUser(signedOutUser);
})
.catch((error) => {
  
});
}


const handleBlur =(e) =>{
let isFormValid = true;
//console.log(e.target.name, e.target.value);
if(e.target.name === 'email'){
isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
  // const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
  // console.log(isEmailValid)
}
if (e.target.name === 'password'){
  const isPasswordValid = e.target.value.length > 6;
  const passwordHasNumber = /\d{1}/.test(e.target.value);
  isFormValid = isPasswordValid && passwordHasNumber;
}
if (isFormValid){
  const newUserInfo = {...user};
  newUserInfo[e.target.name] = e.target.value;
  setUser(newUserInfo);
  
}
}
const handleSubmit =(e) =>{
// console.log(user.email, user.password);

 if(newUser && user.email && user.password){


  const auth = getAuth();
  createUserWithEmailAndPassword(auth, user.email, user.password)
    .then((res) => {
      // Signed in 
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo);
      // const user = userCredential.user;
      // console.log(user);
      updateUserName(user.name);
    })
    .catch((error) => {
      const newUserInfo ={...user};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      setUser(newUserInfo);

      // const errorCode = error.code;
      // const errorMessage = error.message;
      // console.log(errorCode, errorMessage);
    });
 }

if (!newUser && user.email && user.password){

  const auth = getAuth();
  signInWithEmailAndPassword(auth, user.email, user.password)
  .then((res) => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log('sign in user info', res.user);
  })
  .catch((error) => {
    const newUserInfo ={...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
}

e.preventDefault();
}

const updateUserName = name =>{

  const auth = getAuth();
  
  updateProfile(auth.currentUser, {
    displayName: name
  }).then(() => {
    // Profile updated!
    console.log('user name update successfully');
  }).catch((error) => {
    // An error occurred
    console.log(error);
  });

}

  return (
    <div className="App">
    {
      user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
      <button onClick={handleSignIn}>Sign in</button>
    }
    <br />
    <button onClick ={handleFbSignIn}>login in using Facebook</button>
    
      {
        user.isSignedIn && <div>
          <p>Welcome , {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

    
    <h1> Our Own Authentication</h1>
    {/* <p>User Name: {user.name}</p>
    <p>Email: {user.email}</p>
    <p>Password:{user.password}</p> */}
    <input type="checkbox" onChange={()=> setNewUser (!newUser)} name="newUser" id="" />
    <label htmlFor="newUser">New User Sign up</label>
    <form onSubmit ={handleSubmit}>
    {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder ="Your name" required/>}
    <br />
    <input type="text" name="email" onBlur={handleBlur} placeholder ="Your email holder" required/>
    <br />
    <input type="password" name="password" onBlur={handleBlur}  placeholder="Your password" required/>
    <br />
    {/* <button>Submit</button> */}
    <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
    </form>
    <p style={{color: 'red'}}>{user.error}</p>

    {user.success && <p style={{color: 'green'}}>User {newUser ? 'created' : 'Logged In'} successfully</p>}

    </div>
  );
}

export default App;
