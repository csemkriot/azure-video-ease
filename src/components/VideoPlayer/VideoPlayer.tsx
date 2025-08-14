import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipForward, 
  SkipBack,
  Settings,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoControls } from './VideoControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { SettingsMenu } from './SettingsMenu';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export const VideoPlayer = ({ src, poster, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(-0.1);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      setShowControls(true);
      
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  }, [isMuted]);

  const changeVolume = useCallback((delta: number) => {
    if (!videoRef.current) return;
    
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  }, [volume, isMuted]);

  const skip = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [currentTime, duration]);

  const seekTo = useCallback((time: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    
    try {
      if (isFullscreen) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullscreen]);

  const changePlaybackRate = useCallback((rate: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  // Video event handlers
  const handleLoadStart = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };
  const handleProgress = () => {
    if (!videoRef.current) return;
    const bufferedEnd = videoRef.current.buffered.length > 0 
      ? videoRef.current.buffered.end(videoRef.current.buffered.length - 1) 
      : 0;
    setBuffered(bufferedEnd);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative bg-player-bg rounded-xl overflow-hidden shadow-player group",
        "w-full max-w-4xl mx-auto",
        isFullscreen && "!fixed !inset-0 !max-w-none !rounded-none z-50",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        preload="metadata"
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-player-overlay">
          <Loader2 className="w-12 h-12 text-player-primary animate-spin" />
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-player-overlay cursor-pointer transition-opacity duration-300"
          onClick={togglePlay}
        >
          <div className="bg-player-primary/20 backdrop-blur-sm rounded-full p-6 hover:bg-player-primary/30 transition-all duration-300 hover:scale-110">
            <Play className="w-16 h-16 text-player-text ml-2" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-controls p-4 transition-all duration-300",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        )}
      >
        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          onSeek={seekTo}
          className="mb-4"
        />

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-player-text" />
              ) : (
                <Play className="w-6 h-6 text-player-text" />
              )}
            </button>

            <button
              onClick={() => skip(-10)}
              className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
            >
              <SkipBack className="w-5 h-5 text-player-text" />
            </button>

            <button
              onClick={() => skip(10)}
              className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
            >
              <SkipForward className="w-5 h-5 text-player-text" />
            </button>

            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={changeVolume}
              onToggleMute={toggleMute}
            />

            <div className="text-sm text-player-text-muted">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <SettingsMenu
              playbackRate={playbackRate}
              quality={quality}
              onPlaybackRateChange={changePlaybackRate}
              onQualityChange={setQuality}
              isOpen={showSettings}
              onToggle={() => setShowSettings(!showSettings)}
            />

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-player-secondary/50 transition-colors duration-200"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-player-text" />
              ) : (
                <Maximize className="w-5 h-5 text-player-text" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Click to play/pause overlay */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
      />
    </div>
  );
};