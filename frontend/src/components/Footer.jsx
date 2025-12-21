import { MessageCircle, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-teal-100 dark:border-gray-800/50 transition-colors duration-500
      bg-linear-to-b from-white to-teal-50 
      dark:from-gray-950 dark:to-[#051e24]">
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">

        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-500/20">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
              Synaptik
            </span>
          </Link>

          {/* NAV LINKS */}
          <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors">
            <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Features
            </a>
            <Link to="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Terms
            </Link>
            <Link to="/about" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              About
            </Link>
          </nav>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.linkedin.com/in/dhruvjain1109/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Twitter"
              className="w-11 h-11 rounded-xl bg-white dark:bg-gray-900 border border-teal-100 dark:border-gray-700
                         flex items-center justify-center transition-all duration-300
                         hover:bg-teal-50 dark:hover:bg-gray-800 hover:scale-110 hover:border-teal-200 dark:hover:border-teal-500/30"
            >
              <Linkedin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </a>

            <a 
              href="https://github.com/Dhruv110904/Synaptik"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Source on GitHub"
              className="w-11 h-11 rounded-xl bg-white dark:bg-gray-900 border border-teal-100 dark:border-gray-700
                         flex items-center justify-center transition-all duration-300
                         hover:bg-teal-50 dark:hover:bg-gray-800 hover:scale-110 hover:border-teal-200 dark:hover:border-teal-500/30"
            >
              <Github className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </a>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 pt-8 border-t border-teal-50 dark:border-gray-800/50 text-center text-sm text-gray-500 dark:text-gray-500">
          © {currentYear} <span className="font-medium text-gray-900 dark:text-gray-300">Synaptik</span>. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;