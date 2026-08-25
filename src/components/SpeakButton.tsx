import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SpeakButtonProps {
  text: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'badge' | 'chip';
  className?: string;
  title?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  label,
  size = 'sm',
  variant = 'icon',
  className = '',
  title = 'Kattints a kiejtés meghallgatásához!',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (isSpeaking) {
        soundManager.stopSpeaking();
      }
    };
  }, [isSpeaking]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isSpeaking) {
      soundManager.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    soundManager.speak(
      text,
      {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      }
    );
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
  };

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleSpeak}
        title={title}
        aria-label={title}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
          isSpeaking
            ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300 animate-pulse'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
        } ${className}`}
      >
        <Volume2 className={`${iconSizes[size]} shrink-0 ${isSpeaking ? 'animate-bounce' : ''}`} />
        <span>{label || 'Meghallgatom'}</span>
      </button>
    );
  }

  if (variant === 'chip') {
    return (
      <button
        type="button"
        onClick={handleSpeak}
        title={title}
        aria-label={title}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer select-none ${
          isSpeaking
            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
            : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
        } ${className}`}
      >
        <span>{label || text}</span>
        <Volume2 className={`${iconSizes[size]} shrink-0 ${isSpeaking ? 'text-white animate-bounce' : 'text-indigo-500'}`} />
      </button>
    );
  }

  // Default 'icon' variant
  const sizeClasses = {
    xs: 'p-1 rounded-md',
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-xl',
    lg: 'p-2.5 rounded-xl',
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center transition-all cursor-pointer shrink-0 select-none ${
        sizeClasses[size]
      } ${
        isSpeaking
          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300 scale-110'
          : 'bg-white hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 border border-indigo-200 shadow-2xs hover:border-indigo-400'
      } ${className}`}
    >
      <Volume2 className={`${iconSizes[size]} ${isSpeaking ? 'animate-pulse' : ''}`} />
    </button>
  );
};
