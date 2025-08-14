import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (delta: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl = ({ 
  volume, 
  isMuted, 
  onVolumeChange, 
  onToggleMute 
}: VolumeControlProps) => {
  const [showSlider, setShowSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const displayVolume = isMuted ? 0 : volume;

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  const handleSliderMouseDown = useCallback((e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    setIsDragging(true);
    const rect = sliderRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const newVolume = 1 - (clickY / rect.height);
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    onVolumeChange(clampedVolume - volume);
    
    if (isMuted && clampedVolume > 0) {
      onToggleMute();
    }
  }, [volume, isMuted, onVolumeChange, onToggleMute]);

  const handleSliderMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const moveY = e.clientY - rect.top;
    const newVolume = 1 - (moveY / rect.height);
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    onVolumeChange(clampedVolume - volume);
  }, [isDragging, volume, onVolumeChange]);

  const handleSliderMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => !isDragging && setShowSlider(false)}
    >
      <button
        onClick={onToggleMute}
        className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
      >
        <VolumeIcon className="w-5 h-5 text-player-text" />
      </button>

      {/* Volume Slider */}
      <div 
        className={cn(
          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-player-controls/90 backdrop-blur-sm rounded-lg p-3 transition-all duration-200",
          showSlider ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div
          ref={sliderRef}
          className="relative w-4 h-24 bg-player-secondary/30 rounded-full cursor-pointer"
          onMouseDown={handleSliderMouseDown}
          onMouseMove={handleSliderMouseMove}
          onMouseUp={handleSliderMouseUp}
        >
          {/* Volume fill */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-primary rounded-full transition-all duration-150"
            style={{ height: `${displayVolume * 100}%` }}
          />

          {/* Volume handle */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-player-primary rounded-full shadow-glow transition-all duration-150"
            style={{ 
              bottom: `calc(${displayVolume * 100}% - 6px)`,
              transform: isDragging ? 'translateX(-50%) scale(1.3)' : 'translateX(-50%)'
            }}
          />
        </div>

        {/* Volume percentage */}
        <div className="text-xs text-player-text-muted text-center mt-2">
          {Math.round(displayVolume * 100)}%
        </div>
      </div>
    </div>
  );
};