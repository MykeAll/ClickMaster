import React, { useEffect } from 'react';

interface AdSenseUnitProps {
  client: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: string;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ 
  client, 
  slot, 
  format = 'auto', 
  responsive = 'true',
  className = '',
  style = { display: 'block' }
}) => {
  useEffect(() => {
    const initAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          // Check if this specific instance or any others need initialization
          const uninitializedAds = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
          
          if (uninitializedAds.length > 0) {
            // Push only once even if multiple elements are found? 
            // Actually, AdSense documentation says push once per unit.
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        // Silently handle the case where multiple pushes might happen during hot reload
        if (e instanceof Error && e.message.includes('already have ads')) {
          return;
        }
        console.error('AdSense unit initialization error:', e);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initAd, 200);
    return () => clearTimeout(timer);
  }, [slot]); // Re-run if slot changes

  return (
    <div className={`adsense-container ${className}`} style={{ minHeight: '90px', width: '100%', overflow: 'hidden' }}>
      <ins 
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdSenseUnit;
