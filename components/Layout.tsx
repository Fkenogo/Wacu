
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  hideHeader?: boolean;
  fullWidth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, onBack, hideHeader = false, fullWidth = false }) => {
  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 relative overflow-hidden ${fullWidth ? 'w-full' : 'max-w-md mx-auto'}`}>
      {!hideHeader && (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center shadow-sm">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className={`flex-1 font-semibold text-lg text-center ${onBack ? 'pr-8' : ''}`}>
            {title || 'KAZE'}
          </h1>
        </header>
      )}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};
