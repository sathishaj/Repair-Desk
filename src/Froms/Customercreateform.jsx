import { Button, Dialog, Drawer, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebaseconfig";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SendIcon from '@mui/icons-material/Send';


const schema = z
  .object({
    customername: z.string().min(3, "Name is required"),
    phonenumber: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  })
  .superRefine(async (data, ctx) => {
    const q = query(
      collection(db, "customers"),
      where("phonenumber", "==", data.phonenumber)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      ctx.addIssue({
        code: z.ZodIssueCustom,
        message: "Phone number already exists!",
        path: ["phonenumber"],
      });
    }
  });




function Customercreateform() {

const[open, setOpen]= useState(false)


const handleopen = ()=>{setOpen(true)}

const handleclose = ()=>{
  reset()
  setOpen(false)

}

     const {register, formState:{ isSubmitSuccessful, errors},reset,handleSubmit,}= useForm({
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

             const onsubmit = async (data) => {
                    try {
                       await addDoc(collection(db, "customers"), {
                       customername: data.customername,
                       phonenumber: data.phonenumber,
                       createdAt: new Date(),
    });
                    } catch (error) {
                          console.error("Error adding document:", error);
                    }
             console.log(data); }

    return (
            
        <>
            <Button variant="contained" color="secondary" className="!capitalize" onClick={handleopen} startIcon={<AddCircleIcon/>}  >New Customer</Button>
            <Dialog open={open} >

                <form action="" className="w-[300px] p-5 mb-3 md:w-[600px] " onSubmit={handleSubmit(onsubmit)} >
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
                                            <div className="w-[100%] flex justify-end " ><Button variant="contained" color="secondary" className="!capitalize" type="submit" endIcon={<SendIcon/>} >Submit</Button></div>
                                       
                                   </div>
                      </div>
                </form>
                  
            </Dialog>
        
        </>
    )
}
export default Customercreateform;