
import React, { useState } from 'react';
import { Map, MapPin, Search, Loader2, ExternalLink, Compass } from 'lucide-react';
import { findRockLocations } from '../services/geminiService';

const MapExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      // Try to get geolocation
      let lat, lng;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (e) {
        console.warn("Location access denied or unavailable.");
      }

      const response = await findRockLocations(query, lat, lng);
      setResults(response);
    } catch (err) {
      console.error(err);
      alert("Error finding locations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <Compass className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-4xl font-serif">Field Explorer</h1>
          <p className="text-slate-400">Locate geological formations and outcrops using Maps grounding.</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-2xl"
            placeholder="Search for 'Columnar jointing', 'Ophiolite complexes'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Explore"}
          </button>
        </div>

        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 prose prose-invert max-w-none">
              <h3 className="text-blue-400 mb-4 font-serif text-2xl">Geological Insights</h3>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {results.text}
              </div>
            </div>

            {results.candidates?.[0]?.groundingMetadata?.groundingChunks && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Grounding Sources</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.candidates[0].groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                    const place = chunk.maps || chunk.web;
                    if (!place) return null;
                    return (
                      <a
                        key={i}
                        href={place.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-emerald-500" />
                          <span className="font-medium text-slate-200 truncate max-w-[200px]">{place.title || "Geological Site"}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapExplorer;
