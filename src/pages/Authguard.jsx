import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebaseconfig";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function Authguard({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="w-[100%] h-screen flex justify-center items-center " > <CircularProgress color="secondary" /></div>;

  if (!user) return <Navigate to="/login" />;

  return children;
}

export default Authguard;
