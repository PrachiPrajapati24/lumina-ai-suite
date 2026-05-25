import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clipboard, Check, RotateCcw, Notebook } from 'lucide-react';

export const StudyNotesGenerator: React.FC = () => {
  const { showToast } = useToast();

  const [subject, setSubject] = useState('');
  const [topicText, setTopicText] = useState('');
  const [detailLevel, setDetailLevel] = useState('detailed');

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Hydrate fields if presets are specified
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('subject');
    const t = params.get('topicText');
    const d = params.get('detailLevel');
    if (s) setSubject(s);
    if (t) setTopicText(t);
    if (d) setDetailLevel(d);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !topicText) {
      setErrorMsg('Please specify a subject and a topic/concept text.');
      return;
    }

    setGenerating(true);
    setErrorMsg('');
    setResult(null);
    setCopied(false);

    try {
      const res = await api.post('/ai/notes', {
        subject,
        topicText,
        detailLevel,
      });
      setResult(res.data.output);
      showToast('Study notes generated and saved to log history!', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to generate study notes.');
      showToast('Generation failed', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    showToast('Copied notes to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSubject('');
    setTopicText('');
    setDetailLevel('detailed');
    setResult(null);
    setErrorMsg('');
  };

  // Helper function to render note markdown elegantly
  const renderFormattedMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl md:text-3xl font-extrabold text-white mt-6 mb-4 Outfit border-b border-dark-700/50 pb-2">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl md:text-2xl font-bold text-neon-violet mt-6 mb-3 Outfit">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-bold text-neon-blue mt-5 mb-2 Outfit">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={index} className="ml-6 list-disc text-slate-300 my-1">{line.replace(/^[\*\-]\s+/, '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={index} className="h-3"></div>;
      }
      return <p key={index} className="text-slate-300 my-2 leading-relaxed text-sm md:text-base">{line}</p>;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-card p-6 border border-dark-700/50 relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-dark-700/30 pb-4 mb-6">
            <div className="p-2 bg-neon-violet/10 rounded-xl text-neon-violet border border-neon-violet/20 shrink-0">
              <Notebook className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold Outfit text-slate-100">Study Companion</h2>
              <p className="text-xs text-slate-500">Transform topics into neat study blocks</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/35 rounded-xl text-red-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Subject Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Academic Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics, Cognitive Psychology, World History"
                className="w-full glass-input"
                required
              />
            </div>

            {/* Concept / Text text-area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Topic Core Text or Concepts
              </label>
              <textarea
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                placeholder="e.g. Quantum Entanglement, Cognitive Dissonance theory overview and its key research benchmarks..."
                rows={5}
                className="w-full glass-input resize-none"
                required
              />
            </div>

            {/* Detail toggle options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Study Notes Detail Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['brief', 'detailed', 'comprehensive'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDetailLevel(lvl)}
                    className={`py-2 px-3 text-xs font-bold uppercase rounded-lg border transition-all duration-200 capitalize ${
                      detailLevel === lvl
                        ? 'bg-neon-violet/15 border-neon-violet text-slate-100 font-bold'
                        : 'bg-dark-950/40 border-dark-700/80 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={generating}
              className="w-full btn-premium-violet flex items-center justify-center gap-2 mt-4"
            >
              {generating ? (
                <span>Compiling Study Block...</span>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 text-white" />
                  <span>Generate Study Notes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Output Panel Column */}
      <div className="lg:col-span-7 h-full">
        <div className="glass-card p-6 border border-dark-700/50 flex flex-col min-h-[500px] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-3 flex items-center gap-2 z-10">
            {result && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-dark-800/80 border border-dark-700 text-slate-400 hover:text-white transition-colors"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-neon-violet" /> : <Clipboard className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-dark-800/80 border border-dark-700 text-slate-400 hover:text-white transition-colors"
                  title="Clear Workspace"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="border-b border-dark-700/30 pb-4 mb-6">
            <h2 className="text-lg font-bold Outfit text-slate-100">Study Notes Canvas</h2>
            <p className="text-xs text-slate-500">Your custom study deck will appear below</p>
          </div>

          <div className="flex-1 flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-4"
                >
                  <LoadingSpinner size="lg" />
                  <p className="text-xs text-slate-400 animate-pulse uppercase tracking-wider font-semibold">
                    Lumina engine digesting subjects...
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-between"
                >
                  {/* Notes scrollbox */}
                  <div className="bg-dark-950/40 border border-dark-700/50 rounded-xl p-6 font-sans text-slate-200 leading-relaxed text-sm md:text-base overflow-y-auto max-h-[400px] select-text">
                    {renderFormattedMarkdown(result)}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-4 shrink-0">
                    <span>Subject: {subject}</span>
                    <span>Detail: {detailLevel.toUpperCase()}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <BookOpen className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-sm font-bold text-slate-400">Empty Study Deck</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    Configure your subject, input core content to digest on the left, then trigger compile.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudyNotesGenerator;
