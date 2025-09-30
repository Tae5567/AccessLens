//src/lib/ai-remediation.ts

import OpenAI from "openai";
import { AccessibilityIssue } from "./accessibility-analyzer";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export interface RemediationSuggestion {
    type: "alt-text" | "aria-label" | "heading-structure" | "color-contrast" | "focus-management";
    element: string;
    issue: string;
    suggestion: string;
    confidence: number;
    autoFixable: boolean;
    code?: string;
    componentId?: string;
}

export class AIRemediationEngine {
    async generateSuggestions( htmlContent: string, issues: AccessibilityIssue[]): Promise<RemediationSuggestion[]> {
        const suggestions: RemediationSuggestion[] = [];

        //Process high imoact issues first
        const sortedIssues = issues.sort((a, b) => {
            const impactOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
            return impactOrder[a.impact] - impactOrder[b.impact];
        });

        for (const issue of sortedIssues.slice(0, 10)) {
            //limit to top 10 issues
            try{
                const suggestion = await this.generateSuggestionForIssue(htmlContent, issue);
                if (suggestion) {
                    suggestions.push(suggestion);
                }
            } catch (error) {
                console.error("error generating suggestion:", error);
            }
        }
        return suggestions;
    }

    private async generateSuggestionForIssue( htmlContent: string, issue: AccessibilityIssue): Promise<RemediationSuggestion | null> {
        const nodeInfo = issue.nodes[0]?.html || "";

        const prompt = `You are an accessibility expert. Analyze this HTML accessibility issue and provide a specific remediation suggestion.
        Issue: ${issue.description}
        Help: ${issue.help}
        Element: ${nodeInfo}
        Context: ${htmlContent.substring(0, 500)}...

        Respond with ONLY valid JSON in this exact format:
        {
        "type": "alt-text|aria-label|heading-structure|color-contrast|focus-management",
        "element": "specific element selector or description",
        "issue": "brief issue description",
        "suggestion": "specific remediation suggestion",
        "confidence": 0.85,
        "autoFixable": true,
        "code": "actual HTML code fix if autoFixable, otherwise null"
        }`;

        try{

            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 500,
            });
            const content = response.choices[0].message.content;
            if (!content) return null;

            const suggestion = JSON.parse(content);
            return suggestion;
        } catch (error){
        console.error("AI remediation error:", error);
        return null;
        }
    }

    async generateAltText(imageUrl: string, context:string): Promise<string> {
        const prompt = `Generate concise, descriptive alt tect for this image.Context: ${context}. Keep it under 125 characters and focus on the image's purpose in context.`;
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: { url: imageUrl },
                            },
                        ],
                    },
                ],
                max_tokens: 100,
            });

            return response.choices[0].message.content || "Image description unavailable "
        } catch (error){
            console.error("Alt text generation error:", error);
            return "Image description unavailable";
        }
    }
}