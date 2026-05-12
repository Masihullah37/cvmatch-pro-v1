// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import { useSearchParams, useRouter } from 'next/navigation';
// // import { useUser } from '@clerk/nextjs';
// // import PaywallModal from './PaywallModal';
// // import {
// //   Lock, Loader2, Download, Sparkles, Edit3, X, Save,
// //   Plus, Trash2, AlertCircle, CheckCircle2, Camera,
// // } from 'lucide-react';
// // import CVRenderer from './CVRenderer';

// // interface Template {
// //   id: string;
// //   templateNumber: number;
// //   templateStyle: string;
// //   templateData?: any;
// //   pdfUrl?: string;
// // }

// // interface TemplateGridProps {
// //   templates: Template[];
// //   isPaid: boolean;
// //   analysisId: string;
// //   analysisData?: any;
// // }

// // // ── Shared input styles ────────────────────────────────────────────────────────
// // const inputCls = 'w-full p-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors bg-white';
// // const textareaCls = 'w-full p-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors resize-none bg-white';
// // const labelCls = 'text-[10px] font-black uppercase text-slate-400 mb-1 block';

// // // Default French section header labels
// // const DEFAULT_HEADERS: Record<string, string> = {
// //   summary: 'Profil',
// //   experience: 'Expérience',
// //   education: 'Formation',
// //   projects: 'Projets',
// //   skills: 'Compétences',
// //   languages: 'Langues',
// //   interests: 'Intérêts',
// //   contact: 'Contact',
// //   certifications: 'Certifications',
// // };

// // // ── Editable section header component ─────────────────────────────────────────
// // function SectionHeader({
// //   sectionKey,
// //   editingData,
// //   updateNestedData,
// //   onAdd,
// //   addLabel = '+ Ajouter',
// // }: {
// //   sectionKey: string;
// //   editingData: any;
// //   updateNestedData: (path: string, value: any) => void;
// //   onAdd?: () => void;
// //   addLabel?: string;
// // }) {
// //   const value = editingData?.headers?.[sectionKey] || DEFAULT_HEADERS[sectionKey] || sectionKey;
// //   return (
// //     <div className="flex items-center gap-2 mb-3">
// //       <input
// //         title="Cliquez pour modifier le titre de cette section"
// //         className="flex-1 text-[11px] font-black uppercase tracking-widest text-primary bg-primary/5
// //           border border-primary/20 rounded-lg px-3 py-1.5 outline-none focus:border-primary transition-colors"
// //         value={value}
// //         onChange={(e) => updateNestedData(`headers.${sectionKey}`, e.target.value)}
// //       />
// //       {onAdd && (
// //         <button
// //           onClick={onAdd}
// //           className="text-xs font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap shrink-0"
// //         >
// //           <Plus size={13} /> {addLabel}
// //         </button>
// //       )}
// //     </div>
// //   );
// // }

// // // ── Optional contact field (LinkedIn / GitHub / Portfolio) ────────────────────
// // function OptionalContactField({
// //   label,
// //   fieldKey,
// //   placeholder,
// //   editingData,
// //   updateNestedData,
// //   onDelete,
// // }: {
// //   label: string;
// //   fieldKey: string;
// //   placeholder: string;
// //   editingData: any;
// //   updateNestedData: (path: string, value: any) => void;
// //   onDelete: () => void;
// // }) {
// //   return (
// //     <div>
// //       <div className="flex justify-between items-center mb-1">
// //         <label className={labelCls}>{label}</label>
// //         <button onClick={onDelete} className="text-[10px] text-slate-300 hover:text-red-500 transition-colors flex items-center gap-1">
// //           <Trash2 size={11} /> Supprimer
// //         </button>
// //       </div>
// //       <input
// //         className={inputCls}
// //         placeholder={placeholder}
// //         value={editingData?.contact?.[fieldKey] || ''}
// //         onChange={(e) => updateNestedData(`contact.${fieldKey}`, e.target.value)}
// //       />
// //     </div>
// //   );
// // }

// // export default function TemplateGrid({
// //   templates: initialTemplates,
// //   isPaid,
// //   analysisId,
// //   analysisData,
// // }: TemplateGridProps) {
// //   const { isLoaded } = useUser();
// //   const searchParams = useSearchParams();
// //   const router = useRouter();

// //   useEffect(() => {
// //     console.log("[TemplateGrid] Component Hydrated and Ready.");
// //   }, []);

// //   const [templates, setTemplates] = useState(initialTemplates);

// //   // Sync state if initialTemplates changes from server
// //   useEffect(() => {
// //     setTemplates(initialTemplates);
// //   }, [initialTemplates]);

// //   const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
// //   const [showPaywall, setShowPaywall] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editingData, setEditingData] = useState<any>(null);
// //   const [isGenerating, setIsGenerating] = useState<string | null>(null);
// //   const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

// //   // Ref always points to latest editingData so handleDownload reads current edits
// //   const editingDataRef = useRef<any>(null);
// //   useEffect(() => { editingDataRef.current = editingData; }, [editingData]);

// //   const hasPaid = isPaid || searchParams.get('payment') === 'success';

// //   const [hasRefreshed, setHasRefreshed] = useState(false);

// //   // Force refresh credits from DB when payment is successful (ONE TIME)
// //   useEffect(() => {
// //     if (searchParams.get('payment') === 'success' && !hasRefreshed) {
// //       console.log("[TemplateGrid] Payment success detected, refreshing data...");
// //       setHasRefreshed(true);
// //       router.refresh();
// //     }
// //   }, [searchParams, router, hasRefreshed]);

// //   const handleSelect = (id: string) => {
// //     console.log("[TemplateGrid] Selecting template:", id);
// //     const template = templates.find(t => String(t.id) === String(id));
// //     if (!template) {
// //       console.warn("[TemplateGrid] Template not found in state:", id, "Available IDs:", templates.map(t => t.id));
// //       return;
// //     }

// //     try {
// //       const data = JSON.parse(JSON.stringify(template.templateData || {}));
// //       console.log("[TemplateGrid] Template data loaded:", data);

// //       // Ensure required sub-objects exist
// //       if (!data.contact) data.contact = { email: '', phone: '', location: '' };
// //       data.headers = { ...DEFAULT_HEADERS, ...(data.headers || {}) };

// //       setSelectedTemplate(id);
// //       setEditingData(data);
// //       setSaveStatus('idle');
// //       console.log("[TemplateGrid] Modal state updated.");
// //     } catch (err) {
// //       console.error("[TemplateGrid] Error selecting template:", err);
// //     }
// //   };

// //   // ── Save edits to DB ────────────────────────────────────────────────────────
// //   const persistEdits = async (data: any): Promise<boolean> => {
// //     try {
// //       const response = await fetch('/api/update-cv-data', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           analysisId,
// //           templateId: selectedTemplate,
// //           optimizedData: data
// //         }),
// //       });
// //       return response.ok;
// //     } catch {
// //       return false;
// //     }
// //   };

// //   const handleSaveEdit = async () => {
// //     if (!selectedTemplate || !editingData) return;
// //     setSaveStatus('saving');

// //     setTemplates(prev =>
// //       prev.map(t => String(t.id) === String(selectedTemplate) ? { ...t, templateData: editingData } : t)
// //     );

// //     const ok = await persistEdits(editingData);
// //     if (ok) {
// //       setSaveStatus('saved');
// //       setTimeout(() => setSaveStatus('idle'), 2500);
// //     } else {
// //       setSaveStatus('error');
// //     }
// //   };

// //   // ── Download — auto-saves edits first so print page gets latest data ────────
// //   // The print page reads from DB, so we must save before Puppeteer visits it.
// //   const handleDownload = async (templateId: string) => {
// //     try {
// //       setIsGenerating(templateId);

// //       const currentData =
// //         selectedTemplate === templateId && editingDataRef.current
// //           ? editingDataRef.current
// //           : templates.find(t => t.id === templateId)?.templateData;

// //       // Persist edits to DB before generating — the route.ts also does this
// //       // as a safety net, but doing it here first gives the DB time to commit.
// //       if (selectedTemplate === templateId && editingDataRef.current) {
// //         setTemplates(prev =>
// //           prev.map(t => t.id === templateId ? { ...t, templateData: currentData } : t)
// //         );
// //         await persistEdits(currentData);
// //       }

// //       const response = await fetch('/api/generate-pdf', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ templateId, analysisId, templateData: currentData }),
// //       });

// //       const result = await response.json();
// //       if (!response.ok) throw new Error(result.error || 'Erreur serveur');

// //       if (result.pdfBase64) {
// //         const link = document.createElement('a');
// //         link.href = `data:application/pdf;base64,${result.pdfBase64}`;
// //         link.download = result.fileName || 'CV.pdf';
// //         document.body.appendChild(link);
// //         link.click();
// //         document.body.removeChild(link);
// //       }
// //     } catch (error: any) {
// //       alert(error.message);
// //     } finally {
// //       setIsGenerating(null);
// //     }
// //   };

// //   // ── Generic deep-path state updater ───────────────────────────────────────
// //   const updateNestedData = (path: string, value: any) => {
// //     setEditingData((prev: any) => {
// //       const newData = { ...prev };
// //       const keys = path.split('.');
// //       let current = newData;
// //       for (let i = 0; i < keys.length - 1; i++) {
// //         if (!current[keys[i]]) current[keys[i]] = {};
// //         current[keys[i]] = { ...current[keys[i]] };
// //         current = current[keys[i]];
// //       }
// //       current[keys[keys.length - 1]] = value;
// //       return newData;
// //     });
// //   };

