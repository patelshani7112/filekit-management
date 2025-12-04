import { useEffect } from 'react';

interface GoogleAdSenseScriptProps {
  clientId: string; // Your Google AdSense client ID (e.g., "ca-pub-XXXXXXXXXXXXXXXX")
}

/**
 * GoogleAdSenseScript Component
 * 
 * This component loads the Google AdSense script and initializes ads on the page.
 * 
 * Usage:
 * 1. Add this component to your AppLayout or main App component
 * 2. Replace the clientId with your actual Google AdSense publisher ID
 * 
 * Example:
 * <GoogleAdSenseScript clientId="ca-pub-XXXXXXXXXXXXXXXX" />
 */
export function GoogleAdSenseScript({ clientId }: GoogleAdSenseScriptProps) {
  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`);
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Initialize ads after script loads
    try {
      // @ts-ignore - adsbygoogle is loaded from external script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [clientId]);

  return null;
}
