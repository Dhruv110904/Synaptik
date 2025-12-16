import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-md py-3"
          : "bg-white/70 backdrop-blur-lg py-4"
        }
        border-b border-teal-100`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center group-hover:scale-110 transition">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            Synaptik
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-10 text-gray-600 font-medium">
          <a href="#features" className="hover:text-teal-600 transition">
            Features
          </a>
          <a href="#about" className="hover:text-teal-600 transition">
            About
          </a>
        </div>

        {/* ACTION BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 transition"
          >
            {dark ? (
              <Sun className="w-5 h-5 text-teal-600" />
            ) : (
              <Moon className="w-5 h-5 text-teal-600" />
            )}
          </button>

          <Link
            to="/auth/login"
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-700"
          >
            Sign In
          </Link>

          <Link
            to="/auth/register"
            className="px-6 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition shadow text-white font-semibold"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMobile(!isMobile)}
          className="md:hidden p-2 rounded-xl bg-teal-50 hover:bg-teal-100 transition"
        >
          {isMobile ? <X className="text-teal-600" /> : <Menu className="text-teal-600" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobile && (
        <div className="md:hidden mt-4 mx-4 bg-white/95 backdrop-blur-xl p-4 rounded-xl border border-teal-100 shadow animate-fade-in">
          <div className="flex flex-col gap-4 text-gray-700 font-medium">
            <a href="#features" onClick={() => setIsMobile(false)}>
              Features
            </a>
            <a href="#about" onClick={() => setIsMobile(false)}>
              About
            </a>
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
