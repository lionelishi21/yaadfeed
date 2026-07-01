'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Pause, Volume2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';

interface AudioPlayerProps {
  title: string;
  content: string;
}

export default function AudioPlayer({ title, content }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getCleanText = () => {
    // Strip HTML tags for clean audio reading
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const playAudio = () => {
    if (!synthRef.current) return;

    // Wait for ad to finish
    setIsAdPlaying(true);
    
    setTimeout(() => {
      setIsAdPlaying(false);
      setIsPlaying(true);
      
      const cleanText = getCleanText();
      const fullText = `${title}. ... ... ${cleanText}`;
      
      const utterance = new SpeechSynthesisUtterance(fullText);
      
      // Try to find a good English voice
      const voices = synthRef.current?.getVoices() || [];
      const englishVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower for readability
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e);
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      synthRef.current?.speak(utterance);
    }, 3000); // 3-second simulated ad break
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/20 rounded-md text-red-200 text-sm">
        <AlertCircle size={16} />
        <span>Audio playback is not supported in your browser.</span>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yard-gold/10 flex items-center justify-center">
          <Volume2 className="w-5 h-5 text-yard-gold" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Listen to this article</h3>
          <p className="text-xs text-white/50">Powered by YaadFeed Audio</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isAdPlaying ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-yard-gold text-black text-sm font-bold rounded-md animate-pulse">
            Playing Ad...
          </div>
        ) : isPlaying ? (
          <button 
            onClick={stopAudio}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-md transition-colors"
          >
            <Square size={16} className="fill-white" /> Stop
          </button>
        ) : (
          <button 
            onClick={playAudio}
            className="flex items-center gap-2 px-4 py-2 bg-yard-gold hover:bg-[#c99f3c] text-black text-sm font-bold rounded-md transition-colors"
          >
            <Play size={16} className="fill-black" /> Play Audio
          </button>
        )}
      </div>
    </div>
  );
}
