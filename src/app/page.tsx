// src/app/page.tsx
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navigation />
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-6">
            <span className="text-6xl sm:text-8xl">♿</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
            Access<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Lens</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            AI-Powered Accessibility Preview & Remediation for Storyblok
          </p>
          <p className="text-sm sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
            Transform your content creation workflow with real-time accessibility analysis,
            immersive simulations, and intelligent AI-powered fixes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
          {[
            { icon: "🎯", title: "Real-Time Analysis", desc: "Instant WCAG 2.1 compliance scoring with detailed issue detection" },
            { icon: "🧠", title: "AI Remediation", desc: "Smart fix suggestions powered by GPT-4 with one-click application" },
            { icon: "👁️", title: "Vision Simulations", desc: "Experience content through color blindness, low vision, and more" },
            { icon: "🔊", title: "Screen Reader", desc: "Hear your content as screen reader users experience it" }
          ].map((feature, idx) => (
            <div key={idx} className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center backdrop-blur-lg bg-white/10 border border-white/20 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Make Your Content Accessible?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Install the AccessLens plugin in your Storyblok space and start analyzing
            your content in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              href="/preview?story=home"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-base sm:text-lg hover:from-purple-600 hover:to-pink-600 transition shadow-lg"
            >
              Try Demo →
            </Link>
            <Link
              href="/docs"
              className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-lg bg-white/20 border border-white/30 text-white rounded-xl font-semibold text-base sm:text-lg hover:bg-white/30 transition shadow-lg"
            >
              Read Documentation
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 sm:mt-20 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              { num: "1", title: "Install Plugin", desc: "Add AccessLens to your Storyblok space in just a few clicks" },
              { num: "2", title: "Analyze Content", desc: "Click AccessLens button in any story to see instant accessibility insights" },
              { num: "3", title: "Apply Fixes", desc: "Use AI-powered suggestions to fix issues with one click" }
            ].map((step) => (
              <div key={step.num} className="text-center backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative backdrop-blur-lg bg-black/30 border-t border-white/10 py-6 sm:py-8 mt-16 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base text-gray-400">
            Built for Storyblok Hackathon 2025 • Making the web accessible for everyone
          </p>
        </div>
      </footer>
    </div>
  );
}