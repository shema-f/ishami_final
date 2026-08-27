import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ReadingMode = 'dark' | 'light' | 'sepia';

interface ReadingModeContextType {
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  isDarkReading: boolean;
  isLightReading: boolean;
  isSepiaReading: boolean;
}

const ReadingModeContext = createContext<ReadingModeContextType | undefined>(undefined);

export function ReadingModeProvider({ children }: { children: ReactNode }) {
  const [readingMode, setReadingModeState] = useState<ReadingMode>(() => {
    try {
      const saved = localStorage.getItem('reading_mode');
      return (saved as ReadingMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('reading_mode', readingMode);
    } catch {
      // localStorage not available
    }
  }, [readingMode]);

  const setReadingMode = (mode: ReadingMode) => {
    setReadingModeState(mode);
  };

  const isDarkReading = readingMode === 'dark';
  const isLightReading = readingMode === 'light';
  const isSepiaReading = readingMode === 'sepia';

  return (
    <ReadingModeContext.Provider
      value={{
        readingMode,
        setReadingMode,
        isDarkReading,
        isLightReading,
        isSepiaReading,
      }}
    >
      {children}
    </ReadingModeContext.Provider>
  );
}

export function useReadingMode() {
  const context = useContext(ReadingModeContext);
  if (!context) {
    throw new Error('useReadingMode must be used within a ReadingModeProvider');
  }
  return context;
}

// Helper function to get reading mode styles
export function getReadingModeStyles(mode: ReadingMode) {
  switch (mode) {
    case 'light':
      return {
        container: 'bg-white',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200',
        muted: 'text-gray-500',
        card: 'bg-gray-50',
        code: 'bg-gray-100 text-gray-800',
        link: 'text-blue-600 hover:text-blue-700',
        heading: 'text-gray-900',
        accent: 'text-blue-600',
        button: 'bg-gray-900 text-white hover:bg-gray-800',
        buttonSecondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      };
    case 'sepia':
      return {
        container: 'bg-[#f4ecd8]',
        text: 'text-[#5b4636]',
        textSecondary: 'text-[#7c6f64]',
        border: 'border-[#d4c4a8]',
        muted: 'text-[#8b7355]',
        card: 'bg-[#efe6d5]',
        code: 'bg-[#e8dcc8] text-[#5b4636]',
        link: 'text-[#8b4513] hover:text-[#a0522d]',
        heading: 'text-[#3e2723]',
        accent: 'text-[#8b4513]',
        button: 'bg-[#5b4636] text-[#f4ecd8] hover:bg-[#3e2723]',
        buttonSecondary: 'bg-[#e8dcc8] text-[#5b4636] hover:bg-[#d4c4a8]',
      };
    default: // dark
      return {
        container: 'bg-[#0a0e14]',
        text: 'text-gray-300',
        textSecondary: 'text-gray-400',
        border: 'border-white/10',
        muted: 'text-gray-500',
        card: 'bg-white/5',
        code: 'bg-white/10 text-gray-200',
        link: 'text-blue-400 hover:text-blue-300',
        heading: 'text-white',
        accent: 'text-blue-400',
        button: 'bg-white/10 text-white hover:bg-white/15',
        buttonSecondary: 'bg-white/5 text-gray-300 hover:bg-white/10',
      };
  }
}
