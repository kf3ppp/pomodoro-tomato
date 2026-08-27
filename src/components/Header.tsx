import React from 'react';
import { LayoutGrid, Smartphone, Settings, Sparkles, Volume2, VolumeX, Download } from 'lucide-react';
import { ViewMode, WidgetTheme, AmbientSound } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ambientSound: AmbientSound;
  onToggleAmbient: () => void;
  currentTheme: WidgetTheme;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenSettings,
  onOpenExport,
  soundEnabled,
  onToggleSound,
  ambientSound,
  onToggleAmbient,
  currentTheme,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-30 select-none">
      {/* App Brand */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center border transition-all"
          style={{
            backgroundColor: `${currentTheme.primary}20`,
            borderColor: `${currentTheme.primary}40`,
            boxShadow: `0 0 20px ${currentTheme.glow}`,
          }}
        >
          <span className="text-xl">🍅</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Pomodoro Focus Widgets
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-black font-mono"
              style={{ backgroundColor: currentTheme.primary }}
            >
              iOS & Android
            </span>
          </h1>
          <p className="text-xs text-neutral-400">Authentic dark luxury widget suite</p>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => onChangeViewMode('all-widgets')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'all-widgets'
              ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">All Widgets</span>
        </button>

        <button
          onClick={() => onChangeViewMode('iphone')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'iphone'
              ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iPhone 16</span>
        </button>

        <button
          onClick={() => onChangeViewMode('android')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'android'
              ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android Pixel</span>
        </button>
      </div>

      {/* Action Utilities */}
      <div className="flex items-center gap-2">
        {/* Download / Export Button */}
        <button
          id="header-export-button"
          onClick={onOpenExport}
          title="Download Poster & Test Widgets"
          className="px-3 h-9 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer text-white shadow-md"
          style={{
            backgroundColor: currentTheme.primary,
            boxShadow: `0 4px 14px -3px ${currentTheme.glow}`,
          }}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download & Test</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-orange-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {/* Ambient sound button */}
        <button
          onClick={onToggleAmbient}
          title={ambientSound !== 'none' ? `Ambient: ${ambientSound}` : 'Toggle ambient noise'}
          className={`px-2.5 h-9 rounded-xl flex items-center gap-1.5 text-xs font-medium border transition-all cursor-pointer ${
            ambientSound !== 'none'
              ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
              : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 border-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="capitalize">{ambientSound !== 'none' ? ambientSound.replace('-noise', '') : 'Ambient'}</span>
        </button>

        {/* Settings button */}
        <button
          id="header-settings-button"
          onClick={onOpenSettings}
          title="Open Settings"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
