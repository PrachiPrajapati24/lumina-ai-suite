import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clipboard, Check, RotateCcw, Share2 } from 'lucide-react';

export const CaptionGenerator: React.FC = () => {
  const { showToast } = useToast();

  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Witty');
  const [keywords, setKeywords] = useState('');

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Hydrate form fields if creative template parameters are detected
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('topic');
    const p = params.get('platform');
    const tn = params.get('tone');
    const k = params.get('keywords');
    if (t) setTopic(t);
    if (p) setPlatform(p);
    if (tn) setTone(tn);
    if (k) setKeywords(k);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
      setErrorMsg('Please specify a topic or theme.');
      return;
    }

    setGenerating(true);
    setErrorMsg('');
    setResult(null);
    setCopied(false);

    try {
      const res = await api.post('/ai/caption', {
        topic,
        platform,
        tone,
        keywords,
      });
      // The API returns the whole Generation object. We extract the 'output' string.
      setResult(res.data.output);
      showToast('Caption generated and saved in history!', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to generate caption. Please check server.');
      showToast('Generation failed', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    showToast('Copied caption to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setKeywords('');
    setPlatform('Instagram');
    setTone('Witty');
    setResult(null);
    setErrorMsg('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Input Form Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-card p-6 border border-dark-700/50 relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-dark-700/30 pb-4 mb-6">
            <div className="p-2 bg-neon-cyan/10 rounded-xl text-neon-cyan border border-neon-cyan/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold Outfit text-slate-100">Configure Caption</h2>
              <p className="text-xs text-slate-500">Fine-tune social media parameters</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/35 rounded-xl text-red-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Caption Topic / Core Message
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. launching our new sustainable coffee brand, or morning routine at a creative design studio..."
                rows={3}
                className="w-full glass-input resize-none"
                required
              />
            </div>

            {/* Platform Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Social Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full glass-input"
              >
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn Professional</option>
                <option value="Twitter">Twitter / X</option>
              </select>
            </div>

            {/* Tone Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Creative Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full glass-input"
              >
                <option value="Witty">Witty & Humorous</option>
                <option value="Professional">Professional & Corporate</option>
                <option value="Energetic">Energetic & Inspiring</option>
                <option value="Casual">Casual & Relaxed</option>
                <option value="Emotional">Emotional & Vulnerable</option>
              </select>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Keywords to Include (optional)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. organic, coffee, eco-friendly (comma separated)"
                className="w-full glass-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={generating}
              className="w-full btn-premium-cyan flex items-center justify-center gap-2 mt-4"
            >
              {generating ? (
                <span>Generating Copy...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-dark-950" />
                  <span>Generate Social Caption</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Output / Results Column */}
      <div className="lg:col-span-7 h-full">
        <div className="glass-card p-6 border border-dark-700/50 flex flex-col min-h-[460px] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-3 flex items-center gap-2 z-10">
            {result && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-dark-800/80 border border-dark-700 text-slate-400 hover:text-white transition-colors"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-neon-cyan" /> : <Clipboard className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-dark-800/80 border border-dark-700 text-slate-400 hover:text-white transition-colors"
                  title="Clear Content"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="border-b border-dark-700/30 pb-4 mb-6">
            <h2 className="text-lg font-bold Outfit text-slate-100">Workspace Output</h2>
            <p className="text-xs text-slate-500">Your generated captions will appear below</p>
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
                    Lumina engine generating social copy...
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  {/* Styled glass container for output display */}
                  <div className="bg-dark-950/40 border border-dark-700/50 rounded-xl p-6 font-sans text-slate-200 leading-relaxed text-sm md:text-base whitespace-pre-wrap flex-1 select-text">
                    {result}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-4 shrink-0">
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" />
                      Saved in History logs
                    </span>
                    <span>Length: {result.length} characters</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <Sparkles className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-sm font-bold text-slate-400">Empty Workspace Sandbox</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    Set up your topic and tone parameters on the left, then click generate to craft premium captions.
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
export default CaptionGenerator;
