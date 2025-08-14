import { useState, useRef, useCallback, useEffect } from 'react';
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

  // Global mouse event handlers for drag functionality
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !progressRef.current) return;
      
      e.preventDefault();
      const rect = progressRef.current.getBoundingClientRect();
      const moveX = e.clientX - rect.left;
      const newTime = (moveX / rect.width) * duration;
      onSeek(Math.max(0, Math.min(duration, newTime)));
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, duration, onSeek]);

  const calculateTimeFromPosition = useCallback((clientX: number) => {
    if (!progressRef.current) return 0;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const timeRatio = clickX / rect.width;
    return Math.max(0, Math.min(duration, timeRatio * duration));
  }, [duration]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!progressRef.current) return;
    
    setIsDragging(true);
    const newTime = calculateTimeFromPosition(e.clientX);
    onSeek(newTime);
  }, [calculateTimeFromPosition, onSeek]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    const time = calculateTimeFromPosition(e.clientX);
    setHoverTime(time);
  }, [calculateTimeFromPosition]);

  const handleMouseLeave = useCallback(() => {
    setHoverTime(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDragging) {
      const newTime = calculateTimeFromPosition(e.clientX);
      onSeek(newTime);
    }
  }, [isDragging, calculateTimeFromPosition, onSeek]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Hover time tooltip */}
      {hoverTime !== null && duration > 0 && (
        <div 
          className="absolute bottom-full mb-2 px-2 py-1 bg-player-controls/90 backdrop-blur-sm rounded text-xs text-player-text transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
          style={{ 
            left: `${Math.max(5, Math.min(95, (hoverTime / duration) * 100))}%`,
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Progress bar container */}
      <div
        ref={progressRef}
        className="relative h-2 bg-player-secondary/30 rounded-full cursor-pointer group-hover:h-3 transition-all duration-200 z-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Buffered progress */}
        <div 
          className="absolute inset-y-0 left-0 bg-player-text/20 rounded-full transition-all duration-200 pointer-events-none"
          style={{ width: `${bufferedProgress}%` }}
        />

        {/* Current progress */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-200 pointer-events-none"
          style={{ width: `${progress}%` }}
        />

        {/* Progress handle */}
        <div 
          className="absolute top-1/2 w-4 h-4 bg-player-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-glow pointer-events-none"
          style={{ 
            left: `calc(${progress}% - 8px)`,
            transform: isDragging ? 'translateY(-50%) scale(1.3)' : 'translateY(-50%)'
          }}
        />

        {/* Hover indicator */}
        {hoverTime !== null && !isDragging && duration > 0 && (
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-1 bg-player-text/50 rounded-full pointer-events-none"
            style={{ 
              left: `${(hoverTime / duration) * 100}%`,
              height: '150%'
            }}
          />
        )}
      </div>
    </div>
  );
};