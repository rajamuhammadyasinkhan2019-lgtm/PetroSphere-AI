
import React, { useState, useEffect } from 'react';
import { MicroscopeSpecimen, RockType } from '../types';
import { Eye, RotateCw, Layers, Info, Search, Loader2, Maximize2, Zap } from 'lucide-react';
import { analyzeMicroscopeView } from '../services/geminiService';

const specimens: MicroscopeSpecimen[] = [
  {
    id: 'spec-1',
    name: 'Basaltic Porphyry',
    type: RockType.IGNEOUS,
    description: 'Fine-grained igneous rock with large phenocrysts of olivine and plagioclase.',
    pplImageUrl: 'https://images.unsplash.com/photo-1615800002234-44cf097184f4?auto=format&fit=crop&q=80&w=1200',
    xplImageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200',
    minerals: [
      { name: 'Olivine', properties: 'High relief, strong birefringence in XPL, no cleavage.', significance: 'Indicates high-temperature crystallization from mantle-derived melt.' },
      { name: 'Plagioclase', properties: 'Low relief, characteristic polysynthetic twinning in XPL.', significance: 'Essential component of basic to intermediate volcanic rocks.' }
    ]
  },
  {
    id: 'spec-2',
    name: 'Garnet-Mica Schist',
    type: RockType.METAMORPHIC,
    description: 'Medium-grade metamorphic rock with prominent schistosity and porphyroblasts.',
    pplImageUrl: 'https://images.unsplash.com/photo-1621533051214-41315667104b?auto=format&fit=crop&q=80&w=1200',
    xplImageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    minerals: [
      { name: 'Garnet', properties: 'High relief, isotropic (stays dark in XPL).', significance: 'Key index mineral for calculating metamorphic pressure and temperature.' },
      { name: 'Biotite', properties: 'Strong pleochroism in PPL (brown to straw-yellow), birdseye extinction.', significance: 'Forms via dehydration reactions during prograde metamorphism.' }
    ]
  },
  {
    id: 'spec-3',
    name: 'Foraminiferal Limestone',
    type: RockType.SEDIMENTARY,
    description: 'Biogenic sedimentary rock containing remains of marine microorganisms.',
    pplImageUrl: 'https://images.unsplash.com/photo-1582531608355-081446f1ec02?auto=format&fit=crop&q=80&w=1200',
    xplImageUrl: 'https://images.unsplash.com/photo-1590244439192-6ca371060377?auto=format&fit=crop&q=80&w=1200',
    minerals: [
      { name: 'Calcite', properties: 'Extremely high birefringence (pearl-grey to pink/green interference colors).', significance: 'Primary carbonate mineral forming via biological or chemical precipitation.' },
      { name: 'Micrite', properties: 'Microcrystalline calcite, appears dark and muddy in thin section.', significance: 'Represents low-energy depositional environments.' }
    ]
  }
];

const VirtualMicroscope: React.FC = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<MicroscopeSpecimen>(specimens[0]);
  const [viewMode, setViewMode] = useState<'PPL' | 'XPL'>('PPL');
  const [rotation, setRotation] = useState(0);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const currentImage = viewMode === 'PPL' ? selectedSpecimen.pplImageUrl : selectedSpecimen.xplImageUrl;

  const handleAiAnalyze = async () => {
    setIsAiAnalyzing(true);
    setAiAnalysis(null);
    try {
      // For the demo, we use the specimen description and AI context to generate a "real-time" insight
      const result = await analyzeMicroscopeView(currentImage, `Identify the minerals and explain the ${viewMode} properties of this ${selectedSpecimen.name}.`);
      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
      setAiAnalysis("Analysis failed. Please try again.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <Eye className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-4xl font-serif">Virtual Microscope</h1>
            <p className="text-slate-400">High-resolution petrography and mineral identification.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {specimens.map(spec => (
            <button
              key={spec.id}
              onClick={() => {
                setSelectedSpecimen(spec);
                setAiAnalysis(null);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                selectedSpecimen.id === spec.id 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {spec.name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Microscope Viewer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
            {/* The Microscope Image */}
            <div 
              className="w-full h-full transition-all duration-300"
              style={{ 
                transform: `rotate(${rotation}deg) scale(${zoom})`,
                backgroundImage: `url(${currentImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Overlay Controls */}
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
                {viewMode} Mode
              </div>
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-blue-500/30">
                {selectedSpecimen.type}
              </div>
            </div>

            <div className="absolute top-6 right-6 flex gap-2">
              <button 
                onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                className="p-2 bg-black/60 hover:bg-emerald-600 rounded-lg backdrop-blur-md border border-white/10 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoom(1)}
                className="px-3 py-1 bg-black/60 hover:bg-slate-700 rounded-lg backdrop-blur-md border border-white/10 text-[10px] font-bold"
              >
                RESET
              </button>
            </div>

            {/* Circular Vignette for Microscope feel */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] radial-vignette" />
          </div>

          {/* Controls Bar */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setViewMode('PPL')}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'PPL' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  PPL
                </button>
                <button
                  onClick={() => setViewMode('XPL')}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'XPL' ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  XPL
                </button>
              </div>

              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                <RotateCw className="w-4 h-4 text-slate-500" />
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-xs font-mono text-slate-400 w-8">{rotation}°</span>
              </div>
            </div>

            <button
              onClick={handleAiAnalyze}
              disabled={isAiAnalyzing}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isAiAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              AI Identify Minerals
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Info className="w-5 h-5" />
              <h2 className="text-xl font-serif">Specimen Details</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed italic">
              {selectedSpecimen.description}
            </p>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-xl font-serif">Mineral Assemblage</h2>
            </div>
            <div className="space-y-4">
              {selectedSpecimen.minerals.map((min, i) => (
                <div key={i} className="group p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                  <h3 className="font-bold text-slate-200 mb-1 flex items-center justify-between">
                    {min.name}
                    <span className="text-[10px] text-emerald-500/50 uppercase tracking-tighter">Identified</span>
                  </h3>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                    <span className="text-emerald-500 font-medium">Properties:</span> {min.properties}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <span className="text-slate-400 font-medium">Significance:</span> {min.significance}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {aiAnalysis && (
            <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <Search className="w-5 h-5" />
                <h2 className="text-lg font-bold">AI Petro-Insight</h2>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {aiAnalysis}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualMicroscope;
