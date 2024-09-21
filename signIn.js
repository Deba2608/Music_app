// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8Jo4GfLDgIA6jlQ8DqNYY-x7Jkzi_1Ok",
    authDomain: "debaspotifyclone.firebaseapp.com",
    projectId: "debaspotifyclone",
    storageBucket: "debaspotifyclone.appspot.com",
    messagingSenderId: "845893822646",
    appId: "1:845893822646:web:7f38db2243000f26c61e17"
};

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  
  window.register = function register() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const full_name = document.getElementById('registerName').value;
  
    console.log('Registering user...');
    console.log('Email:', email, 'Password:', password, 'Full Name:', full_name);
  
    if (!validateEmail(email) || !validatePassword(password)) {
      alert('Email or password is incorrect');
      return;
    }
    if (!validateField(full_name)) {
      alert('One or more given credentials are incorrect');
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User created:', user);
  
        const database_ref = ref(database, 'users/' + user.uid);
        const user_data = {
          email: email,
          full_name: full_name,
          last_login: Date.now()
        };
  
        set(database_ref, user_data)
          .then(() => {
            console.log('User data saved successfully');
            alert('User Created!!');
            // Redirect to homepage
            window.location.href = '/';
          })
          .catch((error) => {
            console.error('Error writing user data:', error);
          });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        alert(error.message);
      });
  }
  
  window.signIn = function signIn() {
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
  
    console.log('Signing in user...');
    console.log('Email:', email, 'Password:', password);
  
    if (!validateEmail(email) || !validatePassword(password)) {
      alert('Email or password is incorrect');
      return;
    }
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User signed in:', user);
  
        const database_ref = ref(database, 'users/' + user.uid);
        const user_data = {
          last_login: Date.now()
        };
  
        update(database_ref, user_data)
          .then(() => {
            console.log('User data updated successfully');
            alert('User Logged In!!');
            // Redirect to homepage
            window.location.href = '/';
          })
          .catch((error) => {
            console.error('Error updating user data:', error);
          });
      })
      .catch((error) => {
        console.error('Error signing in:', error);
        alert(error.message);
      });
  }
  
  function validateEmail(email) {
    const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expression.test(email);
  }
  
  function validatePassword(password) {
    return password.length >= 6;
  }
  
  function validateField(field) {
    return field != null && field.length > 0;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
  
    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });
  
    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
  });