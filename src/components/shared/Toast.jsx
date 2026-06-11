'use client';

import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error:   'bg-red-50   border-red-200   text-red-700',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl
      border shadow-lg text-[12px] font-medium flex items-center gap-2
      animate-in ${styles[type]}`}>
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
} 