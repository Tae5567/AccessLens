//src/app/api/analyze/route.ts
//Analysis API Route
import { NextRequest, NextResponse } from "next/server";
import { AccessibilityAnalyzer } from "@/lib/accessibility-analyzer";
import { AIRemediationEngine } from "@/lib/ai-remediation";

export async function POST(request: NextRequest) {
    try{
        const {htmlContent} = await request.json();

        if (!htmlContent) {
            return NextResponse.json(
                { error: "HTML content required"},
                {status: 400}
            );
        }
        const analyzer = new AccessibilityAnalyzer();
        const aiEngine = new AIRemediationEngine();

        //analyze accessibility
        const analysis = await analyzer.analyzeContent(htmlContent);

        //generate AI suggestions
        const suggestions = await aiEngine.generateSuggestions(
            htmlContent,
            analysis.issues
        );

        return NextResponse.json({
            score: analysis.score,
            issues: analysis.issues,
            suggestions,
            timestamp: analysis.timestamp,
        });
    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            {error: "analysis failed"},
            {status: 500}
        );
    }
}