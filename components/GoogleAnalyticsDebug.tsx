'use client';

import { useEffect } from 'react';

export default function GoogleAnalyticsDebug() {
  useEffect(() => {
    // Check if gtag is available
    if (typeof window !== 'undefined') {
      console.log('=== Google Analytics Debug ===');
      console.log('window.gtag exists:', typeof window.gtag === 'function');
      console.log('window.dataLayer exists:', !!window.dataLayer);
      console.log('dataLayer length:', window.dataLayer?.length || 0);
      console.log('dataLayer contents:', window.dataLayer);
      
      // Try to send a test event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'debug_test', {
          event_category: 'debug',
          event_label: 'GA Debug Test',
          value: 1
        });
        console.log('Test event sent to GA');
      } else {
        console.log('gtag function not available');
      }
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-xs max-w-xs">
      <div className="font-semibold text-blue-800 mb-1">GA Debug Info</div>
      <div className="text-blue-700">
        Check browser console for Google Analytics debug information
      </div>
    </div>
  );
}
