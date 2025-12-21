import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText, ArrowLeft, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
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
            <Scale className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 tracking-wide uppercase">
              Legal Agreement
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Terms & <span className="text-teal-500 dark:text-teal-400">Conditions</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Please read these terms carefully before using Synaptik. By accessing our platform, you agree to abide by these rules.
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
              title="Acceptance of Terms"
              text="By creating an account or accessing Synaptik, you confirm that you are at least 13 years old and agree to be legally bound by these Terms & Conditions. If you do not agree, you must discontinue use immediately."
            />

            <Section
              number="02"
              title="User Accounts & Security"
              text="You are responsible for safeguarding your account credentials. You agree to notify us immediately of any unauthorized use of your account. Synaptik is not liable for losses caused by compromised passwords."
            />

            <Section
              number="03"
              title="Acceptable Use Policy"
              text="You agree not to use the platform for: (a) Illegal activities; (b) Harassment, hate speech, or abuse; (c) Spamming or automated messaging; (d) Attempting to reverse-engineer or hack the platform's infrastructure."
            />

            <Section
              number="04"
              title="Content Responsibility"
              text="You retain ownership of the content you send. However, you grant Synaptik a license to transmit and store that content to provide the service. You are solely responsible for ensuring your content does not violate third-party rights."
            />

            <Section
              number="05"
              title="Privacy & Data Usage"
              text="Your use of Synaptik is also governed by our Privacy Policy. By using the platform, you consent to the collection and use of information as detailed in that policy."
            />

            <Section
              number="06"
              title="Termination of Service"
              text="We reserve the right to suspend or terminate your account at our sole discretion, without notice, if we believe you have violated these Terms or engaged in conduct harmful to the platform or other users."
            />

            <Section
              number="07"
              title="Limitation of Liability"
              text="Synaptik is provided 'as is' without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the service or inability to access it."
            />

            <Section
              number="08"
              title="Changes to Terms"
              text="We may modify these terms at any time. Significant changes will be announced via the platform or email. Your continued use of Synaptik after changes constitutes acceptance of the new terms."
            />
          </div>

          {/* Footer of Card */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-500">
              Last updated: <span className="font-medium text-gray-900 dark:text-gray-300">{new Date().toLocaleDateString()}</span>
            </span>
            <Link 
              to="/privacy" 
              className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
            >
              Read Privacy Policy
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