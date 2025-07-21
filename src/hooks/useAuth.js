import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";

import getFirebaseConfig from "@/firebase/config";

export default function useAuth() {
  const { auth, db } = getFirebaseConfig();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const userCollection = collection(db, "users");
        const userDoc = await getDoc(doc(userCollection, user.uid));
        setRole(userDoc.data()?.role || "");
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  return { user, isLoading, role };
}
