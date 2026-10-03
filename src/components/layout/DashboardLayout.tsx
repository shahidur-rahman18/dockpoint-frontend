import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Settings } from 'lucide-react';
import { ThemeCustomizer, type ThemeSettings } from './ThemeCustomizer';

export const DashboardLayout: React.FC = () => {
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    colorMode: 'light',
    sidebarColor: '#ffffff',
    topBarColor: '#ffffff',
    themeColor: '#3730a3',
  });
  const closeCustomizer = useCallback(() => setCustomizerOpen(false), []);
  const toggleColorMode = useCallback(() => {
    setThemeSettings((prev) => ({
      ...prev,
      colorMode: prev.colorMode === 'dark' ? 'light' : 'dark',
    }));
  }, []);
  const sidebarBackground = themeSettings.colorMode === 'dark' && themeSettings.sidebarColor === '#ffffff'
    ? '#03051f'
    : themeSettings.sidebarColor;
  const topBarBackground = themeSettings.colorMode === 'dark' && themeSettings.topBarColor === '#ffffff'
    ? '#05071f'
    : themeSettings.topBarColor;

  return (
    <div
      className="theme-root flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased"
      data-color-mode={themeSettings.colorMode}
      style={{ '--theme-accent': themeSettings.themeColor } as React.CSSProperties}
    >
      {/* Sidebar */}
      <Sidebar background={sidebarBackground} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 dashboard-content">
        <Header
          background={topBarBackground}
          colorMode={themeSettings.colorMode}
          onToggleColorMode={toggleColorMode}
        />
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Settings Button on Right Edge */}
      <button
        type="button"
        onClick={() => setCustomizerOpen(true)}
        aria-label="Open theme customizer"
        title="Theme customizer"
        className="fixed right-0 top-1/2 -translate-y-1/2 text-white p-2.5 rounded-l-xl shadow-lg transition-colors cursor-pointer z-40 hover:brightness-90"
        style={{ background: themeSettings.themeColor }}
      >
        <Settings className="w-5 h-5" />
      </button>
      {customizerOpen && (
        <ThemeCustomizer
          open={customizerOpen}
          onClose={closeCustomizer}
          settings={themeSettings}
          onSettingsChange={setThemeSettings}
          onReset={() => setThemeSettings({
            colorMode: 'light',
            sidebarColor: '#ffffff',
            topBarColor: '#ffffff',
            themeColor: '#3730a3',
          })}
        />
      )}
    </div>
  );
};
