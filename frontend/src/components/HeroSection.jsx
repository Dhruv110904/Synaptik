import { ArrowRight, MessageCircle, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden
      bg-linear-to-br from-teal-50 via-teal-100 to-white 
      dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950 transition-colors duration-500">

      {/* Subtle Background Glow - Enhanced for dark mode */}
      <div className="absolute inset-0 opacity-60 dark:opacity-50 pointer-events-none">
        <div className="absolute w-160 h-160 bg-teal-200/40 dark:bg-teal-500/20 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-140 h-140 bg-teal-300/30 dark:bg-teal-400/20 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SECTION */}
        <div className="flex flex-col justify-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full 
            bg-white dark:bg-gray-900/80
            border border-teal-200 dark:border-teal-500/30
            shadow-sm mb-6 transition-colors backdrop-blur-sm">
            <Zap className="w-4 h-4 text-teal-500 dark:text-teal-400" />
            <span className="text-sm text-teal-600 dark:text-teal-300 font-medium">Real-time messaging reimagined</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-white transition-colors tracking-tight">
            Connect with your{" "}
            <span className="text-teal-500 dark:text-teal-400 drop-shadow-sm">community</span>
            <br />
            like never before
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mb-10 transition-colors leading-relaxed">
            Experience the future of communication. Create rooms, send voice notes,
            react to messages, and build meaningful connections with our beautiful,
            feature-rich chat platform.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/auth/register"
              className="px-8 py-3.5 rounded-xl text-white bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/20 text-base font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/auth/login"
              className="px-8 py-3.5 rounded-xl 
                bg-white dark:bg-gray-950/50
                border border-gray-300 dark:border-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-900
                text-gray-900 dark:text-white
                shadow-sm text-base font-semibold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION — CHAT PREVIEW */}
        <div className="flex justify-center items-center relative lg:ml-10">

          {/* Main Card */}
          <div className="rounded-[2.5rem] shadow-2xl p-6 w-full max-w-md transition-all
            bg-white dark:bg-gray-900/90 backdrop-blur-md
            border border-gray-200 dark:border-gray-800/50 relative z-20">
            
            {/* Chat Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800/50">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Design Team</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  12 members online
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-5 mt-6">

              {/* Incoming message */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                <div>
                  <div className="px-5 py-3 rounded-2xl rounded-tl-md shadow-sm transition-colors
                    bg-gray-100 dark:bg-gray-800">
                    <p className="text-[15px] text-gray-800 dark:text-gray-300 leading-relaxed">Hey team! Check out the new designs 🎨</p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-500 block mt-1.5 ml-1">10:42 AM</span>
                </div>
              </div>

              {/* Outgoing teal bubble */}
              <div className="flex justify-end gap-3">
                <div className="text-right">
                  <div className="bg-teal-500 text-white px-5 py-3 rounded-2xl rounded-tr-md shadow-md max-w-70 ml-auto">
                    <p className="text-[15px] leading-relaxed">
                      Looking amazing! Love the glassmorphism effect ✨
                    </p>
                  </div>
                  <span className="text-xs font-medium text-teal-600/80 dark:text-teal-400/80 block mt-1.5 mr-1">10:44 AM</span>
                </div>
              </div>

              {/* Voice Note Bubble */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                <div className="w-full max-w-70">
                  <div className="px-4 py-3 rounded-2xl shadow-sm transition-colors
                    bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500">Voice Note</span>
                    </div>
                    <div className="h-10 bg-teal-100 dark:bg-teal-950/50 rounded-full flex items-center px-3">
                      <div className="flex gap-0.5 w-full items-center justify-between px-1">
                        {[...Array(24)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-teal-500 rounded-full"
                            style={{ 
                              height: `${Math.max(4, Math.sin(i * 0.5) * 12 + 12 + Math.random() * 6)}px`,
                              opacity: i < 10 ? 1 : 0.5
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-500 block mt-1.5 ml-1">10:45 AM</span>
                </div>
              </div>

            </div>

            {/* Typing Indicator */}
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-500 ml-13">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
              <span>Sarah is typing...</span>
            </div>

          </div>

          {/* Reactions Badge */}
          <div className="absolute -top-6 -right-6 shadow-xl px-4 py-2 rounded-2xl flex gap-2 transition-all z-30
            bg-white dark:bg-gray-900/90 backdrop-blur-md animate-bounce-slow
            border border-gray-200 dark:border-gray-800/50">
            <span className="text-xl">👍❤️😅</span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">Reactions</span>
          </div>

          {/* Real-time Badge */}
          <div className="absolute -bottom-6 -left-6 shadow-xl px-4 py-2 rounded-2xl flex items-center gap-2 transition-all z-30
              bg-white dark:bg-gray-900/90 backdrop-blur-md animate-bounce-slow [animation-delay:500ms]
              border border-gray-200 dark:border-gray-800/50">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Real-time</span>
          </div>

        </div>
      </div>
    </section>
  );
}