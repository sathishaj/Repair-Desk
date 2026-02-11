import { Button, } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../Firebaseconfig";
import { useState } from "react";

function Logoutbutton() {

  const[loading, setLoading]=useState(false)

 const handleLogout = async () => {
    try {
      setLoading(true);

      setTimeout(async () => {
        await signOut(auth);
        navigate("/login", { replace: true });
      }, 1500); 
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
         <Button loading={loading} loadingPosition="start" size="small" onClick={handleLogout} className="!capitalize"   >Logout</Button>
  );
}

export default Logoutbutton;
