// src/components/accessibility/AccessibilityHeatmap.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { AccessibilityIssue } from "@/lib/accessibility-analyzer";

interface HeatmapOverlayProps {
  issues: AccessibilityIssue[];
  isActive: boolean;
  contentRef: HTMLDivElement | null;
}

interface HeatmapZone {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  severity: "critical" | "serious" | "moderate" | "minor";
  issue: AccessibilityIssue;
  element: HTMLElement;
}

export const AccessibilityHeatmap: React.FC<HeatmapOverlayProps> = ({
  issues,
  isActive,
  contentRef,
}) => {
  const [zones, setZones] = useState<HeatmapZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<HeatmapZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<HeatmapZone | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !contentRef) {
      setZones([]);
      setAnimationComplete(false);
      return;
    }

    const generateHeatmapZones = () => {
      const newZones: HeatmapZone[] = [];
      const contentRect = contentRef.getBoundingClientRect();
      const scrollTop = contentRef.scrollTop;
      const scrollLeft = contentRef.scrollLeft;

      issues.forEach((issue, index) => {
        try {
          let targetElement: HTMLElement | null = null;

          if (issue.nodes && issue.nodes.length > 0) {
            const node = issue.nodes[0];
            if (node.target && node.target.length > 0) {
              const selector = node.target[0];
              targetElement = contentRef.querySelector(selector);
            }
          }

          if (!targetElement) {
            if (issue.id === "image-alt") {
              const images = contentRef.querySelectorAll("img:not([alt]), img[alt='']");
              targetElement = images[index % images.length] as HTMLElement;
            } else if (issue.id === "color-contrast") {
              const allElements = contentRef.querySelectorAll('[style*="color"]');
              targetElement = allElements[index % allElements.length] as HTMLElement;
            } else if (issue.id === "link-name") {
              const links = contentRef.querySelectorAll("a");
              for (let link of links) {
                if (!link.textContent?.trim() || link.textContent?.trim().toLowerCase().includes("click here")) {
                  targetElement = link as HTMLElement;
                  break;
                }
              }
            } else if (issue.id === "button-name") {
              const buttons = contentRef.querySelectorAll("button:not([aria-label]):not([aria-labelledby])");
              targetElement = buttons[index % buttons.length] as HTMLElement;
            }
          }

          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            
            newZones.push({
              id: `zone-${index}`,
              top: rect.top - contentRect.top + scrollTop,
              left: rect.left - contentRect.left + scrollLeft,
              width: rect.width,
              height: rect.height,
              severity: issue.impact,
              issue: issue,
              element: targetElement,
            });
          }
        } catch (error) {
          console.error("Error creating heatmap zone:", error);
        }
      });

      setZones(newZones);
      // Trigger animation complete after all zones have rendered
      setTimeout(() => setAnimationComplete(true), newZones.length * 100 + 500);
    };

    generateHeatmapZones();

    const handleUpdate = () => generateHeatmapZones();
    contentRef.addEventListener("scroll", handleUpdate);
    window.addEventListener("resize", handleUpdate);

    return () => {
      contentRef.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [issues, isActive, contentRef]);

  if (!isActive) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "rgba(220, 38, 38, 0.3)";
      case "serious": return "rgba(249, 115, 22, 0.3)";
      case "moderate": return "rgba(234, 179, 8, 0.3)";
      case "minor": return "rgba(59, 130, 246, 0.3)";
      default: return "rgba(156, 163, 175, 0.3)";
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case "critical": return "#dc2626";
      case "serious": return "#f97316";
      case "moderate": return "#eab308";
      case "minor": return "#3b82f6";
      default: return "#9ca3af";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return "🔴";
      case "serious": return "🟠";
      case "moderate": return "🟡";
      case "minor": return "🔵";
      default: return "⚪";
    }
  };

  const getZIndexBySeverity = (severity: string) => {
  switch (severity) {
    case "critical": return 1003;
    case "serious": return 1002;
    case "moderate": return 1001;
    case "minor": return 1000;
    default: return 999;
  }
};

  const handleZoneClick = (zone: HeatmapZone, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedZone(selectedZone?.id === zone.id ? null : zone);
    
    zone.element.style.outline = `3px solid ${getSeverityBorderColor(zone.severity)}`;
    zone.element.style.outlineOffset = "2px";
    zone.element.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      zone.element.style.outline = "";
      zone.element.style.outlineOffset = "";
    }, 3000);
  };

  return (
    <>
      {/* Background Blur Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(1px) brightness(0.95)",
          pointerEvents: "none",
          zIndex: 999,
          transition: "backdrop-filter 0.3s ease",
        }}
      />

      {/* Heatmap Zones */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1000,
        }}
      >
        <style>{`
          @keyframes pulse-critical {
            0%, 100% { 
              box-shadow: 0 0 10px ${getSeverityBorderColor("critical")}80,
                          0 0 20px ${getSeverityBorderColor("critical")}40; 
            }
            50% { 
              box-shadow: 0 0 20px ${getSeverityBorderColor("critical")}ff,
                          0 0 40px ${getSeverityBorderColor("critical")}80; 
            }
          }
          
          @keyframes pulse-serious {
            0%, 100% { 
              box-shadow: 0 0 8px ${getSeverityBorderColor("serious")}60; 
            }
            50% { 
              box-shadow: 0 0 16px ${getSeverityBorderColor("serious")}ff; 
            }
          }
          
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
        `}</style>

        {zones.map((zone, index) => {
          const isHovered = hoveredZone?.id === zone.id;
          const isSelected = selectedZone?.id === zone.id;
          
          return (
            <div
              key={zone.id}
              onClick={(e) => handleZoneClick(zone, e)}
              onMouseEnter={() => setHoveredZone(zone)}
              onMouseLeave={() => setHoveredZone(null)}
              style={{
              position: "absolute",
              top: `${zone.top}px`,
              left: `${zone.left}px`,
              width: `${zone.width}px`,
              height: `${zone.height}px`,
              backgroundColor: getSeverityColor(zone.severity),
              border: `3px solid ${getSeverityBorderColor(zone.severity)}`,
              borderRadius: "8px",
              pointerEvents: "auto",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: `
                fadeInScale 0.4s ease-out ${index * 0.08}s both
                ${zone.severity === "critical" ? ", pulse-critical 2s ease-in-out infinite" : ""}
                ${zone.severity === "serious" ? ", pulse-serious 2.5s ease-in-out infinite" : ""}
              `,
              transform: isSelected ? "scale(1.05)" : isHovered ? "scale(1.03)" : "scale(1)",
              boxShadow: isSelected
                ? `0 0 0 4px ${getSeverityBorderColor(zone.severity)}40, 0 8px 24px rgba(0,0,0,0.2)`
                : isHovered
                ? `0 0 20px ${getSeverityBorderColor(zone.severity)}cc, 0 4px 12px rgba(0,0,0,0.15)`
                : zone.severity === "critical"
                ? `0 0 15px ${getSeverityBorderColor(zone.severity)}80`
                : `0 2px 8px rgba(0,0,0,0.1)`,
              // Use severity-based z-index instead of selection-based
              zIndex: isSelected 
                ? getZIndexBySeverity(zone.severity) + 100  // Selected gets +100 boost
                : isHovered 
                ? getZIndexBySeverity(zone.severity) + 50   // Hovered gets +50 boost
                : getZIndexBySeverity(zone.severity),        // Base priority by severity
            }}
            >
              {/* Issue Count Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "-12px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: getSeverityBorderColor(zone.severity),
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  animation: zone.severity === "critical" ? "float 2s ease-in-out infinite" : "none",
                }}
              >
                !
              </div>

              {/* Label */}
              {showLabels && (
                <div
                  style={{
                    position: "absolute",
                    top: "-32px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: getSeverityBorderColor(zone.severity),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    pointerEvents: "none",
                    opacity: isHovered || isSelected ? 1 : 0.9,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {getSeverityIcon(zone.severity)} {zone.issue.impact.toUpperCase()}
                </div>
              )}

              {/* Hover Tooltip */}
              {isHovered && (
                <div
                  style={{
                    position: "absolute",
                    top: zone.height > 100 ? "50%" : "100%",
                    left: "50%",
                    transform: zone.height > 100 ? "translate(-50%, -50%)" : "translate(-50%, 10px)",
                    background: "white",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    maxWidth: "280px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    border: `2px solid ${getSeverityBorderColor(zone.severity)}`,
                    pointerEvents: "none",
                    zIndex: 10000,
                    animation: "fadeInScale 0.2s ease-out",
                  }}
                >
                  <div style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>
                    {zone.issue.description}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>
                    Click for details
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Controls */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <button
          onClick={() => setShowLabels(!showLabels)}
          style={{
            padding: "14px 24px",
            background: "white",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
          }}
        >
          {showLabels ? "🏷️ Hide Labels" : "🏷️ Show Labels"}
        </button>

        {selectedZone && (
          <div
            style={{
              padding: "20px",
              background: "white",
              border: `3px solid ${getSeverityBorderColor(selectedZone.severity)}`,
              borderRadius: "12px",
              fontSize: "13px",
              maxWidth: "320px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
              animation: "fadeInScale 0.3s ease-out",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>{getSeverityIcon(selectedZone.severity)}</span>
              <strong style={{ color: getSeverityBorderColor(selectedZone.severity), fontSize: "15px" }}>
                {selectedZone.severity.toUpperCase()}
              </strong>
            </div>
            <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#111827", lineHeight: "1.5" }}>
              {selectedZone.issue.description}
            </p>
            {selectedZone.issue.help && (
              <p style={{ margin: "0 0 12px 0", color: "#6b7280", fontSize: "12px", lineHeight: "1.5" }}>
                {selectedZone.issue.help}
              </p>
            )}
            <button
              onClick={() => setSelectedZone(null)}
              style={{
                padding: "8px 16px",
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "13px",
                cursor: "pointer",
                width: "100%",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Legend */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 10000,
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          border: "2px solid #e5e7eb",
          minWidth: "200px",
        }}
      >
        <h4 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "700", color: "#111827" }}>
          🔥 Heatmap Legend
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { severity: "critical", count: zones.filter(z => z.severity === "critical").length },
            { severity: "serious", count: zones.filter(z => z.severity === "serious").length },
            { severity: "moderate", count: zones.filter(z => z.severity === "moderate").length },
            { severity: "minor", count: zones.filter(z => z.severity === "minor").length },
          ].map(({ severity, count }) => (
            <div key={severity} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  background: getSeverityColor(severity),
                  border: `2px solid ${getSeverityBorderColor(severity)}`,
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "13px", color: "#374151", textTransform: "capitalize", flex: 1 }}>
                {severity}
              </span>
              <span style={{ 
                fontSize: "14px", 
                fontWeight: "700", 
                color: getSeverityBorderColor(severity),
                background: `${getSeverityBorderColor(severity)}15`,
                padding: "2px 8px",
                borderRadius: "12px",
              }}>
                {count}
              </span>
            </div>
          ))}
        </div>
        <p style={{ margin: "16px 0 0 0", fontSize: "11px", color: "#9ca3af", textAlign: "center" }}>
          Click zones for details
        </p>
      </div>
    </>
  );
};