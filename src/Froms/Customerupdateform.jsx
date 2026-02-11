

import { Button, Dialog, Drawer, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { addDoc, collection , doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../Firebaseconfig";
import EditIcon from '@mui/icons-material/Edit';


const schema = z
  .object({
    customername: z.string().min(3, "Name is required"),
    phonenumber: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  }) .superRefine(async (data, ctx) => {
      const q = query(
        collection(db, "customers"),
        where("phonenumber", "==", data.phonenumber)
      );
  
      const snapshot = await getDocs(q);
  
      if (!snapshot.empty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number already exists!",
          path: ["phonenumber"],
        });
      }
    });




function Customerupdateform( {customer}) {

const[open, setOpen]= useState(false)
const handleopen = ()=>{
    setOpen(true)
    setValue("customername", customer.customername);
    setValue("phonenumber", customer.phonenumber);
}
const handleclose = ()=>{
 reset()
setOpen(false)
}

     const {register, setValue, formState:{ isSubmitSuccessful, errors},reset,handleSubmit, control,}= useForm({
    resolver : zodResolver(schema),

      defaultValues: {
      customername: '',
      phonenumber: '',
    }
 })

 
  useEffect(() => {
    if(isSubmitSuccessful){
      reset()
    }    
     }, [isSubmitSuccessful])


     const customerload = async ()=>{
           try {
             const docRef = doc(db, "customers" , customer.id)
             const snap = await getDoc(docRef)

             if(snap.exists()){
                const data = snap.data()
                 setValue("customername", data.customername);
                 setValue("phonenumber", data.phonenumber);
             }
            
           } catch (error) {
                  console.error("not load customer", error)
           }

     }

             const onsubmit = async (data) => {
                try {
                   const docref = doc(db, "customers", customer.id);
                    await updateDoc(docref,{
                        customername:data.customername,
                        phonenumber:data.phonenumber
                    })
                     console.log("customer updated succesfully", data)

                } catch (error) {
                    console.error( "customer not updated :" , error)
                }
             console.log(data); }

    return (
            
        <>

           <IconButton onClick={handleopen} ><EditIcon/></IconButton>
            
            <Dialog open={open} >

                <form action="" className="w-[300px] p-5 mb-3 lg:w-[600px]  " onSubmit={handleSubmit(onsubmit)} >
                       <div className="flex flex-col gap-3" >
                                     <div className=" flex justify-between items-center" >
                                       <div className="text-xl font-bold" >New Customer</div>
                                        <div><IconButton onClick={handleclose} ><CloseIcon/></IconButton></div>
                                   </div>

                                   <div className="flex flex-col gap-5 " >
                                       <TextField
                                        label="Customer Name" 
                                        {...register("customername")}
                                          error={!!errors.customername}
                                         helperText={errors.customername?.message} />

                                       <TextField
                                        label="Phone Number" 
                                         {...register("phonenumber")}
                                          error={!! errors.phonenumber}
                                           helperText={errors.phonenumber?.message}/>
                                       <Button variant="contained" color="secondary" className="!capitalize" type="submit"  >Submit</Button>
                                   </div>
                      </div>
                </form>
                  
            </Dialog>
        
        </>
    )
}
export default Customerupdateform;