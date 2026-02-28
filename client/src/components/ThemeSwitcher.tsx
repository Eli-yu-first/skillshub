import { useState, useRef, useEffect } from 'react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { Sun, Moon, Cpu, ChevronDown } from 'lucide-react';

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { value: 'tech', label: 'Tech', icon: <Cpu className="w-4 h-4" /> },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
        title="Switch theme"
      >
        {current.icon}
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-36 bg-popover border border-border rounded-lg shadow-lg shadow-black/8 py-1 z-50">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTheme(t.value); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors rounded-md ${
                theme === t.value
                  ? 'text-primary bg-primary/8 font-medium'
                  : 'text-popover-foreground hover:bg-muted/60'
              }`}
            >
              <span className={theme === t.value ? 'text-primary' : 'text-muted-foreground'}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