// //   // Delete a key from the contact object
// //   const deleteContactField = (fieldKey: string) => {
// //     setEditingData((prev: any) => {
// //       const contact = { ...prev.contact };
// //       delete contact[fieldKey];
// //       return { ...prev, contact };
// //     });
// //   };

// //   // ── Array helpers ──────────────────────────────────────────────────────────
// //   const updateArrayItem = (section: string, idx: number, field: string, value: any) => {
// //     setEditingData((prev: any) => {
// //       const arr = [...(prev[section] || [])];
// //       arr[idx] = { ...arr[idx], [field]: value };
// //       return { ...prev, [section]: arr };
// //     });
// //   };

// //   const addArrayItem = (section: string, template: object) => {
// //     setEditingData((prev: any) => ({
// //       ...prev,
// //       [section]: [...(prev[section] || []), { ...template }],
// //     }));
// //   };

// //   const removeArrayItem = (section: string, idx: number) => {
// //     setEditingData((prev: any) => ({
// //       ...prev,
// //       [section]: (prev[section] || []).filter((_: any, i: number) => i !== idx),
// //     }));
// //   };

// //   const selectedTemplateData = templates.find(t => String(t.id) === String(selectedTemplate));
// //   console.log("[TemplateGrid] Selected template data:", { selectedTemplate, found: !!selectedTemplateData });

// //   // Which optional contact fields are currently active
// //   const hasLinkedin = editingData?.contact && 'linkedin' in editingData.contact;
// //   const hasGithub = editingData?.contact && 'github' in editingData.contact;
// //   const hasPortfolio = editingData?.contact && 'portfolio' in editingData.contact;
// //   const canAddMore = !hasLinkedin || !hasGithub || !hasPortfolio;

// //   const addNextContactField = () => {
// //     if (!hasLinkedin) { updateNestedData('contact.linkedin', ''); return; }
// //     if (!hasGithub) { updateNestedData('contact.github', ''); return; }
// //     if (!hasPortfolio) { updateNestedData('contact.portfolio', ''); return; }
// //   };

// //   return (
// //     <div className="relative">

// //       {/* ── Template Grid ──────────────────────────────────────────────────── */}
// //       <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transition-all duration-700
// //         ${selectedTemplate ? 'opacity-30 scale-95 blur-sm pointer-events-none' : ''}`}>
// //         {templates.map((template) => (
// //           <div
// //             key={template.id}
// //             onClick={(e) => {
// //               e.preventDefault();
// //               console.log("[TemplateGrid] Main container clicked:", template.id);
// //               handleSelect(template.id);
// //             }}
// //             className="group relative bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden
// //               cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-[650px] shadow-sm"
// //           >
// //             <div className="flex-1 bg-gray-50/50 overflow-hidden relative">
// //               <div className={`absolute inset-0 flex justify-center items-start pt-10 ${!hasPaid ? 'blur-[4px]' : ''}`}>
// //                 <div className="scale-[0.4] origin-top transform-gpu shadow-2xl transition-transform duration-500 group-hover:scale-[0.41]">
// //                   <CVRenderer template={template} isPaid={hasPaid} analysisData={analysisData} />
// //                 </div>
// //               </div>
// //               {!hasPaid && (
// //                 <div className="absolute inset-0 flex items-center justify-center z-[25] pointer-events-none">
// //                   <div className="rotate-45 text-[40px] font-black text-black/5 uppercase tracking-[1em] whitespace-nowrap select-none">
// //                     PROTÉGÉ • PROTÉGÉ • PROTÉGÉ
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //             <div
// //               className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center z-20"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 console.log("[TemplateGrid] Overlay clicked:", template.id);
// //                 handleSelect(template.id);
// //               }}
// //             >
// //               <span className="bg-white text-black px-8 py-4 rounded-full font-black opacity-0 group-hover:opacity-100
// //                 transform translate-y-8 group-hover:translate-y-0 transition-all shadow-2xl flex items-center gap-3">
// //                 {hasPaid ? <Sparkles className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-slate-400" />}
// //                 {hasPaid ? 'Éditer le CV' : 'Débloquer ce Modèle'}
// //               </span>
// //             </div>
// //             <div className="p-8 bg-white border-t border-gray-100 flex justify-between items-center">
// //               <div>
// //                 <div className="flex items-center gap-2">
// //                   <span className="font-black text-xl text-gray-900 tracking-tight">{template.templateStyle}</span>
// //                   {!hasPaid && <Lock size={14} className="text-slate-300" />}
// //                 </div>
// //                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">IA Optimisé</span>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* ── Editor Modal ───────────────────────────────────────────────────── */}
// //       {selectedTemplate && selectedTemplateData && (
// //         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/60">
// //           <div className="bg-white w-full max-w-7xl h-full md:h-[95%] shadow-2xl rounded-[3rem] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500">

// //             {/* Header bar */}
// //             <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-slate-100 shrink-0">
// //               <div className="flex items-center gap-6">
// //                 <button
// //                   onClick={() => { setSelectedTemplate(null); setIsEditing(false); }}
// //                   className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all"
// //                 >
// //                   <X className="w-5 h-5 text-slate-400" />
// //                 </button>
// //                 <span className="font-black text-2xl text-slate-900">Modèle {selectedTemplateData.templateStyle}</span>
// //               </div>
// //               <div className="flex items-center gap-4">
// //                 <button
// //                   onClick={() => setIsEditing(!isEditing)}
// //                   className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all
// //                     ${isEditing ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}
// //                 >
// //                   <Edit3 size={18} />
// //                   {isEditing ? 'Fermer Éditeur' : 'Modifier le contenu'}
// //                 </button>
// //                 {!hasPaid ? (
// //                   <button
// //                     onClick={() => setShowPaywall(true)}
// //                     className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl"
// //                   >
// //                     <Lock size={18} /> Débloquer
// //                   </button>
// //                 ) : (
// //                   <button
// //                     onClick={() => handleDownload(selectedTemplateData.id)}
// //                     disabled={!!isGenerating}
// //                     className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 disabled:opacity-50 transition-all"
// //                   >
// //                     {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
// //                     {isGenerating ? 'Génération...' : 'Télécharger'}
// //                   </button>
// //                 )}
// //               </div>
// //             </div>

// //             <div className="flex-1 flex overflow-hidden">

// //               {/* ── Editor Panel ───────────────────────────────────────────── */}
// //               <div className={`w-[450px] shrink-0 border-r border-slate-100 overflow-y-auto bg-slate-50/30
// //                 transition-all duration-500 ${!isEditing ? '-ml-[450px] opacity-0' : 'ml-0 opacity-100'}`}>
// //                 <div className="p-10 space-y-10 pb-36">
// //                   <h3 className="text-2xl font-black text-slate-900">Modifier le CV</h3>

// //                   {/* ── 1. Informations Générales + Résumé ──────────────── */}
// //                   <section className="space-y-3">
// //                     <SectionHeader sectionKey="summary" editingData={editingData} updateNestedData={updateNestedData} />

// //                     {/* Photo Upload */}
// //                     <div>
// //                       <label className={labelCls}>Photo de profil</label>
// //                       <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
// //                         {editingData?.photoUrl ? (
// //                           <div className="relative group">
// //                             <img src={editingData.photoUrl} alt="Profil" className="w-20 h-20 rounded-xl object-cover" />
// //                             <button
// //                               onClick={() => updateNestedData('photoUrl', '')}
// //                               className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
// //                             >
// //                               <X size={12} />
// //                             </button>
// //                           </div>
// //                         ) : (
// //                           <div className="w-20 h-20 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
// //                             <Camera size={20} />
// //                             <span className="text-[10px] font-bold mt-1">Photo</span>
// //                           </div>
// //                         )}
// //                         <div className="flex-1">
// //                           <input
// //                             type="file"
// //                             accept="image/*"
// //                             className="hidden"
// //                             id="photo-upload"
// //                             onChange={(e) => {
// //                               const file = e.target.files?.[0];
// //                               if (file) {
// //                                 const reader = new FileReader();
// //                                 reader.onloadend = () => updateNestedData('photoUrl', reader.result);
// //                                 reader.readAsDataURL(file);
// //                               }
// //                             }}
// //                           />
// //                           <label
// //                             htmlFor="photo-upload"
// //                             className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors"
// //                           >
// //                             {editingData?.photoUrl ? 'Changer la photo' : 'Télécharger une photo'}
// //                           </label>
// //                           <p className="text-[10px] text-slate-400 mt-2 font-medium">PNG, JPG ou JPEG (Max 2MB)</p>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div>
// //                       <label className={labelCls}>Nom complet</label>
// //                       <input className={inputCls} placeholder="Nom Complet"
// //                         value={editingData?.userName || ''}
// //                         onChange={(e) => updateNestedData('userName', e.target.value)} />
// //                     </div>
// //                     <div>
// //                       <label className={labelCls}>Poste visé</label>
// //                       <input className={inputCls} placeholder="Développeur Web Full Stack"
// //                         value={editingData?.jobTitle || ''}
// //                         onChange={(e) => updateNestedData('jobTitle', e.target.value)} />
// //                     </div>
// //                     <div>
// //                       <label className={labelCls}>Résumé / Profil</label>
// //                       <textarea className={textareaCls} rows={5} placeholder="Résumé professionnel..."
// //                         value={editingData?.summary || ''}
// //                         onChange={(e) => updateNestedData('summary', e.target.value)} />
// //                     </div>
// //                   </section>

