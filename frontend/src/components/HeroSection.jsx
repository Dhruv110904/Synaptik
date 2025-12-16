import { ArrowRight, MessageCircle, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-linear-to-br from-teal-50 via-teal-100 to-white">

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute w-160 h-160 bg-teal-200/40 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-140 h-140 bg-teal-300/30 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid lg:grid-cols-2 gap-16">

        {/* LEFT SECTION */}
        <div className="flex flex-col justify-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-teal-200 mb-6">
            <Zap className="w-4 h-4 text-teal-500" />
            <span className="text-sm text-teal-600">Real-time messaging reimagined</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
            Connect with your{" "}
            <span className="text-teal-500">community</span>
            <br />
            like never before
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 text-lg max-w-xl mb-10">
            Experience the future of communication. Create rooms, send voice notes,
            react to messages, and build meaningful connections with our beautiful,
            feature-rich chat platform.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/auth/register"
              className="px-6 py-3 rounded-xl text-white bg-teal-500 hover:bg-teal-600 shadow-md text-base font-semibold flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/auth/login"
              className="px-6 py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 shadow-sm text-base font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION — CHAT PREVIEW */}
        <div className="flex justify-center items-center relative">

          <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-6 w-full max-w-md">
            
            {/* Chat Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Design Team</h3>
                <p className="text-sm text-gray-500">12 members online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 mt-4">

              {/* Incoming message */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-tl-md shadow-sm">
                  <p className="text-sm text-gray-800">Hey team! Check out the new designs 🎨</p>
                  <span className="text-xs text-gray-500 block mt-1">10:42 AM</span>
                </div>
              </div>

              {/* Outgoing teal bubble */}
              <div className="flex justify-end gap-3">
                <div className="bg-teal-500 text-white px-4 py-2 rounded-2xl rounded-tr-md shadow-md max-w-[80%]">
                  <p className="text-sm">
                    Looking amazing! Love the glassmorphism effect ✨
                  </p>
                  <span className="text-xs text-white/80 block mt-1">10:44 AM</span>
                </div>
              </div>

              {/* Voice Note Bubble */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl shadow-sm w-full max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-4 h-4 text-teal-500" />
                    <span className="text-xs text-gray-500">Voice Note</span>
                  </div>
                  <div className="h-8 bg-teal-200 rounded-full flex items-center px-2">
                    <div className="flex gap-0.5 w-full">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-teal-500 rounded-full"
                          style={{ height: `${Math.random() * 18 + 8}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Typing Indicator */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              <span>Sarah is typing...</span>
            </div>

          </div>

          {/* Reactions Badge */}
          <div className="absolute -top-5 -right-5 bg-white shadow-lg border border-gray-200 px-3 py-1.5 rounded-xl flex gap-2">
            <span>👍❤️😅</span>
            <span className="text-xs text-gray-500">Reactions</span>
          </div>

          {/* Real-time Badge */}
          <div className="absolute -bottom-5 -left-5 bg-white shadow-lg border border-gray-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-600">Real-time</span>
          </div>

        </div>
      </div>
    </section>
  );
}
