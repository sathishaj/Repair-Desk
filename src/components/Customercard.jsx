import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Firebaseconfig";

function CustomerCard() {

    const [customerlist, setCustomerlist] = useState([])
  
     useEffect(() => {
        const unsub = onSnapshot(collection(db, "customers"), (snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setCustomerlist(list);
        });
    
        return () => unsub();
      }, []);


  return (
    <div className="w-[380px] sm:w-[500px] bg-white  p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          Total Customers
        </h2>
        <div className="text-indigo-500 bg-indigo-100 p-2 rounded-lg">
          <PermIdentityOutlinedIcon fontSize="medium" />
        </div>
      </div>

      {/* Count */}
      <div className="mt-4 text-3xl font-bold text-gray-900">
        {customerlist.length}
      </div>

      {/* Progress / Trend */}
      <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
        <span className="text-green-500">▲</span> 12% since last week
      </div>
    </div>
  );
}

export default CustomerCard;
