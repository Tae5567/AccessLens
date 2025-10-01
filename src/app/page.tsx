// src/app/page.tsx
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-50">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navigation />
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-6">
            <span className="text-6xl sm:text-8xl">♿</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
            Access<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500">Lens</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-700 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            AI-Powered Accessibility Preview for Storyblok Content
          </p>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Experience your content through the eyes of users with disabilities.
            Real-time analysis, immersive simulations, and intelligent insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
          {[
            { icon: "🔥", title: "Visual Heatmap", desc: "See accessibility issues overlaid directly on your content" },
            { icon: "🧠", title: "AI Analysis", desc: "GPT-4 powered insights and remediation suggestions" },
            { icon: "👁️", title: "Vision Simulations", desc: "Experience content through color blindness, low vision, and more" },
            { icon: "📊", title: "WCAG Scoring", desc: "Real-time compliance metrics for A, AA, and AAA levels" }
          ].map((feature, idx) => (
            <div key={idx} className="backdrop-blur-lg bg-white/60 border border-sky-200/50 p-4 sm:p-6 rounded-2xl shadow-xl hover:bg-white/80 transition-all duration-300 hover:scale-105">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center backdrop-blur-lg bg-white/60 border border-sky-200/50 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Ready to Preview Your Content?
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Open AccessLens with any Storyblok story and see instant accessibility insights
            with visual heatmaps and immersive simulations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              href="/preview?story=landing-page"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-sky-600 transition shadow-lg"
            >
              Try Demo →
            </Link>
            <Link
              href="/docs"
              className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-lg bg-white/80 border border-sky-300 text-gray-900 rounded-xl font-semibold text-base sm:text-lg hover:bg-white transition shadow-lg"
            >
              Read Documentation
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 sm:mt-20 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              { num: "1", title: "Load Your Story", desc: "Navigate to AccessLens with your Storyblok story slug in the URL" },
              { num: "2", title: "Analyze & Visualize", desc: "See instant accessibility insights with visual heatmaps and WCAG scores" },
              { num: "3", title: "Experience Simulations", desc: "View your content through vision impairments, motor limitations, and screen readers" }
            ].map((step) => (
              <div key={step.num} className="text-center backdrop-blur-lg bg-white/60 border border-sky-200/50 p-6 rounded-2xl shadow-xl">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-700">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative backdrop-blur-lg bg-white/40 border-t border-sky-200/50 py-6 sm:py-8 mt-16 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            Built for Storyblok Hackathon 2025 • Making the web accessible for everyone
          </p>
        </div>
      </footer>
    </div>
  );
}