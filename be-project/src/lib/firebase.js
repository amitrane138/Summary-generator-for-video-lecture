import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyAh0wX8Rcvf1X0uijWW18qzhuNBgGaCeqI",
authDomain: "be-project-9abdf.firebaseapp.com",
projectId: "be-project-9abdf",
storageBucket: "be-project-9abdf.appspot.com",
messagingSenderId: "262664650084",
appId: "1:262664650084:web:b4bb8bc39191f1fd44ce71",
measurementId: "G-WC7V37BWZN",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage, db };
export default db;
