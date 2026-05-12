"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import PaywallModal from "./PaywallModal";
import {
  Lock,
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
import OuiCVLoader from "../common/OuiCVLoader";

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

// ── Shared styles & constants ──────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all";
const textareaCls =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all resize-none";
const labelCls =
  "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block";

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

const sectionColors: Record<string, string> = {
  identity: "bg-white",
  summary: "bg-emerald-50/30",
  contact: "bg-slate-50/30",
  experience: "bg-emerald-50/20",
  education: "bg-slate-50/50",
  skills: "bg-emerald-50/30",
  languages: "bg-slate-50/30",
  projects: "bg-emerald-50/20",
};

// ── Sub-components (outside to prevent focus loss) ───────────────────────────

interface SectionHeaderProps {
  sectionKey: string;
  editingData: any;
  update: (path: string, value: any) => void;
  onAdd?: () => void;
  addLabel?: string;
  confirmingDelete: string | null;
  setConfirmingDelete: (val: string | null) => void;
  deleteSection: (key: string) => void;
}

const SectionHeader = ({
  sectionKey,
  editingData,
  update,
  onAdd,
  addLabel = "Ajouter",
  confirmingDelete,
  setConfirmingDelete,
  deleteSection
}: SectionHeaderProps) => {
  const val = editingData?.headers?.[sectionKey] ?? DEFAULT_HEADERS[sectionKey] ?? sectionKey;
  const isConfirming = confirmingDelete === sectionKey;
  
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1 group/header">
        <input
          className="w-full text-xs font-black uppercase tracking-widest text-slate-800 bg-white/50
            border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
          value={val}
          onChange={(e) => update(`headers.${sectionKey}`, e.target.value)}
          placeholder={DEFAULT_HEADERS[sectionKey]}
        />
        {isConfirming && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 animate-in slide-in-from-left-2 z-20 translate-x-full pl-2">
             <button 
              onClick={() => deleteSection(sectionKey)}
              className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg hover:bg-red-600 whitespace-nowrap"
             >
               Confirmer ?
             </button>
             <button 
              onClick={() => setConfirmingDelete(null)}
              className="bg-slate-100 text-slate-400 p-1 rounded-lg hover:bg-slate-200"
             >
               <X size={12} />
             </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {!onAdd && !isConfirming && (
          <button
            onClick={() => setConfirmingDelete(sectionKey)}
            className="p-2 text-slate-300 hover:text-red-500 transition-all"
            title="Supprimer la section"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
        {onAdd && (
          <div className="flex items-center gap-2">
            {!isConfirming && (
              <button
                onClick={() => setConfirmingDelete(sectionKey)}
                className="p-2 text-slate-300 hover:text-red-500 transition-all"
                title="Supprimer la section"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onAdd}
              className="px-3 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-primary/20 transition-all flex items-center gap-1 shrink-0"
            >
              <Plus size={12} /> {addLabel}
            </button>
          </div>
        )}
      </div>
  );
};

interface EditorContentProps {
  editingData: any;
  update: (path: string, value: any) => void;
  updateArr: (section: string, idx: number, field: string, value: any) => void;
  addArr: (section: string, item: object) => void;
  removeArr: (section: string, idx: number) => void;
  delContact: (key: string) => void;
  hasLinkedin: boolean;
  hasGithub: boolean;
  hasPortfolio: boolean;
  addNextContact: () => void;
  addCustomSection: (name: string) => void;
  handleSave: () => void;
  saveStatus: string;
  confirmingDelete: string | null;
  setConfirmingDelete: (val: string | null) => void;
  deleteSection: (key: string) => void;
  newSectionName: string;
  setNewSectionName: (val: string) => void;
}

const EditorContent = ({
  editingData,
  update,
  updateArr,
  addArr,
  removeArr,
  delContact,
  hasLinkedin,
  hasGithub,
  hasPortfolio,
  addNextContact,
  addCustomSection,
  handleSave,
  saveStatus,
  confirmingDelete,
  setConfirmingDelete,
  deleteSection,
  newSectionName,
  setNewSectionName
}: EditorContentProps) => (
  <div className="pb-32">
    <div className="p-6 md:p-8 bg-white border-b border-slate-100">
      <h3 className="text-xl font-black text-slate-900">Modifier le CV</h3>
      <p className="text-xs text-slate-400 font-medium mt-1">Personnalisez chaque section en temps réel.</p>
    </div>

    <div className="space-y-1">
      {/* Identity */}
      <div className={`p-6 md:p-8 ${sectionColors.identity}`}>
        <label className={labelCls}>Photo de profil</label>
        <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
          {editingData?.photoUrl ? (
            <div className="relative group">
              <img
                src={editingData.photoUrl}
                alt="Profil"
                className="w-20 h-20 rounded-xl object-cover"
              />
              <button
                onClick={() => update("photoUrl", "")}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg transition-transform hover:scale-110"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
              <Camera size={24} />
            </div>
          )}
          <div className="flex-1">
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
              className="inline-block px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black cursor-pointer hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
            >
              {editingData?.photoUrl ? "Changer" : "Ajouter une photo"}
            </label>
            <p className="text-[10px] text-slate-400 mt-2 font-medium italic">PNG, JPG — Max 2MB</p>
          </div>
        </div>

        <div className="space-y-4">
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
        </div>
      </div>

      {editingData?.headers?.summary !== undefined && (
        <div className={`p-6 md:p-8 border-t border-slate-100 ${sectionColors.summary}`}>
          <SectionHeader 
            sectionKey="summary" 
            editingData={editingData} 
            update={update} 
            confirmingDelete={confirmingDelete} 
            setConfirmingDelete={setConfirmingDelete} 
            deleteSection={deleteSection} 
          />
          <textarea
            className={textareaCls}
            rows={5}
            placeholder="Décrivez votre parcours et vos objectifs..."
            value={editingData?.summary || ""}
            onChange={(e) => update("summary", e.target.value)}
          />
        </div>
      )}

      {editingData?.headers?.contact !== undefined && (
        <div className={`p-6 md:p-8 border-t border-slate-100 ${sectionColors.contact}`}>
          <SectionHeader 
            sectionKey="contact" 
            onAdd={(!hasLinkedin || !hasGithub || !hasPortfolio) ? addNextContact : undefined}
            addLabel="Lien"
            editingData={editingData}
            update={update}
            confirmingDelete={confirmingDelete}
            setConfirmingDelete={setConfirmingDelete}
            deleteSection={deleteSection}
          />
          <div className="grid grid-cols-1 gap-4">
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
              <div className="group/field relative">
                <label className={labelCls}>LinkedIn</label>
                <input
                  className={inputCls}
                  placeholder="linkedin.com/in/profil"
                  value={editingData?.contact?.linkedin || ""}
                  onChange={(e) => update("contact.linkedin", e.target.value)}
                />
                <button
                  onClick={() => delContact("linkedin")}
                  className="absolute right-3 top-9 p-1 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            {hasGithub && (
              <div className="group/field relative">
                <label className={labelCls}>GitHub</label>
                <input
                  className={inputCls}
                  placeholder="github.com/username"
                  value={editingData?.contact?.github || ""}
                  onChange={(e) => update("contact.github", e.target.value)}
                />
                <button
                  onClick={() => delContact("github")}
                  className="absolute right-3 top-9 p-1 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            {hasPortfolio && (
              <div className="group/field relative">
                <label className={labelCls}>Portfolio</label>
                <input
                  className={inputCls}
                  placeholder="https://portfolio.com"
                  value={editingData?.contact?.portfolio || ""}
                  onChange={(e) => update("contact.portfolio", e.target.value)}
                />
                <button
                  onClick={() => delContact("portfolio")}
                  className="absolute right-3 top-9 p-1 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {editingData?.headers?.experience !== undefined && (
        <div className={`p-6 md:p-8 border-t border-slate-100 ${sectionColors.experience}`}>
          <SectionHeader
            sectionKey="experience"
            onAdd={() => addArr("experience", { title: "", company: "", period: "", description: "" })}
            editingData={editingData}
            update={update}
            confirmingDelete={confirmingDelete}
            setConfirmingDelete={setConfirmingDelete}
            deleteSection={deleteSection}
          />
          <div className="space-y-4">
            {(editingData?.experience || []).map((exp: any, idx: number) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm relative group/item">
                <button
                  onClick={() => removeArr("experience", idx)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelCls}>Poste</label>
                    <input className={inputCls} value={exp.title || ""} onChange={(e) => updateArr("experience", idx, "title", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Entreprise</label>
                    <input className={inputCls} value={exp.company || ""} onChange={(e) => updateArr("experience", idx, "company", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Période</label>
                    <input className={inputCls} value={exp.period || ""} onChange={(e) => updateArr("experience", idx, "period", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Missions & Réalisations</label>
                  <textarea className={textareaCls} rows={4} value={exp.description || ""} onChange={(e) => updateArr("experience", idx, "description", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingData?.headers?.education !== undefined && (
        <div className={`p-6 md:p-8 border-t border-slate-100 ${sectionColors.education}`}>
          <SectionHeader
            sectionKey="education"
            onAdd={() => addArr("education", { degree: "", school: "", year: "", details: "" })}
            editingData={editingData}
            update={update}
            confirmingDelete={confirmingDelete}
            setConfirmingDelete={setConfirmingDelete}
            deleteSection={deleteSection}
          />
          <div className="space-y-4">
            {(editingData?.education || []).map((edu: any, idx: number) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm relative">
                <button onClick={() => removeArr("education", idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div>
                  <label className={labelCls}>Diplôme / Formation</label>
                  <input className={inputCls} value={edu.degree || ""} onChange={(e) => updateArr("education", idx, "degree", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className={labelCls}>Établissement</label>
                    <input className={inputCls} value={edu.school || ""} onChange={(e) => updateArr("education", idx, "school", e.target.value)} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className={labelCls}>Année / Période</label>
                    <input className={inputCls} value={edu.year || ""} onChange={(e) => updateArr("education", idx, "year", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingData?.headers?.skills !== undefined && (
        <div className={`p-6 md:p-8 border-t border-slate-100 ${sectionColors.skills}`}>
          <SectionHeader
            sectionKey="skills"
            onAdd={() => update("skills", [...(editingData?.skills || []), ""])}
            editingData={editingData}
            update={update}
            confirmingDelete={confirmingDelete}
            setConfirmingDelete={setConfirmingDelete}
            deleteSection={deleteSection}
          />
          <div className="flex flex-wrap gap-2.5 p-4 bg-white/50 rounded-2xl border border-slate-200 min-h-[60px]">
            {(editingData?.skills || []).map((skill: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-200 group/skill">
                <input
                  value={skill}
                  onChange={(e) => {
                    const arr = [...(editingData?.skills || [])];
                    arr[idx] = e.target.value;
                    update("skills", arr);
                  }}
                  className="text-sm font-bold outline-none w-24 bg-transparent text-slate-700"
                />
                <button
                  onClick={() => update("skills", (editingData?.skills || []).filter((_: any, i: number) => i !== idx))}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingData?.headers?.languages !== undefined && (
        <div className={`p-6 md:p-8 border-t border-slate-100 ${sectionColors.languages}`}>
          <SectionHeader
            sectionKey="languages"
            onAdd={() => addArr("languages", { language: "", level: "" })}
            editingData={editingData}
            update={update}
            confirmingDelete={confirmingDelete}
            setConfirmingDelete={setConfirmingDelete}
            deleteSection={deleteSection}
          />
          <div className="space-y-3">
            {(editingData?.languages || []).map((lang: any, idx: number) => (
              <div key={idx} className="flex gap-3 items-center group/lang">
                <input className={`${inputCls} flex-1 shadow-sm`} placeholder="Langue" value={lang.language || lang.name || ""} onChange={(e) => {
                  const arr = [...(editingData?.languages || [])];
                  arr[idx] = { ...arr[idx], language: e.target.value };
                  update("languages", arr);
                }} />
                <input className={`${inputCls} flex-1 shadow-sm`} placeholder="Niveau" value={lang.level || ""} onChange={(e) => {
                  const arr = [...(editingData?.languages || [])];
                  arr[idx] = { ...arr[idx], level: e.target.value };
                  update("languages", arr);
                }} />
                <button onClick={() => removeArr("languages", idx)} className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingData?.headers?.projects !== undefined && (
        <div className={`p-6 md:p-8 border-t border-slate-100 ${sectionColors.projects}`}>
          <SectionHeader
            sectionKey="projects"
            onAdd={() => addArr("projects", { name: "", technologies: [], description: "" })}
            editingData={editingData}
            update={update}
            confirmingDelete={confirmingDelete}
            setConfirmingDelete={setConfirmingDelete}
            deleteSection={deleteSection}
          />
          <div className="space-y-5">
            {(editingData?.projects || []).map((proj: any, idx: number) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm relative">
                <button onClick={() => removeArr("projects", idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                <div>
                  <label className={labelCls}>Nom du Projet</label>
                  <input className={inputCls} value={proj.name || ""} onChange={(e) => updateArr("projects", idx, "name", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Technologies</label>
                  <input className={inputCls} placeholder="Ex: React, Tailwind, Supabase" value={Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies || ""} onChange={(e) => updateArr("projects", idx, "technologies", e.target.value.split(",").map(s => s.trimStart()))} />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea className={textareaCls} rows={3} value={proj.description || ""} onChange={(e) => updateArr("projects", idx, "description", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {Object.keys(editingData?.headers || {}).filter(k => !DEFAULT_HEADERS[k] && k !== 'photoUrl' && k !== 'userName' && k !== 'jobTitle').map(key => (
        <div key={key} className={`p-6 md:p-8 border-t border-slate-100 bg-slate-50/20`}>
          <SectionHeader
            sectionKey={key}
            onAdd={Array.isArray(editingData[key]) ? () => update(key, [...(editingData[key] || []), ""]) : undefined}
            editingData={editingData}
            update={update}
            confirmingDelete={confirmingDelete}
            setConfirmingDelete={setConfirmingDelete}
            deleteSection={deleteSection}
          />
          {Array.isArray(editingData[key]) ? (
            <div className="flex flex-wrap gap-2.5 p-4 bg-white/50 rounded-2xl border border-slate-200">
               {editingData[key].map((item: string, idx: number) => (
                 <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-200">
                    <input
                      value={item}
                      onChange={(e) => {
                        const arr = [...editingData[key]];
                        arr[idx] = e.target.value;
                        update(key, arr);
                      }}
                      className="text-sm font-medium outline-none w-24 bg-transparent"
                    />
                    <button
                      onClick={() => update(key, editingData[key].filter((_: any, i: number) => i !== idx))}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                 </div>
               ))}
            </div>
          ) : (
            <textarea
              className={textareaCls}
              rows={4}
              value={editingData[key] || ""}
              onChange={(e) => update(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>

    {/* Footer actions */}
    <div className="sticky bottom-0 pt-4 pb-2 bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col gap-2">
         <div className="w-full flex flex-col gap-2 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
           <div className="flex items-center gap-2">
             <Plus size={14} className="text-slate-400" />
             <input 
               placeholder="Nom de la section (ex: Loisirs)" 
               className="bg-transparent text-xs font-black uppercase tracking-widest outline-none flex-1 text-slate-700"
               value={newSectionName}
               onChange={(e) => setNewSectionName(e.target.value)}
             />
             <button 
               onClick={() => {
                 if (newSectionName) {
                   addCustomSection(newSectionName);
                   setNewSectionName("");
                 }
               }}
               className="bg-primary text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase"
             >
               Ajouter
             </button>
           </div>
         </div>

         <button
           onClick={handleSave}
           disabled={saveStatus === "saving"}
           className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
             saveStatus === "saved"
               ? "bg-emerald-600 text-white"
               : saveStatus === "error"
                 ? "bg-red-500 text-white"
                 : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-lg shadow-emerald-500/20"
           }`}
         >
           {saveStatus === "saving" && (
             <OuiCVLoader size="sm" className="opacity-80" />
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
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [newSectionName, setNewSectionName] = useState("");

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
    setMobileView("edit");
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

  const updateArr = (section: string, idx: number, field: string, value: any) => {
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

  const deleteSection = (key: string) => {
    setEditingData((prev: any) => {
      const next = { ...prev };
      delete next[key];
      if (next.headers) {
        const nextHeaders = { ...next.headers };
        delete nextHeaders[key];
        next.headers = nextHeaders;
      }
      return next;
    });
    setConfirmingDelete(null);
  };

  const addCustomSection = (sectionName: string) => {
    if (!sectionName) return;
    const key = sectionName.toLowerCase().replace(/\s+/g, '_');
    setEditingData((prev: any) => ({
      ...prev,
      headers: { ...prev.headers, [key]: sectionName },
      [key]: [] 
    }));
  };

  const selectedTpl = templates.find((t) => String(t.id) === String(selectedTemplate));
  const hasLinkedin = editingData?.contact && "linkedin" in editingData.contact;
  const hasGithub = editingData?.contact && "github" in editingData.contact;
  const hasPortfolio = editingData?.contact && "portfolio" in editingData.contact;

  const addNextContact = () => {
    if (!hasLinkedin) { update("contact.linkedin", ""); return; }
    if (!hasGithub) { update("contact.github", ""); return; }
    if (!hasPortfolio) { update("contact.portfolio", ""); return; }
  };

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
              <div className="relative bg-slate-50 overflow-hidden" style={{ height: 320 }}>
                <div className={`absolute inset-0 flex justify-center items-start pt-6 ${!hasPaid ? "blur-sm" : ""}`}>
                  <div className="scale-[0.38] origin-top transform-gpu">
                    <CVRenderer template={template} isPaid={hasPaid} analysisData={analysisData} />
                  </div>
                </div>
                {!hasPaid && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
                      <Lock size={14} className="text-slate-400" />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Verrouillé</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <span className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl flex items-center gap-2">
                    {hasPaid ? <><Pencil size={15} /> Éditer</> : <><Lock size={15} /> Débloquer</>}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <p className="font-black text-slate-900">{template.templateStyle}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">IA Optimisé</p>
                </div>
                {hasPaid && (
                  <button onClick={(e) => { e.stopPropagation(); handleDownload(template.id); }} disabled={isGenerating === template.id} className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition-colors">
                    {isGenerating === template.id ? <OuiCVLoader size="sm" /> : <Download size={15} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Editor Modal ────────────────────────────────────────────── */}
      {selectedTemplate && selectedTpl && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedTemplate(null)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              <div>
                <p className="font-black text-slate-900 text-sm">Modèle {selectedTpl.templateStyle}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:block">Éditeur de CV</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              {hasPaid ? (
                <button 
                  onClick={() => handleDownload(selectedTpl.id)} 
                  disabled={!!isGenerating} 
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 active:scale-95"
                >
                  {isGenerating ? <OuiCVLoader size="sm" /> : <Download size={16} />}
                  {isGenerating ? "" : "Télécharger PDF"}
                </button>
              ) : (
                <button onClick={() => setShowPaywall(true)} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all hover:brightness-110 active:scale-95">
                  <Lock size={16} /> Débloquer
                </button>
              )}
            </div>

            <div className="flex sm:hidden items-center gap-1 bg-slate-100 p-1 rounded-xl">
               <button onClick={() => setMobileView("edit")} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mobileView === "edit" ? "bg-white text-primary shadow-sm" : "text-slate-400"}`}>
                 <Pencil size={12} /> Éditer
               </button>
               <button onClick={() => setMobileView("preview")} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mobileView === "preview" ? "bg-white text-primary shadow-sm" : "text-slate-400"}`}>
                 <Eye size={12} /> Aperçu
               </button>
            </div>

            <div className="flex sm:hidden">
               {hasPaid ? (
                 <button onClick={() => handleDownload(selectedTpl.id)} className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-90 transition-all text-white rounded-xl flex items-center justify-center"><Download size={18} /></button>
               ) : (
                 <button onClick={() => setShowPaywall(true)} className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-all"><Lock size={18} /></button>
               )}
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
            <div className={`w-full md:w-[480px] flex flex-col border-r border-slate-200 overflow-y-auto bg-white shrink-0 shadow-xl z-10 ${mobileView === "preview" ? "hidden md:flex" : "flex"}`}>
              <EditorContent 
                editingData={editingData}
                update={update}
                updateArr={updateArr}
                addArr={addArr}
                removeArr={removeArr}
                delContact={delContact}
                hasLinkedin={hasLinkedin}
                hasGithub={hasGithub}
                hasPortfolio={hasPortfolio}
                addNextContact={addNextContact}
                addCustomSection={addCustomSection}
                handleSave={handleSave}
                saveStatus={saveStatus}
                confirmingDelete={confirmingDelete}
                setConfirmingDelete={setConfirmingDelete}
                deleteSection={deleteSection}
                newSectionName={newSectionName}
                setNewSectionName={setNewSectionName}
              />
            </div>

            <div className={`flex-1 overflow-auto bg-slate-200/50 flex flex-col relative min-h-[500px] md:min-h-0 ${mobileView === "edit" ? "hidden md:flex" : "flex"}`}>
              <div className="md:hidden sticky top-0 z-20 px-4 py-2 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aperçu en direct</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600">Sync IA</span>
                </div>
              </div>

              <div className="flex-1 overflow-auto px-0 py-4 md:p-12 flex justify-center items-start">
                <div className={`relative bg-white shadow-2xl rounded-sm overflow-hidden transform-gpu ${!hasPaid ? "pointer-events-none" : ""}`} style={{ width: "100%", maxWidth: 794, minWidth: 320 }}>
                  <div className="w-full transform-gpu flex justify-center" style={{ transform: "scale(var(--preview-scale, 1))", transformOrigin: 'top center' }}>
                    <style>{`
                      @media (max-width: 400px) { :root { --preview-scale: 0.52; } }
                      @media (min-width: 401px) and (max-width: 639px) { :root { --preview-scale: 0.64; } }
                      @media (min-width: 640px) and (max-width: 767px) { :root { --preview-scale: 0.80; } }
                      @media (min-width: 768px) and (max-width: 1023px) { :root { --preview-scale: 0.94; } }
                      @media (min-width: 1024px) { :root { --preview-scale: 1; } }
                    `}</style>
                    <CVRenderer template={{ ...selectedTpl, templateData: editingData }} isPaid={hasPaid} analysisData={analysisData} />
                  </div>
                  {!hasPaid && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-xs mx-4">
                        <Lock className="mx-auto mb-4 text-primary" size={40} />
                        <h3 className="text-lg font-black mb-2">Aperçu verrouillé</h3>
                        <p className="text-slate-500 text-sm mb-6">Débloquez pour modifier et télécharger sans filigrane.</p>
                        <button onClick={() => setShowPaywall(true)} className="w-full bg-primary text-white py-3 rounded-2xl font-black text-sm">Débloquer</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaywall && <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} analysisId={analysisId} />}
    </div>
  );
}
