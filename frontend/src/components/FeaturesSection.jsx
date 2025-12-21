import {
  MessageCircle,
  Users,
  Shield,
  Image,
  Mic,
  Bell,
  Reply,
  Heart,
  Pin,
  Crown,
  Search,
  Moon,
} from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";

const features = [
  {
    icon: MessageCircle,
    title: "Real-Time Messaging",
    description: "Instant message delivery with typing indicators, read receipts, and seamless sync across devices.",
    color: "from-yellow-500 to-yellow-500/60",
  },
  {
    icon: Users,
    title: "Community Rooms",
    description: "Create public or private rooms for your team, friends, or community. Manage roles and permissions.",
    color: "from-emerald-500 to-emerald-500/60",
  },
  {
    icon: Mic,
    title: "Voice Notes",
    description: "Record and send voice messages with a beautiful audio player. Perfect for quick communication.",
    color: "from-cyan-500 to-cyan-500/60",
  },
  {
    icon: Heart,
    title: "Message Reactions",
    description: "Express yourself with emoji reactions. React to messages with 👍❤️😂😮😢 and more.",
    color: "from-rose-500 to-rose-500/60",
  },
  {
    icon: Reply,
    title: "Quoted Replies",
    description: "Reply to specific messages with context. Keep conversations organized and easy to follow.",
    color: "from-violet-500 to-violet-500/60",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "End-to-end encryption for DMs. Your conversations stay private and secure.",
    color: "from-amber-500 to-amber-500/60",
  },
  {
    icon: Pin,
    title: "Pinned Messages",
    description: "Pin important messages to the top of any room. Never lose track of crucial information.",
    color: "from-orange-500 to-orange-500/60",
  },
  {
    icon: Crown,
    title: "Role Management",
    description: "Assign owner, admin, and member roles. Control who can manage your community.",
    color: "from-yellow-500 to-yellow-500/60",
  },
  {
    icon: Image,
    title: "Media Sharing",
    description: "Share images, files, and documents. View shared media in a beautiful gallery.",
    color: "from-pink-500 to-pink-500/60",
  },
  {
    icon: Search,
    title: "Search Messages",
    description: "Find any message instantly. Search within rooms or across all your conversations.",
    color: "from-indigo-500 to-indigo-500/60",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Browser notifications for new messages. Customizable sound and visual alerts.",
    color: "from-sky-500 to-sky-500/60",
  },
  {
    icon: Moon,
    title: "Dark & Light Modes",
    description: "Beautiful themes for day and night. Switch seamlessly with saved preferences.",
    color: "from-slate-500 to-slate-500/60",
  },
];

export default function FeaturesSection() {
  useScrollReveal();

  return (
    <section
      id="features"
      className="py-32 transition-colors duration-500 relative overflow-hidden
        bg-linear-to-br from-white via-teal-50 to-white
        dark:bg-linear-to-br dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950"
    >
      
      {/* Background Ambience (Aligned with Hero) */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-150 h-150 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-teal-300/20 dark:bg-teal-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2
            data-animate
            className="text-4xl md:text-5xl font-extrabold mb-6 transition-colors tracking-tight
              text-gray-900 dark:text-white"
          >
            Powerful Features for <br className="hidden md:block"/>
            <span className="text-teal-600 dark:text-teal-400">Modern Communication</span>
          </h2>

          <p
            data-animate
            className="text-lg md:text-xl leading-relaxed transition-colors
              text-gray-600 dark:text-gray-400"
            style={{ animationDelay: "100ms" }}
          >
            Synaptik gives you all the tools you need to connect, collaborate,
            and build communities effortlessly.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              data-animate
              style={{ animationDelay: `${i * 50}ms` }}
              className="group rounded-3xl p-8 transition-all duration-300
                bg-white border border-teal-100 shadow-sm
                hover:shadow-xl hover:-translate-y-1 hover:border-teal-200
                
                dark:bg-gray-900/60 dark:backdrop-blur-md dark:border-gray-800 
                dark:hover:bg-gray-800 dark:hover:border-teal-500/30 dark:hover:shadow-teal-900/20"
            >
              <div 
                className={`w-14 h-14 rounded-2xl bg-linear-to-br ${f.color} 
                flex items-center justify-center mb-6 shadow-lg shadow-teal-500/10
                group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
              >
                <f.icon className="w-7 h-7 text-white drop-shadow-md" />
              </div>

              <h3 className="text-xl font-bold mb-3 transition-colors
                text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                {f.title}
              </h3>

              <p className="text-[15px] leading-relaxed transition-colors
                text-gray-600 dark:text-gray-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}