// //                   {/* ── 2. Contact ──────────────────────────────────────── */}
// //                   <section className="space-y-3 border-t pt-8">
// //                     <SectionHeader
// //                       sectionKey="contact"
// //                       editingData={editingData}
// //                       updateNestedData={updateNestedData}
// //                       onAdd={canAddMore ? addNextContactField : undefined}
// //                       addLabel="+ Champ"
// //                     />
// //                     {/* Always-visible core fields */}
// //                     <div>
// //                       <label className={labelCls}>Email</label>
// //                       <input className={inputCls} type="email" placeholder="exemple@email.com"
// //                         value={editingData?.contact?.email || ''}
// //                         onChange={(e) => updateNestedData('contact.email', e.target.value)} />
// //                     </div>
// //                     <div>
// //                       <label className={labelCls}>Téléphone</label>
// //                       <input className={inputCls} placeholder="+33 6 00 00 00 00"
// //                         value={editingData?.contact?.phone || ''}
// //                         onChange={(e) => updateNestedData('contact.phone', e.target.value)} />
// //                     </div>
// //                     <div>
// //                       <label className={labelCls}>Localisation</label>
// //                       <input className={inputCls} placeholder="Paris, France"
// //                         value={editingData?.contact?.location || ''}
// //                         onChange={(e) => updateNestedData('contact.location', e.target.value)} />
// //                     </div>
// //                     {/* Optional deletable fields */}
// //                     {hasLinkedin && (
// //                       <OptionalContactField
// //                         label="LinkedIn"
// //                         fieldKey="linkedin"
// //                         placeholder="linkedin.com/in/votre-profil"
// //                         editingData={editingData}
// //                         updateNestedData={updateNestedData}
// //                         onDelete={() => deleteContactField('linkedin')}
// //                       />
// //                     )}
// //                     {hasGithub && (
// //                       <OptionalContactField
// //                         label="GitHub"
// //                         fieldKey="github"
// //                         placeholder="github.com/votre-username"
// //                         editingData={editingData}
// //                         updateNestedData={updateNestedData}
// //                         onDelete={() => deleteContactField('github')}
// //                       />
// //                     )}
// //                     {hasPortfolio && (
// //                       <OptionalContactField
// //                         label="Portfolio / Site web"
// //                         fieldKey="portfolio"
// //                         placeholder="https://votre-portfolio.com"
// //                         editingData={editingData}
// //                         updateNestedData={updateNestedData}
// //                         onDelete={() => deleteContactField('portfolio')}
// //                       />
// //                     )}
// //                   </section>

// //                   {/* ── 3. Expérience ───────────────────────────────────── */}
// //                   <section className="space-y-4 border-t pt-8">
// //                     <SectionHeader
// //                       sectionKey="experience"
// //                       editingData={editingData}
// //                       updateNestedData={updateNestedData}
// //                       onAdd={() => addArrayItem('experience', { title: '', company: '', period: '', description: '' })}
// //                     />
// //                     {(editingData?.experience || []).map((exp: any, idx: number) => (
// //                       <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
// //                         <div className="flex justify-between items-center">
// //                           <span className="text-xs font-black text-slate-400">Expérience {idx + 1}</span>
// //                           <button onClick={() => removeArrayItem('experience', idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
// //                         </div>
// //                         <div><label className={labelCls}>Titre du poste</label>
// //                           <input className={inputCls} placeholder="Ex: Développeur Full Stack" value={exp.title || ''} onChange={(e) => updateArrayItem('experience', idx, 'title', e.target.value)} /></div>
// //                         <div><label className={labelCls}>Entreprise</label>
// //                           <input className={inputCls} placeholder="Ex: ICV Informatique" value={exp.company || ''} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} /></div>
// //                         <div><label className={labelCls}>Période</label>
// //                           <input className={inputCls} placeholder="Ex: Janvier 2025 – Avril 2025" value={exp.period || ''} onChange={(e) => updateArrayItem('experience', idx, 'period', e.target.value)} /></div>
// //                         <div><label className={labelCls}>Description</label>
// //                           <textarea className={textareaCls} rows={3} placeholder="Description des responsabilités..." value={exp.description || ''} onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value)} /></div>
// //                       </div>
// //                     ))}
// //                   </section>

// //                   {/* ── 4. Formation ────────────────────────────────────── */}
// //                   <section className="space-y-4 border-t pt-8">
// //                     <SectionHeader
// //                       sectionKey="education"
// //                       editingData={editingData}
// //                       updateNestedData={updateNestedData}
// //                       onAdd={() => addArrayItem('education', { degree: '', school: '', year: '', details: '' })}
// //                     />
// //                     {(editingData?.education || []).map((edu: any, idx: number) => (
// //                       <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
// //                         <div className="flex justify-between items-center">
// //                           <span className="text-xs font-black text-slate-400">Formation {idx + 1}</span>
// //                           <button onClick={() => removeArrayItem('education', idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
// //                         </div>
// //                         <div><label className={labelCls}>Diplôme / Titre</label>
// //                           <input className={inputCls} placeholder="Ex: Licence Informatique" value={edu.degree || ''} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} /></div>
// //                         <div><label className={labelCls}>Établissement</label>
// //                           <input className={inputCls} placeholder="Ex: Université Paris-Saclay" value={edu.school || ''} onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)} /></div>
// //                         <div><label className={labelCls}>Année</label>
// //                           <input className={inputCls} placeholder="Ex: 2023-2024" value={edu.year || ''} onChange={(e) => updateArrayItem('education', idx, 'year', e.target.value)} /></div>
// //                         <div><label className={labelCls}>Détails (optionnel)</label>
// //                           <input className={inputCls} placeholder="Ex: Mention Bien" value={edu.details || ''} onChange={(e) => updateArrayItem('education', idx, 'details', e.target.value)} /></div>
// //                       </div>
// //                     ))}
// //                   </section>

// //                   {/* ── 5. Projets ──────────────────────────────────────── */}
// //                   <section className="space-y-4 border-t pt-8">
// //                     <SectionHeader
// //                       sectionKey="projects"
// //                       editingData={editingData}
// //                       updateNestedData={updateNestedData}
// //                       onAdd={() => addArrayItem('projects', { name: '', technologies: [], description: '' })}
// //                     />
// //                     {(editingData?.projects || []).map((proj: any, idx: number) => (
// //                       <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
// //                         <div className="flex justify-between items-center">
// //                           <span className="text-xs font-black text-slate-400">Projet {idx + 1}</span>
// //                           <button onClick={() => removeArrayItem('projects', idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
// //                         </div>
// //                         <div><label className={labelCls}>Nom du projet</label>
// //                           <input className={inputCls} placeholder="Ex: School Management Website" value={proj.name || ''} onChange={(e) => updateArrayItem('projects', idx, 'name', e.target.value)} /></div>
// //                         <div><label className={labelCls}>Technologies (séparées par virgules)</label>
// //                           <input className={inputCls} placeholder="Ex: JavaScript, React, Bootstrap"
// //                             value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '')}
// //                             onChange={(e) => {
// //                               const arr = e.target.value.split(',').map((s: string) => s.trimStart());
// //                               updateArrayItem('projects', idx, 'technologies', arr);
// //                             }} /></div>
// //                         <div><label className={labelCls}>Description</label>
// //                           <textarea className={textareaCls} rows={2} placeholder="Description du projet..." value={proj.description || ''} onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value)} /></div>
// //                       </div>
// //                     ))}
// //                   </section>

// //                   {/* ── 6. Compétences ──────────────────────────────────── */}
// //                   <section className="space-y-3 border-t pt-8">
// //                     <SectionHeader
// //                       sectionKey="skills"
// //                       editingData={editingData}
// //                       updateNestedData={updateNestedData}
// //                       onAdd={() => updateNestedData('skills', [...(editingData?.skills || []), ''])}
// //                     />
// //                     <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
// //                       {(editingData?.skills || []).map((skill: string, idx: number) => (
// //                         <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
// //                           <input value={skill}
// //                             onChange={(e) => {
// //                               const arr = [...(editingData?.skills || [])];
// //                               arr[idx] = e.target.value;
// //                               updateNestedData('skills', arr);
// //                             }}
// //                             className="text-sm font-medium outline-none w-20 bg-transparent" />
// //                           <button onClick={() => updateNestedData('skills', (editingData?.skills || []).filter((_: any, i: number) => i !== idx))}
// //                             className="text-slate-300 hover:text-red-500 transition-colors"><X size={12} /></button>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </section>

// //                   {/* ── 7. Langues ──────────────────────────────────────── */}
// //                   <section className="space-y-4 border-t pt-8">
// //                     <SectionHeader
// //                       sectionKey="languages"
// //                       editingData={editingData}
// //                       updateNestedData={updateNestedData}
// //                       onAdd={() => addArrayItem('languages', { language: '', level: '' })}
// //                     />
// //                     {(editingData?.languages || []).map((lang: any, idx: number) => (
// //                       <div key={idx} className="flex gap-2 items-center">
// //                         <input className={`${inputCls} flex-1`} placeholder="Langue"
// //                           value={lang.language || lang.name || (typeof lang === 'string' ? lang : '')}
// //                           onChange={(e) => {
// //                             const arr = [...(editingData?.languages || [])];
// //                             arr[idx] = typeof arr[idx] === 'string' ? e.target.value : { ...arr[idx], language: e.target.value };
// //                             updateNestedData('languages', arr);
// //                           }} />
// //                         <input className={`${inputCls} flex-1`} placeholder="Niveau"
// //                           value={typeof lang === 'string' ? '' : (lang.level || '')}
// //                           onChange={(e) => {
// //                             const arr = [...(editingData?.languages || [])];
// //                             arr[idx] = { ...arr[idx], level: e.target.value };
// //                             updateNestedData('languages', arr);
// //                           }} />
// //                         <button onClick={() => removeArrayItem('languages', idx)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0"><Trash2 size={14} /></button>
// //                       </div>
// //                     ))}
// //                   </section>

