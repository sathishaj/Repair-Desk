import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../Firebaseconfig";
import Admincard from "../components/Admincard";
import Admincreateform from "../Froms/Admincreateform";

function Adminpage() {
  const [admindata, setAdmindata] = useState([]);
  const [adminStatus, setAdminStatus] = useState({});

  // fetch admin list
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "admin"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAdmindata(list);

      // map id -> boolean
      const statusMap = {};
      list.forEach((admin) => {
        statusMap[admin.id] = admin.status === "active";
      });
      setAdminStatus(statusMap);
    });

    return () => unsub();
  }, []);

  // switch handler
  const handleChange = (adminId) => async (event) => {
    const checked = event.target.checked;

    // update UI immediately
    setAdminStatus((prev) => ({
      ...prev,
      [adminId]: checked,
    }));

    // update Firestore
    await updateDoc(doc(db, "admin", adminId), {
      status: checked ? "active" : "inactive",
    });
  };

  return (
    <div className="p-5 min-h-screen bg-[#E9E9E9]">
      <div className="flex justify-between mb-6">
        <div className="text-xl font-bold text-gray-700">
          Admin Control
        </div>
        <Admincreateform />
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {admindata.map((admin) => (
          <Admincard
            key={admin.id}
            checked={adminStatus[admin.id] || false}
            onChange={handleChange(admin.id)}
            name={admin.name}
            email={admin.email}
            role={admin.role}
          />
        ))}
      </div>
    </div>
  );
}

export default Adminpage;
