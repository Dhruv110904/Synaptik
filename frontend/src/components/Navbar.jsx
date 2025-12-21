import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Initialize state based on what is actually in localStorage or system pref
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return saved === "dark" || (!saved && prefersDark);
    }
    return false;
  });

  // Apply the class to HTML whenever 'dark' state changes
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Scroll Effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? "glass py-3" : "glass py-5"}
        border-b border-teal-200/20`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          {/* Ensure dark:text-white is here */}
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Synaptik
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-10 font-medium">
          <a href="#features" className="text-gray-600 dark:text-slate-300 hover:text-teal-400 transition">
            Features
          </a>
          <Link to="/about" className="text-gray-600 dark:text-slate-300 hover:text-teal-400 transition">
            About
          </Link>
        </div>

        {/* ACTION BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition"
          >
            {/* If dark mode is ON, show SUN (to switch to light) */}
            {dark ? (
              <Sun className="w-5 h-5 text-teal-400" />
            ) : (
              <Moon className="w-5 h-5 text-teal-600" />
            )}
          </button>

          <Link
            to="/auth/login"
            className="px-5 py-2 rounded-lg border border-gray-300/50 dark:border-white/20
                       text-gray-700 dark:text-slate-300
                       hover:bg-white/70 dark:hover:bg-white/10 transition"
          >
            Sign In
          </Link>

          <Link
            to="/auth/register"
            className="px-6 py-2 rounded-lg gradient-primary shadow text-white font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMobile(!isMobile)}
          className="md:hidden p-2 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition"
        >
          {isMobile ? <X className="text-teal-500" /> : <Menu className="text-teal-500" />}
        </button>
      </div>
      
      {/* (Mobile menu code remains the same...) */}
      {isMobile && (
        <div className="md:hidden mt-4 mx-4 bg-white/95 backdrop-blur-xl p-4 rounded-xl border border-teal-100 shadow animate-fade-in">
          <div className="flex flex-col gap-4 text-gray-700 font-medium">
            <a href="#features" onClick={() => setIsMobile(false)}>
              Features
            </a>
            <a href="#about" onClick={() => setIsMobile(false)}>
              About
            </a>
            <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition"
          >
            {/* If dark mode is ON, show SUN (to switch to light) */}
            {dark ? (
              <Sun className="w-5 h-5 text-teal-400" />
            ) : (
              <Moon className="w-5 h-5 text-teal-600" />
            )}
          </button>
            <Link to="/auth/login" onClick={() => setIsMobile(false)}>
              Sign In
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setIsMobile(false)}
              className="px-4 py-2 bg-teal-500 rounded-lg text-center text-white font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}