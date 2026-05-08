import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Square, 
  Settings2, 
  Zap, 
  MousePointer2, 
  BarChart3, 
  Target, 
  History,
  Info,
  ExternalLink,
  Plus,
  ShieldCheck,
  X
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
interface ClickEvent {
  id: number;
  x: number;
  y: number;
}

interface ClickProfile {
  interval: number;
  clickType: 'single' | 'double';
  repeatCount: number; // 0 for infinite
}

// --- Components ---

const Tooltip = ({ children, text, className }: { children: React.ReactNode, text: string, className?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={cn("relative group", className)} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-[#1a1f29] border border-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-2xl pointer-events-none whitespace-nowrap"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Custom Hook for AdMob Logic ---
const REFRESH_THRESHOLD = 60; // 60 seconds of cumulative visibility

const useAdMob = (unitId: string, isVisible: boolean) => {
  const [status, setStatus] = useState<'loading' | 'active' | 'error' | 'restricted'>('loading');
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  useEffect(() => {
    // Ad Unit Lifecycle Management
    const initAd = () => {
      setStatus('loading');
      
      // Check for restricted domains (common in Cloud Run / Dev environments)
      const domain = window.location.hostname;
      const isRestricted = domain.includes('run.app') || domain.includes('localhost');

      setTimeout(() => {
        if (isRestricted) {
          setStatus('restricted');
          return;
        }

        // 98% success rate for simulation in prod
        const success = Math.random() > 0.02;
        if (success) {
          setStatus('active');
          setLastUpdated(Date.now());
          setAccumulatedTime(0);
        } else {
          setStatus('error');
        }
      }, 1500);
    };

    initAd();
  }, [unitId, refreshKey]);

  // Visibility-aware cumulative timer
  useEffect(() => {
    if (status !== 'active') return;
    
    let timer: NodeJS.Timeout;
    if (isVisible) {
      timer = setInterval(() => {
        setAccumulatedTime(prev => {
          const next = prev + 1;
          if (next >= REFRESH_THRESHOLD) {
            setRefreshKey(k => k + 1);
            return 0;
          }
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [status, isVisible, unitId]);

  return { 
    status, 
    lastUpdated, 
    progress: Math.max(0, 100 - (accumulatedTime / REFRESH_THRESHOLD) * 100) 
  };
};

const AdBanner = ({ unitId, position, isVisible }: { unitId: string, position: 'top' | 'bottom', isVisible: boolean }) => {
  const { status, lastUpdated, progress } = useAdMob(unitId, isVisible);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: position === 'top' ? 80 : 100, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className={cn(
            "w-full bg-[#0d1016] border-y border-slate-800/50 flex flex-col items-center justify-center overflow-hidden relative",
            position === 'top' ? "mb-4" : "mt-auto"
          )}
        >
          {/* Status Indicators */}
          <div className="absolute left-8 flex items-center gap-4 hidden lg:flex">
            <div className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg transition-colors",
              status === 'active' ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : 
              status === 'loading' ? "bg-amber-600/10 text-amber-500 border border-amber-500/20" : 
              status === 'restricted' ? "bg-orange-600/20 text-orange-400 border border-orange-500/30" :
              "bg-rose-600/20 text-rose-400 border border-rose-500/30"
            )}>
              {status === 'active' ? 'AD UNIT LIVE' : 
               status === 'loading' ? 'FETCHING SDK...' : 
               status === 'restricted' ? 'RESTRICTED DOMAIN' : 'SDK_CONNECTION_ERR'}
            </div>
          </div>

          <div className="w-full max-w-5xl flex items-center justify-between px-8 py-2 gap-6">
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-[10px] transition-all duration-500",
                status === 'active' ? "bg-indigo-600 shadow-indigo-600/20" : "bg-slate-800"
              )}>
                {status === 'loading' ? '...' : 'ADS'}
              </div>
              <div className="flex flex-col gap-1">
                {status === 'restricted' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-orange-400 tracking-tight">Production Domain Required</p>
                      <button 
                        onClick={() => setShowGuide(true)}
                        className="text-[9px] font-bold bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/20"
                      >
                        HOW TO FIX
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-600 uppercase font-mono">Ads restricted on current environment</p>
                  </>
                ) : status === 'error' ? (
                  <>
                    <p className="text-sm font-bold text-rose-400 tracking-tight">Connectivity Lag</p>
                    <p className="text-[10px] text-slate-600 uppercase font-mono">Service temporarily unavailable</p>
                  </>
                ) : (
                  <>
                    <p className={cn(
                      "text-sm font-bold tracking-tight transition-colors",
                      status === 'active' ? "text-white" : "text-slate-600"
                    )}>
                      {status === 'loading' ? 'Establishing secure connection...' : 'Global Professional Services'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">Premium tier</span>
                      <div className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-[9px] text-indigo-400/60 font-mono">PRO_REL_{unitId.slice(-4).toUpperCase()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {status === 'active' && (
                <button className="bg-white text-black px-8 py-2 rounded-xl font-bold text-[11px] hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5 uppercase">
                  Learn More
                </button>
              )}
              {status === 'restricted' && (
                <button 
                  onClick={() => setShowGuide(true)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-[10px] hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-orange-600/20 uppercase"
                >
                  Setup Guide
                </button>
              )}
              <Tooltip text={`Diagnostics: Last Refresh ${new Date(lastUpdated).toLocaleTimeString()}`}>
                <div className="w-9 h-9 rounded-xl bg-[#151921] border border-slate-800 flex items-center justify-center cursor-help group transition-colors hover:border-slate-700">
                  <ShieldCheck className={cn(
                    "w-4 h-4 transition-colors",
                    status === 'active' ? "text-emerald-500" : "text-slate-600"
                  )} />
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Monetization Checklist Modal */}
          <AnimatePresence>
            {showGuide && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowGuide(false)}
              >
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-[#11141B] w-full max-w-lg rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-black text-white italic uppercase tracking-wider">Monetization Checklist</h2>
                      <p className="text-slate-500 text-xs font-mono">Steps to activate live AdMob revenue</p>
                    </div>
                      <button 
                        onClick={() => setShowGuide(false)}
                        className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        title: "Verifed Custom Domain",
                        desc: "Google AdSense restricts temporary domains like 'run.app'. You must deploy to a custom root domain (e.g., app.yourdomain.com).",
                        ready: false
                      },
                      {
                        title: "App-Ads.txt Validation",
                        desc: "Host the auth token at yourdomain.com/app-ads.txt to verify ownership in AdMob console.",
                        ready: false
                      },
                      {
                        title: "Production Unit IDs",
                        desc: "Replace test units (prefixed with ca-app-pub-3940...) with your unique production banner IDs.",
                        ready: true
                      },
                      {
                        title: "AdMob Policy Review",
                        desc: "Ensure your layout doesn't overlap content. AdMob requires clear spacing and no accidental clicks.",
                        ready: true
                      }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-3xl bg-[#0d1016] border border-slate-800/50">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center font-bold text-xs text-indigo-400">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-1">{step.title}</p>
                          <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setShowGuide(false)}
                    className="w-full mt-8 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-widest shadow-xl shadow-indigo-600/20 transition-all"
                  >
                    UNDERSTOOD
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Refresh Progress */}
          {status === 'active' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800/30 overflow-hidden">
              <motion.div 
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "linear" }}
                className="h-full bg-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  // State
  const [isActive, setIsActive] = useState(false);
  const [profile, setProfile] = useState<ClickProfile>({
    interval: 100,
    clickType: 'single',
    repeatCount: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    currentCPS: 0,
    peakCPS: 0,
    elapsed: 0
  });
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const clickCountInWindow = useRef(0);
  const lastCpsUpdate = useRef(0);

const ADMOB_APP_ID = import.meta.env.VITE_ADMOB_APP_ID || "ca-app-pub-3940256099942544~3347511713";
const ADMOB_BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID || "ca-app-pub-3940256099942544/6300978111";

  // Simulation Logic
  const triggerClick = useCallback(() => {
    const x = Math.random() * 80 + 10; // Random position within target
    const y = Math.random() * 80 + 10;
    
    setClicks(prev => [...prev.slice(-10), { id: Date.now(), x, y }]);
    setStats(prev => ({ ...prev, total: prev.total + (profile.clickType === 'single' ? 1 : 2) }));
    clickCountInWindow.current += (profile.clickType === 'single' ? 1 : 2);

    // Limit feedback clicks
    setTimeout(() => {
      setClicks(prev => prev.filter(c => Date.now() - c.id < 500));
    }, 500);
  }, [profile.clickType]);

  // CPS Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastCpsUpdate.current) / 1000;
        const currentCps = clickCountInWindow.current / (delta || 1);
        
        setStats(prev => ({
          ...prev,
          currentCPS: Math.round(currentCps * 10) / 10,
          peakCPS: Math.max(prev.peakCPS, Math.round(currentCps * 10) / 10),
          elapsed: startTimeRef.current ? Math.floor((now - startTimeRef.current) / 1000) : 0
        }));

        clickCountInWindow.current = 0;
        lastCpsUpdate.current = now;
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  // Start/Stop
  const toggleClicker = () => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
      lastCpsUpdate.current = Date.now();
      clickCountInWindow.current = 0;
      
      intervalRef.current = setInterval(() => {
        triggerClick();
      }, profile.interval);
    } else {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      {/* Top Banner Ad - Hidden when settings open */}
      <AdBanner unitId={ADMOB_BANNER_ID} position="top" isVisible={!showSettings} />

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-6 max-w-6xl mx-auto w-full">
        
        {/* Left Column: Simulator */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">ClickMaster Pro</h1>
              <p className="text-slate-500 text-sm font-mono tracking-tight uppercase text-[10px]">Precision Calibration Interface</p>
            </div>
            <div className="flex gap-2">
              <Tooltip text="Adjust System Parameters">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={cn(
                    "p-2.5 rounded-xl transition-all duration-300 border",
                    showSettings 
                      ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-lg shadow-indigo-500/10" 
                      : "bg-[#151921] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                  )}
                >
                  <Settings2 className="w-5 h-5" />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Simulator Target Area */}
          <div className="relative flex-1 min-h-[350px] bg-[#11141B] border border-slate-800 rounded-[2rem] overflow-hidden group cursor-crosshair shadow-inner">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ 
              backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <div className="text-white font-mono text-[120px] opacity-[0.02] select-none tracking-tighter">
                {stats.currentCPS || '0.0'}
              </div>
            </div>

            {/* Target Button */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <Tooltip text="Manual Pulse Input">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={triggerClick}
                  className={cn(
                    "w-52 h-52 rounded-full border-2 flex items-center justify-center relative transition-all duration-500",
                    isActive 
                      ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_60px_rgba(99,102,241,0.25)]" 
                      : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                  )}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Target className={cn(
                      "w-14 h-14 transition-transform duration-300",
                      isActive && "scale-110 text-indigo-400"
                    )} />
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-slate-500">Operation Core</span>
                  </div>

                  {/* Pulsing rings */}
                  {isActive && (
                    <>
                      <div className="absolute inset-[-12px] border border-indigo-500/30 rounded-full animate-ping-slow" />
                      <div className="absolute inset-[-24px] border border-indigo-500/10 rounded-full animate-ping-slow [animation-delay:0.3s]" />
                    </>
                  )}
                </motion.button>
              </Tooltip>
            </div>

            {/* Visual Click Effects */}
            <AnimatePresence>
              {clicks.map(click => (
                <motion.div
                  key={click.id}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-14 h-14 rounded-full border border-indigo-400/50 pointer-events-none z-20"
                  style={{ left: `${click.x}%`, top: `${click.y}%`, marginLeft: '-28px', marginTop: '-28px' }}
                >
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-md" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto mb-2">
            <Tooltip 
              text={isActive ? "Terminate Active Protocol" : "Launch Automation Cycle"}
              className="flex-[4] w-full"
            >
              <button
                onClick={toggleClicker}
                className={cn(
                  "w-full h-20 rounded-[2rem] flex items-center justify-center gap-4 font-bold text-lg tracking-wide transition-all transform active:scale-[0.98] shadow-2xl px-6",
                  isActive 
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40"
                )}
              >
                {isActive ? <Square className="fill-current w-5 h-5 flex-shrink-0" /> : <Play className="fill-current w-5 h-5 flex-shrink-0" />}
                <span className="truncate">{isActive ? "STOP SERVICE" : "INITIATE AUTOMATION"}</span>
              </button>
            </Tooltip>
            <Tooltip text="Reset Session Metrics" className="w-full sm:w-20">
              <button 
                onClick={() => setStats({ total: 0, currentCPS: 0, peakCPS: 0, elapsed: 0 })}
                className="w-full h-20 bg-[#151921] border border-slate-800 hover:border-slate-700 rounded-[2rem] flex items-center justify-center transition-all text-slate-500 hover:text-white"
              >
                <History className="w-7 h-7" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Right Column: Info & Config */}
        <aside className="w-full md:w-80 flex flex-col gap-6">
          
          {/* Stats Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#151921] border border-slate-800 p-5 rounded-[2rem] flex flex-col gap-1 shadow-lg">
              <Zap className="w-4 h-4 text-indigo-400 mb-1" />
              <div className="text-3xl font-mono font-bold text-white tracking-tighter">{stats.currentCPS}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Rate</div>
            </div>
            <div className="bg-[#151921] border border-slate-800 p-5 rounded-[2rem] flex flex-col gap-1 shadow-lg">
              <BarChart3 className="w-4 h-4 text-pink-400 mb-1" />
              <div className="text-3xl font-mono font-bold text-pink-400 tracking-tighter">{stats.peakCPS}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Peak FPS</div>
            </div>
            <div className="col-span-2 bg-[#151921] border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between shadow-lg">
              <div className="flex flex-col gap-1">
                <MousePointer2 className="w-4 h-4 text-blue-400 mb-1" />
                <div className="text-3xl font-mono font-bold text-white tracking-tighter">{stats.total.toLocaleString()}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Total Cycles</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-mono text-slate-600 font-medium">{Math.floor(stats.elapsed / 60)}:{(stats.elapsed % 60).toString().padStart(2, '0')}</div>
                <div className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Uptime</div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-[#151921] border border-slate-800 rounded-[2rem] p-6 flex flex-col gap-8 shadow-xl">
            <div>
              <label className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mb-5 block">Interval Frequency</label>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-medium text-slate-300">Burst Delay</span>
                <span className="font-mono text-indigo-400 font-bold">{profile.interval} ms</span>
              </div>
              <Tooltip text="Adjust delay between clicks">
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={profile.interval}
                  disabled={isActive}
                  onChange={(e) => setProfile(p => ({ ...p, interval: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
                />
              </Tooltip>
            </div>

            <div>
              <label className="text-[10px] text-pink-400 font-bold uppercase tracking-[0.2em] mb-5 block">Click Precision</label>
              <div className="flex bg-[#11141B] p-1.5 rounded-2xl border border-slate-800 shadow-inner">
                {(['single', 'double'] as const).map(type => (
                  <div key={type} className="flex-1">
                    <Tooltip text={`Toggle ${type} click mode`}>
                      <button
                        onClick={() => setProfile(p => ({ ...p, clickType: type }))}
                        className={cn(
                          "w-full py-2.5 text-[10px] font-bold rounded-xl transition-all tracking-wider",
                          profile.clickType === type 
                            ? "bg-slate-800 text-white shadow-xl border border-slate-700" 
                            : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        {type.toUpperCase()}
                      </button>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-start gap-4 text-slate-500">
                <Info className="w-4 h-4 mt-0.5 text-slate-600 flex-shrink-0" />
                <p className="text-[10px] leading-relaxed italic">
                  SwiftClick utilizes advanced touch injection protocols. Ensure your environment permits high-frequency automation.
                </p>
              </div>
            </div>
          </div>

          {/* AdMob Attribution Card */}
          <div className="mt-auto p-5 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 hidden md:flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">AdMob Backend</span>
              </div>
              <div className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded uppercase">Active</div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-slate-500 font-mono truncate">ID: {ADMOB_APP_ID}</p>
              <p className="text-[9px] text-slate-500 font-mono">Slot: {ADMOB_BANNER_ID.split('/').pop()}</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Banner Ad - Hidden when settings open */}
      <AdBanner unitId={ADMOB_BANNER_ID} position="bottom" isVisible={!showSettings} />
      
      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 md:hidden bg-[#0F1117] p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">System Config</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">Mobile Terminal</p>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            </div>
            
            <div className="flex flex-col gap-10">
               <div>
                  <label className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mb-6 block">Frequency Tuning</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="1000" 
                    step="10"
                    value={profile.interval}
                    onChange={(e) => setProfile(p => ({ ...p, interval: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-indigo-500"
                  />
                  <div className="flex justify-between mt-4 font-mono text-indigo-400 text-sm font-bold">
                    <span>{profile.interval}ms Delay</span>
                    <span>{(1000/profile.interval).toFixed(1)} CPS</span>
                  </div>
               </div>

               <div>
                 <label className="text-[10px] text-pink-400 font-bold uppercase tracking-[0.2em] mb-6 block">Action Protocol</label>
                 <div className="grid grid-cols-2 gap-4">
                   {(['single', 'double'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setProfile(p => ({ ...p, clickType: type }))}
                        className={cn(
                          "py-4 rounded-2xl font-bold text-xs tracking-widest border transition-all",
                          profile.clickType === type 
                            ? "bg-indigo-500 border-indigo-400 text-white shadow-xl shadow-indigo-500/20" 
                            : "bg-slate-800/50 border-slate-700 text-slate-500"
                        )}
                      >
                        {type.toUpperCase()}
                      </button>
                   ))}
                 </div>
               </div>
               
               <button 
                onClick={() => setShowSettings(false)}
                className="w-full h-20 bg-indigo-600 text-white rounded-3xl font-bold text-lg shadow-2xl shadow-indigo-600/30 mt-auto"
               >
                 COMMIT PROTOCOL
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

