//src/lib/speech-utils.ts
//Web Speech API Intgeraton
"use client";

import { Speech } from "openai/resources/audio.js";

export class SpeechUtility {
    private synth: SpeechSynthesis | null = null;
    private recognition: any = null;

    constructor() {
        if (typeof window !== "undefined") {
            this.synth = window.speechSynthesis;
            //initialize speech recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = "en-US";
            }
        }
    }

    speak(text: string, options?: {
        rate?: number;
        pitch?: number;
        volume?: number,
        lang?: string;
        onEnd?: () => void;
    }): void {
        if (!this.synth) return;

        //cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options?.rate || 0.9;
        utterance.pitch = options?.pitch || 1;
        utterance.volume = options?.volume || 1;
        utterance.lang = options?.lang || "en-US";

        if (options?.onEnd) {
            utterance.onend = options.onEnd;
        }

        this.synth.speak(utterance);
    }

    cancel(): void {
        if (this.synth) {
            this.synth.cancel();
        }
    }

    isSpeaking(): boolean {
        return this.synth?.speaking || false;
    }

    startListening( onResult: (transcript: string) => void, onError?: (error: any) => void): void {
        if (!this.recognition){
            console.error("Speech Recognition not supported in this browser.");
            return;
        }

        this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };

        if (onerror) {
            this.recognition.onerror = onError;
        }

        this.recognition.start();
    }

    stopListening(): void{
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    getVoices(): SpeechSynthesisVoice[] {
        return this.synth?.getVoices() || [];
    }
}