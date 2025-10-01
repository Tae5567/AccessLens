//src/lib/accessibility-analyzer.ts
import axe from "axe-core";

export interface AccessibilityIssue {
    id: string;
    impact: "minor" | "moderate" | "serious" | "critical";
    description: string;
    help: string;
    helpUrl: string;
    nodes: any[];
    tags: string[];
}

export interface AccessibilityScore {
    overall: number;
    wcag: {
        a: number;
        aa: number;
        aaa: number;
    };
    categories: {
        perceivable: number;
        operable: number;
        understandable: number;
        robust: number;
    };
}

export interface AnalysisResult{
    issues: AccessibilityIssue[];
    score: AccessibilityScore;
    timestamp: Date;
}

class AccessibilityAnalyzerClass {
  private currentAnalysis: Promise<AnalysisResult> | null = null;
  private abortController: AbortController | null = null;

  async analyzeContent(htmlContent: string): Promise<AnalysisResult> {
    // If there's an ongoing analysis, wait for it to complete first
    if (this.currentAnalysis) {
      try {
        await this.currentAnalysis;
      } catch (error) {
        // Ignore errors from previous analysis
      }
    }

    // Start new analysis
    this.currentAnalysis = this.performAnalysis(htmlContent);
    
    try {
      const result = await this.currentAnalysis;
      return result;
    } finally {
      this.currentAnalysis = null;
    }
  }

  private async performAnalysis(htmlContent: string): Promise<AnalysisResult> {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      const results = await axe.run(doc.body, {
        rules: {
          "color-contrast": { enabled: true },
          "image-alt": { enabled: true },
          "label": { enabled: true },
          "link-name": { enabled: true },
        },
      });

      const issues: AccessibilityIssue[] = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact as any,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes,
        tags: violation.tags,
      }));

      const score = this.calculateScore(results);

      return {
        issues,
        score,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Axe analysis error:", error);
      throw error;
    }
  }

  private calculateScore(results: any): AccessibilityScore {
    const totalRules = results.passes.length + results.violations.length;
    const passedRules = results.passes.length;
    const overall = totalRules > 0 ? Math.round((passedRules / totalRules) * 100) : 100;

    //Calculate WCAG level scores
    const wcagA = this.calculateWCAGScore(results, ["wcag2a"]);
    const wcagAA = this.calculateWCAGScore(results, ["wcag2a", "wcag2aa"]);
    const wcagAAA = this.calculateWCAGScore(results, ["wcag2a", "wcag2aa", "wcag2aaa"]);

    //Calculate category scores
    const categories = {
        perceivable: this.calculateCategoryScore(results, [
            "cat.color",
            "cat.text-alternatives",
            "cat.time-and-media",
            "cat.adaptable",
        ]),
        operable: this.calculateCategoryScore(results, [
            "cat.keyboard",
            "cat.navigation",
            "cat.seizure",
        ]),
        understandable: this.calculateCategoryScore(results, [
            "cat.language",
            "cat.readable",
            "cat.predictable",
        ]),
        robust: this.calculateCategoryScore(results, ["cat.parsing", "cat.name-role-value" ]),  
    };

    return{
        overall,
        wcag: { a: wcagA, aa: wcagAA, aaa: wcagAAA },
        categories,
    };
  }

  private calculateWCAGScore(results: any, tags: string[]) : number {
    const relevantPasses = results.passes.filter((pass: any)=> 
        pass.tags.some((tag:string)=> tags.includes(tag))
    );
    const relevantViolations = results.violations.filter((violation: any)=>
        violation.tags.some((tag:string)=> tags.includes(tag))
    );

    const total = relevantPasses.length + relevantViolations.length;
    return total > 0 ? Math.round((relevantPasses.length / total) * 100) : 100;
  }

  private calculateCategoryScore(results: any, tags: string[]) : number {
    const relevantPasses = results.passes.filter((pass: any)=> 
        pass.tags.some((tag:string)=> tags.includes(tag))
    );
    const relevantViolations = results.violations.filter((violation: any)=>
        violation.tags.some((tag:string)=> tags.includes(tag))
    );

    const total = relevantPasses.length + relevantViolations.length;
    return total > 0 ? Math.round((relevantPasses.length / total) * 100) : 100;
  }
}

// Export singleton instance
export const AccessibilityAnalyzer = new AccessibilityAnalyzerClass();