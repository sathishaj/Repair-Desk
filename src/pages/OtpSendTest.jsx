import { useEffect, useState } from "react";
import { auth } from "../Firebaseconfig";
import { RecaptchaVerifier, signInWithPhoneNumber,} from "firebase/auth";

function OtpSendTest() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading ReCAPTCHA security...");
  const [recaptchaReady, setRecaptchaReady] = useState(false); // New State

  // 🚀 FIX: Initialize RecaptchaVerifier ONLY when the component mounts
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth,
          "recaptcha-container",
          { 
            size: "invisible",
            callback: () => {
              // This is called when the ReCAPTCHA is ready/solved
              setRecaptchaReady(true);
              setMessage("Ready to send OTP.");
            },
            'expired-callback': () => {
              // Handle expiration if needed
              setRecaptchaReady(false);
              setMessage("Security check expired. Please refresh.");
            }
          },
          auth
        );
        // If the callback doesn't fire immediately (depends on Firebase version),
        // we can set it ready here too, assuming initialization was successful.
        if (window.recaptchaVerifier) {
            setRecaptchaReady(true);
            setMessage("Ready to send OTP.");
        }
      } catch (e) {
        console.error("Recaptcha Initialization Error:", e);
        setMessage("❌ Security initialization failed. Check console.");
      }
    }
  }, [auth]); // Dependency on auth instance

  const sendOtp = async () => {
    if (!recaptchaReady) {
      setMessage("Please wait for security check to finish loading.");
      return;
    }
    if (!phone || phone.length !== 10) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    try {
      setLoading(true);
      setMessage("Sending request...");

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        window.recaptchaVerifier // Now guaranteed to exist and be initialized
      );

      console.log("OTP request accepted:", confirmationResult);
      setMessage("✅ OTP SENT. Check your mobile phone. (Confirmation Result logged to console)");
      // Note: In a real app, you would save confirmationResult here to verify the OTP later
    } catch (err) {
      console.error("OTP error:", err);
      // More specific error display
      const displayMessage = err.code === 'auth/too-many-requests' 
        ? "Too many requests. Try again later."
        : err.message;
        
      setMessage(`❌ OTP NOT SENT: ${displayMessage}`);
      
      // If the error is ReCAPTCHA related, force refresh/reset
      if (err.code === 'auth/captcha-check-failed' || err.code === 'auth/web-storage-unsupported') {
          setMessage("❌ ReCAPTCHA failure. Try refreshing the page.");
          window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Firebase OTP Send Test</h2>

      <input
        placeholder="Enter 10-digit phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: 10, marginRight: 10, border: '1px solid #ccc', borderRadius: 4 }}
        maxLength={10}
      />

      <button 
        onClick={sendOtp} 
        disabled={loading || !recaptchaReady} // Disable if loading or not ready
        style={{ padding: '10px 20px', backgroundColor: recaptchaReady ? 'green' : 'gray', color: 'white', border: 'none', borderRadius: 4, cursor: recaptchaReady ? 'pointer' : 'not-allowed' }}
      >
        {loading ? "Sending..." : (recaptchaReady ? "Send OTP" : "Loading Security...")}
      </button>

      <p style={{ marginTop: 15, fontWeight: 'bold' }}>Status: {message}</p>

      {/* MUST EXIST: The container remains in the DOM structure */}
      <div
        id="recaptcha-container"
        style={{ position: "fixed", opacity: 0, pointerEvents: 'none' }}
      />
    </div>
  );
}

export default OtpSendTest;