import { Settings, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsMenuProps {
  playbackRate: number;
  quality: string;
  onPlaybackRateChange: (rate: number) => void;
  onQualityChange: (quality: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SettingsMenu = ({ 
  playbackRate, 
  quality, 
  onPlaybackRateChange, 
  onQualityChange, 
  isOpen, 
  onToggle 
}: SettingsMenuProps) => {
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualities = ['auto', '1080p', '720p', '480p', '360p'];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
      >
        <Settings className="w-5 h-5 text-player-text" />
      </button>

      {/* Settings Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-player-controls/95 backdrop-blur-sm rounded-lg p-2 min-w-48 shadow-player">
          {/* Playback Speed */}
          <div className="mb-3">
            <div className="text-sm font-medium text-player-text mb-2 px-2">
              Playback Speed
            </div>
            <div className="space-y-1">
              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  onClick={() => onPlaybackRateChange(rate)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-200",
                    playbackRate === rate 
                      ? "bg-player-primary/20 text-player-primary" 
                      : "text-player-text hover:bg-player-secondary/30"
                  )}
                >
                  <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                  {playbackRate === rate && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <div className="text-sm font-medium text-player-text mb-2 px-2">
              Quality
            </div>
            <div className="space-y-1">
              {qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => onQualityChange(q)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-200",
                    quality === q 
                      ? "bg-player-primary/20 text-player-primary" 
                      : "text-player-text hover:bg-player-secondary/30"
                  )}
                >
                  <span className="capitalize">{q}</span>
                  {quality === q && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={onToggle}
        />
      )}
    </div>
  );
};