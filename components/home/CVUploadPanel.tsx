'use client';

import { FileUp, FileText, UserPlus, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface CVUploadPanelProps {
  cvFile: File | null;
  setCvFile: (file: File | null) => void;
  cvUrl: string;
  setCvUrl: (url: string) => void;
  profileDescription?: string;
  setProfileDescription?: (desc: string) => void;
}

export default function CVUploadPanel({ 
  cvFile, 
  setCvFile, 
  cvUrl, 
  setCvUrl,
  profileDescription = '',
  setProfileDescription 
}: CVUploadPanelProps) {
  const [mode, setMode] = useState<'upload' | 'profile'>('upload');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCvFile(acceptedFiles[0]);
    }
  }, [setCvFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl flex flex-col h-full animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-2xl">
            {mode === 'upload' ? <FileText size={24} /> : <UserPlus size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {mode === 'upload' ? 'Votre CV' : 'Votre Profil'}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {mode === 'upload' ? 'Importation' : 'Saisie Manuelle'}
            </p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setMode('upload')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${mode === 'upload' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Fichier
          </button>
          <button 
            onClick={() => setMode('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${mode === 'profile' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Texte
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div 
          {...getRootProps()} 
          className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-10 transition-all ${
            isDragActive ? 'border-primary bg-primary/5 scale-[0.98]' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
          } cursor-pointer group`}
        >
          <input {...getInputProps()} />
          <div className="bg-white text-primary p-6 rounded-full mb-6 shadow-xl group-hover:scale-110 transition-transform">
            <FileUp size={40} />
          </div>
          
          {cvFile ? (
            <div className="text-center space-y-3">
              <p className="font-black text-primary text-lg">{cvFile.name}</p>
              <p className="text-sm font-bold text-slate-400">Fichier prêt pour l'analyse.</p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Glissez votre CV ici</h3>
              <p className="text-sm font-medium text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                Ou cliquez pour parcourir vos dossiers. PDF ou DOCX acceptés.
              </p>
            </div>
          )}

          <button className="mt-8 bg-primary text-white font-black px-8 py-3.5 rounded-2xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Sélectionner un fichier
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="relative flex-1">
            <textarea 
              value={profileDescription}
              onChange={(e) => setProfileDescription?.(e.target.value)}
              placeholder="Décrivez votre parcours, vos expériences et vos compétences ici... L'IA s'occupera de générer un CV parfaitement adapté."
              className="w-full h-full min-h-[300px] p-6 bg-slate-50 border-none rounded-[2rem] text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none resize-none leading-relaxed text-slate-700"
            />
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
              <Sparkles size={14} className="text-accent" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimisé par IA</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 text-center px-4 italic">
            L'IA utilisera ces détails pour créer un CV compatible avec l'offre d'emploi.
          </p>
        </div>
      )}
    </div>
  );
}


