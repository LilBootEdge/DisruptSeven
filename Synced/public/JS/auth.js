var Config = {
	apiKey: "AIzaSyD9_NPOmpiHXfDQqYCFgdy8t9VIfftjBW0",
	authDomain: "ttcdisrupt7.firebaseapp.com",
	databaseURL: "https://ttcdisrupt7-default-rtdb.firebaseio.com",
	projectId: "ttcdisrupt7",
	storageBucket: "ttcdisrupt7.appspot.com",
	messagingSenderId: "889154885911",
	appId: "1:889154885911:web:62ab42ccdc07914f923f52"
  };
  firebase.initializeApp(config);

  const auth = firebase.auth();
  const db  = firebase.firestore();

  db.settings({timestampsInSnapshots: true})


// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in: ', user);
    } else {
      console.log('user logged out');
    }
  })

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    // close the signup modal & reset form
    
    // signupForm.reset();
    // console.log("working signup");
    window.location.href('/public/index1.html')
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});