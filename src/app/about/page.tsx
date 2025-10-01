// src/app/about/page.tsx
import Navigation from "@/components/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">About AccessLens</h1>
        
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-base sm:text-lg text-gray-200 mb-4">
            AccessLens was created to bridge the gap between content creation and accessibility.
            We believe that making content accessible shouldn't be an afterthought—it should be
            integrated seamlessly into the content creation workflow.
          </p>
          <p className="text-base sm:text-lg text-gray-200">
            By combining AI-powered analysis, immersive simulations, and intelligent remediation,
            AccessLens empowers content creators to build truly inclusive digital experiences.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-xl shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">🎯 Our Goal</h3>
            <p className="text-sm sm:text-base text-gray-200">
              Make accessibility testing as easy as clicking a button, with AI-powered
              suggestions that help you fix issues instantly.
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-xl shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">💡 Innovation</h3>
            <p className="text-sm sm:text-base text-gray-200">
              Combining cutting-edge AI with proven accessibility standards to create
              a tool that's both powerful and easy to use.
            </p>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-6 sm:p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Built For Storyblok</h2>
          <p className="text-base sm:text-lg text-gray-200 mb-4">
            AccessLens integrates seamlessly with Storyblok's visual editor, providing
            real-time accessibility feedback as you create and edit content.
          </p>
          <ul className="space-y-2 text-sm sm:text-base text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>Native plugin integration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>One-click fixes that update content directly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">✓</span>
              <span>Real-time preview in visual editor</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}