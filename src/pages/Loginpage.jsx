import { Button, IconButton, InputAdornment, Snackbar, TextField } from "@mui/material";
import logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebaseconfig";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";



const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters required"),
});

function Loginpage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(true);
  const [open, setOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

   const[loading, setLoading]=useState(false)

  const handleClose = () => setOpen(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // --------------------
  // LOGIN LOGIC
  // --------------------
 const onsubmit = async (data) => {
  try {
    setLoading(true);

    // Smooth UX delay (optional but professional)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const res = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const uid = res.user.uid;

    const adminRef = doc(db, "admin", uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      setSnackMessage("Access denied");
      setOpen(true);
      setLoading(false);
      return;
    }

    const userData = adminSnap.data();

    if (userData.status !== "active") {
      setSnackMessage("Account disabled");
      setOpen(true);
      setLoading(false);
      return;
    }

    // ✅ Role-based navigation
    if (userData.role === "Admin") {
      navigate("/", { replace: true });
    } else {
      navigate("/employee/dashboard", { replace: true });
    }

  } catch (error) {
    console.error(error);

    if (error.code === "auth/user-not-found") {
      setSnackMessage("Email not registered");
    } else if (error.code === "auth/wrong-password") {
      setSnackMessage("Incorrect password");
    } else {
      setSnackMessage("Email id or Password incorrect");
    }

    setOpen(true);
    setLoading(false);
  }
};

  return (
    <div className="w-[100%] bg-gray-300 h-dvh flex justify-center items-center">
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="w-[350px] bg-white p-7 rounded-lg flex flex-col gap-5 lg:w-[400px] ">

          <div className="flex items-center gap-1">
            <img src={logo} alt="logo" className="w-10 h-10" />
            <div className="text-2xl font-bold">Repair Desk</div>
          </div>

          <div>
            <div className="text-[15px] font-semibold text-gray-700">
              Login to your account
            </div>
            <div className="text-[14px] text-gray-700">
              Enter your email below to login
            </div>
          </div>

          <TextField
            placeholder="name@example.com"
            color="secondary"
            {...register("email")}
            fullWidth
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register("password")}
            color="secondary"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            type={showPassword ? "password" : "text"}
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

          <div className="flex justify-end">
            <Button   variant="text" size="small" sx={{ textTransform: "none" }}>
              Forgot your password?
            </Button>
          </div>

          <Button
          fullWidth
          loading={loading} 
           loadingPosition="start" 
            type="submit"
            variant="contained"
            color="secondary"
            className="!capitalize"
          >
            Login
          </Button>

        </div>
      </form>

      {/* ✅ Snackbar (Rendered Once) */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={snackMessage}
        action={
          <IconButton color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}

export default Loginpage;