// //                   {/* ── 8. Intérêts (if present) ────────────────────────── */}
// //                   {(editingData?.interests?.length > 0) && (
// //                     <section className="space-y-3 border-t pt-8">
// //                       <SectionHeader
// //                         sectionKey="interests"
// //                         editingData={editingData}
// //                         updateNestedData={updateNestedData}
// //                         onAdd={() => updateNestedData('interests', [...(editingData?.interests || []), ''])}
// //                       />
// //                       <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
// //                         {(editingData?.interests || []).map((interest: string, idx: number) => (
// //                           <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
// //                             <input value={interest}
// //                               onChange={(e) => {
// //                                 const arr = [...(editingData?.interests || [])];
// //                                 arr[idx] = e.target.value;
// //                                 updateNestedData('interests', arr);
// //                               }}
// //                               className="text-sm font-medium outline-none w-24 bg-transparent" />
// //                             <button onClick={() => updateNestedData('interests', (editingData?.interests || []).filter((_: any, i: number) => i !== idx))}
// //                               className="text-slate-300 hover:text-red-500 transition-colors"><X size={12} /></button>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </section>
// //                   )}

// //                   {/* ── Save button ─────────────────────────────────────── */}
// //                   <div className="sticky bottom-0 pt-4 pb-2 bg-slate-50/90 backdrop-blur-sm">
// //                     <button
// //                       onClick={handleSaveEdit}
// //                       disabled={saveStatus === 'saving'}
// //                       className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all
// //                         shadow-2xl flex items-center justify-center gap-3 ${saveStatus === 'saved' ? 'bg-emerald-600 text-white' :
// //                           saveStatus === 'error' ? 'bg-red-500 text-white' :
// //                             'bg-slate-900 text-white hover:scale-[1.02]'
// //                         }`}
// //                     >
// //                       {saveStatus === 'saving' && <Loader2 size={18} className="animate-spin" />}
// //                       {saveStatus === 'saved' && <CheckCircle2 size={18} />}
// //                       {saveStatus === 'error' && <AlertCircle size={18} />}
// //                       {saveStatus === 'idle' && <Save size={18} />}
// //                       {saveStatus === 'saving' ? 'Enregistrement...'
// //                         : saveStatus === 'saved' ? 'Enregistré !'
// //                           : saveStatus === 'error' ? 'Erreur — réessayer'
// //                             : 'Enregistrer les modifications'}
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* ── Live Preview ────────────────────────────────────────── */}
// //               <div className="flex-1 overflow-auto bg-slate-100/30 p-12 flex justify-center relative">
// //                 <div className={`relative bg-white shadow-2xl h-fit ${!hasPaid ? 'blur-md pointer-events-none' : ''}`}>
// //                   <CVRenderer
// //                     template={{ ...selectedTemplateData, templateData: editingData }}
// //                     isPaid={hasPaid}
// //                     analysisData={analysisData}
// //                   />
// //                 </div>
// //                 {!hasPaid && (
// //                   <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px] z-50">
// //                     <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-sm">
// //                       <Lock className="mx-auto mb-6 text-primary" size={48} />
// //                       <h3 className="text-2xl font-black mb-2">Aperçu Verrouillé</h3>
// //                       <p className="text-slate-500 mb-8">Débloquez ce modèle pour modifier et télécharger sans filigrane.</p>
// //                       <button onClick={() => setShowPaywall(true)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Débloquer</button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {showPaywall && (
// //         <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} analysisId={analysisId} />
// //       )}
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';
// import PaywallModal from './PaywallModal';
// import {
//   Lock, Loader2, Download, Sparkles, Edit3, X, Save,
//   Plus, Trash2, AlertCircle, CheckCircle2, Camera,
// } from 'lucide-react';
// import CVRenderer from './CVRenderer';

// interface Template {
//   id: string;
//   templateNumber: number;
//   templateStyle: string;
//   templateData?: any;
//   pdfUrl?: string;
// }

// interface TemplateGridProps {
//   templates: Template[];
//   isPaid: boolean;
//   analysisId: string;
//   analysisData?: any;
// }

// // ── Shared input styles ────────────────────────────────────────────────────────
// const inputCls = 'w-full p-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors bg-white';
// const textareaCls = 'w-full p-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors resize-none bg-white';
// const labelCls = 'text-[10px] font-black uppercase text-slate-400 mb-1 block';

// // Default French section header labels
// const DEFAULT_HEADERS: Record<string, string> = {
//   summary: 'Profil',
//   experience: 'Expérience',
//   education: 'Formation',
//   projects: 'Projets',
//   skills: 'Compétences',
//   languages: 'Langues',
//   interests: 'Intérêts',
//   contact: 'Contact',
//   certifications: 'Certifications',
// };

// /**
//  * 🛠️ FIX CRITIQUE : Cette fonction transforme les objets complexes (STAR, Skills avec niveau)
//  * en chaînes de caractères simples pour éviter l'erreur "Objects are not valid as a React child".
//  */
// const sanitizeTemplateData = (data: any) => {
//   if (!data) return data;
//   return JSON.parse(JSON.stringify(data, (key, value) => {
//     if (value && typeof value === 'object' && !Array.isArray(value)) {
//       // Cas des objets d'expérience (STAR)
//       if ('action' in value || 'situation' in value) {
//         return `${value.situation || ''} ${value.action || ''} ${value.resultat || ''}`.trim();
//       }
//       // Cas des objets de compétences ou langues {name, level}
//       if ('name' in value) {
//         return value.level ? `${value.name} (${value.level})` : value.name;
//       }
//       return value;
//     }
//     return value;
//   }));
// };

// // ── Editable section header component ─────────────────────────────────────────
// function SectionHeader({
//   sectionKey,
//   editingData,
//   updateNestedData,
//   onAdd,
//   addLabel = '+ Ajouter',
// }: {
//   sectionKey: string;
//   editingData: any;
//   updateNestedData: (path: string, value: any) => void;
//   onAdd?: () => void;
//   addLabel?: string;
// }) {
//   const value = editingData?.headers?.[sectionKey] || DEFAULT_HEADERS[sectionKey] || sectionKey;
//   return (
//     <div className="flex items-center gap-2 mb-3">
//       <input
//         title="Cliquez pour modifier le titre de cette section"
//         className="flex-1 text-[11px] font-black uppercase tracking-widest text-primary bg-primary/5
//           border border-primary/20 rounded-lg px-3 py-1.5 outline-none focus:border-primary transition-colors"
//         value={value}
//         onChange={(e) => updateNestedData(`headers.${sectionKey}`, e.target.value)}
//       />
//       {onAdd && (
//         <button
//           onClick={onAdd}
//           className="text-xs font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap shrink-0"
//         >
//           <Plus size={13} /> {addLabel}
//         </button>
//       )}
//     </div>
//   );
// }

// // ── Optional contact field (LinkedIn / GitHub / Portfolio) ────────────────────
// function OptionalContactField({
//   label,
//   fieldKey,
//   placeholder,
//   editingData,
//   updateNestedData,
//   onDelete,
// }: {
//   label: string;
//   fieldKey: string;
//   placeholder: string;
//   editingData: any;
//   updateNestedData: (path: string, value: any) => void;
//   onDelete: () => void;
// }) {
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-1">
//         <label className={labelCls}>{label}</label>
//         <button onClick={onDelete} className="text-[10px] text-slate-300 hover:text-red-500 transition-colors flex items-center gap-1">
//           <Trash2 size={11} /> Supprimer
//         </button>
//       </div>
//       <input
//         className={inputCls}
//         placeholder={placeholder}
//         value={editingData?.contact?.[fieldKey] || ''}
//         onChange={(e) => updateNestedData(`contact.${fieldKey}`, e.target.value)}
//       />
//     </div>
//   );
// }

// export default function TemplateGrid({
//   templates: initialTemplates,
//   isPaid,
//   analysisId,
//   analysisData,
// }: TemplateGridProps) {
//   const { isLoaded } = useUser();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [templates, setTemplates] = useState(initialTemplates);
//   const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
//   const [showPaywall, setShowPaywall] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingData, setEditingData] = useState<any>(null);
//   const [isGenerating, setIsGenerating] = useState<string | null>(null);
//   const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

//   const editingDataRef = useRef<any>(null);
//   useEffect(() => { editingDataRef.current = editingData; }, [editingData]);

//   useEffect(() => {
//     setTemplates(initialTemplates);
//   }, [initialTemplates]);

//   const hasPaid = isPaid || searchParams.get('payment') === 'success';

//   const [hasRefreshed, setHasRefreshed] = useState(false);
//   useEffect(() => {
//     if (searchParams.get('payment') === 'success' && !hasRefreshed) {
//       setHasRefreshed(true);
//       router.refresh();
//     }
//   }, [searchParams, router, hasRefreshed]);

//   const handleSelect = (id: string) => {
//     const template = templates.find(t => String(t.id) === String(id));
//     if (!template) return;

//     try {
//       // ✅ FIX : Nettoyage des données lors de la sélection pour éviter le crash de l'éditeur
//       const data = sanitizeTemplateData(template.templateData || {});
//       if (!data.contact) data.contact = { email: '', phone: '', location: '' };
//       data.headers = { ...DEFAULT_HEADERS, ...(data.headers || {}) };

//       setSelectedTemplate(id);
//       setEditingData(data);
//       setSaveStatus('idle');
//     } catch (err) {
//       console.error("[TemplateGrid] Error selecting template:", err);
//     }
//   };

