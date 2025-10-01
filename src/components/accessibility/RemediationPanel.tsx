// src/components/accessibility/RemediationPanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { RemediationSuggestion } from "@/lib/ai-remediation";

interface RemediationPanelProps {
  suggestions: RemediationSuggestion[];
  storyId: string;
  onApplyFix: (suggestion: RemediationSuggestion) => Promise<void>;
  currentScore?: number; // Add this prop
}

export const RemediationPanel: React.FC<RemediationPanelProps> = ({
  suggestions,
  storyId,
  onApplyFix,
  currentScore = 0,
}) => {
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());
  const [applyingFixes, setApplyingFixes] = useState<Set<string>>(new Set());
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Detect score improvements
  useEffect(() => {
    if (lastScore !== null && currentScore > lastScore && currentScore >= 90) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
    setLastScore(currentScore);
  }, [currentScore, lastScore]);

  const toggleExpanded = (suggestionId: string) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(suggestionId)) {
      newExpanded.delete(suggestionId);
    } else {
      newExpanded.add(suggestionId);
    }
    setExpandedSuggestions(newExpanded);
  };

  const handleApplyFix = async (suggestion: RemediationSuggestion, suggestionId: string) => {
    setApplyingFixes((prev) => new Set(prev).add(suggestionId));

    try {
      await onApplyFix(suggestion);
    } catch (error) {
      console.error("Error applying fix:", error);
    } finally {
      setApplyingFixes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(suggestionId);
        return newSet;
      });
    }
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      "alt-text": "border-blue-300 bg-blue-50",
      "aria-label": "border-purple-300 bg-purple-50",
      "heading-structure": "border-green-300 bg-green-50",
      "color-contrast": "border-orange-300 bg-orange-50",
      "focus-management": "border-pink-300 bg-pink-50",
    };
    return colors[type] || "border-gray-300 bg-gray-50";
  };

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      "alt-text": "🖼️",
      "aria-label": "🏷️",
      "heading-structure": "📝",
      "color-contrast": "🎨",
      "focus-management": "🎯",
    };
    return icons[type] || "🔧";
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-6xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
        <p className="text-sm text-gray-600">
          No major accessibility issues found. Great job!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Celebration Popup */}
      {showCelebration && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-6 rounded-xl shadow-2xl z-[10000] animate-bounce">
          <div className="text-center">
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-xl font-bold mb-1">Excellent Work!</h3>
            <p className="text-sm">Your accessibility score improved to {currentScore}%</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-xl">🔧</span>
          AI Remediation Suggestions ({suggestions.length})
        </h3>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const suggestionId = `${suggestion.type}-${index}`;
            const isExpanded = expandedSuggestions.has(suggestionId);
            const isApplying = applyingFixes.has(suggestionId);

            return (
              <div
                key={suggestionId}
                className={`border-2 rounded-lg p-3 transition-all ${getTypeColor(suggestion.type)}`}
              >
                <div
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleExpanded(suggestionId)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {suggestion.type.replace("-", " ").toUpperCase()}
                      </span>
                      <span className="text-xs bg-white px-2 py-0.5 rounded-full font-medium">
                        {Math.round(suggestion.confidence * 100)}% confident
                      </span>
                      {suggestion.autoFixable && (
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
                          Auto-fixable
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{suggestion.issue}</p>
                  </div>
                  <div className="text-gray-500 text-xl ml-2">
                    {isExpanded ? "−" : "+"}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">AI Suggestion:</p>
                      <p className="text-sm text-gray-800 bg-white p-2 rounded">
                        {suggestion.suggestion}
                      </p>
                    </div>

                    {suggestion.code && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Proposed Fix:</p>
                        <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                          <code>{suggestion.code}</code>
                        </pre>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {suggestion.autoFixable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyFix(suggestion, suggestionId);
                          }}
                          disabled={isApplying}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                          {isApplying ? (
                            <>
                              <span className="animate-spin">⚙️</span>
                              Applying...
                            </>
                          ) : (
                            <>
                              <span>✓</span>
                              Apply Fix
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(suggestionId);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};