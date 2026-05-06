'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import PaywallModal from './PaywallModal';
import {
  Lock, Loader2, Download, Sparkles, Edit3, X, Save,
  Plus, Trash2, AlertCircle, CheckCircle2, Camera,
} from 'lucide-react';
import CVRenderer from './CVRenderer';

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

// ── Shared input styles ────────────────────────────────────────────────────────
const inputCls = 'w-full p-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors bg-white';
const textareaCls = 'w-full p-3 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors resize-none bg-white';
const labelCls = 'text-[10px] font-black uppercase text-slate-400 mb-1 block';

// Default French section header labels
const DEFAULT_HEADERS: Record<string, string> = {
  summary: 'Profil',
  experience: 'Expérience',
  education: 'Formation',
  projects: 'Projets',
  skills: 'Compétences',
  languages: 'Langues',
  interests: 'Intérêts',
  contact: 'Contact',
  certifications: 'Certifications',
};

// ── Editable section header component ─────────────────────────────────────────
function SectionHeader({
  sectionKey,
  editingData,
  updateNestedData,
  onAdd,
  addLabel = '+ Ajouter',
}: {
  sectionKey: string;
  editingData: any;
  updateNestedData: (path: string, value: any) => void;
  onAdd?: () => void;
  addLabel?: string;
}) {
  const value = editingData?.headers?.[sectionKey] || DEFAULT_HEADERS[sectionKey] || sectionKey;
  return (
    <div className="flex items-center gap-2 mb-3">
      <input
        title="Cliquez pour modifier le titre de cette section"
        className="flex-1 text-[11px] font-black uppercase tracking-widest text-primary bg-primary/5
          border border-primary/20 rounded-lg px-3 py-1.5 outline-none focus:border-primary transition-colors"
        value={value}
        onChange={(e) => updateNestedData(`headers.${sectionKey}`, e.target.value)}
      />
      {onAdd && (
        <button
          onClick={onAdd}
          className="text-xs font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap shrink-0"
        >
          <Plus size={13} /> {addLabel}
        </button>
      )}
    </div>
  );
}

// ── Optional contact field (LinkedIn / GitHub / Portfolio) ────────────────────
function OptionalContactField({
  label,
  fieldKey,
  placeholder,
  editingData,
  updateNestedData,
  onDelete,
}: {
  label: string;
  fieldKey: string;
  placeholder: string;
  editingData: any;
  updateNestedData: (path: string, value: any) => void;
  onDelete: () => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className={labelCls}>{label}</label>
        <button onClick={onDelete} className="text-[10px] text-slate-300 hover:text-red-500 transition-colors flex items-center gap-1">
          <Trash2 size={11} /> Supprimer
        </button>
      </div>
      <input
        className={inputCls}
        placeholder={placeholder}
        value={editingData?.contact?.[fieldKey] || ''}
        onChange={(e) => updateNestedData(`contact.${fieldKey}`, e.target.value)}
      />
    </div>
  );
}

