import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAc53vQHo_boQYzv2uE0PkI3FseoZrfQoQ",
  authDomain: "movie-list-f578b.firebaseapp.com",
  projectId: "movie-list-f578b",
  storageBucket: "movie-list-f578b.firebasestorage.app",
  messagingSenderId: "580267261461",
  appId: "1:580267261461:web:c4af50828cb0f61f88181c",
  measurementId: "G-L5B00811FH"
};

export default function getFirebaseConfig () {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const auth = getAuth(app);

  return {db, auth};
}