import { Play, Pause, SkipForward, SkipBack, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onToggleFullscreen: () => void;
  className?: string;
}

export const VideoControls = ({
  isPlaying,
  isFullscreen,
  onTogglePlay,
  onSkipBackward,
  onSkipForward,
  onToggleFullscreen,
  className
}: VideoControlsProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <button
        onClick={onTogglePlay}
        className="p-3 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-player-text" />
        ) : (
          <Play className="w-6 h-6 text-player-text" />
        )}
      </button>

      <button
        onClick={onSkipBackward}
        className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
      >
        <SkipBack className="w-5 h-5 text-player-text" />
      </button>

      <button
        onClick={onSkipForward}
        className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
      >
        <SkipForward className="w-5 h-5 text-player-text" />
      </button>

      <button
        onClick={onToggleFullscreen}
        className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5 text-player-text" />
        ) : (
          <Maximize className="w-5 h-5 text-player-text" />
        )}
      </button>
    </div>
  );
};