import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-32 bg-linear-to-b from-white via-teal-50 to-white">
      <div className="max-w-5xl mx-auto px-6">

        <div
          data-animate
          className="relative bg-white border border-teal-100 rounded-3xl p-12 md:p-16 shadow-lg text-center overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-teal-300/30 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Ready to transform how you <span className="text-teal-500">communicate</span>?
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Start building communities, sharing ideas, and chatting with your
              friends in real time — fast, secure, and beautifully designed.
            </p>

            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl
                         bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg
                         shadow-md transition"
            >
              Create Free Account
            </Link>
            
          </div>
        </div>

      </div>
    </section>
  );
}