//   const persistEdits = async (data: any): Promise<boolean> => {
//     try {
//       const response = await fetch('/api/update-cv-data', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           analysisId,
//           templateId: selectedTemplate,
//           optimizedData: data
//         }),
//       });
//       return response.ok;
//     } catch {
//       return false;
//     }
//   };

//   const handleSaveEdit = async () => {
//     if (!selectedTemplate || !editingData) return;
//     setSaveStatus('saving');
//     setTemplates(prev =>
//       prev.map(t => String(t.id) === String(selectedTemplate) ? { ...t, templateData: editingData } : t)
//     );
//     const ok = await persistEdits(editingData);
//     if (ok) {
//       setSaveStatus('saved');
//       setTimeout(() => setSaveStatus('idle'), 2500);
//     } else {
//       setSaveStatus('error');
//     }
//   };

//   const handleDownload = async (templateId: string) => {
//     try {
//       setIsGenerating(templateId);
//       const currentData = selectedTemplate === templateId && editingDataRef.current
//           ? editingDataRef.current
//           : templates.find(t => t.id === templateId)?.templateData;

//       if (selectedTemplate === templateId && editingDataRef.current) {
//         setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, templateData: currentData } : t));
//         await persistEdits(currentData);
//       }

//       const response = await fetch('/api/generate-pdf', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ templateId, analysisId, templateData: currentData }),
//       });
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || 'Erreur serveur');
//       if (result.pdfBase64) {
//         const link = document.createElement('a');
//         link.href = `data:application/pdf;base64,${result.pdfBase64}`;
//         link.download = result.fileName || 'CV.pdf';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     } catch (error: any) {
//       alert(error.message);
//     } finally {
//       setIsGenerating(null);
//     }
//   };

//   const updateNestedData = (path: string, value: any) => {
//     setEditingData((prev: any) => {
//       const newData = { ...prev };
//       const keys = path.split('.');
//       let current = newData;
//       for (let i = 0; i < keys.length - 1; i++) {
//         if (!current[keys[i]]) current[keys[i]] = {};
//         current[keys[i]] = { ...current[keys[i]] };
//         current = current[keys[i]];
//       }
//       current[keys[keys.length - 1]] = value;
//       return newData;
//     });
//   };

//   const deleteContactField = (fieldKey: string) => {
//     setEditingData((prev: any) => {
//       const contact = { ...prev.contact };
//       delete contact[fieldKey];
//       return { ...prev, contact };
//     });
//   };

//   const updateArrayItem = (section: string, idx: number, field: string, value: any) => {
//     setEditingData((prev: any) => {
//       const arr = [...(prev[section] || [])];
//       arr[idx] = { ...arr[idx], [field]: value };
//       return { ...prev, [section]: arr };
//     });
//   };

//   const addArrayItem = (section: string, template: object) => {
//     setEditingData((prev: any) => ({
//       ...prev,
//       [section]: [...(prev[section] || []), { ...template }],
//     }));
//   };

//   const removeArrayItem = (section: string, idx: number) => {
//     setEditingData((prev: any) => ({
//       ...prev,
//       [section]: (prev[section] || []).filter((_: any, i: number) => i !== idx),
//     }));
//   };

//   const selectedTemplateData = templates.find(t => String(t.id) === String(selectedTemplate));
//   const hasLinkedin = editingData?.contact && 'linkedin' in editingData.contact;
//   const hasGithub = editingData?.contact && 'github' in editingData.contact;
//   const hasPortfolio = editingData?.contact && 'portfolio' in editingData.contact;
//   const canAddMore = !hasLinkedin || !hasGithub || !hasPortfolio;

//   const addNextContactField = () => {
//     if (!hasLinkedin) { updateNestedData('contact.linkedin', ''); return; }
//     if (!hasGithub) { updateNestedData('contact.github', ''); return; }
//     if (!hasPortfolio) { updateNestedData('contact.portfolio', ''); return; }
//   };

//   return (
//     <div className="relative">
//       <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transition-all duration-700
//         ${selectedTemplate ? 'opacity-30 scale-95 blur-sm pointer-events-none' : ''}`}>
//         {templates.map((template) => (
//           <div
//             key={template.id}
//             onClick={() => handleSelect(template.id)}
//             className="group relative bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden
//               cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-[650px] shadow-sm"
//           >
//             <div className="flex-1 bg-gray-50/50 overflow-hidden relative">
//               <div className={`absolute inset-0 flex justify-center items-start pt-10 ${!hasPaid ? 'blur-[4px]' : ''}`}>
//                 <div className="scale-[0.4] origin-top transform-gpu shadow-2xl transition-transform duration-500 group-hover:scale-[0.41]">
//                   {/* ✅ FIX : Nettoyage des données avant le rendu dans la grille */}
//                   <CVRenderer
//                     template={{ ...template, templateData: sanitizeTemplateData(template.templateData) }}
//                     isPaid={hasPaid}
//                     analysisData={analysisData}
//                   />
//                 </div>
//               </div>
//               {!hasPaid && (
//                 <div className="absolute inset-0 flex items-center justify-center z-[25] pointer-events-none">
//                   <div className="rotate-45 text-[40px] font-black text-black/5 uppercase tracking-[1em] whitespace-nowrap select-none">
//                     PROTÉGÉ • PROTÉGÉ • PROTÉGÉ
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center z-20">
//               <span className="bg-white text-black px-8 py-4 rounded-full font-black opacity-0 group-hover:opacity-100
//                 transform translate-y-8 group-hover:translate-y-0 transition-all shadow-2xl flex items-center gap-3">
//                 {hasPaid ? <Sparkles className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-slate-400" />}
//                 {hasPaid ? 'Éditer le CV' : 'Débloquer ce Modèle'}
//               </span>
//             </div>
//             <div className="p-8 bg-white border-t border-gray-100 flex justify-between items-center">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-black text-xl text-gray-900 tracking-tight">{template.templateStyle}</span>
//                   {!hasPaid && <Lock size={14} className="text-slate-300" />}
//                 </div>
//                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">IA Optimisé</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedTemplate && selectedTemplateData && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/60">
//           <div className="bg-white w-full max-w-7xl h-full md:h-[95%] shadow-2xl rounded-[3rem] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500">
//             <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-slate-100 shrink-0">
//               <div className="flex items-center gap-6">
//                 <button onClick={() => { setSelectedTemplate(null); setIsEditing(false); }} className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all">
//                   <X className="w-5 h-5 text-slate-400" />
//                 </button>
//                 <span className="font-black text-2xl text-slate-900">Modèle {selectedTemplateData.templateStyle}</span>
//               </div>
//               <div className="flex items-center gap-4">
//                 <button onClick={() => setIsEditing(!isEditing)} className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${isEditing ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}>
//                   <Edit3 size={18} /> {isEditing ? 'Fermer Éditeur' : 'Modifier le contenu'}
//                 </button>
//                 {!hasPaid ? (
//                   <button onClick={() => setShowPaywall(true)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-primary/20">
//                     <Lock size={18} /> Débloquer
//                   </button>
//                 ) : (
//                   <button onClick={() => handleDownload(selectedTemplateData.id)} disabled={!!isGenerating} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 disabled:opacity-50 transition-all">
//                     {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
//                     {isGenerating ? 'Génération...' : 'Télécharger'}
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="flex-1 flex overflow-hidden">
//               {/* Editor Side Panel */}
//               <div className={`w-[450px] shrink-0 border-r border-slate-100 overflow-y-auto bg-slate-50/30 transition-all duration-500 ${!isEditing ? '-ml-[450px] opacity-0' : 'ml-0 opacity-100'}`}>
//                 <div className="p-10 space-y-10 pb-36">
//                   <h3 className="text-2xl font-black text-slate-900">Modifier le CV</h3>

//                   {/* Summary & Personal Info */}
//                   <section className="space-y-3">
//                     <SectionHeader sectionKey="summary" editingData={editingData} updateNestedData={updateNestedData} />
//                     <div>
//                       <label className={labelCls}>Photo de profil</label>
//                       <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
//                         {editingData?.photoUrl ? (
//                           <div className="relative group">
//                             <img src={editingData.photoUrl} alt="Profil" className="w-20 h-20 rounded-xl object-cover" />
//                             <button onClick={() => updateNestedData('photoUrl', '')} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
//                           </div>
//                         ) : (
//                           <div className="w-20 h-20 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
//                             <Camera size={20} />
//                             <span className="text-[10px] font-bold mt-1">Photo</span>
//                           </div>
//                         )}
//                         <div className="flex-1">
//                           <input type="file" accept="image/*" className="hidden" id="photo-upload" onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (file) {
//                               const reader = new FileReader();
//                               reader.onloadend = () => updateNestedData('photoUrl', reader.result);
//                               reader.readAsDataURL(file);
//                             }
//                           }} />
//                           <label htmlFor="photo-upload" className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors">
//                             {editingData?.photoUrl ? 'Changer la photo' : 'Télécharger une photo'}
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                     <div><label className={labelCls}>Nom complet</label><input className={inputCls} placeholder="Nom Complet" value={editingData?.userName || ''} onChange={(e) => updateNestedData('userName', e.target.value)} /></div>
//                     <div><label className={labelCls}>Poste visé</label><input className={inputCls} placeholder="Poste" value={editingData?.jobTitle || ''} onChange={(e) => updateNestedData('jobTitle', e.target.value)} /></div>
//                     <div><label className={labelCls}>Résumé / Profil</label><textarea className={textareaCls} rows={5} placeholder="Résumé..." value={editingData?.summary || ''} onChange={(e) => updateNestedData('summary', e.target.value)} /></div>
//                   </section>

