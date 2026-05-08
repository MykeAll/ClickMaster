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
  X,
  FileText,
  Scale
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

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Kernel...");

  useEffect(() => {
    const sequence = [
      { p: 15, s: "Loading UI Components..." },
      { p: 35, s: "Establishing AdSense Handshake..." },
      { p: 65, s: "Injecting Precision Protocols..." },
      { p: 85, s: "Optimizing Terminal Buffer..." },
      { p: 100, s: "System Ready" },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < sequence.length) {
        setProgress(sequence[currentStep].p);
        setStatus(sequence[currentStep].s);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[1000] bg-[#0F1117] flex flex-col items-center justify-center p-8"
    >
      <div className="w-full max-w-sm">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-6 group">
            <Zap className="w-10 h-10 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-widest mb-2">ClickMaster Pro</h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-[0.4em] uppercase">Advanced Automation Terminal</p>
        </motion.div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider uppercase">{status}</span>
            <span className="text-xs font-black text-white font-mono">{progress}%</span>
          </div>
          <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 text-[9px] text-slate-700 font-mono tracking-widest uppercase italic">
        Secured by AES-256 Multi-Layer Protocols
      </div>
    </motion.div>
  );
};

const LegalModal = ({ 
  isOpen, 
  onClose, 
  title, 
  content 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  content: React.ReactNode 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#11141B] w-full max-w-2xl max-h-[80vh] rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8 flex-shrink-0">
              <div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-wider">{title}</h2>
                <p className="text-slate-500 text-[10px] font-mono tracking-[0.2em] uppercase">Legal Documentation Hub</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar text-slate-400 text-sm leading-relaxed space-y-6">
              {content}
            </div>

            <div className="mt-8 flex-shrink-0">
              <button 
                onClick={onClose}
                className="w-full h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-widest transition-all"
              >
                CLOSE DOCUMENT
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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

import AdSenseUnit from './components/AdSenseUnit';

const AdBanner = ({ unitId, position, isVisible }: { unitId: string, position: 'top' | 'bottom', isVisible: boolean }) => {
  const [showGuide, setShowGuide] = useState(false);
  const ADSENSE_CLIENT = "ca-pub-9778861564915832";
  const ADSENSE_SLOT = "8720221013";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: position === 'top' ? 120 : 150, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className={cn(
            "w-full bg-[#0d1016] border-y border-slate-800/50 flex flex-col items-center justify-center overflow-hidden relative",
            position === 'top' ? "mb-4" : "mt-auto"
          )}
        >
          {/* Header UI */}
          <div className="w-full max-w-5xl px-8 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Monetized Terminal Active</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[8px] font-mono text-slate-600">SLOT: {ADSENSE_SLOT}</span>
            </div>
          </div>

          <div className="w-full max-w-5xl flex items-center justify-center p-4">
             <AdSenseUnit 
               client={ADSENSE_CLIENT}
               slot={ADSENSE_SLOT}
               className="rounded-xl overflow-hidden border border-slate-800/50 bg-[#0a0c10]"
             />
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

          {/* Animated Refresh Progress - Removed Simulation Progress Bar */}
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);

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

  const handleCommit = () => {
    setIsCommitting(true);
    setTimeout(() => {
      setIsCommitting(false);
      setShowSettings(false);
    }, 800);
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
      ) : (
        <motion.div 
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen bg-[#0F1117] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col"
        >
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

              {/* AdSense Attribution Card */}
              <div className="mt-auto p-5 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 hidden md:flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">AdSense Backend</span>
                  </div>
                  <div className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded uppercase">Verified</div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 font-mono truncate">ID: ca-pub-9778861564915832</p>
                  <p className="text-[9px] text-slate-500 font-mono">Slot: 8720221013</p>
                </div>
              </div>
            </aside>
          </main>

          {/* Bottom Banner Ad - Hidden when settings open */}
          <AdBanner unitId={ADMOB_BANNER_ID} position="bottom" isVisible={!showSettings} />

          {/* Legal Footer */}
          <footer className="w-full bg-[#0d1016] border-t border-slate-800/50 py-6 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-indigo-500/50" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">© 2024 ClickMaster Pro Terminal</span>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setActiveModal('privacy')}
                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2"
                >
                  <ShieldCheck className="w-3 h-3" /> Privacy Policy
                </button>
                <button 
                  onClick={() => setActiveModal('terms')}
                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2"
                >
                  <Scale className="w-3 h-3" /> Terms of Service
                </button>
              </div>
            </div>
          </footer>

          <LegalModal 
            isOpen={activeModal === 'privacy'} 
            onClose={() => setActiveModal(null)}
            title="Privacy Policy"
            content={
              <>
                <section>
                  <h3 className="text-white font-bold mb-2">1. Data Collection</h3>
                  <p>ClickMaster Pro is a self-contained productivity simulation tool. We do not collect personal identification information. All application statistics (CPS, total clicks, session time) are stored locally in your browser's temporary state and are cleared when the session is terminated.</p>
                </section>
                <section>
                  <h3 className="text-white font-bold mb-2">2. Advertisements</h3>
                  <p>We use Google AdSense to serve ads. Google may use cookies to serve ads based on your prior visits to this or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings.</p>
                </section>
                <section>
                  <h3 className="text-white font-bold mb-2">3. Cookies</h3>
                  <p>We use standard functional cookies required for the AdSense SDK to operate correctly. No third-party tracking outside of advertising parameters is implemented.</p>
                </section>
              </>
            }
          />

          <LegalModal 
            isOpen={activeModal === 'terms'} 
            onClose={() => setActiveModal(null)}
            title="Terms of Service"
            content={
              <>
                <section>
                  <h3 className="text-white font-bold mb-2">1. Acceptable Use</h3>
                  <p>ClickMaster Pro is intended for software testing and interface calibration simulation. You agree not to use this tool for malicious activities, including but not limited to, overloading external systems or simulating fraudulent interactions with third-party services.</p>
                </section>
                <section>
                  <h3 className="text-white font-bold mb-2">2. No Warranty</h3>
                  <p>This software is provided "as is" without warranty of any kind. Operation at high CPS rates may impact browser performance depending on hardware specifications.</p>
                </section>
                <section>
                  <h3 className="text-white font-bold mb-2">3. Limitation of Liability</h3>
                  <p>The developers are not liable for any direct or indirect damages resulting from the use or inability to use this automation terminal.</p>
                </section>
              </>
            }
          />
          
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
                    onClick={handleCommit}
                    disabled={isCommitting}
                    className={cn(
                      "w-full h-20 rounded-3xl font-bold text-lg shadow-2xl transition-all mt-auto flex items-center justify-center gap-3",
                      isCommitting 
                        ? "bg-emerald-600 text-white shadow-emerald-900/40" 
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40 active:scale-95"
                    )}
                   >
                     {isCommitting ? (
                       <>
                         <ShieldCheck className="w-6 h-6 animate-pulse" />
                         COMMITTING...
                       </>
                     ) : (
                       "COMMIT PROTOCOL"
                     )}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

