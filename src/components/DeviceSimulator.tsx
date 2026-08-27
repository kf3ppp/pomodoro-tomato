import React from 'react';
import { Wifi, Battery, Signal, Search, Camera, MessageCircle, Phone, Compass, Music } from 'lucide-react';
import { MediumWidget } from './widgets/MediumWidget';
import { SmallDigitalWidget } from './widgets/SmallDigitalWidget';
import { SmallTomatoArcWidget } from './widgets/SmallTomatoArcWidget';
import { SmallWaveWidget } from './widgets/SmallWaveWidget';
import { SmallTachometerWidget } from './widgets/SmallTachometerWidget';
import { TimerMode, WidgetTheme } from '../types';

interface DeviceSimulatorProps {
  platform: 'iphone' | 'android';
  selectedWidgetStyle: 'medium' | 'digital' | 'tomato-arc' | 'wave' | 'tachometer';
  onSelectWidgetStyle: (style: 'medium' | 'digital' | 'tomato-arc' | 'wave' | 'tachometer') => void;
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  completedSessions: number;
  targetSessions: number;
  currentTask: string;
  theme: WidgetTheme;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onSkip: () => void;
  onSelectMode: (mode: TimerMode) => void;
  onOpenSettings: () => void;
  onIncrementCompleted: () => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  platform,
  selectedWidgetStyle,
  onSelectWidgetStyle,
  mode,
  timeLeft,
  totalTime,
  isRunning,
  completedSessions,
  targetSessions,
  currentTask,
  theme,
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  onTogglePlay,
  onReset,
  onSkip,
  onSelectMode,
  onOpenSettings,
  onIncrementCompleted,
}) => {
  const isIPhone = platform === 'iphone';

  // App mock icons
  const appIcons = [
    { name: 'Photos', icon: '🌸', bg: 'bg-gradient-to-tr from-amber-400 to-rose-400' },
    { name: 'Calendar', icon: '📅', bg: 'bg-white text-black' },
    { name: 'Notes', icon: '📝', bg: 'bg-amber-100 text-amber-900' },
    { name: 'Reminders', icon: '✅', bg: 'bg-sky-500 text-white' },
    { name: 'Podcasts', icon: '🎙️', bg: 'bg-purple-600 text-white' },
    { name: 'Fitness', icon: '🔥', bg: 'bg-neutral-900 text-rose-500 border border-neutral-700' },
    { name: 'Health', icon: '❤️', bg: 'bg-white text-rose-500' },
    { name: 'Settings', icon: '⚙️', bg: 'bg-neutral-700 text-neutral-200' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full">
      {/* Widget Selector Pills */}
      <div className="flex items-center gap-2 mb-6 bg-neutral-900/80 p-1.5 rounded-full border border-neutral-800 backdrop-blur-md overflow-x-auto max-w-full">
        <span className="text-xs text-neutral-400 px-3 font-medium">Place Widget:</span>
        <button
          onClick={() => onSelectWidgetStyle('medium')}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            selectedWidgetStyle === 'medium'
              ? 'bg-neutral-700 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Medium (Wide)
        </button>
        <button
          onClick={() => onSelectWidgetStyle('tomato-arc')}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            selectedWidgetStyle === 'tomato-arc'
              ? 'bg-neutral-700 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Tomato Arc
        </button>
        <button
          onClick={() => onSelectWidgetStyle('tachometer')}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            selectedWidgetStyle === 'tachometer'
              ? 'bg-neutral-700 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Tachometer
        </button>
        <button
          onClick={() => onSelectWidgetStyle('digital')}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            selectedWidgetStyle === 'digital'
              ? 'bg-neutral-700 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Digital
        </button>
        <button
          onClick={() => onSelectWidgetStyle('wave')}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
            selectedWidgetStyle === 'wave'
              ? 'bg-neutral-700 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Wave
        </button>
      </div>

      {/* Phone Hardware Shell */}
      <div
        className={`relative w-[360px] sm:w-[390px] h-[780px] sm:h-[800px] rounded-[52px] p-3.5 sm:p-4 shadow-[0_30px_90px_rgba(0,0,0,0.85)] border-[6px] transition-all overflow-hidden ${
          isIPhone
            ? 'bg-[#0f1115] border-[#2c303c]'
            : 'bg-[#121316] border-[#22242a] rounded-[44px]'
        }`}
      >
        {/* Screen Bezel & Wallpaper */}
        <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-gradient-to-b from-[#1C1F2B] via-[#12141A] to-[#0A0B0E] flex flex-col justify-between p-4 pt-3 select-none">
          {/* Wallpaper Subtle Ambient Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,87,34,0.08),transparent_70%)] pointer-events-none" />

          {/* Top Phone Status Bar */}
          <div className="relative z-20 flex items-center justify-between px-3 text-xs font-semibold text-white/90">
            <span>9:41</span>

            {/* Dynamic Island (iPhone) or Punch Hole (Android) */}
            {isIPhone ? (
              <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-2 shadow-inner border border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40" />
                </div>
                {isRunning && (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                    <span className="text-[10px] text-orange-400 font-mono">
                      {Math.floor(timeLeft / 60)}m
                    </span>
                  </div>
                )}
                <div className="w-2 h-2 rounded-full bg-neutral-900" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner mx-auto border border-white/5" />
            )}

            <div className="flex items-center gap-1.5 text-white/80">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* Home Screen Content */}
          <div className="flex-1 flex flex-col items-center justify-start pt-4 space-y-5 z-10 overflow-y-auto no-scrollbar">
            {/* The Active Widget in the Frame */}
            <div className="w-full flex justify-center transform scale-95 origin-top">
              {selectedWidgetStyle === 'medium' && (
                <div className="w-full max-w-[340px]">
                  <MediumWidget
                    mode={mode}
                    timeLeft={timeLeft}
                    totalTime={totalTime}
                    isRunning={isRunning}
                    completedSessions={completedSessions}
                    targetSessions={targetSessions}
                    currentTask={currentTask}
                    theme={theme}
                    focusDuration={focusDuration}
                    shortBreakDuration={shortBreakDuration}
                    longBreakDuration={longBreakDuration}
                    onTogglePlay={onTogglePlay}
                    onReset={onReset}
                    onSkip={onSkip}
                    onSelectMode={onSelectMode}
                    onOpenSettings={onOpenSettings}
                    onIncrementCompleted={onIncrementCompleted}
                  />
                </div>
              )}

              {selectedWidgetStyle === 'tomato-arc' && (
                <SmallTomatoArcWidget
                  mode={mode}
                  timeLeft={timeLeft}
                  totalTime={totalTime}
                  isRunning={isRunning}
                  theme={theme}
                  onTogglePlay={onTogglePlay}
                />
              )}

              {selectedWidgetStyle === 'tachometer' && (
                <SmallTachometerWidget
                  mode={mode}
                  timeLeft={timeLeft}
                  totalTime={totalTime}
                  isRunning={isRunning}
                  theme={theme}
                  onTogglePlay={onTogglePlay}
                />
              )}

              {selectedWidgetStyle === 'digital' && (
                <SmallDigitalWidget
                  mode={mode}
                  timeLeft={timeLeft}
                  isRunning={isRunning}
                  theme={theme}
                  onTogglePlay={onTogglePlay}
                  onOpenSettings={onOpenSettings}
                />
              )}

              {selectedWidgetStyle === 'wave' && (
                <SmallWaveWidget
                  mode={mode}
                  timeLeft={timeLeft}
                  isRunning={isRunning}
                  theme={theme}
                  onTogglePlay={onTogglePlay}
                />
              )}
            </div>

            {/* Simulated App Icon Grid */}
            <div className="grid grid-cols-4 gap-y-4 gap-x-3 w-full px-2">
              {appIcons.slice(0, selectedWidgetStyle === 'medium' ? 8 : 12).map((app, i) => (
                <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div
                    className={`w-13 h-13 rounded-[15px] flex items-center justify-center text-xl shadow-md group-active:scale-90 transition-transform ${app.bg}`}
                  >
                    {app.icon}
                  </div>
                  <span className="text-[10px] font-medium text-white/90 tracking-tight">
                    {app.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Dock */}
          <div className="relative z-20 pb-2">
            {/* Page dots */}
            <div className="flex justify-center items-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>

            {/* Glass Dock */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-[28px] p-2.5 flex items-center justify-around border border-white/10 shadow-lg">
              <div className="w-12 h-12 rounded-[14px] bg-emerald-500 flex items-center justify-center text-white shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all">
                <Phone className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-[14px] bg-sky-500 flex items-center justify-center text-white shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center text-sky-600 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all">
                <Compass className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-[14px] bg-rose-500 flex items-center justify-center text-white shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all">
                <Music className="w-5 h-5" />
              </div>
            </div>

            {/* Home Indicator Bar */}
            <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
