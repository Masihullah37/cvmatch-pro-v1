'use client';

import { Briefcase } from 'lucide-react';

interface JobInputPanelProps {
  jobTitle: string;
  setJobTitle: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
}

export default function JobInputPanel({ 
  jobTitle, 
  setJobTitle, 
  jobDescription, 
  setJobDescription 
}: JobInputPanelProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e0d4] flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#e8f3ec] text-primary p-2 rounded-lg">
            <Briefcase size={20} />
          </div>
          <h2 className="text-lg font-bold text-foreground">Poste Ciblé</h2>
        </div>
        <button className="text-xs font-semibold text-primary hover:underline">
          Charger un modèle
        </button>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Intitulé du poste</label>
          <input 
            type="text"
            placeholder="ex. Développeur Frontend Senior"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-[#EFECE3] border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground font-medium"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <label className="text-sm font-semibold text-foreground">Description et Pré-requis</label>
          <textarea 
            placeholder="Collez la description complète du poste ici..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full flex-1 min-h-[200px] bg-[#EFECE3] border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground resize-none font-medium"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#e5e0d4]">
        <button className="text-xs font-semibold text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors">
          <span className="flex items-center justify-center w-4 h-4 rounded-full border border-current">+</span>
          Ajouter des critères de sélection personnalisés
        </button>
      </div>
    </div>
  );
}
