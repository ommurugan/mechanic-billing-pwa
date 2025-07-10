
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const webApp = (window.navigator as any).standalone === true;
    
    setIsStandalone(standalone || webApp);
    
    if (standalone || webApp) {
      setIsInstalled(true);
      return;
    }

    // For iOS, show install prompt after a short delay
    if (iOS && !standalone && !webApp) {
      const hasSeenPrompt = localStorage.getItem('ios-install-prompt-dismissed');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    // Listen for the beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-dismissed');
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-prompt-dismissed');
      localStorage.removeItem('ios-install-prompt-dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // iOS install instructions are handled in the render
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during app installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('ios-install-prompt-dismissed', 'true');
    } else {
      localStorage.setItem('pwa-install-prompt-dismissed', 'true');
    }
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className={`
      fixed z-50 
      ${isMobile 
        ? 'bottom-4 left-4 right-4' 
        : 'top-4 right-4 w-96'
      }
    `}>
      <Card className="bg-white shadow-lg border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <img 
                  src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
                  alt="App Icon" 
                  className="w-6 h-6"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900">
                  Install Auto Bill Guru
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {isIOS 
                    ? 'Add to your home screen for the best experience' 
                    : isMobile 
                      ? 'Install the app for quick access' 
                      : 'Install the app for a better experience'
                  }
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isIOS ? (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 mb-2 font-medium">To install on iOS:</p>
              <ol className="text-xs text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <span>1.</span>
                  <span>Tap the Share button</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                  </svg>
                </li>
                <li className="flex items-center gap-2">
                  <span>2.</span>
                  <span>Select "Add to Home Screen"</span>
                  <Plus className="w-3 h-3" />
                </li>
                <li className="flex items-center gap-2">
                  <span>3.</span>
                  <span>Tap "Add"</span>
                </li>
              </ol>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-1 text-xs"
                >
                  Got it
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!deferredPrompt}
              >
                <Download className="h-4 w-4 mr-2" />
                Install
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="flex-1"
              >
                Not Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
