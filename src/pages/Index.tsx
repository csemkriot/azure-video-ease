import { VideoPlayer } from '@/components/VideoPlayer/VideoPlayer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Advanced Video Player
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience a YouTube-like video player with advanced controls, keyboard shortcuts, 
            and smooth performance optimizations.
          </p>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer 
            src="https://dockerblobklarifaibbsr.blob.core.windows.net/uploadfiles/1409899-uhd_3840_2160_25fps.mp4"
            poster="/placeholder.svg"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">🎮 Keyboard Controls</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li><kbd className="bg-muted px-2 py-1 rounded">Space</kbd> - Play/Pause</li>
              <li><kbd className="bg-muted px-2 py-1 rounded">←/→</kbd> - Skip 10s</li>
              <li><kbd className="bg-muted px-2 py-1 rounded">↑/↓</kbd> - Volume</li>
              <li><kbd className="bg-muted px-2 py-1 rounded">F</kbd> - Fullscreen</li>
              <li><kbd className="bg-muted px-2 py-1 rounded">M</kbd> - Mute</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">⚡ Performance</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• Progressive loading</li>
              <li>• Optimized buffering</li>
              <li>• Smooth seeking</li>
              <li>• Memory efficient</li>
              <li>• Fast startup</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">🎯 Features</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• Custom playback speeds</li>
              <li>• Volume control with slider</li>
              <li>• Progress bar with preview</li>
              <li>• Fullscreen support</li>
              <li>• Auto-hiding controls</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card p-8 rounded-xl border border-border">
          <h2 className="text-2xl font-bold mb-6 text-card-foreground">🚀 Getting Started</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">📦 Installation & Setup</h3>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`# Clone the repository
git clone <your-repo-url>
cd <your-project-name>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">🎮 How to Use</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Mouse Controls:</strong></p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Click anywhere to play/pause</li>
                    <li>• Hover to show controls</li>
                    <li>• Drag progress bar to seek</li>
                    <li>• Hover volume for slider</li>
                  </ul>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Advanced Features:</strong></p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Settings menu for speed/quality</li>
                    <li>• Buffer progress indicator</li>
                    <li>• Time tooltip on hover</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">🔧 Customization</h3>
              <p className="text-muted-foreground mb-3">
                To use your own video, replace the <code className="bg-muted px-2 py-1 rounded">src</code> prop in the VideoPlayer component:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`<VideoPlayer 
  src="https://your-video-url.mp4"
  poster="https://your-poster-image.jpg"
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;