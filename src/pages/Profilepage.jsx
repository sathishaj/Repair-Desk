import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebaseconfig";

const schema = z.object({
  shopname: z.string().min(3, "Name is required"),
  phonenumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  streetaddress: z.string().min(3, "Street Address is required"),
  city: z.string().min(3, "City is required"),
  state: z.string().min(3, "State is required"),
});

function Profilepage() {
  const [profileId, setProfileId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      shopname: "",
      phonenumber: "",
      streetaddress: "",
      city: "",
      state: "",
    },
  });

  // 🔥 Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const snapshot = await getDocs(collection(db, "profile"));

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        setProfileId(docSnap.id);

        reset(docSnap.data());
      }
    };

    fetchProfile();
  }, [reset]);

  // 🔥 Save or Update
  const onsubmit = async (data) => {
    try {
      if (profileId) {
        // UPDATE
        await updateDoc(doc(db, "profile", profileId), {
          ...data,
          updatedAt: new Date(),
        });
        alert("Profile updated successfully");
      } else {
        // SAVE
        const docRef = await addDoc(collection(db, "profile"), {
          ...data,
          createdAt: new Date(),
        });
        setProfileId(docRef.id);
        alert("Profile saved successfully");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-[80%] flex flex-col gap-5 lg:w-[40%]"
      >
        <h1 className="text-xl font-semibold">Shop Address & Details</h1>

        <TextField
         InputLabelProps={{ shrink: true }}
          {...register("shopname")}
          label="Shop Name"
          error={!!errors.shopname}
          helperText={errors.shopname?.message}
        />

        <TextField
         InputLabelProps={{ shrink: true }}
          {...register("phonenumber")}
          label="Phone Number"
          error={!!errors.phonenumber}
          helperText={errors.phonenumber?.message}
        />

        <TextField
         InputLabelProps={{ shrink: true }}
          {...register("streetaddress")}
          label="Street Address"
          error={!!errors.streetaddress}
          helperText={errors.streetaddress?.message}
        />

        <TextField
         InputLabelProps={{ shrink: true }}
          {...register("city")}
          label="City"
          error={!!errors.city}
          helperText={errors.city?.message}
        />

        <TextField
         InputLabelProps={{ shrink: true }}
          {...register("state")}
          label="State"
          error={!!errors.state}
          helperText={errors.state?.message}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            className="!capitalize"
          >
            {profileId ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Profilepage;
