import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, MessageCircle } from "lucide-react";
import API from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  // --- LOGIC STARTS (UNCHANGED) ---
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (step !== 2) return;
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    if (step === 1 && !validatePassword(password)) {
      setErr(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }

    try {
      if (step === 1) {
        await API.post("/api/auth/register/request-otp", {
          name,
          username,
          email,
          password,
        });
        setStep(2);
      } else {
        const { data } = await API.post("/api/auth/register/verify-otp", {
          name,
          username,
          email,
          password,
          otp: otp.join(""),
        });
        login({ token: data.token, user: data.user });
        navigate("/app");
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResending(true);
      await API.post("/api/auth/register/request-otp", {
        name,
        username,
        email,
        password,
      });
      setTimer(60);
    } catch (err) {
      setErr("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      submit(new Event("submit"));
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  // --- LOGIC ENDS ---

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500
      bg-linear-to-br from-white via-teal-50 to-white 
      dark:bg-linear-to-br dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950 px-4 py-10">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-200 h-200 bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 font-medium transition-colors
          text-gray-600 hover:text-teal-600 
          dark:text-gray-400 dark:hover:text-teal-400"
      >
        <ArrowLeft size={18} />
        Back to home
      </Link>

      {/* Card */}
      <div className="w-full max-w-md relative z-10 rounded-[2.5rem] shadow-2xl px-8 py-10 transition-all
        bg-white border border-teal-100
        dark:bg-gray-900/60 dark:backdrop-blur-md dark:border-gray-800">
        

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
            Synaptik
          </span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white transition-colors">
          Create an account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 transition-colors">
          Join Synaptik and start connecting
        </p>

        {err && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 text-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your Name"
              required
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none
                bg-white border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/20 dark:placeholder-gray-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none
                bg-white border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/20 dark:placeholder-gray-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="youremail@gmail.com"
              required
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none
                bg-white border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/20 dark:placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none
                  bg-white border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/20 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Must contain 8+ chars, uppercase, lowercase, number & special
            character
          </p>

          {step === 2 && (
            <div className="space-y-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center block">
                Enter 6-digit OTP
              </label>

              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    maxLength={1}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold rounded-xl border transition-all duration-300 outline-none
                      bg-white border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                      dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
                  />
                ))}
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {timer > 0 ? (
                  <span>
                    Resend OTP in <b className="text-teal-600 dark:text-teal-400">{timer}s</b>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={resending}
                    className="text-teal-600 font-semibold hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 hover:underline transition-colors"
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 mt-4
              bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading
              ? "Please wait..."
              : step === 1
              ? "Send OTP"
              : "Verify OTP & Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}