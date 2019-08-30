import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage'

let config = {
  apiKey: "AIzaSyA6kjTtvPaK5co3cqG2WZob9e7WdEineFA",
  authDomain: "facevote-eb748.firebaseapp.com",
  databaseURL: "https://facevote-eb748.firebaseio.com",
  projectId: "facevote-eb748",
  messagingSenderId: "742556427936",
  storageBucket: "facevote-eb748.appspot.com"
};


const app = firebase.initializeApp(config);

const db = firebase.firestore()
const database = firebase.database();
const storage = firebase.storage();

firebase.firestore().enablePersistence({experimentalTabSynchronization: true})
.catch(function(err) {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
    /* eslint-disable-next-line */
      // console.log(err)
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    /* eslint-disable-next-line */
    // console.log(err)
  }
})



export { firebase, db, database, storage, app }