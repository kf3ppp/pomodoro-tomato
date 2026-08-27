import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Settings as SettingsIcon, Coffee, Flame, CheckCircle2 } from 'lucide-react';
import { TimerMode, TimerConfig, WidgetTheme, ViewMode, AmbientSound } from './types';
import { THEMES } from './utils/themes';
import { TIMER_PRESETS, PresetOption } from './utils/timer';
import { playBellChime, playTickSound, startAmbientSound, stopAmbientSound, setAmbientVolume } from './utils/audio';

import { Header } from './components/Header';
import { MediumWidget } from './components/widgets/MediumWidget';
import { SmallDigitalWidget } from './components/widgets/SmallDigitalWidget';
import { SmallTomatoArcWidget } from './components/widgets/SmallTomatoArcWidget';
import { SmallWaveWidget } from './components/widgets/SmallWaveWidget';
import { SmallTachometerWidget } from './components/widgets/SmallTachometerWidget';
import { DeviceSimulator } from './components/DeviceSimulator';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';

const DEFAULT_CONFIG: TimerConfig = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreaks: false,
  autoStartFocus: false,
  longBreakInterval: 4,
};

export default function App() {
  // Timer State
  const [config, setConfig] = useState<TimerConfig>(DEFAULT_CONFIG);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_CONFIG.focusDuration);
  const [totalTime, setTotalTime] = useState<number>(DEFAULT_CONFIG.focusDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(4); // Matching 4/10 from screenshot
  const [targetSessions, setTargetSessions] = useState<number>(10);
  const [currentTask, setCurrentTask] = useState<string>('Stay focused');

  // Aesthetic & View State
  const [currentTheme, setCurrentTheme] = useState<WidgetTheme>(THEMES.obsidian);
  const [viewMode, setViewMode] = useState<ViewMode>('all-widgets');
  const [selectedWidgetStyle, setSelectedWidgetStyle] = useState<'medium' | 'digital' | 'tomato-arc' | 'wave' | 'tachometer'>('medium');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Audio State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tickSoundEnabled, setTickSoundEnabled] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [ambientVolume, setAmbientVol] = useState<number>(0.3);

  const timerRef = useRef<number | null>(null);

  // Trigger celebration on completing focus session
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.65 },
        colors: [currentTheme.primary, '#FF9800', '#FFC107', '#4CAF50', '#FFFFFF'],
      });
    } catch {
      // Confetti fallback
    }
  }, [currentTheme]);

  // Handle Mode Change
  const handleSelectMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    let duration = config.focusDuration;
    if (newMode === 'shortBreak') duration = config.shortBreakDuration;
    if (newMode === 'longBreak') duration = config.longBreakDuration;
    setTimeLeft(duration);
    setTotalTime(duration);
  }, [config]);

  // Handle Timer Finish
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    if (soundEnabled) {
      playBellChime();
    }

    if (mode === 'focus') {
      triggerCelebration();
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);

      // Auto cycle to break
      if (newCompleted % config.longBreakInterval === 0) {
        handleSelectMode('longBreak');
      } else {
        handleSelectMode('shortBreak');
      }
    } else {
      handleSelectMode('focus');
    }
  }, [mode, completedSessions, config, soundEnabled, triggerCelebration, handleSelectMode]);

  // Main Timer Interval Loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          if (tickSoundEnabled) {
            playTickSound();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, tickSoundEnabled, handleTimerComplete]);

  // Ambient sound management
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      startAmbientSound(ambientSound as 'brown-noise' | 'white-noise' | 'rain' | 'campfire', ambientVolume);
    } else {
      stopAmbientSound();
    }

    return () => {
      stopAmbientSound();
    };
  }, [isRunning, ambientSound, ambientVolume]);

  const handleTogglePlay = () => {
    if (!isRunning && timeLeft === 0) {
      // Reset if at 0
      const duration = mode === 'focus' ? config.focusDuration : mode === 'shortBreak' ? config.shortBreakDuration : config.longBreakDuration;
      setTimeLeft(duration);
      setTotalTime(duration);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    const duration = mode === 'focus' ? config.focusDuration : mode === 'shortBreak' ? config.shortBreakDuration : config.longBreakDuration;
    setTimeLeft(duration);
    setTotalTime(duration);
  };

  const handleSkip = () => {
    if (mode === 'focus') {
      handleSelectMode('shortBreak');
    } else if (mode === 'shortBreak') {
      handleSelectMode('longBreak');
    } else {
      handleSelectMode('focus');
    }
  };

  const handleFastTest = (seconds: number) => {
    setTimeLeft(seconds);
    setTotalTime(seconds);
    setIsRunning(true);
  };

  const handleTestSound = () => {
    playBellChime();
    triggerCelebration();
  };

  const handleIncrementCompleted = () => {
    setCompletedSessions((prev) => (prev >= targetSessions ? 0 : prev + 1));
  };

  const handleApplyPreset = (preset: PresetOption) => {
    const newConfig: TimerConfig = {
      ...config,
      focusDuration: preset.focus * 60,
      shortBreakDuration: preset.shortBreak * 60,
      longBreakDuration: preset.longBreak * 60,
    };
    setConfig(newConfig);
    if (mode === 'focus') {
      setTimeLeft(newConfig.focusDuration);
      setTotalTime(newConfig.focusDuration);
    } else if (mode === 'shortBreak') {
      setTimeLeft(newConfig.shortBreakDuration);
      setTotalTime(newConfig.shortBreakDuration);
    } else {
      setTimeLeft(newConfig.longBreakDuration);
      setTotalTime(newConfig.longBreakDuration);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key.toLowerCase() === 'r') {
        handleReset();
      } else if (e.key.toLowerCase() === 's') {
        setIsSettingsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, timeLeft, mode, config]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between text-neutral-100 transition-colors duration-500 overflow-x-hidden"
      style={{
        backgroundColor: currentTheme.surfaceBg,
        backgroundImage: `radial-gradient(ellipse at 50% 15%, ${currentTheme.glow} 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(20,25,35,0.8), transparent 50%)`,
      }}
    >
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        ambientSound={ambientSound}
        onToggleAmbient={() => {
          setAmbientSound((prev) => (prev === 'none' ? 'brown-noise' : 'none'));
        }}
        currentTheme={currentTheme}
      />

      {/* Main Workbench Body */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 max-w-6xl mx-auto">
        {viewMode === 'all-widgets' ? (
          <div className="w-full flex flex-col items-center space-y-8 sm:space-y-10 animate-in fade-in duration-300">
            {/* Top Primary Medium Widget */}
            <div className="w-full flex flex-col items-center">
              <MediumWidget
                mode={mode}
                timeLeft={timeLeft}
                totalTime={totalTime}
                isRunning={isRunning}
                completedSessions={completedSessions}
                targetSessions={targetSessions}
                currentTask={currentTask}
                theme={currentTheme}
                focusDuration={config.focusDuration}
                shortBreakDuration={config.shortBreakDuration}
                longBreakDuration={config.longBreakDuration}
                onTogglePlay={handleTogglePlay}
                onReset={handleReset}
                onSkip={handleSkip}
                onSelectMode={handleSelectMode}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onIncrementCompleted={handleIncrementCompleted}
              />
              <span className="text-xs font-semibold text-neutral-400 mt-2.5 tracking-wide">
                Pomodoro (Medium Widget)
              </span>
            </div>

            {/* Bottom 4 Small Widgets Grid (Matching Exact Reference Layout) */}
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 place-items-center">
                {/* 1. Digital Classic */}
                <div className="flex flex-col items-center">
                  <SmallDigitalWidget
                    mode={mode}
                    timeLeft={timeLeft}
                    isRunning={isRunning}
                    theme={currentTheme}
                    onTogglePlay={handleTogglePlay}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                  />
                  <span className="text-xs font-medium text-neutral-400 mt-2">Pomodoro</span>
                </div>

                {/* 2. Tomato Arc */}
                <div className="flex flex-col items-center">
                  <SmallTomatoArcWidget
                    mode={mode}
                    timeLeft={timeLeft}
                    totalTime={totalTime}
                    isRunning={isRunning}
                    theme={currentTheme}
                    onTogglePlay={handleTogglePlay}
                  />
                  <span className="text-xs font-medium text-neutral-400 mt-2">Pomodoro</span>
                </div>

                {/* 3. Focus Sound Wave */}
                <div className="flex flex-col items-center">
                  <SmallWaveWidget
                    mode={mode}
                    timeLeft={timeLeft}
                    isRunning={isRunning}
                    theme={currentTheme}
                    onTogglePlay={handleTogglePlay}
                  />
                  <span className="text-xs font-medium text-neutral-400 mt-2">Pomodoro</span>
                </div>

                {/* 4. Tachometer / Segmented Ticks */}
                <div className="flex flex-col items-center">
                  <SmallTachometerWidget
                    mode={mode}
                    timeLeft={timeLeft}
                    totalTime={totalTime}
                    isRunning={isRunning}
                    theme={currentTheme}
                    onTogglePlay={handleTogglePlay}
                  />
                  <span className="text-xs font-medium text-neutral-400 mt-2">Pomodoro</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Phone Simulator Mode */
          <div className="w-full flex justify-center animate-in fade-in duration-300">
            <DeviceSimulator
              platform={viewMode === 'iphone' ? 'iphone' : 'android'}
              selectedWidgetStyle={selectedWidgetStyle}
              onSelectWidgetStyle={setSelectedWidgetStyle}
              mode={mode}
              timeLeft={timeLeft}
              totalTime={totalTime}
              isRunning={isRunning}
              completedSessions={completedSessions}
              targetSessions={targetSessions}
              currentTask={currentTask}
              theme={currentTheme}
              focusDuration={config.focusDuration}
              shortBreakDuration={config.shortBreakDuration}
              longBreakDuration={config.longBreakDuration}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
              onSkip={handleSkip}
              onSelectMode={handleSelectMode}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onIncrementCompleted={handleIncrementCompleted}
            />
          </div>
        )}
      </main>

      {/* Bottom Quick Controls & Shortcut Bar */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between text-xs text-neutral-400 border-t border-white/5 gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${isRunning ? 'animate-ping' : ''}`}
              style={{ backgroundColor: currentTheme.primary }}
            />
            {isRunning ? 'Timer Active' : 'Ready'}
          </span>
          <span>•</span>
          <span>
            Goal: <strong className="text-white">{completedSessions}</strong>/{targetSessions} sessions
          </span>
        </div>

        {/* Keyboard hints */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-neutral-400">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-white/10 text-white font-mono text-[10px]">
              Space
            </kbd>{' '}
            {isRunning ? 'Pause' : 'Start'}
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-white/10 text-white font-mono text-[10px]">
              R
            </kbd>{' '}
            Reset
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-white/10 text-white font-mono text-[10px]">
              S
            </kbd>{' '}
            Settings
          </span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onChangeConfig={(newCfg) => setConfig((prev) => ({ ...prev, ...newCfg }))}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        currentTask={currentTask}
        onChangeTask={setCurrentTask}
        targetSessions={targetSessions}
        onChangeTargetSessions={setTargetSessions}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        tickSoundEnabled={tickSoundEnabled}
        onToggleTickSound={() => setTickSoundEnabled((v) => !v)}
        ambientSound={ambientSound}
        onSelectAmbientSound={(snd) => setAmbientSound(snd)}
        ambientVolume={ambientVolume}
        onChangeAmbientVolume={setAmbientVol}
        onApplyPreset={handleApplyPreset}
      />

      {/* Export, Poster & Testing Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        mode={mode}
        timeLeft={timeLeft}
        totalTime={totalTime}
        isRunning={isRunning}
        completedSessions={completedSessions}
        targetSessions={targetSessions}
        currentTask={currentTask}
        theme={currentTheme}
        focusDuration={config.focusDuration}
        shortBreakDuration={config.shortBreakDuration}
        longBreakDuration={config.longBreakDuration}
        onFastTest={handleFastTest}
        onTestSound={handleTestSound}
      />
    </div>
  );
}
