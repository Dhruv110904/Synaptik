import { MessageCircle, Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-linear-to-b from-white to-teal-50 border-t border-teal-100">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-teal-500 flex items-center justify-center group-hover:scale-110 transition">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Synaptik
            </span>
          </Link>

          {/* NAV LINKS */}
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-teal-600 transition">
              Features
            </a>
            <a href="#" className="hover:text-teal-600 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-teal-600 transition">
              Terms
            </a>
            <a href="#about" className="hover:text-teal-600 transition">
              About
            </a>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4">
            <a target="_blank"
              href="https://x.com/DhruvJain1109"
              className="w-11 h-11 rounded-xl bg-white border border-teal-100
                         flex items-center justify-center
                         hover:bg-teal-50 hover:scale-110 transition target:_blank"
            >
              <Twitter className="w-5 h-5 text-teal-600" />
            </a>

            <a target="_blank"
              href="https://github.com/Dhruv110904/Synaptik"
              className="w-11 h-11 rounded-xl bg-white border border-teal-100
                         flex items-center justify-center
                         hover:bg-teal-50 hover:scale-110 transition"
            >
              <Github className="w-5 h-5 text-teal-600" />
            </a>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <span className="font-medium">Synaptik</span>. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
