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
  const adRef = React.useRef<HTMLModElement>(null);

  useEffect(() => {
    const initAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
          // Verify if this specific element is still uninitialized
          if (!adRef.current.hasAttribute('data-adsbygoogle-status')) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        // Silently handle the case where multiple pushes might happen
        if (e instanceof Error && e.message.includes('already have ads')) {
          return;
        }
        console.error('AdSense unit initialization error:', e);
      }
    };

    // Stagger initialization slightly to avoid race conditions
    const timer = setTimeout(initAd, 300);
    return () => clearTimeout(timer);
  }, [slot]); // Re-run if slot changes

  return (
    <div className={`adsense-container ${className}`} style={{ minHeight: '90px', width: '100%', overflow: 'hidden' }}>
      <ins 
        ref={adRef}
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
