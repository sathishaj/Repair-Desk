import { useEffect, useRef, useState } from "react";

function Otpinput({ onsubmitotp, length = 6, onVerify }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputref = useRef([]);

  useEffect(() => {
    inputref.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputref.current[index + 1]?.focus();
    }

    const finalOtp = newOtp.join("");
    if (finalOtp.length === length) {
      onVerify(finalOtp); // 🚀 auto trigger
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) {
        inputref.current[index - 1]?.focus();
      }
    }
  };

  return (
    <>
      <div className="flex gap-2 justify-center">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputref.current[index] = el)}
            type="text"
            maxLength={1}
            value={value}
            className="w-10 h-10 text-center border border-gray-600 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <div className="text-sm text-gray-600 mt-2 text-center">
        OTP sent to: <b>{onsubmitotp}</b>
      </div>
    </>
  );
}

export default Otpinput;
