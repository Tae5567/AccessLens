// src/components/simulations/ScreenReaderSim.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SpeechUtility } from "@/lib/speech-utils";

interface ScreenReaderSimProps {
  content: string;
  isActive: boolean;
  onClose?: () => void; 
}

export const ScreenReaderSim: React.FC<ScreenReaderSimProps> = ({ content, isActive, onClose }) => {
  const [speechUtility] = useState(() => new SpeechUtility());
  const [currentElement, setCurrentElement] = useState<Element | null>(null);
  const [navigationIndex, setNavigationIndex] = useState(0);
  const [readableElements, setReadableElements] = useState<Element[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = Array.from(
      doc.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,input,img,label")
    );
    setReadableElements(elements);

    return () => {
      speechUtility.cancel();
    };
  }, [content, isActive, speechUtility]);

  const speakElement = useCallback(
    (element: Element) => {
      let textToSpeak = "";

      switch (element.tagName.toLowerCase()) {
        case "img":
          const alt = element.getAttribute("alt");
          textToSpeak = alt ? `Image: ${alt}` : "Image with no alternative text. This is an accessibility issue.";
          break;
        case "a":
          textToSpeak = `Link: ${element.textContent}`;
          break;
        case "button":
          textToSpeak = `Button: ${element.textContent}`;
          break;
        case "input":
          const label = element.getAttribute("aria-label") || element.getAttribute("placeholder");
          const type = element.getAttribute("type") || "text";
          textToSpeak = `${type} input field: ${label || "unlabeled"}`;
          break;
        case "label":
          textToSpeak = `Label: ${element.textContent}`;
          break;
        default:
          if (element.tagName.match(/^h[1-6]$/i)) {
            const level = element.tagName.charAt(1);
            textToSpeak = `Heading level ${level}: ${element.textContent}`;
          } else {
            textToSpeak = element.textContent || "";
          }
      }

      setIsSpeaking(true);
      speechUtility.speak(textToSpeak, {
        rate: 0.85,
        onEnd: () => setIsSpeaking(false),
      });
    },
    [speechUtility]
  );

  const navigateNext = useCallback(() => {
    if (navigationIndex < readableElements.length - 1) {
      const nextIndex = navigationIndex + 1;
      setNavigationIndex(nextIndex);
      setCurrentElement(readableElements[nextIndex]);
      speakElement(readableElements[nextIndex]);
    }
  }, [navigationIndex, readableElements, speakElement]);

  const navigatePrevious = useCallback(() => {
    if (navigationIndex > 0) {
      const prevIndex = navigationIndex - 1;
      setNavigationIndex(prevIndex);
      setCurrentElement(readableElements[prevIndex]);
      speakElement(readableElements[prevIndex]);
    }
  }, [navigationIndex, readableElements, speakElement]);

  const stopSpeaking = useCallback(() => {
    speechUtility.cancel();
    setIsSpeaking(false);
  }, [speechUtility]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "Tab") {
        e.preventDefault();
        navigateNext();
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        navigatePrevious();
      } else if (e.key === "Escape") {
        stopSpeaking();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, navigateNext, navigatePrevious, stopSpeaking]);

  if (!isActive) return null;

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-2xl min-w-[300px]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="text-2xl">🔊</span>
          Screen Reader Mode
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl font-bold"
          aria-label="Close screen reader"
          type="button"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm bg-gray-800 p-2 rounded">
          <div className="text-gray-400 text-xs mb-1">Element Navigation</div>
          <div className="font-medium">
            {navigationIndex + 1} of {readableElements.length}
          </div>
        </div>

        {currentElement && (
          <div className="text-xs bg-gray-800 p-2 rounded">
            <div className="text-gray-400 mb-1">Current Element:</div>
            <code className="text-green-400">
              &lt;{currentElement.tagName.toLowerCase()}&gt;
            </code>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={navigatePrevious}
            disabled={navigationIndex === 0}
            className="flex-1 px-3 py-2 bg-blue-600 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>
          <button
            onClick={navigateNext}
            disabled={navigationIndex === readableElements.length - 1}
            className="flex-1 px-3 py-2 bg-blue-600 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>

        <button
          onClick={stopSpeaking}
          disabled={!isSpeaking}
          className="w-full px-3 py-2 bg-red-600 rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSpeaking ? "⏹ Stop Speaking" : "⏸ Not Speaking"}
        </button>

        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          <div className="font-medium mb-1">Keyboard Shortcuts:</div>
          <div>• Tab / ↓ : Next element</div>
          <div>• Shift+Tab / ↑ : Previous element</div>
          <div>• Esc : Stop speaking</div>
        </div>
      </div>
    </div>
  );
};