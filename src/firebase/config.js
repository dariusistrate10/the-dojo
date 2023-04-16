import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyC9eWygNa2_BhdwHifpIdmAxISke4JWrHA",
    authDomain: "thedojo-b23a7.firebaseapp.com",
    projectId: "thedojo-b23a7",
    storageBucket: "thedojo-b23a7.appspot.com",
    messagingSenderId: "711089947826",
    appId: "1:711089947826:web:adea632bb5b77fb04a75ab"
  };

// initialize firebase
firebase.initializeApp(firebaseConfig)

// initialize services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.Timestamp

export { projectAuth, projectFirestore, projectStorage, timestamp }