export default function TemplateGrid({
  templates: initialTemplates,
  isPaid,
  analysisId,
  analysisData,
}: TemplateGridProps) {
  const { isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("[TemplateGrid] Component Hydrated and Ready.");
  }, []);

  const [templates, setTemplates] = useState(initialTemplates);
  
  // Sync state if initialTemplates changes from server
  useEffect(() => {
    setTemplates(initialTemplates);
  }, [initialTemplates]);

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Ref always points to latest editingData so handleDownload reads current edits
  const editingDataRef = useRef<any>(null);
  useEffect(() => { editingDataRef.current = editingData; }, [editingData]);

  const hasPaid = isPaid || searchParams.get('payment') === 'success';


  const [hasRefreshed, setHasRefreshed] = useState(false);

  // Force refresh credits from DB when payment is successful (ONE TIME)
  useEffect(() => {
    if (searchParams.get('payment') === 'success' && !hasRefreshed) {
      console.log("[TemplateGrid] Payment success detected, refreshing data...");
      setHasRefreshed(true);
      router.refresh();
    }
  }, [searchParams, router, hasRefreshed]);

  const handleSelect = (id: string) => {
    console.log("[TemplateGrid] Selecting template:", id);
    const template = templates.find(t => String(t.id) === String(id));
    if (!template) {
      console.warn("[TemplateGrid] Template not found in state:", id, "Available IDs:", templates.map(t => t.id));
      return;
    }

    try {
      const data = JSON.parse(JSON.stringify(template.templateData || {}));
      console.log("[TemplateGrid] Template data loaded:", data);

      // Ensure required sub-objects exist
      if (!data.contact) data.contact = { email: '', phone: '', location: '' };
      data.headers = { ...DEFAULT_HEADERS, ...(data.headers || {}) };

      setSelectedTemplate(id);
      setEditingData(data);
      setSaveStatus('idle');
      console.log("[TemplateGrid] Modal state updated.");
    } catch (err) {
      console.error("[TemplateGrid] Error selecting template:", err);
    }
  };

  // ── Save edits to DB ────────────────────────────────────────────────────────
  const persistEdits = async (data: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/update-cv-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          analysisId, 
          templateId: selectedTemplate,
          optimizedData: data 
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedTemplate || !editingData) return;
    setSaveStatus('saving');

    setTemplates(prev =>
      prev.map(t => String(t.id) === String(selectedTemplate) ? { ...t, templateData: editingData } : t)
    );

    const ok = await persistEdits(editingData);
    if (ok) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } else {
      setSaveStatus('error');
    }
  };

  // ── Download — auto-saves edits first so print page gets latest data ────────
  // The print page reads from DB, so we must save before Puppeteer visits it.
  const handleDownload = async (templateId: string) => {
    try {
      setIsGenerating(templateId);

      const currentData =
        selectedTemplate === templateId && editingDataRef.current
          ? editingDataRef.current
          : templates.find(t => t.id === templateId)?.templateData;

      // Persist edits to DB before generating — the route.ts also does this
      // as a safety net, but doing it here first gives the DB time to commit.
      if (selectedTemplate === templateId && editingDataRef.current) {
        setTemplates(prev =>
          prev.map(t => t.id === templateId ? { ...t, templateData: currentData } : t)
        );
        await persistEdits(currentData);
      }

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, analysisId, templateData: currentData }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erreur serveur');

      if (result.pdfBase64) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${result.pdfBase64}`;
        link.download = result.fileName || 'CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsGenerating(null);
    }
  };

  // ── Generic deep-path state updater ───────────────────────────────────────
  const updateNestedData = (path: string, value: any) => {
    setEditingData((prev: any) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Delete a key from the contact object
  const deleteContactField = (fieldKey: string) => {
    setEditingData((prev: any) => {
      const contact = { ...prev.contact };
      delete contact[fieldKey];
      return { ...prev, contact };
    });
  };

  // ── Array helpers ──────────────────────────────────────────────────────────
  const updateArrayItem = (section: string, idx: number, field: string, value: any) => {
    setEditingData((prev: any) => {
      const arr = [...(prev[section] || [])];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [section]: arr };
    });
  };

  const addArrayItem = (section: string, template: object) => {
    setEditingData((prev: any) => ({
      ...prev,
      [section]: [...(prev[section] || []), { ...template }],
    }));
  };

  const removeArrayItem = (section: string, idx: number) => {
    setEditingData((prev: any) => ({
      ...prev,
      [section]: (prev[section] || []).filter((_: any, i: number) => i !== idx),
    }));
  };

  const selectedTemplateData = templates.find(t => String(t.id) === String(selectedTemplate));
  console.log("[TemplateGrid] Selected template data:", { selectedTemplate, found: !!selectedTemplateData });

  // Which optional contact fields are currently active
  const hasLinkedin = editingData?.contact && 'linkedin' in editingData.contact;
  const hasGithub = editingData?.contact && 'github' in editingData.contact;
  const hasPortfolio = editingData?.contact && 'portfolio' in editingData.contact;
  const canAddMore = !hasLinkedin || !hasGithub || !hasPortfolio;

  const addNextContactField = () => {
    if (!hasLinkedin) { updateNestedData('contact.linkedin', ''); return; }
    if (!hasGithub) { updateNestedData('contact.github', ''); return; }
    if (!hasPortfolio) { updateNestedData('contact.portfolio', ''); return; }
  };

  return (
    <div className="relative">

      {/* ── Template Grid ──────────────────────────────────────────────────── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transition-all duration-700
        ${selectedTemplate ? 'opacity-30 scale-95 blur-sm pointer-events-none' : ''}`}>
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={(e) => {
              e.preventDefault();
              console.log("[TemplateGrid] Main container clicked:", template.id);
              handleSelect(template.id);
            }}
            className="group relative bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden
              cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-[650px] shadow-sm"
          >
            <div className="flex-1 bg-gray-50/50 overflow-hidden relative">
              <div className={`absolute inset-0 flex justify-center items-start pt-10 ${!hasPaid ? 'blur-[4px]' : ''}`}>
                <div className="scale-[0.4] origin-top transform-gpu shadow-2xl transition-transform duration-500 group-hover:scale-[0.41]">
                  <CVRenderer template={template} isPaid={hasPaid} analysisData={analysisData} />
                </div>
              </div>
              {!hasPaid && (
                <div className="absolute inset-0 flex items-center justify-center z-[25] pointer-events-none">
                  <div className="rotate-45 text-[40px] font-black text-black/5 uppercase tracking-[1em] whitespace-nowrap select-none">
                    PROTÉGÉ • PROTÉGÉ • PROTÉGÉ
                  </div>
                </div>
              )}
            </div>
            <div 
              className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center z-20"
              onClick={(e) => {
                e.stopPropagation();
                console.log("[TemplateGrid] Overlay clicked:", template.id);
                handleSelect(template.id);
              }}
            >
              <span className="bg-white text-black px-8 py-4 rounded-full font-black opacity-0 group-hover:opacity-100
                transform translate-y-8 group-hover:translate-y-0 transition-all shadow-2xl flex items-center gap-3">
                {hasPaid ? <Sparkles className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-slate-400" />}
                {hasPaid ? 'Éditer le CV' : 'Débloquer ce Modèle'}
              </span>
            </div>
            <div className="p-8 bg-white border-t border-gray-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl text-gray-900 tracking-tight">{template.templateStyle}</span>
                  {!hasPaid && <Lock size={14} className="text-slate-300" />}
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">IA Optimisé</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Editor Modal ───────────────────────────────────────────────────── */}
      {selectedTemplate && selectedTemplateData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/60">
          <div className="bg-white w-full max-w-7xl h-full md:h-[95%] shadow-2xl rounded-[3rem] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500">

            {/* Header bar */}
            <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => { setSelectedTemplate(null); setIsEditing(false); }}
                  className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
                <span className="font-black text-2xl text-slate-900">Modèle {selectedTemplateData.templateStyle}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all
                    ${isEditing ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}
                >
                  <Edit3 size={18} />
                  {isEditing ? 'Fermer Éditeur' : 'Modifier le contenu'}
                </button>
                {!hasPaid ? (
                  <button
                    onClick={() => setShowPaywall(true)}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl"
                  >
                    <Lock size={18} /> Débloquer
                  </button>
                ) : (
                  <button
                    onClick={() => handleDownload(selectedTemplateData.id)}
                    disabled={!!isGenerating}
                    className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 disabled:opacity-50 transition-all"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                    {isGenerating ? 'Génération...' : 'Télécharger'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">

              {/* ── Editor Panel ───────────────────────────────────────────── */}
              <div className={`w-[450px] shrink-0 border-r border-slate-100 overflow-y-auto bg-slate-50/30
                transition-all duration-500 ${!isEditing ? '-ml-[450px] opacity-0' : 'ml-0 opacity-100'}`}>
                <div className="p-10 space-y-10 pb-36">
                  <h3 className="text-2xl font-black text-slate-900">Modifier le CV</h3>

                  {/* ── 1. Informations Générales + Résumé ──────────────── */}
                  <section className="space-y-3">
                    <SectionHeader sectionKey="summary" editingData={editingData} updateNestedData={updateNestedData} />
                    
                    {/* Photo Upload */}
                    <div>
                      <label className={labelCls}>Photo de profil</label>
                      <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        {editingData?.photoUrl ? (
                          <div className="relative group">
                            <img src={editingData.photoUrl} alt="Profil" className="w-20 h-20 rounded-xl object-cover" />
                            <button 
                              onClick={() => updateNestedData('photoUrl', '')}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <Camera size={20} />
                            <span className="text-[10px] font-bold mt-1">Photo</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            id="photo-upload" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => updateNestedData('photoUrl', reader.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label 
                            htmlFor="photo-upload" 
                            className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors"
                          >
                            {editingData?.photoUrl ? 'Changer la photo' : 'Télécharger une photo'}
                          </label>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">PNG, JPG ou JPEG (Max 2MB)</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Nom complet</label>
                      <input className={inputCls} placeholder="Nom Complet"
                        value={editingData?.userName || ''}
                        onChange={(e) => updateNestedData('userName', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Poste visé</label>
                      <input className={inputCls} placeholder="Développeur Web Full Stack"
                        value={editingData?.jobTitle || ''}
                        onChange={(e) => updateNestedData('jobTitle', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Résumé / Profil</label>
                      <textarea className={textareaCls} rows={5} placeholder="Résumé professionnel..."
                        value={editingData?.summary || ''}
                        onChange={(e) => updateNestedData('summary', e.target.value)} />
                    </div>
                  </section>

                  {/* ── 2. Contact ──────────────────────────────────────── */}
                  <section className="space-y-3 border-t pt-8">
                    <SectionHeader
                      sectionKey="contact"
                      editingData={editingData}
                      updateNestedData={updateNestedData}
                      onAdd={canAddMore ? addNextContactField : undefined}
                      addLabel="+ Champ"
                    />
                    {/* Always-visible core fields */}
                    <div>
                      <label className={labelCls}>Email</label>
                      <input className={inputCls} type="email" placeholder="exemple@email.com"
                        value={editingData?.contact?.email || ''}
                        onChange={(e) => updateNestedData('contact.email', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Téléphone</label>
                      <input className={inputCls} placeholder="+33 6 00 00 00 00"
                        value={editingData?.contact?.phone || ''}
                        onChange={(e) => updateNestedData('contact.phone', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Localisation</label>
                      <input className={inputCls} placeholder="Paris, France"
                        value={editingData?.contact?.location || ''}
                        onChange={(e) => updateNestedData('contact.location', e.target.value)} />
                    </div>
                    {/* Optional deletable fields */}
                    {hasLinkedin && (
                      <OptionalContactField
                        label="LinkedIn"
                        fieldKey="linkedin"
                        placeholder="linkedin.com/in/votre-profil"
                        editingData={editingData}
                        updateNestedData={updateNestedData}
                        onDelete={() => deleteContactField('linkedin')}
                      />
                    )}
                    {hasGithub && (
                      <OptionalContactField
                        label="GitHub"
                        fieldKey="github"
                        placeholder="github.com/votre-username"
                        editingData={editingData}
                        updateNestedData={updateNestedData}
                        onDelete={() => deleteContactField('github')}
                      />
                    )}
                    {hasPortfolio && (
                      <OptionalContactField
                        label="Portfolio / Site web"
                        fieldKey="portfolio"
                        placeholder="https://votre-portfolio.com"
                        editingData={editingData}
                        updateNestedData={updateNestedData}
                        onDelete={() => deleteContactField('portfolio')}
                      />
                    )}
                  </section>

                  {/* ── 3. Expérience ───────────────────────────────────── */}
                  <section className="space-y-4 border-t pt-8">
                    <SectionHeader
                      sectionKey="experience"
                      editingData={editingData}
                      updateNestedData={updateNestedData}
                      onAdd={() => addArrayItem('experience', { title: '', company: '', period: '', description: '' })}
                    />
                    {(editingData?.experience || []).map((exp: any, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-400">Expérience {idx + 1}</span>
                          <button onClick={() => removeArrayItem('experience', idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <div><label className={labelCls}>Titre du poste</label>
                          <input className={inputCls} placeholder="Ex: Développeur Full Stack" value={exp.title || ''} onChange={(e) => updateArrayItem('experience', idx, 'title', e.target.value)} /></div>
                        <div><label className={labelCls}>Entreprise</label>
                          <input className={inputCls} placeholder="Ex: ICV Informatique" value={exp.company || ''} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} /></div>
                        <div><label className={labelCls}>Période</label>
                          <input className={inputCls} placeholder="Ex: Janvier 2025 – Avril 2025" value={exp.period || ''} onChange={(e) => updateArrayItem('experience', idx, 'period', e.target.value)} /></div>
                        <div><label className={labelCls}>Description</label>
                          <textarea className={textareaCls} rows={3} placeholder="Description des responsabilités..." value={exp.description || ''} onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value)} /></div>
                      </div>
                    ))}
                  </section>

                  {/* ── 4. Formation ────────────────────────────────────── */}
                  <section className="space-y-4 border-t pt-8">
                    <SectionHeader
                      sectionKey="education"
                      editingData={editingData}
                      updateNestedData={updateNestedData}
                      onAdd={() => addArrayItem('education', { degree: '', school: '', year: '', details: '' })}
                    />
                    {(editingData?.education || []).map((edu: any, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-400">Formation {idx + 1}</span>
                          <button onClick={() => removeArrayItem('education', idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <div><label className={labelCls}>Diplôme / Titre</label>
                          <input className={inputCls} placeholder="Ex: Licence Informatique" value={edu.degree || ''} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} /></div>
                        <div><label className={labelCls}>Établissement</label>
                          <input className={inputCls} placeholder="Ex: Université Paris-Saclay" value={edu.school || ''} onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)} /></div>
                        <div><label className={labelCls}>Année</label>
                          <input className={inputCls} placeholder="Ex: 2023-2024" value={edu.year || ''} onChange={(e) => updateArrayItem('education', idx, 'year', e.target.value)} /></div>
                        <div><label className={labelCls}>Détails (optionnel)</label>
                          <input className={inputCls} placeholder="Ex: Mention Bien" value={edu.details || ''} onChange={(e) => updateArrayItem('education', idx, 'details', e.target.value)} /></div>
                      </div>
                    ))}
                  </section>

                  {/* ── 5. Projets ──────────────────────────────────────── */}
                  <section className="space-y-4 border-t pt-8">
                    <SectionHeader
                      sectionKey="projects"
                      editingData={editingData}
                      updateNestedData={updateNestedData}
                      onAdd={() => addArrayItem('projects', { name: '', technologies: [], description: '' })}
                    />
                    {(editingData?.projects || []).map((proj: any, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-400">Projet {idx + 1}</span>
                          <button onClick={() => removeArrayItem('projects', idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <div><label className={labelCls}>Nom du projet</label>
                          <input className={inputCls} placeholder="Ex: School Management Website" value={proj.name || ''} onChange={(e) => updateArrayItem('projects', idx, 'name', e.target.value)} /></div>
                        <div><label className={labelCls}>Technologies (séparées par virgules)</label>
                          <input className={inputCls} placeholder="Ex: JavaScript, React, Bootstrap"
                            value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '')}
                            onChange={(e) => {
                              const arr = e.target.value.split(',').map((s: string) => s.trimStart());
                              updateArrayItem('projects', idx, 'technologies', arr);
                            }} /></div>
                        <div><label className={labelCls}>Description</label>
                          <textarea className={textareaCls} rows={2} placeholder="Description du projet..." value={proj.description || ''} onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value)} /></div>
                      </div>
                    ))}
                  </section>

                  {/* ── 6. Compétences ──────────────────────────────────── */}
                  <section className="space-y-3 border-t pt-8">
                    <SectionHeader
                      sectionKey="skills"
                      editingData={editingData}
                      updateNestedData={updateNestedData}
                      onAdd={() => updateNestedData('skills', [...(editingData?.skills || []), ''])}
                    />
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      {(editingData?.skills || []).map((skill: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
                          <input value={skill}
                            onChange={(e) => {
                              const arr = [...(editingData?.skills || [])];
                              arr[idx] = e.target.value;
                              updateNestedData('skills', arr);
                            }}
                            className="text-sm font-medium outline-none w-20 bg-transparent" />
                          <button onClick={() => updateNestedData('skills', (editingData?.skills || []).filter((_: any, i: number) => i !== idx))}
                            className="text-slate-300 hover:text-red-500 transition-colors"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ── 7. Langues ──────────────────────────────────────── */}
                  <section className="space-y-4 border-t pt-8">
                    <SectionHeader
                      sectionKey="languages"
                      editingData={editingData}
                      updateNestedData={updateNestedData}
                      onAdd={() => addArrayItem('languages', { language: '', level: '' })}
                    />
                    {(editingData?.languages || []).map((lang: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input className={`${inputCls} flex-1`} placeholder="Langue"
                          value={lang.language || lang.name || (typeof lang === 'string' ? lang : '')}
                          onChange={(e) => {
                            const arr = [...(editingData?.languages || [])];
                            arr[idx] = typeof arr[idx] === 'string' ? e.target.value : { ...arr[idx], language: e.target.value };
                            updateNestedData('languages', arr);
                          }} />
                        <input className={`${inputCls} flex-1`} placeholder="Niveau"
                          value={typeof lang === 'string' ? '' : (lang.level || '')}
                          onChange={(e) => {
                            const arr = [...(editingData?.languages || [])];
                            arr[idx] = { ...arr[idx], level: e.target.value };
                            updateNestedData('languages', arr);
                          }} />
                        <button onClick={() => removeArrayItem('languages', idx)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </section>

                  {/* ── 8. Intérêts (if present) ────────────────────────── */}
                  {(editingData?.interests?.length > 0) && (
                    <section className="space-y-3 border-t pt-8">
                      <SectionHeader
                        sectionKey="interests"
                        editingData={editingData}
                        updateNestedData={updateNestedData}
                        onAdd={() => updateNestedData('interests', [...(editingData?.interests || []), ''])}
                      />
                      <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        {(editingData?.interests || []).map((interest: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
                            <input value={interest}
                              onChange={(e) => {
                                const arr = [...(editingData?.interests || [])];
                                arr[idx] = e.target.value;
                                updateNestedData('interests', arr);
                              }}
                              className="text-sm font-medium outline-none w-24 bg-transparent" />
                            <button onClick={() => updateNestedData('interests', (editingData?.interests || []).filter((_: any, i: number) => i !== idx))}
                              className="text-slate-300 hover:text-red-500 transition-colors"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ── Save button ─────────────────────────────────────── */}
                  <div className="sticky bottom-0 pt-4 pb-2 bg-slate-50/90 backdrop-blur-sm">
                    <button
                      onClick={handleSaveEdit}
                      disabled={saveStatus === 'saving'}
                      className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all
                        shadow-2xl flex items-center justify-center gap-3 ${saveStatus === 'saved' ? 'bg-emerald-600 text-white' :
                          saveStatus === 'error' ? 'bg-red-500 text-white' :
                            'bg-slate-900 text-white hover:scale-[1.02]'
                        }`}
                    >
                      {saveStatus === 'saving' && <Loader2 size={18} className="animate-spin" />}
                      {saveStatus === 'saved' && <CheckCircle2 size={18} />}
                      {saveStatus === 'error' && <AlertCircle size={18} />}
                      {saveStatus === 'idle' && <Save size={18} />}
                      {saveStatus === 'saving' ? 'Enregistrement...'
                        : saveStatus === 'saved' ? 'Enregistré !'
                          : saveStatus === 'error' ? 'Erreur — réessayer'
                            : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Live Preview ────────────────────────────────────────── */}
              <div className="flex-1 overflow-auto bg-slate-100/30 p-12 flex justify-center relative">
                <div className={`relative bg-white shadow-2xl h-fit ${!hasPaid ? 'blur-md pointer-events-none' : ''}`}>
                  <CVRenderer
                    template={{ ...selectedTemplateData, templateData: editingData }}
                    isPaid={hasPaid}
                    analysisData={analysisData}
                  />
                </div>
                {!hasPaid && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px] z-50">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-sm">
                      <Lock className="mx-auto mb-6 text-primary" size={48} />
                      <h3 className="text-2xl font-black mb-2">Aperçu Verrouillé</h3>
                      <p className="text-slate-500 mb-8">Débloquez ce modèle pour modifier et télécharger sans filigrane.</p>
                      <button onClick={() => setShowPaywall(true)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Débloquer</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaywall && (
        <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} analysisId={analysisId} />
      )}
    </div>
  );
}