'use client';

import { Briefcase, Info } from 'lucide-react';

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
    <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl flex flex-col h-full animate-in fade-in duration-700 delay-150">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-2xl">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Le Poste</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cible d'Analyse</p>
          </div>
        </div>
        <div className="bg-blue-50 text-primary px-3 py-1 rounded-full flex items-center gap-2">
          <Info size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Aide IA</span>
        </div>
      </div>

      <div className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Intitulé du poste</label>
          <input 
            type="text"
            placeholder="ex. Lead Product Designer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none text-slate-700 placeholder:text-slate-300 transition-all"
          />
        </div>

        <div className="space-y-3 flex-1 flex flex-col">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Missions & Critères</label>
          <textarea 
            placeholder="Décrivez les responsabilités et les compétences attendues... L'IA extraira les mots-clés essentiels."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full flex-1 min-h-[250px] bg-slate-50 border-none rounded-[2rem] px-6 py-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none resize-none leading-relaxed text-slate-700 placeholder:text-slate-300 transition-all"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 text-center px-4 uppercase tracking-tighter">
          Plus la description est précise, meilleur sera votre score ATS.
        </p>
      </div>
    </div>
  );
}
