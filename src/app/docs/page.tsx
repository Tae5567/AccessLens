// src/app/docs/page.tsx
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-5xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">Documentation</h1>
        
        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-lg bg-white/60 border border-sky-200/50 p-6 rounded-xl shadow-xl sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#getting-started" className="text-blue-600 hover:text-blue-800 transition">Getting Started</a></li>
                <li><a href="#features" className="text-blue-600 hover:text-blue-800 transition">Features</a></li>
                <li><a href="#simulations" className="text-blue-600 hover:text-blue-800 transition">Simulations</a></li>
                <li><a href="#api" className="text-blue-600 hover:text-blue-800 transition">API Usage</a></li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            <section id="getting-started" className="backdrop-blur-lg bg-white/60 border border-sky-200/50 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">1. Access the Preview</h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    Navigate to AccessLens with your Storyblok story slug:
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs sm:text-sm border border-gray-700">
                    https://your-app.com/preview?story=your-story-slug
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">2. Configure Environment</h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    Add your Storyblok credentials to .env.local:
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs sm:text-sm border border-gray-700">
                    NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN=your_preview_token<br/>
                    STORYBLOK_SPACE_ID=your_space_id
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">3. Start Analyzing</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    The preview will automatically load your content and run accessibility analysis.
                    Use the simulation dropdown to explore different perspectives.
                  </p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="backdrop-blur-lg bg-white/60 border border-sky-200/50 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4 bg-red-50 py-3 rounded-r">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Visual Accessibility Heatmap</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    See issues overlaid on your content with color-coded severity zones.
                    Click any zone to see details and suggested fixes.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 rounded-r">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Real-Time WCAG Analysis</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Instant compliance scores for A, AA, and AAA levels with breakdowns
                    across POUR principles (Perceivable, Operable, Understandable, Robust).
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 py-3 rounded-r">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">AI-Powered Insights</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    GPT-4 analyzes your content and provides specific remediation suggestions
                    with explanations of why each fix matters.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 bg-green-50 py-3 rounded-r">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Immersive Simulations</h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Experience your content through 10+ disability perspectives including
                    color blindness, low vision, cataracts, motor impairments, and screen readers.
                  </p>
                </div>
              </div>
            </section>

            {/* Simulations */}
            <section id="simulations" className="backdrop-blur-lg bg-white/60 border border-sky-200/50 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Available Simulations</h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Vision Simulations</h4>
                  <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-1">
                    <li>Protanopia (Red-blind)</li>
                    <li>Deuteranopia (Green-blind)</li>
                    <li>Tritanopia (Blue-blind)</li>
                    <li>Achromatopsia (Total color blindness)</li>
                    <li>Low Vision</li>
                    <li>Blurred Vision</li>
                    <li>Cataracts</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Motor Simulations</h4>
                  <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-1">
                    <li>Hand Tremor</li>
                    <li>Limited Mobility</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Assistive Technology</h4>
                  <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 space-y-1">
                    <li>Screen Reader Simulation with text-to-speech</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* API Usage */}
            <section id="api" className="backdrop-blur-lg bg-white/60 border border-sky-200/50 p-6 sm:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">API Integration</h2>
              
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-gray-700">
                  AccessLens integrates with Storyblok's Content Delivery API to fetch
                  and analyze your stories in real-time.
                </p>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs sm:text-sm border border-gray-700">
                  GET /api/storyblok?slug=your-story-slug
                </div>

                <p className="text-sm sm:text-base text-gray-700">
                  The analysis engine uses axe-core for WCAG compliance testing
                  and OpenAI's GPT-4 for intelligent remediation suggestions.
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-sky-500/20 border border-blue-400/30 p-6 sm:p-8 rounded-2xl text-center shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready to Try AccessLens?</h2>
              <p className="text-sm sm:text-base text-gray-700 mb-6">
                Launch the demo and see how it transforms your accessibility workflow
              </p>
              <Link
                href="/preview?story=landing-page"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl font-bold text-base sm:text-lg hover:from-blue-600 hover:to-sky-600 transition shadow-lg"
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