//                   {/* Contact Section */}
//                   <section className="space-y-3 border-t pt-8">
//                     <SectionHeader sectionKey="contact" editingData={editingData} updateNestedData={updateNestedData} onAdd={canAddMore ? addNextContactField : undefined} addLabel="+ Champ" />
//                     <div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={editingData?.contact?.email || ''} onChange={(e) => updateNestedData('contact.email', e.target.value)} /></div>
//                     <div><label className={labelCls}>Téléphone</label><input className={inputCls} value={editingData?.contact?.phone || ''} onChange={(e) => updateNestedData('contact.phone', e.target.value)} /></div>
//                     <div><label className={labelCls}>Localisation</label><input className={inputCls} value={editingData?.contact?.location || ''} onChange={(e) => updateNestedData('contact.location', e.target.value)} /></div>
//                     {hasLinkedin && <OptionalContactField label="LinkedIn" fieldKey="linkedin" placeholder="URL" editingData={editingData} updateNestedData={updateNestedData} onDelete={() => deleteContactField('linkedin')} />}
//                     {hasGithub && <OptionalContactField label="GitHub" fieldKey="github" placeholder="URL" editingData={editingData} updateNestedData={updateNestedData} onDelete={() => deleteContactField('github')} />}
//                     {hasPortfolio && <OptionalContactField label="Portfolio" fieldKey="portfolio" placeholder="URL" editingData={editingData} updateNestedData={updateNestedData} onDelete={() => deleteContactField('portfolio')} />}
//                   </section>

//                   {/* Experience Section */}
//                   <section className="space-y-4 border-t pt-8">
//                     <SectionHeader sectionKey="experience" editingData={editingData} updateNestedData={updateNestedData} onAdd={() => addArrayItem('experience', { title: '', company: '', period: '', description: '' })} />
//                     {(editingData?.experience || []).map((exp: any, idx: number) => (
//                       <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm relative group">
//                         <button onClick={() => removeArrayItem('experience', idx)} className="absolute -top-2 -right-2 bg-white border shadow-sm text-slate-300 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
//                         <input className={inputCls} placeholder="Poste" value={exp.title || ''} onChange={(e) => updateArrayItem('experience', idx, 'title', e.target.value)} />
//                         <input className={inputCls} placeholder="Entreprise" value={exp.company || ''} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} />
//                         <textarea className={textareaCls} rows={3} placeholder="Description..." value={exp.description || ''} onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value)} />
//                       </div>
//                     ))}
//                   </section>

//                   {/* Education Section */}
//                   <section className="space-y-4 border-t pt-8">
//                     <SectionHeader sectionKey="education" editingData={editingData} updateNestedData={updateNestedData} onAdd={() => addArrayItem('education', { degree: '', school: '', year: '' })} />
//                     {(editingData?.education || []).map((edu: any, idx: number) => (
//                       <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm relative group">
//                         <button onClick={() => removeArrayItem('education', idx)} className="absolute -top-2 -right-2 bg-white border shadow-sm text-slate-300 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
//                         <input className={inputCls} placeholder="Diplôme" value={edu.degree || ''} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} />
//                         <input className={inputCls} placeholder="Établissement" value={edu.school || ''} onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)} />
//                         <input className={inputCls} placeholder="Année" value={edu.year || ''} onChange={(e) => updateArrayItem('education', idx, 'year', e.target.value)} />
//                       </div>
//                     ))}
//                   </section>

//                   {/* Projects Section (Optionnelle) */}
//                   {(editingData?.projects?.length > 0 || isEditing) && (
//                     <section className="space-y-4 border-t pt-8">
//                       <SectionHeader sectionKey="projects" editingData={editingData} updateNestedData={updateNestedData} onAdd={() => addArrayItem('projects', { title: '', description: '' })} />
//                       {(editingData?.projects || []).map((proj: any, idx: number) => (
//                         <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm relative group">
//                            <button onClick={() => removeArrayItem('projects', idx)} className="absolute -top-2 -right-2 bg-white border shadow-sm text-slate-300 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
//                            <input className={inputCls} placeholder="Nom du projet" value={proj.title || ''} onChange={(e) => updateArrayItem('projects', idx, 'title', e.target.value)} />
//                            <textarea className={textareaCls} rows={2} placeholder="Description..." value={proj.description || ''} onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value)} />
//                         </div>
//                       ))}
//                     </section>
//                   )}

//                   {/* Skills Section */}
//                   <section className="space-y-3 border-t pt-8">
//                     <SectionHeader sectionKey="skills" editingData={editingData} updateNestedData={updateNestedData} onAdd={() => updateNestedData('skills', [...(editingData?.skills || []), ''])} />
//                     <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                       {(editingData?.skills || []).map((skill: string, idx: number) => (
//                         <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
//                           <input value={skill} onChange={(e) => { const arr = [...(editingData?.skills || [])]; arr[idx] = e.target.value; updateNestedData('skills', arr); }} className="text-sm font-medium outline-none w-24 bg-transparent" />
//                           <button onClick={() => updateNestedData('skills', (editingData?.skills || []).filter((_: any, i: number) => i !== idx))} className="text-slate-300 hover:text-red-500"><X size={12} /></button>
//                         </div>
//                       ))}
//                     </div>
//                   </section>

//                   {/* Languages Section */}
//                   <section className="space-y-4 border-t pt-8">
//                     <SectionHeader sectionKey="languages" editingData={editingData} updateNestedData={updateNestedData} onAdd={() => addArrayItem('languages', { language: '', level: '' })} />
//                     {(editingData?.languages || []).map((lang: any, idx: number) => (
//                       <div key={idx} className="flex gap-2 items-center">
//                         <input className={`${inputCls} flex-1`} placeholder="Langue" value={lang.language || lang.name || (typeof lang === 'string' ? lang : '')} onChange={(e) => {
//                           const arr = [...(editingData?.languages || [])];
//                           arr[idx] = typeof arr[idx] === 'string' ? e.target.value : { ...arr[idx], language: e.target.value };
//                           updateNestedData('languages', arr);
//                         }} />
//                         <input className={`${inputCls} flex-1`} placeholder="Niveau" value={typeof lang === 'string' ? '' : (lang.level || '')} onChange={(e) => {
//                           const arr = [...(editingData?.languages || [])];
//                           arr[idx] = { ...arr[idx], level: e.target.value };
//                           updateNestedData('languages', arr);
//                         }} />
//                         <button onClick={() => removeArrayItem('languages', idx)} className="text-slate-300 hover:text-red-500 shrink-0"><Trash2 size={14} /></button>
//                       </div>
//                     ))}
//                   </section>

//                   {/* Interests Section */}
//                   {(editingData?.interests?.length > 0) && (
//                     <section className="space-y-3 border-t pt-8">
//                       <SectionHeader sectionKey="interests" editingData={editingData} updateNestedData={updateNestedData} onAdd={() => updateNestedData('interests', [...(editingData?.interests || []), ''])} />
//                       <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                         {(editingData?.interests || []).map((interest: string, idx: number) => (
//                           <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
//                             <input value={interest} onChange={(e) => { const arr = [...(editingData?.interests || [])]; arr[idx] = e.target.value; updateNestedData('interests', arr); }} className="text-sm font-medium outline-none w-24 bg-transparent" />
//                             <button onClick={() => updateNestedData('interests', (editingData?.interests || []).filter((_: any, i: number) => i !== idx))} className="text-slate-300 hover:text-red-500"><X size={12} /></button>
//                           </div>
//                         ))}
//                       </div>
//                     </section>
//                   )}

//                   {/* Save Footer */}
//                   <div className="sticky bottom-0 pt-4 pb-2 bg-slate-50/90 backdrop-blur-sm">
//                     <button onClick={handleSaveEdit} disabled={saveStatus === 'saving'} className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 ${saveStatus === 'saved' ? 'bg-emerald-600 text-white' : saveStatus === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white hover:scale-[1.02]'}`}>
//                       {saveStatus === 'saving' ? <Loader2 size={18} className="animate-spin" /> : saveStatus === 'saved' ? <CheckCircle2 size={18} /> : saveStatus === 'error' ? <AlertCircle size={18} /> : <Save size={18} />}
//                       {saveStatus === 'saving' ? 'Enregistrement...' : saveStatus === 'saved' ? 'Enregistré !' : saveStatus === 'error' ? 'Erreur — réessayer' : 'Enregistrer les modifications'}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Live Preview Panel */}
//               <div className="flex-1 overflow-auto bg-slate-100/30 p-12 flex justify-center relative">
//                 <div className={`relative bg-white shadow-2xl h-fit ${!hasPaid ? 'blur-md pointer-events-none' : ''}`}>
//                   <CVRenderer template={{ ...selectedTemplateData, templateData: editingData }} isPaid={hasPaid} analysisData={analysisData} />
//                 </div>
//                 {!hasPaid && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px] z-50">
//                     <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-sm">
//                       <Lock className="mx-auto mb-6 text-primary" size={48} />
//                       <h3 className="text-2xl font-black mb-2">Aperçu Verrouillé</h3>
//                       <p className="text-slate-500 mb-8">Débloquez ce modèle pour modifier et télécharger sans filigrane.</p>
//                       <button onClick={() => setShowPaywall(true)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Débloquer</button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showPaywall && <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} analysisId={analysisId} />}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import PaywallModal from "./PaywallModal";
import {
  Lock,
  Loader2,
  Download,
  Sparkles,
  Edit3,
  X,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Camera,
  ChevronLeft,
  Eye,
  Pencil,
} from "lucide-react";
import CVRenderer from "./CVRenderer";

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

