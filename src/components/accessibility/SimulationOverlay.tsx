//src/components/accessibility/SImulationOverlay.tsx
"use client";

import React, {useState, useEffect} from "react";
import { AccessibilityAnalyzer, AccessibilityScore, AccessibilityIssue } from "@/lib/accessibility-analyzer";
import { AIRemediationEngine, RemediationSuggestion } from "@/lib/ai-remediation";
import { ScreenReaderSim } from "../simulations/ScreenReaderSim";
import { VisionSim, VisionSimulationType } from "../simulations/VisionSim";
import { MotorSim, MotorSimulationType } from "../simulations/MotorSim";
import { ScoreCard } from "./ScoreCard";
import { RemediationPanel } from "./RemediationPanel";

interface SimulationOverlayProps {
    storyContent: string;
    storyId: string;
    onClose: () => void;
}

type SimulationMode = "none" | "screen-reader" | VisionSimulationType | MotorSimulationType;

export const SimulationOverlay: React.FC<SimulationOverlayProps> = ({
    storyContent,
    storyId,
    onClose,
}) => {
    const [activeSimulation, setActiveSimulation] = useState<SimulationMode>("none");
    const [score, setScore] = useState<AccessibilityScore | null>(null);
    const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
    const [suggestions, setSuggestions] = useState<RemediationSuggestion[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        analyzeContent();
    }, [storyContent]);

    const analyzeContent = async () => {
        setIsAnalyzing(true);
        try{
            const analyzer = new AccessibilityAnalyzer();
            const aiEngine = new AIRemediationEngine();

            const analysis = await analyzer.analyzeContent(storyContent);
            setScore(analysis.score);
            setIssues(analysis.issues);

            //generate AI suggestions for the top issues
            const aiSuggestions = await aiEngine.generateSuggestions(storyContent, analysis.issues);
            setSuggestions(aiSuggestions);
        } catch (error){
            console.error("Analyssi error:", error);
        } finally{
            setIsAnalyzing(false);
        }
    };

    const handleApplyFix = async (suggestion: RemediationSuggestion) => {
        try{
            const response = await fetch("/api/remediate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    storyId,
                    fix: suggestion,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to apply fix");
            }

            //Re analayze after applying the fix
            await analyzeContent();
        } catch (error){
            console.error("Error applying fix:", error);
            alert("failed to apply fix. Please try again.");
        }
    };


    const simulationOptions = [
        {value: "none", label: "No Simulation", category: "None"},
        { value: "screen-reader", label: "Screen Reader", category: "Assistive Tech" },
        { value: "protanopia", label: "Protanopia (Red-Blind)", category: "Color Blindness" },
        { value: "deuteranopia", label: "Deuteranopia (Green-Blind)", category: "Color Blindness" },
        { value: "tritanopia", label: "Tritanopia (Blue-Blind)", category: "Color Blindness" },
        { value: "achromatopsia", label: "Total Color Blindness", category: "Color Blindness" },
        { value: "low-vision", label: "Low Vision", category: "Vision" },
        { value: "blur", label: "Blurred Vision", category: "Vision" },
        { value: "cataracts", label: "Cataracts", category: "Vision" },
        { value: "tremor", label: "Hand Tremor", category: "Motor" },
        { value: "limited-mobility", label: "Limited Mobility", category: "Motor" },
    ];

    const groupedOptions = simulationOptions.reduce((acc, option) => {
        if (!acc[option.category]) {
            acc[option.category] = [];
        }
        acc[option.category].push(option);
        return acc;
    }, {} as Record<string, typeof simulationOptions>);

    //Decide which simulation component to render
    const isVisionSim = ["protanopia", "deuteranopia", "tritanopia", "achromatopsia", "low-vision", "blur", "cataracts"].includes(activeSimulation);
    const isMotorSim = ["tremor", "limited-mobility"].includes(activeSimulation);
    const isScreenReader = activeSimulation === "screen-reader";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex">
      {/* Left Control Panel */}
      <div className="w-96 bg-white overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-3xl">♿</span>
                AccessLens
              </h1>
              <p className="text-xs text-gray-500 mt-1">Accessibility Preview & Analysis</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition"
              aria-label="Close AccessLens"
            >
              ×
            </button>
          </div>

          {/* Simulation Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Accessibility Simulation
            </label>
            <select
              value={activeSimulation}
              onChange={(e) => setActiveSimulation(e.target.value as SimulationMode)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            >
              {Object.entries(groupedOptions).map(([category, options]) => (
                <optgroup key={category} label={category}>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Score Card */}
          {score && <ScoreCard score={score} isLoading={isAnalyzing} />}

          {/* Issues Summary */}
          {issues.length > 0 && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                <span>⚠️</span>
                {issues.length} Issue{issues.length !== 1 ? "s" : ""} Found
              </h4>
              <div className="space-y-1">
                {["critical", "serious", "moderate", "minor"].map((impact) => {
                  const count = issues.filter((issue) => issue.impact === impact).length;
                  if (count === 0) return null;
                  return (
                    <div key={impact} className="flex justify-between text-xs">
                      <span className="capitalize text-gray-700">{impact}:</span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remediation Panel */}
          <RemediationPanel
            suggestions={suggestions}
            storyId={storyId}
            onApplyFix={handleApplyFix}
          />
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="flex-1 relative bg-white">
        {isVisionSim ? (
          <VisionSim simulationType={activeSimulation as VisionSimulationType}>
            <div className="w-full h-full overflow-auto p-8">
              <div dangerouslySetInnerHTML={{ __html: storyContent }} />
            </div>
          </VisionSim>
        ) : isMotorSim ? (
          <MotorSim simulationType={activeSimulation as MotorSimulationType} isActive={true}>
            <div className="w-full h-full overflow-auto p-8">
              <div dangerouslySetInnerHTML={{ __html: storyContent }} />
            </div>
          </MotorSim>
        ) : (
          <div className="w-full h-full overflow-auto p-8">
            <div dangerouslySetInnerHTML={{ __html: storyContent }} />
          </div>
        )}

        {/* Screen Reader Overlay */}
        {isScreenReader && (
          <ScreenReaderSim content={storyContent} isActive={true} />
        )}
      </div>
    </div>
  );
};