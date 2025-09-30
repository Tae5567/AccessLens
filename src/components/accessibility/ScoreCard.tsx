//src/components/accessibility/ScoreCard.tsx

"use client";

import React from "react";
import { AccessibilityScore } from "@/lib/accessibility-analyzer";

interface ScoreCardProps {
    score: AccessibilityScore;
    isLoading: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, isLoading }) => {
    const getScoreColor = (scoreValue: number): string => {
        if (scoreValue >= 90) return "text-green-600";
        if (scoreValue >= 70) return "text-yelow-600";
        if (scoreValue >= 50) return "text-orange-600";
        return "text-red-600";     
    };

    const getScoreBackground = (scoreValue: number): string => {
        if (scoreValue >= 90) return "bg-green-50 border-green-200";
        if (scoreValue >= 70) return "bg-green-50 border-yellow-200";
        if (scoreValue >= 50) return "bg-green-50 border-orange-200";
        return "bg-green-50 border-red-200";     
    };

    const getScoreGrade = (scoreValue: number): string => {
        if (scoreValue >= 90) return "A";
        if (scoreValue >= 80) return "B";
        if (scoreValue >= 70) return "C";
        if (scoreValue >= 60) return "D";
        return "F";
    };

    if (isLoading) {
        return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span>
        Accessibility Score
      </h3>

      {/* Overall Score */}
      <div className={`rounded-lg p-4 mb-4 border-2 ${getScoreBackground(score.overall)}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Overall Score</div>
          </div>
          <div className={`text-5xl font-bold ${getScoreColor(score.overall)} opacity-20`}>
            {getScoreGrade(score.overall)}
          </div>
        </div>
      </div>

      {/* WCAG Levels */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-3 text-gray-700">WCAG 2.1 Compliance</h4>
        <div className="space-y-2">
          {[
            { level: "A", score: score.wcag.a, description: "Essential" },
            { level: "AA", score: score.wcag.aa, description: "Ideal (Standard)" },
            { level: "AAA", score: score.wcag.aaa, description: "Specialized" },
          ].map((item) => (
            <div key={item.level} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 w-8">
                  {item.level}
                </span>
                <span className="text-xs text-gray-600">{item.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.score >= 90
                        ? "bg-green-500"
                        : item.score >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(item.score)} min-w-[45px] text-right`}>
                  {item.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-gray-700">POUR Principles</h4>
        <div className="space-y-2">
          {[
            { key: "perceivable", label: "Perceivable", icon: "👁️", score: score.categories.perceivable },
            { key: "operable", label: "Operable", icon: "⌨️", score: score.categories.operable },
            { key: "understandable", label: "Understandable", icon: "🧠", score: score.categories.understandable },
            { key: "robust", label: "Robust", icon: "💪", score: score.categories.robust },
          ].map((category) => (
            <div key={category.key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <span className="text-lg">{category.icon}</span>
                <span className="text-xs font-medium text-gray-700">{category.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      category.score >= 90
                        ? "bg-green-500"
                        : category.score >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(category.score)} min-w-[45px] text-right`}>
                  {category.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};