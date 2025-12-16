import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import API from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { MessageCircle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-100 via-white to-teal-200 px-4">

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-8 py-10">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center group">
        <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center group-hover:scale-110 transition">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            Synaptik
          </span>
          </div>

        <h2 className="text-2xl font-bold text-center mb-1">
          Welcome back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Sign in to continue to Synaptik
        </p>

        {err && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">

          {/* Email / Username */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <input
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter your email or username"
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/auth/register"
            className="text-teal-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
