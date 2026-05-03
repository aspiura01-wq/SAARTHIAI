/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export const speak = (text: string, lang: Language = Language.ENGLISH) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Friendly, calm pace
  utterance.pitch = 1.0;
  
  // Try to find a nice Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
  if (indianVoice) {
    utterance.voice = indianVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// Simple wrapper for Web Speech API Recognition
export class SpeechToText {
  private recognition: any;
  public onResult: (text: string) => void = () => {};
  public onError: (err: any) => void = () => {};
  public onEnd: () => void = () => {};

  constructor(lang: Language = Language.ENGLISH) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = lang;
      this.recognition.interimResults = false;
      this.recognition.continuous = false;

      this.recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        this.onResult(text);
      };

      this.recognition.onerror = (event: any) => {
        this.onError(event.error);
      };

      this.recognition.onend = () => {
        this.onEnd();
      };
    }
  }

  start() {
    if (this.recognition) {
      this.recognition.start();
    } else {
      this.onError('Speech recognition not supported in this browser.');
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
