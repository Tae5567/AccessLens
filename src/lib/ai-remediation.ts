// src/lib/ai-remediation.ts
import { AccessibilityIssue } from "./accessibility-analyzer";

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
  async generateSuggestions(
    htmlContent: string,
    issues: AccessibilityIssue[]
  ): Promise<RemediationSuggestion[]> {
    try {
      const response = await fetch("/api/generate-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          issues: issues.slice(0, 10), // Limit to top 10
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate suggestions");
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return [];
    }
  }

  async generateAltText(imageUrl: string, context: string): Promise<string> {
    try {
      const response = await fetch("/api/generate-alt-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl, context }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate alt text");
      }

      const data = await response.json();
      return data.altText || "Image description unavailable";
    } catch (error) {
      console.error("Error generating alt text:", error);
      return "Image description unavailable";
    }
  }
}