import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { collection, doc, onSnapshot } from "firebase/firestore";
import Printicon from "../assets/Printicon.svg"
import { db } from "../Firebaseconfig";
import moment from "moment";

const Printjobcard = ({jobcardId}) => {

const[profiledata,setProfiledata]=useState([])
const[jobcarddata,setJobcardata]=useState([])
 const [customerlist, setCustomerlist] = useState([])

  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({contentRef,});

 const jobcardid = jobcardId;

 const getdata =()=>{
    const unsub = onSnapshot(collection(db, "profile"),(snapshot)=>{
      const list = snapshot.docs.map((doc)=>({       
          id:doc.id,
          ...doc.data()
      }))
      setProfiledata(list)
    })

   return unsub
 }

 const getjobcarddata = ()=>{
  const docref = doc(db, "jobcard" , jobcardid  )
  const unsub = onSnapshot(docref,(snapshot)=>{
  setJobcardata([{id:snapshot.id, ...snapshot.data() }])
  })
   return unsub
 }
     
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


 useEffect(()=>{
   getdata()
   getjobcarddata()
 },[jobcardid])



  return (
    <>
      {/* Trigger the print function */}

       <IconButton onClick={() => handlePrint()} ><img src={Printicon} className="w-5 h-5" /></IconButton>
     
     {jobcarddata.map((jobcard)=>{
        const customer = customerlist.find(c => c.id === jobcard.selectcustomer)
      return(
      <div
        key={jobcard.id}
        ref={contentRef}
         className="hidden print:block w-[595px] min-h-[842px] p-5 text-black text-[14px] bg-white mx-auto mt-5"
      >
        {/* Header */}
        {profiledata.map((profile)=>(
           <div key={profile.id} className="flex justify-between mb-2">
          <div className="text-4xl font-semibold">{profile.shopname}</div>
          <div className="text-right text-sm">
            <div>{profile.streetaddress}</div>
            <div>{profile.phonenumber}</div>
            <div>{profile.city}</div>
            <div>{profile.state}</div>
          </div>
        </div>
        ))}
             <div className="mb-1">Created On :{moment(jobcard.createdon?.toDate()).format("DD-MM-YYYY")}</div>
        <hr />

        
        {/* Customer */}
        <div className="font-bold mt-2">Customer Details</div>
        <div>Name : {customer.customername}</div>
        <div>Mobile : {customer.phonenumber}</div>

        <hr className="my-2" />

        {/* Product */}
        <div className="font-bold">Product Details</div>
        <div>Brand : {jobcard.brand}</div>
        <div>Model : {jobcard.model}</div>

        <hr className="my-2" />

        {/* Issue */}
        <div className="font-bold">Issue Details</div>
        {jobcard.phoneproblem.map((issue)=>(
            <ul className="list-disc pl-5" key={issue.id} >
          <li>{issue.label}</li>
        </ul>
        ))}
       

        <hr className="my-2" />

        {/* Terms */}
        <div className="font-bold">Terms & Conditions</div>
        <ul className="list-disc pl-5 text-xs">
          <li>Data loss is not our responsibility</li>
          <li>Shop not liable for unrelated future issues</li>
          <li>Advance is non-refundable</li>
          <li>Water / physical damage may cause more faults</li>
          <li>Repair starts only after customer approval</li>
        </ul>

        {/* Signature */}
        <div className="flex justify-between mt-12">
          <div>
            Customer Signature
            <div className="mt-6">________________</div>
          </div>
          <div>
            Authorized Signature
            <div className="mt-6">________________</div>
          </div>
        </div>
      </div>
     )})}
      
    </>
  );
};

export default Printjobcard;