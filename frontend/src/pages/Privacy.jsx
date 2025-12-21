import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen transition-colors duration-500 font-sans
      bg-linear-to-br from-white via-teal-50 to-white
      dark:bg-linear-to-br dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950">
      
      <Navbar />

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-30">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-250 h-150 bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6
            bg-teal-50 border border-teal-100 
            dark:bg-teal-900/20 dark:border-teal-500/20">
            <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 tracking-wide uppercase">
              Legal & Security
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Privacy <span className="text-teal-500 dark:text-teal-400">Policy</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Your privacy is non-negotiable. This policy explains exactly how Synaptik handles, protects, and respects your data.
          </p>
        </div>

        {/* CONTENT CARD */}
        <div className="max-w-4xl mx-auto rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all
          bg-white border border-teal-100
          dark:bg-gray-900/60 dark:backdrop-blur-md dark:border-gray-800">
          
          {/* Inner Card Gradient */}
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-teal-400 to-teal-600" />

          <div className="space-y-10">
            <Section
              number="01"
              title="Information We Collect"
              text="We collect minimal information required to operate the service. This includes your username, email address, and authentication credentials (hashed). We may also log basic usage data (e.g., login times) to improve platform performance and security."
            />

            <Section
              number="02"
              title="How We Use Your Data"
              text="Your data is used strictly to: (a) Create and manage your account; (b) Facilitate real-time messaging via WebSockets; (c) Send essential security notifications (e.g., OTPs); and (d) Prevent abuse or fraud on the platform."
            />

            <Section
              number="03"
              title="OTP & Authentication"
              text="We use email-based One-Time Passwords (OTPs) for verification. These are transient, time-limited codes that are never stored permanently. We do not share your email address with advertisers or third parties."
            />

            <Section
              number="04"
              title="Messages & Encryption"
              text="All messages are transmitted over secure SSL/TLS channels. While we store message history to allow you to view past conversations, we do not analyze, sell, or mine your private conversations for advertising purposes."
            />

            <Section
              number="05"
              title="Cookies & Storage"
              text="We use local storage and secure HTTP-only cookies to maintain your login session and save preferences (like Dark Mode). You can clear these at any time via your browser settings."
            />

            <Section
              number="06"
              title="Data Security"
              text="We employ industry-standard security practices, including Bcrypt password hashing, JWT for stateless authentication, and MongoDB sanitation to prevent injection attacks."
            />

            <Section
              number="07"
              title="Data Sharing"
              text="We do not sell your personal data. Data is only shared if strictly required by law or to protect the rights and safety of Synaptik, our users, or the public."
            />

            <Section
              number="08"
              title="Your Rights"
              text="You have the right to access, correct, or delete your data. You may delete your account permanently at any time from the Settings page, which will erase your personal information from our active databases."
            />

            <Section
              number="09"
              title="Policy Updates"
              text="We may update this policy as the platform evolves. Significant changes will be communicated via email or a platform notification. Continued use implies acceptance of the new terms."
            />
          </div>

          {/* Footer of Card */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-500">
              Last updated: <span className="font-medium text-gray-900 dark:text-gray-300">{new Date().toLocaleDateString()}</span>
            </span>
            <Link 
              to="/contact" 
              className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
            >
              Have questions? Contact Support
            </Link>
          </div>

        </div>

        {/* BACK BUTTON */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all
              text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400
              hover:bg-teal-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}

/* Styled Section Component */
function Section({ number, title, text }) {
  return (
    <div className="flex gap-5 md:gap-8 items-start group">
      <span className="shrink-0 text-3xl font-black text-gray-200 dark:text-gray-800 group-hover:text-teal-100 dark:group-hover:text-teal-900/30 transition-colors select-none">
        {number}
      </span>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {title}
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}