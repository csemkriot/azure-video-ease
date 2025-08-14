import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  className?: string;
}

export const ProgressBar = ({ 
  currentTime, 
  duration, 
  buffered, 
  onSeek, 
  className 
}: ProgressBarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    setIsDragging(true);
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    onSeek(Math.max(0, Math.min(duration, newTime)));
  }, [duration, onSeek]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const time = (hoverX / rect.width) * duration;
    setHoverTime(Math.max(0, Math.min(duration, time)));

    if (isDragging) {
      onSeek(Math.max(0, Math.min(duration, time)));
    }
  }, [duration, isDragging, onSeek]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverTime(null);
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Hover time tooltip */}
      {hoverTime !== null && (
        <div 
          className="absolute bottom-full mb-2 px-2 py-1 bg-player-controls rounded text-xs text-player-text transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ 
            left: `${(hoverTime / duration) * 100}%`,
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Progress bar container */}
      <div
        ref={progressRef}
        className="relative h-2 bg-player-secondary/30 rounded-full cursor-pointer group-hover:h-3 transition-all duration-200"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Buffered progress */}
        <div 
          className="absolute inset-y-0 left-0 bg-player-text/20 rounded-full transition-all duration-200"
          style={{ width: `${bufferedProgress}%` }}
        />

        {/* Current progress */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />

        {/* Progress handle */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-player-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-glow"
          style={{ 
            left: `calc(${progress}% - 8px)`,
            transform: isDragging ? 'translateY(-50%) scale(1.2)' : 'translateY(-50%)'
          }}
        />

        {/* Hover indicator */}
        {hoverTime !== null && !isDragging && (
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-1 h-full bg-player-text/50 rounded-full"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
};