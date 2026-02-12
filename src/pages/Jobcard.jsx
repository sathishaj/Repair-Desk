import Jobcardcreateform from "../Froms/Jobcardcreateform";
import Profileicon from "../assets/Profileicon.svg";
import phoneicon from "../assets/phoneicon.svg";
import deleteicon from "../assets/deleteicon.svg";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebaseconfig";
import Jobcardupdateform from "../Froms/Jobcardupdateform";
import Printjobcard from "../components/Printjobcard";
import moment from "moment";
import Jobcardskeleton from "../skeletons/Jobcardskeleton";

function Jobcard() {
  const [jobcardlist, setJobcardlist] = useState([]);
  const [customerlist, setCustomerlist] = useState([]);
  const [isloading, setLoading] = useState(true);

  
  useEffect(() => {
    setLoading(true);

    const unsubJobcard = onSnapshot(collection(db, "jobcard"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobcardlist(list);
      setLoading(false);
    });

    const unsubCustomer = onSnapshot(collection(db, "customers"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomerlist(list);
    });

    return () => {
      unsubJobcard();
      unsubCustomer();
    };
  }, []);

 
  const deletejobcard = async (id) => {
    try {
      await deleteDoc(doc(db, "jobcard", id));
      console.log("Deleted:", id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="p-5 min-h-screen bg-[#E9E9E9] flex flex-col gap-10">
     
      <div className="flex justify-between">
        <div className="text-xl font-bold text-gray-700">Job card</div>
        <Jobcardcreateform />
      </div>

     
      <div className="w-full flex flex-wrap gap-4">

       
        {isloading && jobcardlist.length === 0 ? (
          <Jobcardskeleton count={6} />
        ) : jobcardlist.length === 0 ? (

          <div className="w-full flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 text-xl font-semibold">
              No Jobcard Found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Add a new jobcard to get started
            </p>
          </div>

        ) : (

        
          jobcardlist.map((jobcard) => {
            const customer = customerlist.find(
              (c) => c.id === jobcard.selectcustomer
            );

            return (
              <div
                key={jobcard.id}
                className="w-[360px] bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
               
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <img src={Profileicon} className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {customer ? customer.customername : "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {customer ? customer.phonenumber : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Jobcardupdateform jobcard={jobcard} />

                    <button
                      onClick={() => deletejobcard(jobcard.id)}
                      className="p-1.5 rounded-md hover:bg-gray-100"
                    >
                      <img src={deleteicon} className="h-4 w-4" />
                    </button>

                    <Printjobcard jobcardId={jobcard.id} />
                  </div>
                </div>

                {/* Phone */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md border border-gray-200 flex items-center justify-center">
                    <img src={phoneicon} className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {jobcard.brand}
                    </p>
                    <p className="text-xs text-gray-500">{jobcard.model}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Issues
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {jobcard.phoneproblem?.map((issue) => (
                      <span
                        key={issue.id}
                        className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700"
                      >
                        {issue.label}
                      </span>
                    ))}
                  </div>
                </div>

                
                <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {moment(jobcard.createdon?.toDate()).format("DD MMM YYYY")}
                  </span>

                  <span className="px-2 py-1 rounded-md border border-gray-200">
                    {jobcard.jobcardstatus}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Jobcard;
