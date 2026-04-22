'use client';

import { useState } from 'react';
import PaywallModal from './PaywallModal';
import Watermark from './Watermark';
import { Shield, Lock, Download, Sparkles, Edit3, X, Save, Plus, Trash2 } from 'lucide-react';

interface Template {
  id: string;
  templateNumber: number;
  templateStyle: string;
  templateData?: any;
  pdfUrl?: string;
}

interface TemplateGridProps {
  templates: Template[];
  isPaid: boolean;
  analysisId: string;
  analysisData?: any;
}

export default function TemplateGrid({ templates: initialTemplates, isPaid, analysisId, analysisData }: TemplateGridProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  const handleSelect = (id: string) => {
    setSelectedTemplate(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setEditingData(JSON.parse(JSON.stringify(template.templateData || {})));
    }
  };

  const handleSaveEdit = () => {
    if (!selectedTemplate) return;
    setTemplates(prev => prev.map(t => 
      t.id === selectedTemplate ? { ...t, templateData: editingData } : t
    ));
    setIsEditing(false);
  };

  const updateNestedData = (path: string, value: any) => {
    const newData = { ...editingData };
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setEditingData(newData);
  };

  const renderCVLayout = (template: Template, isPreview: boolean = false) => {
    const data = (template.templateData as any) || {};
    const style = template.templateStyle;
    
    const name = data.userName || analysisData?.userName || "Candidat";
    const title = data.jobTitle || analysisData?.jobTitle || "Optimisé par IA";
    const summaryText = data.summary || "Professionnel expérimenté avec une solide expertise dans son domaine.";
    const experiences = data.experience || [];
    const skills = data.skills || [];
    const education = data.education || [];
    const contact = data.contact || {};
    const projects = data.projects || [];
    const languages = data.languages || [];
    const interests = data.interests || [];

    const ProtectionOverlay = () => (
      !isPaid && (
        <div className="absolute inset-0 z-[60] select-none pointer-events-none">
          <Watermark />
          <div className="absolute inset-0 bg-black/[0.02] backdrop-blur-[0.5px]"></div>
        </div>
      )
    );

    return (
      <div className={`w-[210mm] min-h-[297mm] bg-white shadow-sm overflow-hidden text-left mx-auto relative select-none cv-printable`} onContextMenu={(e) => !isPaid && e.preventDefault()}>
        <ProtectionOverlay />
        
        {/* Style: Galaxy (Centered, Serif, Elegant) */}
        {style === 'Galaxy' && (
          <div className="p-16 font-serif text-[#1a1a1a]">
            <div className="text-center border-b-2 border-gray-100 pb-10 mb-10">
              <h1 className="text-5xl font-bold uppercase tracking-widest mb-4">{name}</h1>
              <p className="text-xl italic text-gray-500">{title}</p>
              <div className="mt-4 flex justify-center gap-6 text-xs font-sans uppercase tracking-widest text-gray-400">
                <span>{contact.location}</span>
                <span>{contact.email}</span>
                <span>{contact.phone}</span>
              </div>
            </div>
            <div className="space-y-10 font-sans">
              <section>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Résumé</h3>
                <p className="text-sm leading-relaxed text-gray-700">{summaryText}</p>
              </section>
              <section>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Expérience</h3>
                <div className="space-y-8">
                  {experiences.map((exp: any, i: number) => (
                    <div key={i} className="relative pl-6 border-l border-gray-100">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-lg font-bold">{exp.title}</h4>
                        <span className="text-xs text-gray-400">{exp.period}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-500 mb-2">{exp.company}</p>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {education.length > 0 && (
                <section>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Formation</h3>
                  <div className="space-y-6">
                    {education.map((edu: any, i: number) => (
                      <div key={i} className="relative pl-6 border-l border-gray-100">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-base font-bold">{edu.degree}</h4>
                          <span className="text-xs text-gray-400">{edu.year}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-500">{edu.school}</p>
                        {edu.details && <p className="text-xs text-gray-400 mt-1">{edu.details}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Projets Réalisés</h3>
                  <div className="space-y-6">
                    {projects.map((proj: any, i: number) => (
                      <div key={i} className="relative pl-6 border-l border-gray-100">
                        <h4 className="text-base font-bold">{proj.name}</h4>
                        <p className="text-xs text-gray-400 mb-2">{proj.technologies?.join(' • ')}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="grid grid-cols-2 gap-10">
                {languages.length > 0 && (
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Langues</h3>
                    <div className="space-y-2">
                      {languages.map((lang: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="font-bold">{lang.language || lang.name || (typeof lang === 'string' ? lang : '')}</span>
                          <span className="text-gray-500 italic">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {interests.length > 0 && (
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Intérêts</h3>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((it: string, i: number) => (
                        <span key={i} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-600"># {it}</span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Style: Eclipse (Modern Sidebar, Bold) */}
        {style === 'Eclipse' && (
          <div className="flex min-h-[297mm] w-[210mm] font-sans text-[#333] mx-auto bg-white shadow-sm">
            <div className="w-[35%] bg-[#1a1a1a] text-white p-10 flex flex-col gap-10 overflow-hidden">
              <div>
                <h1 className="text-[28px] font-black leading-[1.1] uppercase mb-4 break-normal hyphens-none">{name}</h1>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
              </div>
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">Contact</h3>
                <div className="text-[11px] space-y-2 opacity-80">
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                  <p>{contact.location}</p>
                </div>
              </section>
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s: string, i: number) => (
                    <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
              </section>
              {languages.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">Langues</h3>
                   <div className="space-y-2">
                    {languages.map((lang: any, i: number) => (
                      <div key={i} className="text-[10px]">
                        <span className="block font-bold">{(lang.language || lang.name || (typeof lang === 'string' ? lang : ''))}</span>
                        <span className="opacity-60">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {interests.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">Intérêts</h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((it: string, i: number) => (
                      <span key={i} className="text-[9px] opacity-70 underline decoration-gray-500">{it}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="flex-1 p-16 space-y-12 bg-white">
              <section>
                <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6">Profil</h2>
                <p className="text-[13px] leading-relaxed text-gray-600">{summaryText}</p>
              </section>
              <section>
                <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6">Expérience</h2>
                {experiences.map((exp: any, i: number) => (
                    <div key={i} className="mb-6">
                      <div className="flex justify-between font-bold text-[13px]">
                        <span>{exp.title}</span>
                        <span className="text-gray-400">{exp.period}</span>
                      </div>
                      <p className="text-[11px] font-black text-gray-500 uppercase mb-2">{exp.company}</p>
                      <p className="text-[12px] text-gray-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
              </section>
              {projects.length > 0 && (
                <section>
                  <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6">Projets</h2>
                    {projects.map((proj: any, i: number) => (
                    <div key={i} className="mb-6">
                      <p className="text-[13px] font-bold mb-1">{proj.name}</p>
                      <p className="text-[11px] text-gray-500 mb-2 italic">{proj.technologies?.join(', ')}</p>
                      <p className="text-[12px] text-gray-600 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </section>
              )}
              {education.length > 0 && (
                <section>
                  <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6">Formation</h2>
                  {education.map((edu: any, i: number) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between font-bold text-[13px]">
                        <span>{edu.degree}</span>
                        <span className="text-gray-400">{edu.year}</span>
                      </div>
                      <p className="text-[11px] font-black text-gray-500 uppercase">{edu.school}</p>
                      {edu.details && <p className="text-[10px] text-gray-400 mt-1">{edu.details}</p>}
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        )}

        {/* Style: Aether (Classic, Minimalist) */}
        {style === 'Aether' && (
          <div className="p-16 font-sans text-gray-900">
            <div className="flex justify-between items-start border-b-4 border-gray-900 pb-8 mb-10">
              <div>
                <h1 className="text-5xl font-black tracking-tighter">{name}</h1>
                <p className="text-xl font-bold text-gray-500 mt-1">{title}</p>
              </div>
              <div className="text-right text-xs font-bold space-y-1">
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <p>{contact.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-8 space-y-10">
                <section>
                  <h3 className="text-lg font-black border-b border-gray-200 pb-2 mb-4">Expérience</h3>
                  {experiences.map((exp: any, i: number) => (
                    <div key={i} className="mb-6">
                      <p className="font-black text-base">{exp.company} | {exp.title}</p>
                      <p className="text-xs text-gray-400 font-bold mb-2">{exp.period}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </section>
              </div>
              <div className="col-span-4 space-y-8">
                <section>
                  <h3 className="text-sm font-black uppercase border-b border-gray-200 pb-2 mb-4">Résumé</h3>
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{summaryText}"</p>
                </section>
                <section>
                  <h3 className="text-sm font-black uppercase border-b border-gray-200 pb-2 mb-4">Skills</h3>
                  <div className="space-y-2">
                    {skills.map((s: string, i: number) => <p key={i} className="text-xs font-bold">• {s}</p>)}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Style: Hyperion (Tech, Modern, Sidebar) */}
        {style === 'Hyperion' && (
          <div className="flex min-h-[297mm] font-sans">
             <div className="w-[30%] bg-emerald-900 text-white p-10 flex flex-col gap-10">
                <div className="w-32 h-32 rounded-3xl bg-emerald-800 flex items-center justify-center font-bold text-3xl">
                  {name[0]}
                </div>
                <section className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Expertise</h3>
                  <div className="space-y-3">
                    {skills.map((s: string, i: number) => (
                      <div key={i} className="bg-emerald-800/50 p-2 rounded-lg text-[10px] font-bold border border-emerald-700/50">{s}</div>
                    ))}
                  </div>
                </section>
                 {languages.length > 0 && (
                   <section className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Langues</h3>
                     <div className="space-y-2">
                       {languages.map((lang: any, i: number) => (
                         <div key={i} className="text-[10px]">
                           <span className="block font-bold">{(lang.language || lang.name || (typeof lang === 'string' ? lang : ''))}</span>
                           <span className="text-emerald-500 opacity-60">{lang.level}</span>
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
             </div>
             <div className="flex-1 p-16 space-y-12">
                <header>
                  <h1 className="text-5xl font-black text-emerald-950 tracking-tighter">{name}</h1>
                  <p className="text-xl font-bold text-emerald-600 mt-2">{title}</p>
                </header>
                <section>
                  <h2 className="text-lg font-black text-emerald-900 border-b-2 border-emerald-100 pb-2 mb-6 uppercase">Projets & Expériences</h2>
                  <div className="space-y-8">
                    {experiences.map((exp: any, i: number) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-base font-black text-gray-900">{exp.title}</h4>
                          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{exp.period}</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-800 italic mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
                {projects.length > 0 && (
                   <section>
                     <h2 className="text-lg font-black text-emerald-900 border-b-2 border-emerald-100 pb-2 mb-6 uppercase">Projets Réalisés</h2>
                     <div className="space-y-6">
                       {projects.map((proj: any, i: number) => (
                         <div key={i}>
                           <h4 className="text-base font-bold text-gray-900">{proj.name}</h4>
                           <p className="text-xs font-bold text-emerald-600 mb-2">{proj.technologies?.join(' • ')}</p>
                           <p className="text-sm text-gray-600">{proj.description}</p>
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
                 {education.length > 0 && (
                   <section>
                     <h2 className="text-lg font-black text-emerald-900 border-b-2 border-emerald-100 pb-2 mb-6 uppercase">Formation</h2>
                     <div className="space-y-4">
                       {education.map((edu: any, i: number) => (
                         <div key={i} className="flex justify-between items-start">
                           <div>
                             <h4 className="text-sm font-bold text-gray-900">{edu.degree}</h4>
                             <p className="text-xs font-bold text-emerald-700">{edu.school}</p>
                             {edu.details && <p className="text-[11px] text-gray-500 mt-1">{edu.details}</p>}
                           </div>
                           <span className="text-xs text-gray-400 font-bold">{edu.year}</span>
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
             </div>
          </div>
        )}

        {/* Style: Lunar (Large Typography, Airy) */}
        {style === 'Lunar' && (
          <div className="p-10 font-sans bg-slate-50 min-h-[297mm] w-[210mm] text-left mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-light tracking-tighter text-slate-900 mb-2 break-normal">{name}</h1>
              <p className="text-lg font-bold text-slate-400 tracking-widest uppercase">{title}</p>
            </header>
            <div className="grid grid-cols-12 gap-8 pr-4">
              <div className="col-span-4 space-y-12">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Contact</h3>
                  <div className="space-y-1 text-sm font-bold text-slate-600">
                    <p>{contact.email}</p>
                    <p>{contact.phone}</p>
                    <p>{contact.location}</p>
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Compétences</h3>
                  <div className="space-y-2">
                    {skills.map((s: string, i: number) => <p key={i} className="text-sm font-bold text-slate-700"># {s}</p>)}
                  </div>
                </section>
              </div>
              <div className="col-span-8 space-y-16">
                <section>
                  <p className="text-sm leading-relaxed text-gray-600 font-medium italic break-words">
                    "{summaryText}"
                  </p>
                </section>
                <section>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Parcours</h3>
                  <div className="space-y-12">
                    {experiences.map((exp: any, i: number) => (
                      <div key={i}>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{exp.title}</h4>
                        <div className="flex gap-4 text-sm font-bold text-slate-400 mb-4">
                          <span>{exp.company}</span>
                          <span>|</span>
                          <span>{exp.period}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
                 {projects.length > 0 && (
                   <section>
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Projets</h3>
                     <div className="space-y-10">
                       {projects.map((proj: any, i: number) => (
                         <div key={i}>
                           <h4 className="text-xl font-bold text-slate-900 mb-1">{proj.name}</h4>
                           <p className="text-[11px] font-bold text-slate-400 mb-3 uppercase">{proj.technologies?.join(' • ')}</p>
                           <p className="text-sm leading-relaxed text-slate-600">{proj.description}</p>
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
                 {education.length > 0 && (
                   <section>
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Formation</h3>
                     <div className="space-y-8">
                       {education.map((edu: any, i: number) => (
                         <div key={i}>
                           <div className="flex justify-between items-baseline mb-1">
                             <h4 className="text-lg font-bold text-slate-900">{edu.degree}</h4>
                             <span className="text-xs font-bold text-slate-400">{edu.year}</span>
                           </div>
                           <p className="text-sm font-bold text-slate-500 mb-2">{edu.school}</p>
                           {edu.details && <p className="text-xs text-slate-400">{edu.details}</p>}
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
              </div>
            </div>
          </div>
        )}

        {/* Style: Stellar (Creative, Gradient Header) */}
        {style === 'Stellar' && (
          <div className="font-sans min-h-[297mm] w-[210mm] text-left mx-auto bg-white shadow-sm overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-white relative">
              <h1 className="text-5xl font-black mb-2">{name}</h1>
              <p className="text-xl font-medium opacity-90">{title}</p>
              <div className="absolute -bottom-8 right-16 bg-white shadow-xl p-6 rounded-2xl flex gap-8 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> {contact.email}</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span> {contact.phone}</div>
              </div>
            </div>
            <div className="p-16 pt-24 grid grid-cols-12 gap-16">
              <div className="col-span-8">
                <section className="mb-12">
                  <h3 className="text-xl font-black text-indigo-900 mb-6">Expérience Professionnelle</h3>
                  <div className="space-y-10">
                    {experiences.map((exp: any, i: number) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-2 w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{exp.title}</h4>
                          <span className="text-xs font-bold text-indigo-600">{exp.period}</span>
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase mb-3">{exp.company}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              <div className="col-span-4 space-y-10">
                <section className="bg-gray-50 p-8 rounded-3xl">
                  <h3 className="text-sm font-black uppercase text-gray-400 mb-4">Profil</h3>
                  <p className="text-xs leading-relaxed text-gray-600 font-medium">{summaryText}</p>
                </section>
                <section>
                  <h3 className="text-sm font-black uppercase text-indigo-900 mb-6">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s: string, i: number) => (
                      <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-100">{s}</span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Style: Solar (Professional, Clean Dual-Column) */}
        {style === 'Solar' && (
          <div className="p-10 font-sans text-slate-800 text-left w-[210mm] min-h-[297mm] mx-auto bg-white shadow-sm">
            <header className="mb-8 flex justify-between items-end border-b-8 border-amber-400 pb-6">
               <div>
                 <h1 className="text-5xl font-black tracking-tight">{name}</h1>
                 <p className="text-xl font-bold text-amber-600 mt-2">{title}</p>
               </div>
               <div className="text-right text-xs font-black space-y-1 opacity-60 uppercase">
                  <p>{contact.location}</p>
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
               </div>
            </header>
            <div className="grid grid-cols-2 gap-16">
              <section className="space-y-8">
                <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2">Expériences</h3>
                {experiences.map((exp: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <p className="font-black text-slate-900">{exp.title}</p>
                    <p className="text-xs font-bold text-amber-600">{exp.company} | {exp.period}</p>
                    <p className="text-xs leading-relaxed text-slate-500">{exp.description}</p>
                  </div>
                ))}
              </section>
              <div className="space-y-12">
                 <section>
                   <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-4">Profil</h3>
                   <p className="text-sm leading-relaxed font-medium text-slate-600 italic">{summaryText}</p>
                 </section>
                 {projects.length > 0 && (
                   <section>
                     <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-4">Projets</h3>
                     <div className="space-y-6">
                       {projects.map((proj: any, i: number) => (
                         <div key={i}>
                           <p className="font-bold text-slate-900">{proj.name}</p>
                           <p className="text-xs text-amber-600 mb-2">{proj.technologies?.join(', ')}</p>
                           <p className="text-xs text-slate-500">{proj.description}</p>
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
                 {education.length > 0 && (
                   <section>
                     <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-4">Formation</h3>
                     <div className="space-y-4">
                       {education.map((edu: any, i: number) => (
                         <div key={i}>
                           <div className="flex justify-between">
                             <p className="font-bold text-slate-900">{edu.degree}</p>
                             <p className="text-xs text-slate-400">{edu.year}</p>
                           </div>
                           <p className="text-xs font-bold text-amber-600">{edu.school}</p>
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
                 <section>
                   <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-6">Compétences</h3>
                   <div className="grid grid-cols-2 gap-3">
                     {skills.map((s: string, i: number) => (
                       <div key={i} className="flex items-center gap-2 text-xs font-bold">
                         <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div> {s}
                       </div>
                     ))}
                   </div>
                 </section>
                 {languages.length > 0 && (
                   <section>
                     <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-4">Langues</h3>
                     <div className="flex flex-wrap gap-4">
                       {languages.map((lang: any, i: number) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold">{lang.language || lang.name || (typeof lang === 'string' ? lang : '')}</span>
                            <span className="text-slate-400 ml-2">({lang.level})</span>
                          </div>
                        ))}
                     </div>
                   </section>
                 )}
               </div>
            </div>
          </div>
        )}

        {/* Style: Nebula (Design-forward, Dark accents) */}
        {style === 'Nebula' && (
          <div className="p-10 font-sans bg-white min-h-[297mm] w-[210mm] text-left mx-auto shadow-sm">
            <div className="flex gap-12 mb-10">
              <div className="w-1/3">
                <h1 className="text-4xl font-black text-rose-500 leading-tight mb-4">{name}</h1>
                <div className="h-2 w-12 bg-rose-500 mb-6"></div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">{title}</p>
              </div>
              <div className="w-2/3 pt-4">
                <p className="text-sm leading-relaxed text-gray-600 font-medium border-l-2 border-rose-100 pl-8 italic">
                  {summaryText}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-8">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-8">Expériences</h3>
                <div className="space-y-12">
                  {experiences.map((exp: any, i: number) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-baseline mb-3">
                        <h4 className="text-xl font-bold group-hover:text-rose-500 transition-colors">{exp.title}</h4>
                        <span className="text-[10px] font-black text-rose-300 uppercase">{exp.period}</span>
                      </div>
                      <p className="text-xs font-black text-gray-400 uppercase mb-4">{exp.company}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-4 space-y-12">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Contact</h3>
                  <div className="space-y-4 text-xs font-bold text-gray-500">
                    <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {contact.email}</p>
                    <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {contact.phone}</p>
                    <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {contact.location}</p>
                  </div>
                </section>
                 <section>
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Skills</h3>
                   <div className="flex flex-wrap gap-2">
                     {skills.map((s: string, i: number) => (
                       <span key={i} className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-gray-100">{s}</span>
                     ))}
                   </div>
                 </section>
                 {languages.length > 0 && (
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Langues</h3>
                      <div className="space-y-3">
                        {languages.map((lang: any, i: number) => (
                          <div key={i} className="text-[10px] font-bold text-gray-500">
                            <span className="text-rose-500 mr-2">/</span> {lang.language || lang.name || (typeof lang === 'string' ? lang : '')} - {lang.level}
                          </div>
                        ))}
                      </div>
                    </section>
                 )}
                 {education.length > 0 && (
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Formation</h3>
                      <div className="space-y-6">
                        {education.map((edu: any, i: number) => (
                          <div key={i}>
                            <p className="text-[11px] font-black text-gray-800 uppercase">{edu.degree}</p>
                            <p className="text-[10px] font-bold text-rose-400">{edu.school}</p>
                            <p className="text-[9px] text-gray-400">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                 )}
              </div>
            </div>
          </div>
        )}

        {/* Style: Cosmos (Executive, Bold Header) */}
        {style === 'Cosmos' && (
          <div className="font-sans min-h-[297mm] w-[210mm] text-slate-900 text-left mx-auto bg-white shadow-sm">
            <header className="bg-slate-900 text-white p-12 flex justify-between items-center">
              <div>
                <h1 className="text-6xl font-black tracking-tighter mb-2">{name}</h1>
                <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{title}</p>
              </div>
              <div className="text-right text-sm space-y-1 font-medium opacity-80">
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <p>{contact.location}</p>
              </div>
            </header>
            <div className="p-20 space-y-16">
              <section className="flex gap-16">
                <div className="w-1/4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Profil</h3>
                </div>
                <div className="w-3/4">
                  <p className="text-lg leading-relaxed text-slate-600 font-medium border-l-4 border-slate-900 pl-8">
                    {summaryText}
                  </p>
                </div>
              </section>
              <section className="flex gap-16">
                <div className="w-1/4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Parcours</h3>
                </div>
                <div className="w-3/4 space-y-12">
                  {experiences.map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-2xl font-black">{exp.title}</h4>
                        <span className="text-sm font-bold text-slate-400">{exp.period}</span>
                      </div>
                      <p className="text-sm font-black text-slate-500 uppercase mb-4">{exp.company}</p>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
              {projects.length > 0 && (
                <section className="flex gap-16">
                  <div className="w-1/4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Projets</h3>
                  </div>
                  <div className="w-3/4 space-y-10">
                    {projects.map((proj: any, i: number) => (
                      <div key={i}>
                        <h4 className="text-xl font-bold mb-1">{proj.name}</h4>
                        <p className="text-xs font-black text-slate-400 uppercase mb-3">{proj.technologies?.join(' | ')}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section className="flex gap-16">
                <div className="w-1/4 space-y-12">
                   <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Compétences</h3>
                      <div className="space-y-2">
                        {skills.map((s: string, i: number) => <p key={i} className="text-sm font-bold text-slate-700">• {s}</p>)}
                      </div>
                   </section>
                   {languages.length > 0 && (
                      <section>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Langues</h3>
                        <div className="space-y-2">
                          {languages.map((lang: any, i: number) => (
                            <p key={i} className="text-sm font-bold text-slate-700">{lang.language || lang.name || (typeof lang === 'string' ? lang : '')} ({lang.level})</p>
                          ))}
                        </div>
                      </section>
                   )}
                </div>
                <div className="w-3/4">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Formation</h3>
                   <div className="space-y-10">
                      {education.map((edu: any, i: number) => (
                        <div key={i}>
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="text-xl font-bold">{edu.degree}</h4>
                            <span className="text-sm font-bold text-slate-400">{edu.year}</span>
                          </div>
                          <p className="text-sm font-black text-slate-500 uppercase">{edu.school}</p>
                          {edu.details && <p className="text-xs text-slate-400 mt-2">{edu.details}</p>}
                        </div>
                      ))}
                   </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Fallback for other styles (simplified) */}
        {!['Galaxy', 'Eclipse', 'Aether', 'Hyperion', 'Lunar', 'Stellar', 'Solar', 'Nebula', 'Cosmos', 'Astra', 'Horizon'].includes(style) && (
          <div className="p-20 text-center space-y-10 font-sans">
             <div className="space-y-4">
                <h1 className="text-6xl font-black tracking-tighter">{name}</h1>
                <p className="text-2xl font-bold text-primary">{title}</p>
                <div className="flex justify-center gap-4 text-gray-400 font-bold text-sm">
                  <span>{contact.email}</span>
                  <span>•</span>
                  <span>{contact.phone}</span>
                </div>
             </div>
             <div className="h-1 w-20 bg-primary mx-auto"></div>
             <p className="text-lg text-gray-600 italic max-w-2xl mx-auto">{summaryText}</p>
             <div className="text-left space-y-10 pt-10">
                {experiences.slice(0, 2).map((exp: any, i: number) => (
                  <div key={i} className="border-l-4 border-primary pl-8">
                    <h4 className="text-xl font-black">{exp.title}</h4>
                    <p className="font-bold text-primary">{exp.company}</p>
                    <p className="text-gray-600 mt-2">{exp.description}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Style: Astra (Traditional, Centered) */}
        {style === 'Astra' && (
          <div className="p-12 font-serif bg-white text-[#1a1a1a] min-h-[297mm] w-[210mm] text-left mx-auto shadow-sm">
            <header className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-2 tracking-tight">{name}</h1>
              <p className="text-lg text-gray-600 italic mb-4">{title}</p>
              <div className="flex justify-center gap-6 text-xs text-gray-500 border-y border-gray-100 py-3">
                <span>{contact.location}</span>
                <span>•</span>
                <span>{contact.phone}</span>
                <span>•</span>
                <span>{contact.email}</span>
              </div>
            </header>

            <div className="space-y-10">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4">Profil Personnel</h3>
                <p className="text-sm leading-relaxed text-gray-700">{summaryText}</p>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-6">Expérience Professionnelle</h3>
                <div className="space-y-8">
                  {experiences.map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between font-bold text-sm mb-1">
                        <span>{exp.title}</span>
                        <span>{exp.period}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-600 mb-3">{exp.company}</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {projects.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-6">Projets Réalisés</h3>
                  <div className="space-y-6">
                    {projects.map((proj: any, i: number) => (
                      <div key={i}>
                        <p className="text-sm font-bold mb-1">{proj.name}</p>
                        <p className="text-xs text-gray-500 italic mb-2">{proj.technologies?.join(', ')}</p>
                        <p className="text-sm text-gray-700">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="grid grid-cols-2 gap-16">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4">Formation</h3>
                  {education.map((edu: any, i: number) => (
                    <div key={i} className="mb-4">
                      <p className="text-sm font-bold">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.school}, {edu.year}</p>
                    </div>
                  ))}
                </section>
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4">Compétences & Langues</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {skills.slice(0, 8).map((s: string, i: number) => (
                      <span key={i} className="text-sm text-gray-700">• {s}</span>
                    ))}
                  </div>
                  {languages.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4">
                       {languages.map((l: any, i: number) => (
                         <span key={i} className="text-xs italic text-gray-600">{l.language || l.name || (typeof l === 'string' ? l : '')}: {l.level}</span>
                       ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Style: Horizon (Modern, Left-Label) */}
        {style === 'Horizon' && (
          <div className="font-sans bg-white min-h-[297mm] w-[210mm] text-left mx-auto shadow-sm">
            <div className="bg-[#fce7e7] p-4 text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
              {contact.location} • {contact.phone} • {contact.email}
            </div>
            <header className="py-12 text-center border-b border-gray-200">
              <h1 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-2 uppercase">{name}</h1>
              <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">{title}</p>
            </header>

            <div className="p-16 space-y-12">
               <section className="grid grid-cols-12 gap-8">
                  <div className="col-span-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-300 border-t-2 border-rose-100 pt-2">Summary</h3>
                  </div>
                  <div className="col-span-9">
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{summaryText}</p>
                  </div>
               </section>

               <section className="grid grid-cols-12 gap-8">
                  <div className="col-span-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-300 border-t-2 border-rose-100 pt-2">Skills</h3>
                  </div>
                  <div className="col-span-9 grid grid-cols-2 gap-4">
                    {skills.slice(0, 10).map((s: string, i: number) => (
                      <div key={i} className="text-[11px] font-bold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-1 bg-rose-200 rounded-full"></span> {s}
                      </div>
                    ))}
                  </div>
               </section>

               <section className="grid grid-cols-12 gap-8">
                  <div className="col-span-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-300 border-t-2 border-rose-100 pt-2">Experience</h3>
                  </div>
                  <div className="col-span-9 space-y-10">
                    {experiences.map((exp: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{exp.title} | {exp.company}</h4>
                          <span className="text-[10px] font-bold text-gray-400">{exp.period}</span>
                        </div>
                        <p className="text-[12px] text-gray-500 leading-relaxed whitespace-pre-line border-l border-gray-100 pl-6">{exp.description}</p>
                      </div>
                    ))}
                  </div>
               </section>

               {education.length > 0 && (
                 <section className="grid grid-cols-12 gap-8">
                    <div className="col-span-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-300 border-t-2 border-rose-100 pt-2">Formation</h3>
                    </div>
                    <div className="col-span-9">
                      {education.map((edu: any, i: number) => (
                        <div key={i} className="mb-4">
                          <p className="text-sm font-black text-gray-900 uppercase">{edu.school}</p>
                          <p className="text-xs font-bold text-gray-400">{edu.degree}, {edu.year}</p>
                        </div>
                      ))}
                    </div>
                 </section>
               )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="relative">
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transition-all duration-700 ${selectedTemplate ? 'opacity-30 scale-95 blur-sm' : ''}`}>
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => handleSelect(template.id)}
            className="group relative bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-[650px] shadow-sm"
          >
            <div className="flex-1 bg-gray-50/50 overflow-hidden relative">
              <div className="absolute inset-0 flex justify-center items-start pt-10">
                <div className="scale-[0.4] origin-top transform-gpu shadow-2xl transition-transform duration-500 group-hover:scale-[0.41]">
                  {renderCVLayout(template, false)}
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center backdrop-blur-0 group-hover:backdrop-blur-[2px] z-20">
              <span className="bg-white text-black px-8 py-4 rounded-full font-black opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all shadow-2xl flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary fill-primary/20" />
                Aperçu Professionnel
              </span>
            </div>

            <div className="p-8 bg-white border-t border-gray-100 flex justify-between items-center relative z-10">
              <div>
                <span className="font-black text-xl text-gray-900 tracking-tight">{template.templateStyle}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">IA Optimisé</span>
                  <Shield size={10} className="text-green-500" />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded">SCORE 98%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full screen Protected Preview */}
      {selectedTemplate && selectedTemplateData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/60">
          <div className="bg-white w-full max-w-5xl h-full md:h-[95%] shadow-2xl rounded-[3rem] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500">
             <div className="bg-[#1A1A1A] p-6 text-white flex justify-between items-center border-b border-white/10 shrink-0 no-print">
                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => setSelectedTemplate(null)}
                    className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                   >
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                   </button>
                   <div>
                      <span className="font-black block text-lg tracking-tight">Aperçu du Modèle {selectedTemplateData.templateStyle}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                          <Sparkles size={12} /> Contenu Optimisé par IA
                        </span>
                        {!isPaid && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">MODE PRÉVISUALISATION</span>}
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all"
                  >
                    <Edit3 size={18} />
                    {isEditing ? 'Masquer Éditeur' : 'Modifier'}
                  </button>

                  {!isPaid ? (
                    <button 
                      onClick={() => setShowPaywall(true)}
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-primary/20"
                    >
                      <Lock size={18} />
                      Débloquer & Télécharger
                    </button>
                  ) : (
                    <button 
                       onClick={() => {
                         if (selectedTemplateData) {
                           window.open(`print/${selectedTemplateData.id}`, '_blank');
                         }
                       }}
                       className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-green-500/20"
                     >
                       <Download size={18} />
                       Télécharger PDF
                     </button>
                  )}
                </div>
             </div>
             
             <div className="flex-1 flex overflow-hidden bg-gray-200/50 relative">
                {/* Real-time Preview Area */}
                <div className={`flex-1 overflow-auto p-4 md:p-8 flex justify-center transition-all duration-500 cv-printable-container`}>
                   <div className={`relative shadow-[0_30px_100px_rgba(0,0,0,0.15)] bg-white origin-top transition-all duration-500 ${isEditing ? 'scale-[0.65] lg:scale-[0.75] xl:scale-[0.85]' : 'scale-[0.7] md:scale-[0.85] lg:scale-100'}`}>
                      {renderCVLayout({ ...selectedTemplateData, templateData: editingData } as any, true)}
                   </div>
                </div>

                {/* Modern Edit Sidebar */}
                {isEditing && (
                  <div className="w-[380px] shrink-0 bg-white border-l border-gray-200 overflow-auto p-6 shadow-2xl animate-in slide-in-from-right duration-500 no-print">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black tracking-tight text-black">Modifier le CV</h3>
                      <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full text-black">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Contact */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact</label>
                        <div className="grid grid-cols-1 gap-3">
                          <input 
                            value={editingData.contact?.email || ''} 
                            onChange={(e) => updateNestedData('contact.email', e.target.value)}
                            placeholder="Email"
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-black"
                          />
                          <input 
                            value={editingData.contact?.phone || ''} 
                            onChange={(e) => updateNestedData('contact.phone', e.target.value)}
                            placeholder="Téléphone"
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-black"
                          />
                          <input 
                            value={editingData.contact?.location || ''} 
                            onChange={(e) => updateNestedData('contact.location', e.target.value)}
                            placeholder="Localisation"
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-black"
                          />
                        </div>
                      </div>

                      {/* Name & Title */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Informations Générales</label>
                        <input 
                          value={editingData.userName || ''} 
                          onChange={(e) => updateNestedData('userName', e.target.value)}
                          placeholder="Nom complet"
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-black"
                        />
                        <input 
                          value={editingData.jobTitle || ''} 
                          onChange={(e) => updateNestedData('jobTitle', e.target.value)}
                          placeholder="Poste visé"
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-black"
                        />
                      </div>

                      {/* Summary */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Profil / Résumé</label>
                        <textarea 
                          value={editingData.summary || ''} 
                          onChange={(e) => updateNestedData('summary', e.target.value)}
                          rows={4}
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm leading-relaxed focus:ring-2 focus:ring-primary/20 outline-none resize-none text-black"
                        />
                      </div>

                      {/* Experience */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Expériences</label>
                          <button 
                            onClick={() => {
                              const newExp = [...(editingData.experience || []), { title: 'Nouveau Poste', company: 'Entreprise', period: 'Dates', description: '' }];
                              updateNestedData('experience', newExp);
                            }}
                            className="p-1.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-auto pr-2 scrollbar-hide">
                          {(editingData.experience || []).map((exp: any, idx: number) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative group/item border border-transparent hover:border-primary/20 transition-all">
                              <button 
                                onClick={() => {
                                  const newExp = editingData.experience.filter((_: any, i: number) => i !== idx);
                                  updateNestedData('experience', newExp);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/item:opacity-100"
                              >
                                <Trash2 size={12} />
                              </button>
                              <input 
                                value={exp.title} 
                                onChange={(e) => {
                                  const newExp = [...editingData.experience];
                                  newExp[idx].title = e.target.value;
                                  updateNestedData('experience', newExp);
                                }}
                                className="w-full bg-transparent text-xs font-black outline-none text-black"
                                placeholder="Titre"
                              />
                              <input 
                                value={exp.company} 
                                onChange={(e) => {
                                  const newExp = [...editingData.experience];
                                  newExp[idx].company = e.target.value;
                                  updateNestedData('experience', newExp);
                                }}
                                className="w-full bg-transparent text-[10px] font-bold text-gray-500 outline-none"
                                placeholder="Entreprise"
                              />
                              <textarea 
                                value={exp.description} 
                                onChange={(e) => {
                                  const newExp = [...editingData.experience];
                                  newExp[idx].description = e.target.value;
                                  updateNestedData('experience', newExp);
                                }}
                                className="w-full bg-transparent text-[10px] outline-none text-gray-600 resize-none"
                                rows={2}
                                placeholder="Description"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Formation / Diplômes</label>
                          <button 
                            onClick={() => {
                              const newEdu = [...(editingData.education || []), { degree: 'Diplôme', school: 'École', year: 'Année', details: '' }];
                              updateNestedData('education', newEdu);
                            }}
                            className="p-1.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="space-y-4">
                          {(editingData.education || []).map((edu: any, idx: number) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative group/item">
                              <button 
                                onClick={() => {
                                  const newEdu = editingData.education.filter((_: any, i: number) => i !== idx);
                                  updateNestedData('education', newEdu);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-all"
                              >
                                <Trash2 size={12} />
                              </button>
                              <input 
                                value={edu.degree} 
                                onChange={(e) => {
                                  const newEdu = [...editingData.education];
                                  newEdu[idx].degree = e.target.value;
                                  updateNestedData('education', newEdu);
                                }}
                                className="w-full bg-transparent text-xs font-black outline-none text-black"
                                placeholder="Diplôme"
                              />
                              <input 
                                value={edu.school} 
                                onChange={(e) => {
                                  const newEdu = [...editingData.education];
                                  newEdu[idx].school = e.target.value;
                                  updateNestedData('education', newEdu);
                                }}
                                className="w-full bg-transparent text-[10px] font-bold text-gray-500 outline-none"
                                placeholder="École"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Compétences</label>
                          <button 
                            onClick={() => {
                              const newSkills = [...(editingData.skills || []), 'Nouvelle compétence'];
                              updateNestedData('skills', newSkills);
                            }}
                            className="p-1.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(editingData.skills || []).map((skill: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-xl group/skill">
                              <input 
                                value={skill} 
                                onChange={(e) => {
                                  const newSkills = [...editingData.skills];
                                  newSkills[idx] = e.target.value;
                                  updateNestedData('skills', newSkills);
                                }}
                                className="bg-transparent text-[11px] font-bold outline-none w-24 text-black"
                              />
                              <button 
                                onClick={() => {
                                  const newSkills = editingData.skills.filter((_: any, i: number) => i !== idx);
                                  updateNestedData('skills', newSkills);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Langues</label>
                          <button 
                            onClick={() => {
                              const newLang = [...(editingData.languages || []), { language: 'Langue', level: 'Niveau' }];
                              updateNestedData('languages', newLang);
                            }}
                            className="p-1.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {(editingData.languages || []).map((lang: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl group/lang">
                              <input 
                                value={lang.language || lang.name || (typeof lang === 'string' ? lang : '')} 
                                onChange={(e) => {
                                  const newLang = [...editingData.languages];
                                  if (typeof newLang[idx] === 'string') {
                                    newLang[idx] = { language: e.target.value, level: 'Niveau' };
                                  } else {
                                    newLang[idx].language = e.target.value;
                                  }
                                  updateNestedData('languages', newLang);
                                }}
                                className="flex-1 bg-transparent text-xs font-black outline-none text-black"
                                placeholder="Langue"
                              />
                              <input 
                                value={lang.level || ''} 
                                onChange={(e) => {
                                  const newLang = [...editingData.languages];
                                  newLang[idx].level = e.target.value;
                                  updateNestedData('languages', newLang);
                                }}
                                className="w-20 bg-transparent text-[10px] font-bold text-gray-500 outline-none text-right"
                                placeholder="Niveau"
                              />
                              <button 
                                onClick={() => {
                                  const newLang = editingData.languages.filter((_: any, i: number) => i !== idx);
                                  updateNestedData('languages', newLang);
                                }}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Save Action */}
                      <button 
                        onClick={handleSaveEdit}
                        className="w-full bg-black text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors shadow-xl"
                      >
                        <Save size={18} />
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                )}
                
                {!isPaid && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[70] bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4 no-print">
                    <Shield className="text-primary animate-pulse" />
                    <div className="text-sm font-bold">
                      <p>Capture d'écran désactivée pour protéger votre contenu premium.</p>
                      <p className="text-gray-400 text-xs font-medium">Abonnez-vous pour obtenir la version haute définition sans filigrane.</p>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)}
        analysisId={analysisId}
      />
    </div>
  );
}
