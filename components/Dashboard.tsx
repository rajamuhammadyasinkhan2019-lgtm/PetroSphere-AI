
import React from 'react';
import { RockType } from '../types';
import { Flame, Layers, Mountain, ArrowRight, Database } from 'lucide-react';

const Dashboard: React.FC = () => {
  const rockClasses = [
    {
      title: 'Igneous',
      type: RockType.IGNEOUS,
      description: 'Formed through the cooling and solidification of magma or lava.',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      image: 'https://picsum.photos/seed/igneous/800/600'
    },
    {
      title: 'Metamorphic',
      type: RockType.METAMORPHIC,
      description: 'Arise from the transformation of existing rock types through heat and pressure.',
      icon: Layers,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      image: 'https://picsum.photos/seed/metamorphic/800/600'
    },
    {
      title: 'Sedimentary',
      type: RockType.SEDIMENTARY,
      description: 'Formed by the accumulation or deposition of mineral or organic particles.',
      icon: Mountain,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      image: 'https://picsum.photos/seed/sedimentary/800/600'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-4">
        <h1 className="text-5xl font-serif text-white">The Petrographic Record</h1>
        <p className="text-xl text-slate-400 max-w-2xl">
          Explore the mineralogical and structural evolution of our planet through advanced AI-driven petrological analysis.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rockClasses.map((rock) => (
          <div 
            key={rock.title} 
            className={`group relative overflow-hidden rounded-3xl border ${rock.borderColor} bg-slate-900/50 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-2xl`}
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img 
                src={rock.image} 
                alt={rock.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100 opacity-60 group-hover:opacity-100"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${rock.bg}`}>
                  <rock.icon className={`w-6 h-6 ${rock.color}`} />
                </div>
                <h3 className="text-2xl font-semibold">{rock.title}</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {rock.description}
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors uppercase tracking-widest">
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-10 relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <h2 className="text-3xl font-serif text-emerald-400">Petrological Lab Access</h2>
          <p className="text-slate-400 leading-relaxed text-lg">
            Our virtual lab allows you to generate high-resolution thin sections, edit sample imagery with natural language, and search the global database for up-to-date geological research.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs font-semibold text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              AI Search Grounding Active
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs font-semibold text-slate-300">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Nano Banana Image Engine
            </div>
          </div>
        </div>
        <Database className="absolute -right-20 -bottom-20 w-80 h-80 text-emerald-500/5 rotate-12" />
      </section>
    </div>
  );
};

export default Dashboard;
