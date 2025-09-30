//src/components/simulations/VisionSim.tsx
"use client";

import React from "react";

export type VisionSimulationType = | "none" | "protanopia"  | "deuteranopia" | "tritanopia" | "achromatopsia" | "low-vision" | "blur" | "cataracts";

interface VisionSimProps {
    simulationType: VisionSimulationType;
    children: React.ReactNode;
}

export const Visionsim: React.FC<VisionSimProps> = ({ simulationType, children }) => {
  const getFilterStyle = (): React.CSSProperties => {
    switch (simulationType) {
      case "protanopia":
        return {
          filter: "url(#protanopia-filter)",
        };
      case "deuteranopia":
        return {
          filter: "url(#deuteranopia-filter)",
        };
      case "tritanopia":
        return {
          filter: "url(#tritanopia-filter)",
        };
      case "achromatopsia":
        return {
          filter: "grayscale(100%)",
        };
      case "low-vision":
        return {
          filter: "contrast(0.5) brightness(0.6)",
        };
      case "blur":
        return {
          filter: "blur(3px)",
        };
      case "cataracts":
        return {
          filter: "blur(2px) contrast(0.7) brightness(1.2)",
        };
      default:
        return {};
    }
  };

  const getSimulationLabel = (): string => {
    const labels: Record<VisionSimulationType, string> = {
        none: "No Simulation",
        protanopia: "Protanopia (Red-Blind)",
        deuteranopia: "Deuteranopia (Green-Blind)",
        tritanopia: "Tritanopia (Blue-Blind)",
        achromatopsia: "Achromatopsia (Total Color Blindness)",
        "low-vision": " Low Vision",
        blur: "Blurred Vision",
        cataracts: "Cataracts",
    };
    return labels[simulationType];
  };

  return (
    <>
      {/* SVG Filters for Color Blindness */}
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          {/* Protanopia - Red-Blind */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0 0 0
                      0.558 0.442 0 0 0
                      0 0.242 0.758 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Deuteranopia - Green-Blind */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0
                      0.7 0.3 0 0 0
                      0 0.3 0.7 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Tritanopia - Blue-Blind */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95 0.05 0 0 0
                      0 0.433 0.567 0 0
                      0 0.475 0.525 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <div style={getFilterStyle()}>
        {children}
        
        {/* Simulation Label */}
        {simulationType !== "none" && (
          <div className="fixed bottom-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <span className="text-xl">👁️</span>
              <span className="text-sm font-medium">Vision Simulation: {getSimulationLabel()}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};