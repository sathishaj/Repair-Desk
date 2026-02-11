import {
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebaseconfig";


// ----------------------
// ZOD SCHEMA
// ----------------------
const schema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(6, "Minimum 6 characters required"),
});


// ----------------------
// COMPONENT
// ----------------------
function Admincreateform() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleClickShowPassword = () =>
    setShowPassword((show) => !show);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);


// ----------------------
// SUBMIT HANDLER
// ----------------------
  const onSubmit = async (data) => {
    try {
      // 1️⃣ Create user in Firebase Authentication
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const uid = res.user.uid;

      // 2️⃣ Store role & profile in Firestore (NO PASSWORD)
      await setDoc(doc(db, "admin", uid), {
        name: data.name,
        email: data.email,
        role: data.role,
        status: "active",
        createdAt: new Date(),
      });

      alert("Admin created successfully");
      handleClose();

    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        alert("Email already exists");
      } else if (error.code === "auth/weak-password") {
        alert("Weak password");
      } else {
        alert("Something went wrong");
      }
    }
  };


// ----------------------
// UI
// ----------------------
  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        className="!capitalize"
        color="secondary"
        startIcon={<AddCircleIcon />}
      >
        New Admin
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[300px] md:w-[600px] p-5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">New Admin</div>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>

            <TextField
              label="Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              label="Password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              type={showPassword ? "password" : "text"}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role">
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Employee">Employee</MenuItem>
                  </Select>
                  <FormHelperText>
                    {errors.role?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                endIcon={<SendIcon />}
                className="!capitalize"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default Admincreateform;
