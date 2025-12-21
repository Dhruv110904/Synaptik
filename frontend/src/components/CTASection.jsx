import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-32 transition-colors duration-500 relative overflow-hidden
      bg-linear-to-br from-white via-teal-50 to-white
      dark:bg-linear-to-br dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950">
      
      {/* Background Ambience (Bottom Glow) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        <div
          className="relative rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden transition-all duration-300
            bg-white border border-teal-100 shadow-2xl
            dark:bg-gray-900/60 dark:backdrop-blur-md dark:border-gray-800"
        >
          {/* Inner Card Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-teal-50/50 to-transparent dark:from-teal-900/10 dark:to-transparent opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
              bg-teal-50 border border-teal-100 
              dark:bg-teal-900/20 dark:border-teal-500/20">
              <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                Join thousands of happy users
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 transition-colors tracking-tight leading-tight
              text-gray-900 dark:text-white">
              Ready to transform how you <br />
              <span className="text-teal-500 dark:text-teal-400">communicate</span>?
            </h2>

            {/* Subtext */}
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-colors
              text-gray-600 dark:text-gray-400">
              Sign up for free and experience the future of messaging. No credit
              card required. Start chatting in seconds.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link
                to="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/25
                  bg-teal-500 hover:bg-teal-600"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95
                  bg-white text-gray-900 border border-gray-200 hover:bg-gray-50
                  dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Explore Features
              </a>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}