// src/app/docs/page.tsx
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-5xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Documentation</h1>
        
        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-xl shadow-xl sticky top-24">
              <h3 className="font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#getting-started" className="text-purple-300 hover:text-white transition">Getting Started</a></li>
                <li><a href="#features" className="text-purple-300 hover:text-white transition">Features</a></li>
                <li><a href="#simulations" className="text-purple-300 hover:text-white transition">Simulations</a></li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            <section id="getting-started" className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Getting Started</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">1. Installation</h3>
                  <p className="text-sm sm:text-base text-gray-200 mb-3">
                    Install the AccessLens plugin in your Storyblok space:
                  </p>
                  <div className="bg-gray-900/50 text-green-400 p-4 rounded-lg font-mono text-xs sm:text-sm border border-gray-700">
                    Settings → Plugins → Add Plugin → Upload plugin.json
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">2. Configuration</h3>
                  <p className="text-sm sm:text-base text-gray-200 mb-3">
                    Configure your AccessLens app URL in the plugin settings
                  </p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Key Features</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4 bg-blue-500/10 py-2 rounded-r">
                  <h3 className="text-base sm:text-lg font-bold text-white">Real-Time Analysis</h3>
                  <p className="text-sm sm:text-base text-gray-200">
                    Instant WCAG 2.1 compliance scores with detailed breakdowns
                  </p>
                </div>

                <div className="border-l-4 border-purple-400 pl-4 bg-purple-500/10 py-2 rounded-r">
                  <h3 className="text-base sm:text-lg font-bold text-white">AI Remediation</h3>
                  <p className="text-sm sm:text-base text-gray-200">
                    GPT-4 powered suggestions with one-click fixes
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 p-6 sm:p-8 rounded-2xl text-center shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Try AccessLens?</h2>
              <p className="text-sm sm:text-base text-gray-200 mb-6">
                Launch the demo and see how it transforms your accessibility workflow
              </p>
              <Link
                href="/preview?story=home"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-base sm:text-lg hover:from-purple-600 hover:to-pink-600 transition shadow-lg"
              >
                Launch Demo →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}