import React, { useRef, useState } from 'react';
import { toPng, toSvg } from 'html-to-image';
import { Download, Image as ImageIcon, Smartphone, Code, Check, Copy, Sparkles, ExternalLink, Play, Bell, Flame } from 'lucide-react';
import { TimerMode, WidgetTheme } from '../types';
import { MediumWidget } from './widgets/MediumWidget';
import { SmallDigitalWidget } from './widgets/SmallDigitalWidget';
import { SmallTomatoArcWidget } from './widgets/SmallTomatoArcWidget';
import { SmallWaveWidget } from './widgets/SmallWaveWidget';
import { SmallTachometerWidget } from './widgets/SmallTachometerWidget';
import { TomatoIcon } from './TomatoIcon';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  onFastTest: (seconds: number) => void;
  onTestSound: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
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
  onFastTest,
  onTestSound,
}) => {
  const [activeTab, setActiveTab] = useState<'poster' | 'widgets' | 'code' | 'test'>('poster');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const posterRef = useRef<HTMLDivElement>(null);
  const mediumWidgetRef = useRef<HTMLDivElement>(null);
  const digitalWidgetRef = useRef<HTMLDivElement>(null);
  const tomatoArcWidgetRef = useRef<HTMLDivElement>(null);
  const waveWidgetRef = useRef<HTMLDivElement>(null);
  const tachometerWidgetRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const downloadElementAsImage = async (
    element: HTMLElement | null,
    filename: string,
    pixelRatio = 2
  ) => {
    if (!element) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(element, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: '#12141A',
      });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const currentUrl = window.location.href;

  const scriptableCode = `// iOS Scriptable Widget Code for Pomodoro Timer
// Copy into the "Scriptable" App on iPhone / iPad

const widget = new ListWidget();
widget.backgroundColor = new Color("${theme.cardBg}");

const title = widget.addText("🍅 Pomodoro Focus");
title.textColor = new Color("${theme.primary}");
title.font = Font.boldSystemFont(13);

widget.addSpacer(8);

const timer = widget.addText("25:00");
timer.textColor = Color.white();
timer.font = Font.boldSystemFont(32);

widget.addSpacer(4);

const status = widget.addText("Stay focused • 4/10 Done");
status.textColor = new Color("#9CA3AF");
status.font = Font.systemFont(11);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-lg animate-in fade-in duration-200">
      <div
        id="export-modal"
        className="relative w-full max-w-3xl rounded-[32px] p-5 sm:p-7 border bg-[#161821] border-white/10 text-white shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
        style={{
          boxShadow: `0 30px 80px -20px rgba(0,0,0,0.9), 0 0 40px -15px ${theme.glow}`,
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center border"
              style={{
                backgroundColor: `${theme.primary}25`,
                borderColor: `${theme.primary}50`,
              }}
            >
              <Download className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">Download & Test Hub</h2>
              <p className="text-xs text-neutral-400">Download high-res poster, widget graphics, and test live</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 my-4 p-1 rounded-2xl bg-neutral-900 border border-white/5 flex-shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('poster')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'poster'
                ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Poster (Full Showcase)</span>
          </button>

          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'widgets'
                ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Individual Widgets</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'test'
                ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Fast Test & Mobile PWA</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>iOS Scriptable Code</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
          {/* 1. POSTER TAB */}
          {activeTab === 'poster' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
                <div>
                  <h3 className="text-sm font-bold text-white">Full Showcase Poster (1:1 High-Res)</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Crisp 2048x2048 PNG render containing the Top Medium Widget and 4 Small Square Widgets.
                  </p>
                </div>
                <button
                  id="download-poster-png-btn"
                  onClick={() => downloadElementAsImage(posterRef.current, 'pomodoro-widgets-poster', 3)}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  style={{
                    backgroundColor: theme.primary,
                    boxShadow: `0 8px 20px -6px ${theme.glow}`,
                  }}
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Generating PNG...' : 'Download Poster (PNG)'}
                </button>
              </div>

              {/* Poster Preview Frame (Exact Studio 1:1 Aspect Ratio) */}
              <div className="w-full flex justify-center overflow-x-auto p-2 bg-[#0B0D11] rounded-2xl border border-white/5">
                <div
                  ref={posterRef}
                  id="poster-render-target"
                  className="w-[600px] h-[600px] flex-shrink-0 p-8 flex flex-col justify-between items-center select-none text-white relative rounded-[36px] overflow-hidden"
                  style={{
                    backgroundColor: '#13151D',
                    backgroundImage: `radial-gradient(circle at 50% 30%, ${theme.glow} 0%, transparent 65%), radial-gradient(circle at 10% 90%, rgba(25,30,45,0.7), transparent 40%)`,
                  }}
                >
                  {/* Subtle Studio Glow Vignette */}
                  <div className="absolute inset-0 bg-radial from-transparent to-black/40 pointer-events-none" />

                  {/* Top: Medium Widget */}
                  <div className="w-full flex flex-col items-center z-10 scale-[0.88] origin-top">
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
                      onTogglePlay={() => {}}
                      onReset={() => {}}
                      onSkip={() => {}}
                      onSelectMode={() => {}}
                    />
                    <span className="text-[11px] font-semibold text-neutral-400 mt-1 tracking-wide">
                      Pomodoro
                    </span>
                  </div>

                  {/* Bottom: 4 Small Square Widgets */}
                  <div className="w-full z-10 scale-[0.84] origin-bottom mb-1">
                    <div className="grid grid-cols-4 gap-3 place-items-center">
                      <div className="flex flex-col items-center">
                        <SmallDigitalWidget
                          mode={mode}
                          timeLeft={timeLeft}
                          isRunning={isRunning}
                          theme={theme}
                          onTogglePlay={() => {}}
                        />
                        <span className="text-[10px] font-medium text-neutral-400 mt-1.5">Pomodoro</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <SmallTomatoArcWidget
                          mode={mode}
                          timeLeft={timeLeft}
                          totalTime={totalTime}
                          isRunning={isRunning}
                          theme={theme}
                          onTogglePlay={() => {}}
                        />
                        <span className="text-[10px] font-medium text-neutral-400 mt-1.5">Pomodoro</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <SmallWaveWidget
                          mode={mode}
                          timeLeft={timeLeft}
                          isRunning={isRunning}
                          theme={theme}
                          onTogglePlay={() => {}}
                        />
                        <span className="text-[10px] font-medium text-neutral-400 mt-1.5">Pomodoro</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <SmallTachometerWidget
                          mode={mode}
                          timeLeft={timeLeft}
                          totalTime={totalTime}
                          isRunning={isRunning}
                          theme={theme}
                          onTogglePlay={() => {}}
                        />
                        <span className="text-[10px] font-medium text-neutral-400 mt-1.5">Pomodoro</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. INDIVIDUAL WIDGETS TAB */}
          {activeTab === 'widgets' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Download high-resolution individual PNG assets for each widget style:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Medium Widget Asset */}
                <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Medium Wide Dial Widget</span>
                    <button
                      onClick={() => downloadElementAsImage(mediumWidgetRef.current, 'pomodoro-medium-widget', 3)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> PNG
                    </button>
                  </div>
                  <div className="overflow-hidden flex justify-center py-2 scale-90 origin-top">
                    <div ref={mediumWidgetRef} className="p-2">
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
                        onTogglePlay={() => {}}
                        onReset={() => {}}
                        onSkip={() => {}}
                        onSelectMode={() => {}}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Tomato Arc Widget */}
                <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Tomato Arc Square Widget</span>
                    <button
                      onClick={() => downloadElementAsImage(tomatoArcWidgetRef.current, 'pomodoro-tomato-arc-widget', 3)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> PNG
                    </button>
                  </div>
                  <div className="flex justify-center py-2">
                    <div ref={tomatoArcWidgetRef} className="p-2">
                      <SmallTomatoArcWidget
                        mode={mode}
                        timeLeft={timeLeft}
                        totalTime={totalTime}
                        isRunning={isRunning}
                        theme={theme}
                        onTogglePlay={() => {}}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Tachometer Widget */}
                <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Tachometer Radial Widget</span>
                    <button
                      onClick={() => downloadElementAsImage(tachometerWidgetRef.current, 'pomodoro-tachometer-widget', 3)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> PNG
                    </button>
                  </div>
                  <div className="flex justify-center py-2">
                    <div ref={tachometerWidgetRef} className="p-2">
                      <SmallTachometerWidget
                        mode={mode}
                        timeLeft={timeLeft}
                        totalTime={totalTime}
                        isRunning={isRunning}
                        theme={theme}
                        onTogglePlay={() => {}}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Digital Widget */}
                <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Digital Classic Square Widget</span>
                    <button
                      onClick={() => downloadElementAsImage(digitalWidgetRef.current, 'pomodoro-digital-widget', 3)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> PNG
                    </button>
                  </div>
                  <div className="flex justify-center py-2">
                    <div ref={digitalWidgetRef} className="p-2">
                      <SmallDigitalWidget
                        mode={mode}
                        timeLeft={timeLeft}
                        isRunning={isRunning}
                        theme={theme}
                        onTogglePlay={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. TEST & MOBILE PWA TAB */}
          {activeTab === 'test' && (
            <div className="space-y-5">
              {/* Fast Test Actions */}
              <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                  Interactive Quick Testing
                </span>
                <p className="text-xs text-neutral-300">
                  Instantly trigger test timers, sound effects, celebrations, and session logs without waiting 25 minutes:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    onClick={() => onFastTest(10)}
                    className="p-3 rounded-xl bg-neutral-800 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-sm text-white">⚡ 10s Timer</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Quick finish test</div>
                  </button>

                  <button
                    onClick={() => onFastTest(3)}
                    className="p-3 rounded-xl bg-neutral-800 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-sm text-white">🚀 3s Timer</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Instant celebration</div>
                  </button>

                  <button
                    onClick={onTestSound}
                    className="p-3 rounded-xl bg-neutral-800 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-sm text-white">🔔 Test Chime</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Meditation bowl</div>
                  </button>

                  <button
                    onClick={() => onFastTest(60)}
                    className="p-3 rounded-xl bg-neutral-800 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-sm text-white">⏱️ 1 Min Sprint</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Short focus test</div>
                  </button>
                </div>
              </div>

              {/* Install on iPhone / Android Guide */}
              <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-orange-400" /> Test on Real iPhone & Android
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentUrl);
                      setCopiedUrl(true);
                      setTimeout(() => setCopiedUrl(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUrl ? 'Copied Link!' : 'Copy App Link'}
                  </button>
                </div>

                <p className="text-xs text-neutral-300">
                  You can open this live application in your phone's browser and pin it as a full-screen home widget:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
                  <div className="p-3 rounded-xl bg-neutral-800/80 border border-white/5 space-y-1">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>🍎 iPhone / iPad (Safari)</span>
                    </div>
                    <ol className="list-decimal list-inside text-neutral-400 space-y-0.5 text-[11px]">
                      <li>Open the link in <strong>Safari</strong></li>
                      <li>Tap the <strong>Share</strong> button (box with arrow)</li>
                      <li>Tap <strong>"Add to Home Screen"</strong></li>
                      <li>Launch like a native dark luxury app!</li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-800/80 border border-white/5 space-y-1">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>🤖 Android (Chrome)</span>
                    </div>
                    <ol className="list-decimal list-inside text-neutral-400 space-y-0.5 text-[11px]">
                      <li>Open the link in <strong>Google Chrome</strong></li>
                      <li>Tap the <strong>three dots (⋮)</strong> menu</li>
                      <li>Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong></li>
                      <li>Test widgets directly on your home screen</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SCRIPTABLE CODE TAB */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">iOS Scriptable Widget Code</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scriptableCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied Code!' : 'Copy Code'}
                </button>
              </div>

              <p className="text-xs text-neutral-400">
                Paste this code into the free <strong>Scriptable</strong> app from the iOS App Store to put a real live widget on your iPhone home screen:
              </p>

              <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neutral-300 overflow-x-auto max-h-56">
                <code>{scriptableCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-4 border-t border-white/10 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
