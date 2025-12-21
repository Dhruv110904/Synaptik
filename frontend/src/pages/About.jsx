import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Assuming you have this
import { MessageCircle, Users, Shield, Zap, Code2, Globe, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen transition-colors duration-500 font-sans
      bg-linear-to-br from-white via-teal-50 to-white
      dark:bg-linear-to-br dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950">
      
      <Navbar />

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 text-center px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-500/20">
            <MessageCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span className="text-sm font-semibold text-teal-700 dark:text-teal-300 tracking-wide">OUR MISSION</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">
            About <span className="text-teal-500 dark:text-teal-400">Synaptik</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Synaptik is a modern real-time chat platform built to help people
            connect, collaborate, and build communities effortlessly.
          </p>
        </div>
      </section>

      {/* WHY SYNAPTIK */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Why we built this?
            </h2>
            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                We wanted to create a chat experience that feels fast, beautiful,
                and human. Synaptik combines real-time messaging, smart UI, and
                strong security into one seamless platform.
              </p>
              <p>
                Whether you’re chatting with friends, collaborating with a team,
                or building a community — Synaptik adapts to your needs.
              </p>
            </div>
          </div>

          {/* Feature List Card */}
          <div className="rounded-[2.5rem] p-8 md:p-10 shadow-2xl transition-all
            bg-white border border-teal-100
            dark:bg-gray-900/60 dark:backdrop-blur-md dark:border-gray-800">
            
            <div className="space-y-8">
              <Feature
                icon={Zap}
                title="Fast & Real-Time"
                text="Instant message delivery powered by optimized WebSockets for minimal latency."
              />
              <Feature
                icon={Users}
                title="Community Focused"
                text="Create unlimited public rooms, manage private chats, and assign custom roles."
              />
              <Feature
                icon={Shield}
                title="Secure by Design"
                text="Enterprise-grade JWT authentication, protected APIs, and end-to-end encrypted flows."
              />
            </div>
          </div>

        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-24 px-6 relative z-10 bg-teal-50/50 dark:bg-black/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Built with Modern Technology
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Synaptik is engineered using a scalable, production-ready MERN stack architecture.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "React 19", icon: Code2 },
              { name: "Node.js", icon: Zap },
              { name: "Express", icon: Globe },
              { name: "MongoDB", icon: DatabaseIcon }, // Placeholder icon logic below
              { name: "Socket.IO", icon: Zap },
              { name: "JWT Auth", icon: Lock },
              { name: "Tailwind v4", icon: Code2 },
            ].map((tech) => (
              <div
                key={tech.name}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
                  bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1
                  dark:bg-gray-800 dark:border-gray-700 dark:hover:border-teal-500/50"
              >
                <tech.icon className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden
          bg-white border border-teal-100
          dark:bg-gray-900/80 dark:backdrop-blur-md dark:border-gray-800">
          
          {/* Inner Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-teal-50/50 to-transparent dark:from-teal-900/10 dark:to-transparent pointer-events-none" />
          
          <div className="relative z-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to start chatting?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto">
              Join Synaptik today and experience next-generation communication with your friends and team.
            </p>

            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:scale-105 active:scale-95
                bg-teal-500 hover:bg-teal-600"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* Feature Card Helper Component */
function Feature({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-5 items-start">
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
        <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

// Simple Icon Placeholder for Map (You can import standard Lucide icons)
const DatabaseIcon = ({ className }) => (
  <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
);