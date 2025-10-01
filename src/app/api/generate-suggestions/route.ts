// src/app/api/generate-suggestions/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, issues } = await request.json();

    if (!htmlContent || !issues) {
      return NextResponse.json(
        { error: "HTML content and issues are required" },
        { status: 400 }
      );
    }

    const suggestions = [];

    for (const issue of issues.slice(0, 5)) {
      // Limit to 5 for speed
      try {
        const nodeInfo = issue.nodes[0]?.html || "";

        const prompt = `You are an accessibility expert. Analyze this HTML accessibility issue and provide a specific remediation suggestion.

Issue: ${issue.description}
Help: ${issue.help}
Element: ${nodeInfo}

Respond with ONLY valid JSON in this exact format:
{
  "type": "alt-text|aria-label|heading-structure|color-contrast|focus-management",
  "element": "specific element selector",
  "issue": "brief issue description",
  "suggestion": "specific remediation suggestion",
  "confidence": 0.85,
  "autoFixable": true,
  "code": "actual HTML code fix if autoFixable, otherwise null"
}`;

        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 500,
        });

        const content = response.choices[0].message.content;
        if (content) {
          const suggestion = JSON.parse(content);
          suggestions.push(suggestion);
        }
      } catch (error) {
        console.error("Error processing issue:", error);
      }
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Generate suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}