const inputCls =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all";
const textareaCls =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all resize-none";
const labelCls =
  "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block";
const sectionCls = "space-y-3 border-t border-slate-100 pt-6";

const DEFAULT_HEADERS: Record<string, string> = {
  summary: "Profil",
  experience: "Expérience",
  education: "Formation",
  projects: "Projets",
  skills: "Compétences",
  languages: "Langues",
  interests: "Intérêts",
  contact: "Contact",
  certifications: "Certifications",
};

export default function TemplateGrid({
  templates: initialTemplates,
  isPaid,
  analysisId,
  analysisData,
}: TemplateGridProps) {
  const { isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [hasRefreshed, setHasRefreshed] = useState(false);
  // Mobile: toggle between editor and preview tabs
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("preview");
  const editingDataRef = useRef<any>(null);

  useEffect(() => {
    editingDataRef.current = editingData;
  }, [editingData]);
  useEffect(() => {
    setTemplates(initialTemplates);
  }, [initialTemplates]);

  useEffect(() => {
    if (searchParams.get("payment") === "success" && !hasRefreshed) {
      setHasRefreshed(true);
      router.refresh();
    }
  }, [searchParams, router, hasRefreshed]);

  const hasPaid = isPaid || searchParams.get("payment") === "success";

  const handleSelect = (id: string) => {
    const template = templates.find((t) => String(t.id) === String(id));
    if (!template) return;
    const data = JSON.parse(JSON.stringify(template.templateData || {}));
    if (!data.contact) data.contact = { email: "", phone: "", location: "" };
    data.headers = { ...DEFAULT_HEADERS, ...(data.headers || {}) };
    setSelectedTemplate(id);
    setEditingData(data);
    setSaveStatus("idle");
    setMobileTab("preview");
  };

  const persistEdits = async (data: any) => {
    try {
      const res = await fetch("/api/update-cv-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          templateId: selectedTemplate,
          optimizedData: data,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate || !editingData) return;
    setSaveStatus("saving");
    setTemplates((prev) =>
      prev.map((t) =>
        String(t.id) === String(selectedTemplate)
          ? { ...t, templateData: editingData }
          : t,
      ),
    );
    const ok = await persistEdits(editingData);
    setSaveStatus(ok ? "saved" : "error");
    if (ok) setTimeout(() => setSaveStatus("idle"), 2500);
  };

  const handleDownload = async (templateId: string) => {
    try {
      setIsGenerating(templateId);
      const currentData =
        selectedTemplate === templateId && editingDataRef.current
          ? editingDataRef.current
          : templates.find((t) => t.id === templateId)?.templateData;

      if (selectedTemplate === templateId && editingDataRef.current) {
        await persistEdits(currentData);
      }

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          analysisId,
          templateData: currentData,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erreur serveur");

      if (result.pdfBase64) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${result.pdfBase64}`;
        link.download = result.fileName || "CV.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(null);
    }
  };

  const update = (path: string, value: any) => {
    setEditingData((prev: any) => {
      const next = { ...prev };
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateArr = (
    section: string,
    idx: number,
    field: string,
    value: any,
  ) => {
    setEditingData((prev: any) => {
      const arr = [...(prev[section] || [])];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [section]: arr };
    });
  };

  const addArr = (section: string, item: object) =>
    setEditingData((prev: any) => ({
      ...prev,
      [section]: [...(prev[section] || []), { ...item }],
    }));

  const removeArr = (section: string, idx: number) =>
    setEditingData((prev: any) => ({
      ...prev,
      [section]: (prev[section] || []).filter((_: any, i: number) => i !== idx),
    }));

  const delContact = (key: string) =>
    setEditingData((prev: any) => {
      const c = { ...prev.contact };
      delete c[key];
      return { ...prev, contact: c };
    });

  const selectedTpl = templates.find(
    (t) => String(t.id) === String(selectedTemplate),
  );
  const hasLinkedin = editingData?.contact && "linkedin" in editingData.contact;
  const hasGithub = editingData?.contact && "github" in editingData.contact;
  const hasPortfolio =
    editingData?.contact && "portfolio" in editingData.contact;

  const addNextContact = () => {
    if (!hasLinkedin) {
      update("contact.linkedin", "");
      return;
    }
    if (!hasGithub) {
      update("contact.github", "");
      return;
    }
    if (!hasPortfolio) {
      update("contact.portfolio", "");
      return;
    }
  };

  // ── Editor panel content (shared between desktop and mobile) ──
  const EditorContent = () => (
    <div className="p-5 md:p-8 space-y-6 pb-32">
      <h3 className="text-lg font-black text-slate-900">Modifier le CV</h3>

      {/* Photo */}
      <div>
        <label className={labelCls}>Photo de profil</label>
        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          {editingData?.photoUrl ? (
            <div className="relative group">
              <img
                src={editingData.photoUrl}
                alt="Profil"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <button
                onClick={() => update("photoUrl", "")}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
              <Camera size={18} />
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="photo-upload"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const r = new FileReader();
                  r.onloadend = () => update("photoUrl", r.result);
                  r.readAsDataURL(f);
                }
              }}
            />
            <label
              htmlFor="photo-upload"
              className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors"
            >
              {editingData?.photoUrl ? "Changer" : "Ajouter une photo"}
            </label>
            <p className="text-[10px] text-slate-400 mt-1">PNG/JPG — Max 2MB</p>
          </div>
        </div>
      </div>

      {/* Identity */}
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Nom complet</label>
          <input
            className={inputCls}
            placeholder="Prénom Nom"
            value={editingData?.userName || ""}
            onChange={(e) => update("userName", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Poste visé</label>
          <input
            className={inputCls}
            placeholder="Développeur Full Stack"
            value={editingData?.jobTitle || ""}
            onChange={(e) => update("jobTitle", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Résumé / Profil</label>
          <textarea
            className={textareaCls}
            rows={4}
            placeholder="Résumé professionnel..."
            value={editingData?.summary || ""}
            onChange={(e) => update("summary", e.target.value)}
          />
        </div>
      </div>

      {/* Contact */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            Contact
          </span>
          {(!hasLinkedin || !hasGithub || !hasPortfolio) && (
            <button
              onClick={addNextContact}
              className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
            >
              <Plus size={11} /> Ajouter un lien
            </button>
          )}
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input
            className={inputCls}
            type="email"
            placeholder="email@exemple.com"
            value={editingData?.contact?.email || ""}
            onChange={(e) => update("contact.email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Téléphone</label>
          <input
            className={inputCls}
            placeholder="+33 6 00 00 00 00"
            value={editingData?.contact?.phone || ""}
            onChange={(e) => update("contact.phone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Localisation</label>
          <input
            className={inputCls}
            placeholder="Paris, France"
            value={editingData?.contact?.location || ""}
            onChange={(e) => update("contact.location", e.target.value)}
          />
        </div>
        {hasLinkedin && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={labelCls + " mb-0"}>LinkedIn</label>
              <button
                onClick={() => delContact("linkedin")}
                className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-0.5"
              >
                <Trash2 size={10} /> Supprimer
              </button>
            </div>
            <input
              className={inputCls}
              placeholder="linkedin.com/in/profil"
              value={editingData?.contact?.linkedin || ""}
              onChange={(e) => update("contact.linkedin", e.target.value)}
            />
          </div>
        )}
        {hasGithub && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={labelCls + " mb-0"}>GitHub</label>
              <button
                onClick={() => delContact("github")}
                className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-0.5"
              >
                <Trash2 size={10} /> Supprimer
              </button>
            </div>
            <input
              className={inputCls}
              placeholder="github.com/username"
              value={editingData?.contact?.github || ""}
              onChange={(e) => update("contact.github", e.target.value)}
            />
          </div>
        )}
        {hasPortfolio && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={labelCls + " mb-0"}>Portfolio</label>
              <button
                onClick={() => delContact("portfolio")}
                className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-0.5"
              >
                <Trash2 size={10} /> Supprimer
              </button>
            </div>
            <input
              className={inputCls}
              placeholder="https://portfolio.com"
              value={editingData?.contact?.portfolio || ""}
              onChange={(e) => update("contact.portfolio", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Experience */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            Expérience
          </span>
          <button
            onClick={() =>
              addArr("experience", {
                title: "",
                company: "",
                period: "",
                description: "",
              })
            }
            className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
          >
            <Plus size={11} /> Ajouter
          </button>
        </div>
        {(editingData?.experience || []).map((exp: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400">
                #{idx + 1}
              </span>
              <button
                onClick={() => removeArr("experience", idx)}
                className="text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <div>
              <label className={labelCls}>Poste</label>
              <input
                className={inputCls}
                placeholder="Développeur Full Stack"
                value={exp.title || ""}
                onChange={(e) =>
                  updateArr("experience", idx, "title", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelCls}>Entreprise</label>
              <input
                className={inputCls}
                placeholder="Entreprise SAS"
                value={exp.company || ""}
                onChange={(e) =>
                  updateArr("experience", idx, "company", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelCls}>Période</label>
              <input
                className={inputCls}
                placeholder="Jan 2023 – Déc 2024"
                value={exp.period || ""}
                onChange={(e) =>
                  updateArr("experience", idx, "period", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                className={textareaCls}
                rows={3}
                value={exp.description || ""}
                onChange={(e) =>
                  updateArr("experience", idx, "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            Formation
          </span>
          <button
            onClick={() =>
              addArr("education", {
                degree: "",
                school: "",
                year: "",
                details: "",
              })
            }
            className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
          >
            <Plus size={11} /> Ajouter
          </button>
        </div>
        {(editingData?.education || []).map((edu: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400">
                #{idx + 1}
              </span>
              <button
                onClick={() => removeArr("education", idx)}
                className="text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <div>
              <label className={labelCls}>Diplôme</label>
              <input
                className={inputCls}
                placeholder="Licence Informatique"
                value={edu.degree || ""}
                onChange={(e) =>
                  updateArr("education", idx, "degree", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelCls}>Établissement</label>
              <input
                className={inputCls}
                placeholder="Université Paris"
                value={edu.school || ""}
                onChange={(e) =>
                  updateArr("education", idx, "school", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelCls}>Année</label>
              <input
                className={inputCls}
                placeholder="2021–2024"
                value={edu.year || ""}
                onChange={(e) =>
                  updateArr("education", idx, "year", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelCls}>Détails (optionnel)</label>
              <input
                className={inputCls}
                placeholder="Mention Bien"
                value={edu.details || ""}
                onChange={(e) =>
                  updateArr("education", idx, "details", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            Compétences
          </span>
          <button
            onClick={() =>
              update("skills", [...(editingData?.skills || []), ""])
            }
            className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
          >
            <Plus size={11} /> Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 min-h-[48px]">
          {(editingData?.skills || []).map((skill: string, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-200"
            >
              <input
                value={skill}
                onChange={(e) => {
                  const arr = [...(editingData?.skills || [])];
                  arr[idx] = e.target.value;
                  update("skills", arr);
                }}
                className="text-sm font-medium outline-none w-20 bg-transparent"
              />
              <button
                onClick={() =>
                  update(
                    "skills",
                    (editingData?.skills || []).filter(
                      (_: any, i: number) => i !== idx,
                    ),
                  )
                }
                className="text-slate-300 hover:text-red-500 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            Langues
          </span>
          <button
            onClick={() => addArr("languages", { language: "", level: "" })}
            className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
          >
            <Plus size={11} /> Ajouter
          </button>
        </div>
        {(editingData?.languages || []).map((lang: any, idx: number) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              className={inputCls + " flex-1"}
              placeholder="Français"
              value={
                lang.language ||
                lang.name ||
                (typeof lang === "string" ? lang : "")
              }
              onChange={(e) => {
                const arr = [...(editingData?.languages || [])];
                arr[idx] =
                  typeof arr[idx] === "string"
                    ? e.target.value
                    : { ...arr[idx], language: e.target.value };
                update("languages", arr);
              }}
            />
            <input
              className={inputCls + " flex-1"}
              placeholder="Natif / B2"
              value={typeof lang === "string" ? "" : lang.level || ""}
              onChange={(e) => {
                const arr = [...(editingData?.languages || [])];
                arr[idx] = { ...arr[idx], level: e.target.value };
                update("languages", arr);
              }}
            />
            <button
              onClick={() => removeArr("languages", idx)}
              className="text-slate-300 hover:text-red-500 shrink-0"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            Projets
          </span>
          <button
            onClick={() =>
              addArr("projects", {
                name: "",
                technologies: [],
                description: "",
              })
            }
            className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
          >
            <Plus size={11} /> Ajouter
          </button>
        </div>
        {(editingData?.projects || []).map((proj: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400">
                #{idx + 1}
              </span>
              <button
                onClick={() => removeArr("projects", idx)}
                className="text-slate-300 hover:text-red-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <div>
              <label className={labelCls}>Nom</label>
              <input
                className={inputCls}
                placeholder="Nom du projet"
                value={proj.name || ""}
                onChange={(e) =>
                  updateArr("projects", idx, "name", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelCls}>Technologies</label>
              <input
                className={inputCls}
                placeholder="React, Node.js, PostgreSQL"
                value={
                  Array.isArray(proj.technologies)
                    ? proj.technologies.join(", ")
                    : proj.technologies || ""
                }
                onChange={(e) =>
                  updateArr(
                    "projects",
                    idx,
                    "technologies",
                    e.target.value.split(",").map((s: string) => s.trimStart()),
                  )
                }
              />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                className={textareaCls}
                rows={2}
                value={proj.description || ""}
                onChange={(e) =>
                  updateArr("projects", idx, "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-white/95 backdrop-blur-sm">
        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            saveStatus === "saved"
              ? "bg-emerald-600 text-white"
              : saveStatus === "error"
                ? "bg-red-500 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white"
          }`}
        >
          {saveStatus === "saving" && (
            <Loader2 size={16} className="animate-spin" />
          )}
          {saveStatus === "saved" && <CheckCircle2 size={16} />}
          {saveStatus === "error" && <AlertCircle size={16} />}
          {saveStatus === "idle" && <Save size={16} />}
          {saveStatus === "saving"
            ? "Enregistrement..."
            : saveStatus === "saved"
              ? "Enregistré !"
              : saveStatus === "error"
                ? "Erreur — réessayer"
                : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* ── Template Grid ─────────────────────────────────────────── */}
      {!selectedTemplate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelect(template.id)}
              className="group bg-white rounded-3xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Preview thumbnail */}
              <div
                className="relative bg-slate-50 overflow-hidden"
                style={{ height: 320 }}
              >
                <div
                  className={`absolute inset-0 flex justify-center items-start pt-6 ${!hasPaid ? "blur-sm" : ""}`}
                >
                  <div className="scale-[0.38] origin-top transform-gpu">
                    <CVRenderer
                      template={template}
                      isPaid={hasPaid}
                      analysisData={analysisData}
                    />
                  </div>
                </div>
                {!hasPaid && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
                      <Lock size={14} className="text-slate-400" />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                        Verrouillé
                      </span>
                    </div>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <span className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl flex items-center gap-2">
                    {hasPaid ? (
                      <>
                        <Pencil size={15} /> Éditer
                      </>
                    ) : (
                      <>
                        <Lock size={15} /> Débloquer
                      </>
                    )}
                  </span>
                </div>
              </div>
              {/* Footer */}
              <div className="p-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <p className="font-black text-slate-900">
                    {template.templateStyle}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    IA Optimisé
                  </p>
                </div>
                {hasPaid && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(template.id);
                    }}
                    disabled={isGenerating === template.id}
                    className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    {isGenerating === template.id ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Download size={15} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Editor Modal / Full screen ────────────────────────────── */}
      {selectedTemplate && selectedTpl && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              <div>
                <p className="font-black text-slate-900 text-sm">
                  Modèle {selectedTpl.templateStyle}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:block">
                  Éditeur de CV
                </p>
              </div>
            </div>

            {/* Desktop download */}
            <div className="hidden md:flex items-center gap-3">
              {hasPaid ? (
                <button
                  onClick={() => handleDownload(selectedTpl.id)}
                  disabled={!!isGenerating}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  {isGenerating ? "Génération..." : "Télécharger PDF"}
                </button>
              ) : (
                <button
                  onClick={() => setShowPaywall(true)}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-black text-sm"
                >
                  <Lock size={16} /> Débloquer
                </button>
              )}
            </div>

            {/* Mobile tab switcher */}
            <div className="flex md:hidden bg-slate-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setMobileTab("edit")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === "edit"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <Pencil size={12} /> Éditer
              </button>
              <button
                onClick={() => setMobileTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === "preview"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <Eye size={12} /> Aperçu
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* ── Editor panel ─────── */}
            {/* Desktop: always visible on left */}
            {/* Mobile: only when tab === 'edit' */}
            <div
              className={`
              w-full md:w-[400px] md:flex flex-col border-r border-slate-100 overflow-y-auto bg-white
              ${mobileTab === "edit" ? "flex" : "hidden md:flex"}
            `}
            >
              <EditorContent />
            </div>

            {/* ── Preview panel ────── */}
            <div
              className={`
              flex-1 overflow-auto bg-slate-100 flex flex-col
              ${mobileTab === "preview" ? "flex" : "hidden md:flex"}
            `}
            >
              {/* Mobile download bar */}
              <div className="md:hidden px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  Aperçu du CV
                </p>
                {hasPaid ? (
                  <button
                    onClick={() => handleDownload(selectedTpl.id)}
                    disabled={!!isGenerating}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Download size={13} />
                    )}
                    {isGenerating ? "En cours..." : "Télécharger"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPaywall(true)}
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-black text-xs"
                  >
                    <Lock size={13} /> Débloquer
                  </button>
                )}
              </div>

              {/* CV preview — scrollable, scaled */}
              <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
                <div
                  className={`relative bg-white shadow-2xl rounded-sm overflow-hidden ${!hasPaid ? "pointer-events-none" : ""}`}
                  style={{
                    width: "100%",
                    maxWidth: 794,
                    transform: "none",
                  }}
                >
                  {/* Scale wrapper for proper A4 preview */}
                  <div
                    style={{
                      transformOrigin: "top center",
                    }}
                  >
                    <CVRenderer
                      template={{ ...selectedTpl, templateData: editingData }}
                      isPaid={hasPaid}
                      analysisData={analysisData}
                    />
                  </div>
                  {!hasPaid && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-xs mx-4">
                        <Lock className="mx-auto mb-4 text-primary" size={40} />
                        <h3 className="text-lg font-black mb-2">
                          Aperçu verrouillé
                        </h3>
                        <p className="text-slate-500 text-sm mb-6">
                          Débloquez pour modifier et télécharger sans filigrane.
                        </p>
                        <button
                          onClick={() => setShowPaywall(true)}
                          className="w-full bg-primary text-white py-3 rounded-2xl font-black text-sm"
                        >
                          Débloquer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaywall && (
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          analysisId={analysisId}
        />
      )}
    </div>
  );
}
