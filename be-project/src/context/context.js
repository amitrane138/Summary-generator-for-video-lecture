import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "../lib/firebase";
import {db} from "../lib/firebase";


const AddContext = createContext();

export function useLocalContext() {
  return useContext(AddContext);
}

export function ContextProvider({ children, classData }) {
  const [createClassDialog, setCreateClassDialog] = useState(false);
  const [joinClassDialog, setJoinClassDialog] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInMail, setLoggedInMail] = useState(null);
  const [details, setdetails] = useState([]);

  const login = () => auth.signInWithPopup(provider);

  const logout = () => auth.signOut();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setLoggedInMail(authUser.email);
        setLoggedInUser(authUser);
      } else {
        setLoggedInMail(null);
        setLoggedInUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (classData) {
      let unsubscribe = db
        .collection("announcments")
        .doc("classes")
        .collection(classData.id)
        .onSnapshot((snap) => {
          setdetails(snap.docs.map((doc) => doc.data()));
        });
      return () => unsubscribe();
    }
  }, [classData]);
  console.log(details);

  const value = {
    createClassDialog,
    setCreateClassDialog,
    joinClassDialog,
    setJoinClassDialog,
    login,
    logout,
    loggedInMail,
    loggedInUser,
    details,
  };

  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}
