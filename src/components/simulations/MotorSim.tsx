//src/components/simulations/MotorSim.tsx
"use client";

import React, { useEffect, useState } from "react";

export type MotorSimulationType = "none" | "tremor" | "limited-mobility" | "one-hand";

interface MotorSimProps {
    simulationType: MotorSimulationType;
    isActive: boolean;
    children: React.ReactNode;
}

export const MotorSim: React.FC<MotorSimProps> = ({ simulationType, isActive, children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tremorOffset, setTremorOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive || simulationType !== "tremor") return;

    const updateTremor = () => {
      // simulate a hand tremor with random offset
      setTremorOffset({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 12,
      });
    };

    const interval = setInterval(updateTremor, 80);
    return () => clearInterval(interval);
  }, [isActive, simulationType]);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive]);

  const getCursorStyle = (): React.CSSProperties => {
    if (!isActive) return {};

    switch (simulationType) {
      case "tremor":
        return {
          cursor: "none",
        };
      case "limited-mobility":
        return {
          cursor: "crosshair",
        };
      case "one-hand":
        return {
          cursor: "help",
        };
      default:
        return {};
    }
  };

  const getSimulationDescription = (): string => {
    const descriptions: Record<MotorSimulationType, string> = {
      none: "",
      tremor: "Hand Tremor - Cursor shakes randomly",
      "limited-mobility": "Limited Mobility - Precise targeting difficult",
      "one-hand": "One-Hand Usage - Keyboard shortcuts restricted",
    };
    return descriptions[simulationType];
  };

  if (!isActive) return <>{children}</>;

  return (
    <div style={getCursorStyle()}>
      {children}

      {/* Custom cursor for tremor simulation */}
      {simulationType === "tremor" && (
        <div
          className="fixed w-5 h-5 pointer-events-none z-[10000]"
          style={{
            left: mousePosition.x + tremorOffset.x,
            top: mousePosition.y + tremorOffset.y,
            transform: "translate(-50%, -50%)",
            transition: "none",
          }}
        >
          <div className="w-full h-full bg-red-500 rounded-full opacity-70 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-700 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Simulation info overlay */}
      {simulationType !== "none" && (
        <div className="fixed bottom-4 right-4 bg-orange-600 text-white p-3 rounded-lg text-sm z-50 max-w-xs">
          <div className="flex items-center gap-2 font-medium mb-1">
            <span className="text-xl">🖱️</span>
            Motor Impairment Simulation
          </div>
          <div className="text-xs opacity-90">{getSimulationDescription()}</div>
        </div>
      )}
    </div>
  );
};