import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, BookOpen, Palette } from 'lucide-react';
import { useReadingMode, type ReadingMode } from '../contexts/ReadingModeContext';
import { useTranslation } from '../contexts/I18nContext';

export default function ReadingModeToggle() {
  const { lang } = useTranslation();
  const { readingMode, setReadingMode } = useReadingMode();
  const [isOpen, setIsOpen] = useState(false);

  const modes: { value: ReadingMode; icon: typeof Sun; label: string; labelRw: string }[] = [
    { value: 'dark', icon: Moon, label: 'Dark', labelRw: 'Gijoro' },
    { value: 'light', icon: Sun, label: 'Light', labelRw: 'Urumuri' },
    { value: 'sepia', icon: BookOpen, label: 'Sepia', labelRw: 'Sepia' },
  ];

  const currentMode = modes.find(m => m.value === readingMode) || modes[0];
  const Icon = currentMode.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm"
        title={lang === 'rw' ? 'Hindura uburyo bwo gusoma' : 'Change reading mode'}
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">{lang === 'rw' ? currentMode.labelRw : currentMode.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 z-50 bg-[#16171C] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/30 min-w-[160px]"
            >
              {modes.map((mode) => {
                const ModeIcon = mode.icon;
                const isActive = readingMode === mode.value;
                
                return (
                  <button
                    key={mode.value}
                    onClick={() => {
                      setReadingMode(mode.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ModeIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{lang === 'rw' ? mode.labelRw : mode.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
