import { Autocomplete, Button, Chip, Dialog, FormControl, FormHelperText, IconButton, InputLabel, Menu, MenuItem, Select, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import {z} from "zod"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../Firebaseconfig";
import EditIcon from '@mui/icons-material/Edit';
import editicon from "../assets/editicon.svg"



const schema = z.object({
  selectcustomer:z.string().min(1, "select Customer"),
  brand: z.string().min(3, "Name is required"),
  model: z.string().min(3, "Select Model Name"),
  phoneproblem :z.array(
      z.object({
        id: z.number(),
        label: z.string(),
      })
    )
    .min(1, "Select at least one problem"),
  jobcardstatus: z.string()

})

function Jobcardupdateform ({jobcard}){


   const[open, setOpen]=useState(false)
   const [customerlist , setCustomerlist]=useState([])
   const mobileBrands = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Xiaomi",
  "Redmi",
  "Poco",
  "Realme",
  "Oppo",
  "Vivo",
  "iQOO",
  "Motorola",
  "Nokia",
  "Asus",
  "Honor",
  "Huawei",
  "Google Pixel",
  "Sony",
  "LG",
  "HTC",
  "Infinix",
  "Tecno",
  "Lava",
  "Micromax",
  "Nothing",
  "Lenovo",
  "ZTE",
  "Meizu",
  "BlackBerry",
  "Alcatel",
  "Panasonic",
  "Philips",
  "Gionee",
  "LeEco",
  "Coolpad"
];

 const phoneproblems = [
  { id: 1, label: "Screen cracked" },
  { id: 2, label: "Touch not working" },
  { id: 3, label: "Battery draining fast" },
  { id: 4, label: "Phone overheating" },
  { id: 5, label: "Speaker not working" },
  { id: 6, label: "Mic not working" },
  { id: 7, label: "Charging port issue" },
  { id: 8, label: "Camera blurry" },
  { id: 9, label: "Camera not opening" },
  { id: 10, label: "Software crash" },
  { id: 11, label: "Hanging / lagging" },
  { id: 12, label: "Network issue" },
  { id: 13, label: "No SIM detection" },
  { id: 14, label: "WiFi not connecting" },
  { id: 15, label: "Bluetooth not working" },
  { id: 16, label: "Fingerprint not working" },
  { id: 17, label: "Face unlock not working" },
  { id: 18, label: "Phone not turning on" },
  { id: 19, label: "Auto restart issue" },
  { id: 20, label: "Low volume" },
  { id: 21, label: "Display Green Line"},
];

const jobcardstatus = ["new", "in Progress" , "waiting for parts" , "ready for delivery" , "delivered" , "cancelled"]


const getcustomer = ()=>{
 
  const unsub = onSnapshot(collection(db,"customers"),(snapshot)=>{
    const list = snapshot.docs.map((doc)=> ({
      id:doc.id, 
       ...doc.data()
    }))
    setCustomerlist(list)
  })
}

useEffect(()=>{
  getcustomer()
},[])

   const handleopen = () => {
  setOpen(true); 
    
   setValue("selectcustomer", jobcard.selectcustomer)
   setValue("brand",jobcard.brand)
   setValue("model", jobcard.model);
   setValue("phoneproblem",jobcard.phoneproblem )
   setValue("jobcardstatus",jobcard.jobcardstatus)
};
    
   const handleclose = ()=>{
      reset()
      setOpen(false)
     
   }

    const {register, setValue, formState:{ isSubmitSuccessful, errors},reset,handleSubmit, control,}= useForm({
       resolver : zodResolver(schema),
       defaultValues: {
        selectcustomer: "",
         brand: '',
         model: '',
        phoneproblem: [],
        jobcardstatus:""
       }
    }
   
    )
   
    useEffect(() => {
      if(isSubmitSuccessful){
        reset()
      }    
       }, [isSubmitSuccessful])



            const jobcardload = async ()=>{
                  try {
                    const docRef = doc(db, "jobcard" , jobcard.id)
                    const snap = await getDoc(docRef)
                    
                    if(snap.exists()){
                       const data = snap.data()
                        setValue("selectcustomer",data.selectcustomer)
                        setValue("brand",data.brand)
                          setValue("model", data.model)                         
                          setValue("phoneproblem",data.phoneproblem )
                          setValue("jobcardstatus", data.jobcardstatus )
                         
                          console.log( setValue("jobcardstatus", data.jobcardstatus ))
                          
                    }
                   
                  } catch (error) {
                         console.error("not load customer", error)
                  }
       
            }

         
       const onsubmit = async (data) =>{

        try {
           const docRef = doc(db, "jobcard", jobcard.id )
             await updateDoc(docRef,{
                 selectcustomer: data.selectcustomer,
                 brand: data.brand,
                 model: data.model,
                 phoneproblem:data.phoneproblem,
                 jobcardstatus: data.jobcardstatus,
             })
        } catch (error) {
            console.error("jobcard not updated :", error)
        }
            console.log(data)
       }

 return(
    <>
       
       <IconButton onClick={handleopen} >  <img src={editicon} className="w-5 h-5" /></IconButton>
       <Dialog open={open} >
        <form action="" className="w-[300px] md:w-[600px] p-5 mb-3"  onSubmit={handleSubmit(onsubmit)} >
         <div className="flex flex-col gap-3 " >
             <div className=" flex justify-between items-center" >
             <div className="text-xl font-bold" >New Job card</div>
             <div><IconButton onClick={handleclose} ><CloseIcon/></IconButton></div>
             </div>
              <div className="w-full flex flex-col gap-3" >

        <Controller
        name="selectcustomer"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel error={!!errors.selectcustomer } >Select Customer</InputLabel>
            <Select
             error={!!errors.selectcustomer }
             label="Select Customer"
             {...field} >
              {customerlist.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-2" >
                     <div>{c.customername}</div>
                     <div className="text-xs" >{c.phonenumber}</div>
                  </div>
                 
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error={!!errors.selectcustomer } >{errors.selectcustomer?.message}</FormHelperText>
          </FormControl>
        )}
      />
<Controller
  name="brand"
  control={control}
  defaultValue=""
  render={({ field }) => (
    <FormControl fullWidth >
      <InputLabel 
       error={!!errors.brand }
        id="brand-label">Brand</InputLabel>
      <Select
        labelId="brand-label"
        label="brand"
         error={!!errors.brand }
        {...field}
      >
          {mobileBrands.map((item ,index)=>(<MenuItem key={index} value={item} >{item}</MenuItem>))}
       
      </Select>
      <FormHelperText error={!!errors.brand } >{errors.brand?.message}</FormHelperText>
    </FormControl>
  )}
/> 

  
  <TextField
   label="Model"
   {...register("model")}
   error={!!errors.model}
    helperText={errors.model?.message}
     />



<Controller
  name="phoneproblem"
  control={control}
  render={({ field }) => (
    <Autocomplete
      multiple
      options={phoneproblems}
      getOptionLabel={(option) => option.label}
      value={field.value}
      onChange={( event, newValue) => field.onChange(newValue)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Phone Problems"
          placeholder="Select issues"
          error={!!errors.phoneproblem}
          helperText={errors.phoneproblem?.message}
        />
      )}
      slotProps={{
        chip: {
          variant: "standard",
        },
      }}
    />
  )}
/>


<Controller
  name="jobcardstatus"
  control={control}
  defaultValue="new"
  render={({ field }) => (
    <FormControl fullWidth >
      <InputLabel 
       error={!!errors.jobcardstatus }
        id="Jobcard Status-label">Jobcard Status</InputLabel>
      <Select
        labelId="Jobcard Status-label"
        label="Jobcard Status"
         error={!!errors.jobcardstatus }
        {...field}
      >
          {jobcardstatus.map((item ,index)=>(<MenuItem key={index} value={item} >{item}</MenuItem>))}
       
      </Select>
      <FormHelperText error={!!errors.jobcardstatus } >{errors.jobcardstatus?.message}</FormHelperText>
    </FormControl>
  )}
/>



  <Button type="submit" variant="contained" color="secondary" className="!capitalize" >Submit</Button>
             </div>
         </div>
        </form>       
       </Dialog>
    </>
 )

}

export default Jobcardupdateform