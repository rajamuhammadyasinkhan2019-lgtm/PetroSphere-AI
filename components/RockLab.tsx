
import React, { useState, useRef } from 'react';
import { Microscope, Image as ImageIcon, Wand2, Download, Loader2, Sparkles, Filter } from 'lucide-react';
import { generatePetrologyImage, editRockImage } from '../services/geminiService';

const RockLab: React.FC = () => {
  const [genPrompt, setGenPrompt] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!genPrompt) return;
    setIsGenerating(true);
    try {
      const url = await generatePetrologyImage(genPrompt, imageSize);
      setGeneratedImage(url);
    } catch (err) {
      console.error(err);
      alert("Error generating image. Ensure you've selected an API key if prompted.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedFile || !editPrompt) return;
    setIsEditing(true);
    try {
      const url = await editRockImage(selectedFile, editPrompt);
      setEditedImage(url);
    } catch (err) {
      console.error(err);
      alert("Error editing image.");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <Microscope className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-4xl font-serif">Virtual Petro Lab</h1>
          <p className="text-slate-400">Synthesize and analyze specimen samples using Pro Image intelligence.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Generation Section */}
        <section className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-300">Specimen Synthesis</h2>
          </div>
          
          <div className="space-y-4">
            <textarea
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none resize-none"
              placeholder="e.g., A high resolution microscopic thin section of gabbro showing plagioclase laths and pyroxene crystals..."
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${imageSize === size ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !genPrompt}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                Synthesize
              </button>
            </div>
          </div>

          <div className="aspect-square bg-slate-950 rounded-2xl border border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
                <p className="text-slate-400 text-sm animate-pulse">Computing mineral lattices...</p>
              </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="Generated Rock" className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-600 flex flex-col items-center gap-2">
                <ImageIcon className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium opacity-40">Generated sample will appear here</p>
              </div>
            )}
          </div>
        </section>

        {/* Editing Section */}
        <section className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-300">Intelligent Analysis</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border border-slate-700 bg-slate-950 hover:bg-slate-900 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                {selectedFile ? selectedFile.name : "Upload Rock Image"}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g., Highlight the feldspar crystals in blue"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
            />

            <button
              onClick={handleEdit}
              disabled={isEditing || !selectedFile || !editPrompt}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              {isEditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Apply Transformation
            </button>
          </div>

          <div className="aspect-square bg-slate-950 rounded-2xl border border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
            {isEditing ? (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            ) : editedImage ? (
              <img src={editedImage} alt="Edited Rock" className="w-full h-full object-cover" />
            ) : selectedFile ? (
               <img src={URL.createObjectURL(selectedFile)} alt="Original" className="w-full h-full object-contain opacity-50" />
            ) : (
              <div className="text-slate-600 flex flex-col items-center gap-2">
                <ImageIcon className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium opacity-40">Edited analysis will appear here</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RockLab;
