import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clipboard, Check, RotateCcw, PenTool } from 'lucide-react';

export const BlogGenerator: React.FC = () => {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('General Public');
  const [length, setLength] = useState('medium');

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Hydrate fields if presets are specified
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('title');
    const k = params.get('keywords');
    const a = params.get('audience');
    const l = params.get('length');
    if (t) setTitle(t);
    if (k) setKeywords(k);
    if (a) setAudience(a);
    if (l) setLength(l);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setErrorMsg('Please specify a title or core topic.');
      return;
    }

    setGenerating(true);
    setErrorMsg('');
    setResult(null);
    setCopied(false);

    try {
      const res = await api.post('/ai/blog', {
        title,
        keywords,
        audience,
        length,
      });
      setResult(res.data.output);
      showToast('Blog article generated and saved!', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to generate blog post.');
      showToast('Generation failed', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    showToast('Copied article to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTitle('');
    setKeywords('');
    setAudience('General Public');
    setLength('medium');
    setResult(null);
    setErrorMsg('');
  };

  // Helper function to render markdown output with simple visual styles
  const renderFormattedMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl md:text-3xl font-extrabold text-white mt-6 mb-4 Outfit border-b border-dark-700/50 pb-2">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl md:text-2xl font-bold text-neon-cyan mt-6 mb-3 Outfit">{line.replace('## ', '')}</h2>;
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
      {/* Input Configuration Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-card p-6 border border-dark-700/50 relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-dark-700/30 pb-4 mb-6">
            <div className="p-2 bg-neon-blue/10 rounded-xl text-neon-blue border border-neon-blue/20 shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold Outfit text-slate-100">Blog Builder</h2>
              <p className="text-xs text-slate-500">Configure parameters for SEO articles</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/35 rounded-xl text-red-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Title / Topic input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Article Title or Main Topic
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Coding Secrets of Senior Engineers..."
                className="w-full glass-input"
                required
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. junior software developers, corporate managers"
                className="w-full glass-input"
                required
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. software engineering, programming habits"
                className="w-full glass-input"
              />
            </div>

            {/* Length toggle options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Article Wordcount / Length
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['short', 'medium', 'long'].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLength(len)}
                    className={`py-2 px-3 text-xs font-bold uppercase rounded-lg border transition-all duration-200 capitalize ${
                      length === len
                        ? 'bg-neon-blue/15 border-neon-blue text-slate-100 font-bold'
                        : 'bg-dark-950/40 border-dark-700/80 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
           <button
  type="submit"
  disabled={generating}
  className="w-full bg-neon-blue hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-neon-blue/20"
>
  {generating ? (
    <span>Composing Article...</span>
  ) : (
    <>
      <FileText className="w-4 h-4 text-white" />
      <span>Generate Blog Post</span>
    </>
  )}
</button>
          </form>
        </div>
      </div>

      {/* Output Display Column */}
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
                  {copied ? <Check className="w-4 h-4 text-neon-blue animate-pulse" /> : <Clipboard className="w-4 h-4" />}
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
            <h2 className="text-lg font-bold Outfit text-slate-100">Article Output Workspace</h2>
            <p className="text-xs text-slate-500">Your custom article draft will load below</p>
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
                    Lumina engine weaving articles...
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-between"
                >
                  {/* Article Markdown styled display scrollbox */}
                  <div className="bg-dark-950/40 border border-dark-700/50 rounded-xl p-6 font-sans text-slate-200 leading-relaxed text-sm md:text-base overflow-y-auto max-h-[400px] select-text">
                    {renderFormattedMarkdown(result)}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-4 shrink-0">
                    <span>Generated for: {audience}</span>
                    <span>Length: ~{result.split(' ').length} words</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <FileText className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-sm font-bold text-slate-400">Empty Article Canvas</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    Set up your topic titles, targeted keywords, and length parameters on the left, then trigger generate.
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
export default BlogGenerator;
