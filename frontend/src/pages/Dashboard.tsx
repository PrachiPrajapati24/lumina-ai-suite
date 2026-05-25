import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Sparkles,
  FileText,
  BookOpen,
  History,
  TrendingUp,
  Zap,
  ArrowRight,
  Clipboard,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface Generation {
  _id: string;
  toolType: 'caption' | 'blog' | 'notes';
  prompt: any;
  output: string;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch generations to compute stats
  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const res = await api.get('/generations');
        setGenerations(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGenerations();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied content to clipboard!', 'success');
  };

  // Stats calculation
  const totalGenerations = generations.length;

  const getMostUsedTool = () => {
    if (generations.length === 0) return 'None';
    const counts = { caption: 0, blog: 0, notes: 0 };
    generations.forEach((g) => {
      if (counts[g.toolType] !== undefined) {
        counts[g.toolType]++;
      }
    });
    const maxVal = Math.max(counts.caption, counts.blog, counts.notes);
    if (maxVal === 0) return 'None';
    if (maxVal === counts.caption) return 'Social Caption';
    if (maxVal === counts.blog) return 'Blog Post';
    return 'Study Notes';
  };

  const getLatestGeneration = () => {
    if (generations.length === 0) return { title: 'No activity', time: 'N/A' };
    const latest = generations[0];
    const toolNames = { caption: 'Social Caption', blog: 'Blog Post', notes: 'Study Notes' };
    return {
      title: toolNames[latest.toolType],
      time: new Date(latest.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    };
  };

  // Recharts Data Aggregation (Generations by Tool Type)
  const getToolTypeData = () => {
    const counts = { caption: 0, blog: 0, notes: 0 };
    generations.forEach((g) => {
      if (counts[g.toolType] !== undefined) {
        counts[g.toolType]++;
      }
    });
    return [
      { name: 'Captions', value: counts.caption, fill: '#06b6d4' },
      { name: 'Blogs', value: counts.blog, fill: '#3b82f6' },
      { name: 'Study Notes', value: counts.notes, fill: '#8b5cf6' },
    ];
  };

  // Recharts Area Chart (Generations over time - last 7 items grouped simply)
  const getTimeChartData = () => {
    if (generations.length === 0) {
      return [
        { day: 'Mon', count: 0 },
        { day: 'Tue', count: 0 },
        { day: 'Wed', count: 0 },
        { day: 'Thu', count: 0 },
        { day: 'Fri', count: 0 },
        { day: 'Sat', count: 0 },
        { day: 'Sun', count: 0 },
      ];
    }

    // Grouping count by date
    const dateMap: { [key: string]: number } = {};
    // Seed last 5 days
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dateMap[label] = 0;
    }

    generations.forEach((g) => {
      const label = new Date(g.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      if (dateMap[label] !== undefined) {
        dateMap[label]++;
      }
    });

    return Object.keys(dateMap).map((key) => ({
      day: key,
      count: dateMap[key],
    }));
  };

  const statCards = [
    {
      title: 'Total Generations',
      value: totalGenerations,
      desc: 'All tools compiled',
      icon: TrendingUp,
      color: 'text-neon-cyan',
      glow: 'shadow-neon-cyan/5 border-neon-cyan/20',
    },
    {
      title: 'Most Used Tool',
      value: getMostUsedTool(),
      desc: 'Top output category',
      icon: Zap,
      color: 'text-neon-blue',
      glow: 'shadow-neon-blue/5 border-neon-blue/20',
    },
    {
      title: 'Recent Activity',
      value: getLatestGeneration().title,
      desc: `Last active on ${getLatestGeneration().time}`,
      icon: History,
      color: 'text-neon-violet',
      glow: 'shadow-neon-violet/5 border-neon-violet/20',
    },
  ];

  const quickLaunchTools = [
    {
      title: 'Social Caption Generator',
      desc: 'Generate highly engaging copy for LinkedIn, IG, or Twitter.',
      icon: Sparkles,
      color: 'text-neon-cyan',
      path: '/caption',
      border: 'hover:border-neon-cyan/40',
    },
    {
      title: 'Blog Post Builder',
      desc: 'Create SEO-optimized articles with keywords and outline sections.',
      icon: FileText,
      color: 'text-neon-blue',
      path: '/blog',
      border: 'hover:border-neon-blue/40',
    },
    {
      title: 'Study Notes Companion',
      desc: 'Break down complex texts or subjects into simple notes.',
      icon: BookOpen,
      color: 'text-neon-violet',
      path: '/notes',
      border: 'hover:border-neon-violet/40',
    },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className={`glass-card p-6 border ${stat.glow} flex items-center justify-between`}>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-extrabold Outfit text-white">{stat.value}</h3>
              <p className="text-xs text-slate-400">{stat.desc}</p>
            </div>
            <div className={`p-4 bg-dark-800/80 rounded-xl ${stat.color} border border-dark-700/50`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generations Frequency Chart */}
        <div className="glass-card p-6 lg:col-span-2 border border-dark-700/50 flex flex-col justify-between min-h-[350px]">
          <div className="mb-4">
            <h3 className="text-lg font-bold Outfit text-slate-200">Generation Frequency</h3>
            <p className="text-xs text-slate-500">Number of items generated over the last few days</p>
          </div>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getTimeChartData()}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    borderColor: '#1f2937',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tool Distribution Chart */}
        <div className="glass-card p-6 border border-dark-700/50 flex flex-col justify-between min-h-[350px]">
          <div className="mb-4">
            <h3 className="text-lg font-bold Outfit text-slate-200">Tools Used Distribution</h3>
            <p className="text-xs text-slate-500">Distribution volume across different generators</p>
          </div>
          {generations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <Zap className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 font-medium">No distribution logs. Generate output to update charts.</p>
            </div>
          ) : (
            <div className="flex-1 w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getToolTypeData()}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b0f19',
                      borderColor: '#1f2937',
                      borderRadius: '12px',
                      color: '#f8fafc',
                    }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Section: Quick Access & Recent Activities */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Cards */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold Outfit text-slate-200">Quick-Launch Suite</h3>
          <div className="space-y-4">
            {quickLaunchTools.map((tool, i) => (
              <div
                key={i}
                onClick={() => navigate(tool.path)}
                className={`glass-card p-4 border border-dark-700/60 flex items-center justify-between group cursor-pointer ${tool.border} transition-all duration-200`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-dark-800/80 rounded-xl ${tool.color} border border-dark-700/40 group-hover:scale-105 transition-transform duration-200`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{tool.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{tool.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Generations Logs */}
        <div className="glass-card p-6 lg:col-span-2 border border-dark-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-dark-700/30 pb-3">
            <div>
              <h3 className="text-lg font-bold Outfit text-slate-200">Recent Activations</h3>
              <p className="text-xs text-slate-500">Your latest generations</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-neon-cyan hover:underline"
            >
              See All History
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {generations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <History className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-sm font-semibold text-slate-400">Empty Logs Sandbox</p>
                <p className="text-xs text-slate-600 mt-1">Start generating AI content to fill your history.</p>
              </div>
            ) : (
              generations.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className="p-4 bg-dark-900/40 border border-dark-700/40 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2.5 rounded-lg border shrink-0 ${
                        item.toolType === 'caption'
                          ? 'bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan'
                          : item.toolType === 'blog'
                          ? 'bg-neon-blue/5 border-neon-blue/20 text-neon-blue'
                          : 'bg-neon-violet/5 border-neon-violet/20 text-neon-violet'
                      }`}
                    >
                      {item.toolType === 'caption' && <Sparkles className="w-4 h-4" />}
                      {item.toolType === 'blog' && <FileText className="w-4 h-4" />}
                      {item.toolType === 'notes' && <BookOpen className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {item.toolType === 'caption'
                          ? 'Social Media Caption'
                          : item.toolType === 'blog'
                          ? 'Blog Post'
                          : 'Study Notes'}
                      </h4>
                      <p className="text-sm text-slate-200 truncate font-semibold mt-0.5">
                        {item.prompt.topic || item.prompt.title || item.prompt.subject}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(item.output)}
                      title="Copy Output"
                      className="p-2 rounded-lg bg-dark-800/80 border border-dark-700 hover:text-white transition-colors"
                    >
                      <Clipboard className="w-4 h-4 text-slate-400 hover:text-white" />
                    </button>
                    <button
                      onClick={() => navigate('/history')}
                      className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-dark-800/80 border border-dark-700"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
