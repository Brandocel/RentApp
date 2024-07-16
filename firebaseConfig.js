// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhLONo_9mPZVmUkRX4AigrBn_YPXV-1NA",
  authDomain: "golftapp-cfbd4.firebaseapp.com",
  projectId: "golftapp-cfbd4",
  storageBucket: "golftapp-cfbd4.appspot.com",
  messagingSenderId: "345164072410",
  appId: "1:345164072410:web:85fba3415c4260355c6ce3",
  measurementId: "G-1T6FDE78WN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
