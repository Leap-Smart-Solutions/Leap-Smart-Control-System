// auth.js file
import { auth, db } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  doc, setDoc, collection, getDocs
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// listen for auth status changes
auth.onAuthStateChanged(user => {
//  console.log(user);
  if(user) {
//    console.log('user logged in: ', user);

    // Get Data
    const actTableRef = collection(db, 'ACT-Table');
    getDocs(actTableRef)
     .then(snapshot => {
       if (!snapshot.empty) {
         snapshot.docs.forEach(doc => {
//           console.log(doc.id, doc.data());
         });
       } else {
//         console.log("No data found");
       }
     })
     .catch(error => {
       console.error("Error fetching documents:", error);
     });

  } else {
//    console.log('user logged out');
  }
});


// Signing up the users
if (document.querySelector('#signup-form')) {
  const signupForm = document.querySelector('#signup-form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // get user info 
    const email = signupForm['email'].value;
    const username = signupForm['username'].value;
    const phone = signupForm['phone'].value;
    const password = signupForm['password'].value;

//    console.log(email, username, phone, password);

    // sign up the user
    createUserWithEmailAndPassword(auth, email, password).then(cred => {
        // Use the user's UID to create a document in the "users" collection
        return setDoc(doc(db, 'users', cred.user.uid), {
          username: username,
          email: email,
          phone: phone
          // Do not store the password here!
        });
      })
      .then(() => {
        // Redirect the user after successful signup and data storage
        //        window.location.href = "../../pages/auth/profile.html";
        window.location.assign("../../pages/auth/profile.html");
      })
      .catch(error => {
        console.error("Error during signup or saving user data:", error);
      });

    signupForm.reset();
  });}

// Signing out the users
if(document.querySelector('#logout')) {
  const logoutbtn = document.querySelector('#logout');
  logoutbtn.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
//    window.location.href = "./index.html";
  })
}

// Signing in the users
if(document.querySelector('#login-form')) {
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info 
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    signInWithEmailAndPassword(auth, email, password).then((cred) => {
      loginForm.reset();
      window.location.href = "../../pages/auth/profile.html";
    })
  })
}
