import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, MessageCircle } from "lucide-react";
import API from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const { data } = await API.post("/api/auth/login", {
        emailOrUsername,
        password,
      });

      login({ token: data.token, user: data.user });
      navigate("/app");
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500
      bg-linear-to-br from-white via-teal-50 to-white 
      dark:bg-linear-to-br dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950 px-4">

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
          Welcome back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 transition-colors">
          Sign in to continue to your dashboard
        </p>

        {err && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 text-center dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">

          {/* Email / Username */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Email or Username
            </label>
            <input
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter your email or username"
              required
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 outline-none
                bg-white border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/20 dark:placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                Password
              </label>
              <Link to="/auth/forgot-password" className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
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

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300
              bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
          Don’t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}