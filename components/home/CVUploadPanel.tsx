'use client';

import { FileUp, FileText } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface CVUploadPanelProps {
  cvFile: File | null;
  setCvFile: (file: File | null) => void;
  cvUrl: string;
  setCvUrl: (url: string) => void;
}

export default function CVUploadPanel({ cvFile, setCvFile, cvUrl, setCvUrl }: CVUploadPanelProps) {
  
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e0d4] flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg">
            <FileText size={20} />
          </div>
          <h2 className="text-lg font-bold text-primary">CV du Candidat</h2>
        </div>
        <div className="flex gap-2">
          <span className="bg-[#EFECE3] text-[10px] font-bold px-2 py-1 rounded text-muted-foreground">PDF</span>
          <span className="bg-[#EFECE3] text-[10px] font-bold px-2 py-1 rounded text-muted-foreground">DOCX</span>
        </div>
      </div>

      <div 
        {...getRootProps()} 
        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-[#d4cfc1] bg-[#FDFBF7]'
        } cursor-pointer`}
      >
        <input {...getInputProps()} />
        <div className="bg-[#e8f3ec] text-primary p-4 rounded-full mb-4">
          <FileUp size={32} />
        </div>
        
        {cvFile ? (
          <div className="text-center space-y-2">
            <p className="font-bold text-primary">{cvFile.name}</p>
            <p className="text-xs text-muted-foreground">Fichier sélectionné. Cliquez ou glissez pour remplacer.</p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <h3 className="font-bold text-foreground text-lg">Déposez le CV ici</h3>
            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
              Ou cliquez pour parcourir depuis votre ordinateur. Taille max 5MB.
            </p>
          </div>
        )}

        <button className="mt-6 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm">
          Parcourir les fichiers
        </button>
      </div>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-[#e5e0d4]"></div>
        <span className="flex-shrink-0 mx-4 text-xs font-semibold text-muted-foreground">ou</span>
        <div className="flex-grow border-t border-[#e5e0d4]"></div>
      </div>

      <button className="w-full bg-[#EFECE3] text-foreground font-semibold py-3 rounded-lg text-sm hover:bg-[#e4e0d4] transition-colors">
        Coller le texte brut
      </button>
    </div>
  );
}
