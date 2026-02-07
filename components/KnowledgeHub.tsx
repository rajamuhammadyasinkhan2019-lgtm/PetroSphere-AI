
import React, { useState } from 'react';
import { BookOpen, Search, Loader2, ArrowUpRight, Globe } from 'lucide-react';
import { searchRockInfo } from '../services/geminiService';

const KnowledgeHub: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await searchRockInfo(query);
      setResults(response);
    } catch (err) {
      console.error(err);
      alert("Search failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const trendingTopics = [
    "Rare Earth Element mineralization in carbonatites",
    "Metamorphic facies of subduction zones",
    "Authigenic minerals in deep-sea sediments",
    "Mantle plume activity and flood basalts"
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 rounded-2xl">
          <BookOpen className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-4xl font-serif">Knowledge Hub</h1>
          <p className="text-slate-400">Deep research portal with Google Search grounding for the latest geological data.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative">
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-3xl py-6 px-8 text-lg text-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all shadow-2xl"
              placeholder="Ask anything about rock formation, mineralogy..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !query}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-amber-600/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Deep"}
            </button>
          </div>

          {results && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="p-8 prose prose-invert max-w-none">
                  <div className="flex items-center gap-2 mb-6 text-amber-400 font-bold uppercase tracking-widest text-xs">
                    <Globe className="w-4 h-4" />
                    Live Grounded Analysis
                  </div>
                  <div className="text-slate-200 leading-relaxed text-lg whitespace-pre-wrap">
                    {results.text}
                  </div>
               </div>

               {results.candidates?.[0]?.groundingMetadata?.groundingChunks && (
                 <div className="bg-slate-950/50 p-6 border-t border-slate-800">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Cited Research & Sources</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {results.candidates[0].groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                       if (!chunk.web) return null;
                       return (
                         <a
                           key={i}
                           href={chunk.web.uri}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all group"
                         >
                           <span className="text-sm text-slate-400 truncate pr-4 group-hover:text-slate-200">{chunk.web.title}</span>
                           <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-amber-500" />
                         </a>
                       );
                     })}
                   </div>
                 </div>
               )}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Trending Research
            </h3>
            <ul className="space-y-4">
              {trendingTopics.map((topic, i) => (
                <li key={i}>
                  <button 
                    onClick={() => {setQuery(topic); handleSearch();}}
                    className="w-full text-left p-4 bg-slate-800/30 hover:bg-amber-500/5 border border-slate-700/50 rounded-2xl text-sm text-slate-400 hover:text-amber-400 transition-all"
                  >
                    {topic}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Mock sparkles icon since lucide might not have been imported in this specific block
const Sparkles = ({className}: {className: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default KnowledgeHub;
