# AccessLens - Visual Accessibility Preview for Storyblok

**AI-Powered Accessibility Analysis with Interactive Heatmap Visualization**

AccessLens is a web-based accessibility testing tool that integrates with Storyblok CMS to provide real-time WCAG compliance analysis, immersive disability simulations, and visual heatmap overlays showing exactly where accessibility issues exist in your content.

## Features

### 🔥 Visual Accessibility Heatmap
- **Color-coded issue zones** overlaid directly on your content
- **Pulsing animations** for critical accessibility violations
- **Click-to-inspect** detailed information about each issue
- **Severity-based layering** ensuring critical issues are always visible
- **Real-time positioning** that follows content as you scroll

### 📊 Comprehensive WCAG Analysis
- **Real-time scoring** for WCAG 2.1 levels A, AA, and AAA
- **POUR principles breakdown** (Perceivable, Operable, Understandable, Robust)
- **Issue categorization** by severity (Critical, Serious, Moderate, Minor)
- **Progress visualization** with animated score bars

### 🧠 AI-Powered Insights
- **GPT-4 analysis** of accessibility issues
- **Contextual remediation suggestions** explaining why fixes matter
- **Smart issue detection** beyond standard automated testing

### 👁️ Immersive Disability Simulations
**Vision Impairments:**
- Protanopia (Red-blind)
- Deuteranopia (Green-blind)
- Tritanopia (Blue-blind)
- Achromatopsia (Total color blindness)
- Low Vision
- Blurred Vision
- Cataracts

**Motor Impairments:**
- Hand Tremor simulation with cursor shake
- Limited Mobility with difficulty targeting

**Assistive Technology:**
- Screen Reader with text-to-speech navigation
- Keyboard navigation visualization

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Accessibility Engine:** axe-core
- **AI Integration:** OpenAI GPT-4
- **CMS:** Storyblok Content Delivery API
- **Text-to-Speech:** Browser Native Web Speech API

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- Storyblok account with API access
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/accesslens.git
cd accesslens
1. Install dependencies
npm install
1. Configure environment variables
cp .env.example .env.local
Add your credentials to .env.local:
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token
STORYBLOK_MANAGEMENT_TOKEN=your_management_token
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
STORYBLOK_SPACE_ID=your_space_id
1. Run development server
npm run dev
1. Open in browser
http://localhost:3000
Usage
Analyzing Storyblok Content
Navigate to the preview page with your story slug:
http://localhost:3000/preview?story=your-story-slug
The app will:
1. Fetch your story from Storyblok
2. Convert it to HTML for analysis
3. Run accessibility checks
4. Display visual heatmap with issues
5. Generate AI-powered remediation suggestions
