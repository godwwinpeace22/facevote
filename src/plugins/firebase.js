import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

let config = {
  apiKey: "AIzaSyA6kjTtvPaK5co3cqG2WZob9e7WdEineFA",
  authDomain: "facevote-eb748.firebaseapp.com",
  databaseURL: "https://facevote-eb748.firebaseio.com",
  projectId: "facevote-eb748",
};

global.firebase = firebase
global.app = firebase.initializeApp(config);

global.db = firebase.firestore();
global.database = firebase.database();

firebase.firestore().enablePersistence({experimentalTabSynchronization:true})
.catch(function(err) {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
      console.log(err)
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    console.log(err)
  }
});