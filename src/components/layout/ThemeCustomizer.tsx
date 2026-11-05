import React, { useState } from 'react';
import { Check, ChevronDown, Moon, RotateCcw, Sun, X } from 'lucide-react';
import { Modal } from '../common/Modal';

export interface ThemeSettings {
  colorMode: 'light' | 'dark';
  sidebarColor: string;
  topBarColor: string;
  themeColor: string;
}

interface ThemeCustomizerProps {
  open: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  onReset: () => void;
}

const solidColors = [
  '#ffffff',
  '#f1f5f9',
  '#111827',
  '#3730a3',
  '#06c7c4',
  '#3182ed',
  '#3730d9',
];

const gradientColors = [
  'linear-gradient(135deg, #8b5cf6, #5b21b6)',
  'linear-gradient(135deg, #06b6d4, #2563eb)',
  'linear-gradient(135deg, #34d399, #0f766e)',
  'linear-gradient(135deg, #64748b, #1e293b)',
  'linear-gradient(135deg, #d946ef, #86198f)',
  'linear-gradient(135deg, #fb923c, #fb7185)',
  'linear-gradient(135deg, #60a5fa, #312e81)',
];

const themeColors = [
  '#3730a3',
  '#06c7c4',
  '#e94b18',
  '#129889',
  '#94008d',
  '#3730d9',
  '#3182ed',
];

interface ColorSwatchesProps {
  label: string;
  selected: string;
  colors: string[];
  onSelect: (color: string) => void;
}

const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  label,
  selected,
  colors,
  onSelect,
}) => (
  <div className="grid grid-cols-6 gap-2.5">
    {colors.map((color, index) => (
      <button
        key={`${label}-${color}`}
        type="button"
        aria-label={`${label} color ${index + 1}`}
        aria-pressed={selected === color}
        onClick={() => onSelect(color)}
        className={`relative h-8 w-8 rounded border transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
          selected === color ? 'border-slate-400' : 'border-slate-300'
        }`}
        style={{ background: color }}
      >
        {selected === color && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </span>
        )}
      </button>
    ))}
  </div>
);

interface CustomizerSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CustomizerSection: React.FC<CustomizerSectionProps> = ({
  title,
  open,
  onToggle,
  children,
}) => (
  <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800"
    >
      {title}
      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div className="space-y-3 p-4">{children}</div>}
  </section>
);

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  open,
  onClose,
  settings,
  onSettingsChange,
  onReset,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    colorMode: true,
    sidebar: true,
    topBar: true,
    theme: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((current) => ({ ...current, [section]: !current[section] }));
  };

  return (
    <Modal
      open={open}
      title="Theme Customizer"
      size="lg"
      showHeader={false}
      ariaLabelledBy="theme-customizer-title"
      overlayClassName={`justify-end !p-0 ${settings.colorMode === 'dark' ? '!bg-transparent' : ''}`}
      panelClassName="theme-customizer-panel !my-0 !ml-auto !mr-0 !h-full !max-h-none !w-full !max-w-[380px] !rounded-none !p-0"
      contentClassName="!mt-0 flex h-full flex-col bg-[var(--bg-base)] text-[var(--text-primary)]"
      onClose={onClose}
    >
      <header className="flex h-12 shrink-0 items-center justify-between bg-indigo-800 px-4 text-white">
        <h2 id="theme-customizer-title" className="text-sm font-semibold">Theme Customizer</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close theme customizer"
          className="rounded p-1 text-indigo-100 transition-colors hover:bg-indigo-700 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        <CustomizerSection
          title="Color Mode"
          open={expandedSections.colorMode}
          onToggle={() => toggleSection('colorMode')}
        >
          <div className="grid grid-cols-2 gap-3">
            {(['light', 'dark'] as const).map((mode) => {
              const Icon = mode === 'light' ? Sun : Moon;
              const selected = settings.colorMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSettingsChange((current) => ({ ...current, colorMode: mode }))}
                  className={`flex items-center justify-center gap-1.5 rounded border px-3 py-2 text-xs capitalize transition-colors ${
                    selected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {mode}
                </button>
              );
            })}
          </div>
        </CustomizerSection>

        <CustomizerSection
          title="Sidebar Color"
          open={expandedSections.sidebar}
          onToggle={() => toggleSection('sidebar')}
        >
          <p className="text-xs font-medium text-slate-700">Solid Colors</p>
          <ColorSwatches
            label="Sidebar"
            selected={settings.sidebarColor}
            colors={solidColors}
            onSelect={(sidebarColor) => onSettingsChange((current) => ({ ...current, sidebarColor }))}
          />
          <p className="pt-1 text-xs font-medium text-slate-700">Gradient Colors</p>
          <ColorSwatches
            label="Sidebar gradient"
            selected={settings.sidebarColor}
            colors={gradientColors}
            onSelect={(sidebarColor) => onSettingsChange((current) => ({ ...current, sidebarColor }))}
          />
        </CustomizerSection>

        <CustomizerSection
          title="Top Bar Color"
          open={expandedSections.topBar}
          onToggle={() => toggleSection('topBar')}
        >
          <p className="text-xs font-medium text-slate-700">Solid Colors</p>
          <ColorSwatches
            label="Top bar"
            selected={settings.topBarColor}
            colors={solidColors}
            onSelect={(topBarColor) => onSettingsChange((current) => ({ ...current, topBarColor }))}
          />
          <p className="pt-1 text-xs font-medium text-slate-700">Gradient Colors</p>
          <ColorSwatches
            label="Top bar gradient"
            selected={settings.topBarColor}
            colors={gradientColors}
            onSelect={(topBarColor) => onSettingsChange((current) => ({ ...current, topBarColor }))}
          />
        </CustomizerSection>

        <CustomizerSection
          title="Theme Colors"
          open={expandedSections.theme}
          onToggle={() => toggleSection('theme')}
        >
          <ColorSwatches
            label="Theme"
            selected={settings.themeColor}
            colors={themeColors}
            onSelect={(themeColor) => onSettingsChange((current) => ({ ...current, themeColor }))}
          />
        </CustomizerSection>
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-white p-3">
        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center justify-center gap-1.5 rounded bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </footer>
    </Modal>
  );
};
