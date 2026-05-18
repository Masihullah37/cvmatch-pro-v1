/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/static-components, react/no-unescaped-entities */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React, { useState, useRef } from 'react';
import Watermark from "@/components/templates/Watermark";

// Inline SVG icons to avoid lucide-react client-only restriction
const MapPin = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Phone = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Mail = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);


const InlineEdit = ({ value, path, isInteractive, onUpdate, className = "", multiline = false }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<any>(null);

  if (!isInteractive) return <span className={className}>{value}</span>;

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== value && onUpdate) onUpdate(path, currentValue);
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className={`w-full bg-white/95 text-slate-950 border border-blue-300 rounded p-1 outline-none focus:ring-1 focus:ring-blue-400 shadow-sm ${className}`}
          rows={Math.max(2, (currentValue || "").split('\n').length)}
        />
      );
    }
    return (
      <input
        ref={inputRef}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
        className={`w-full bg-white/95 border border-blue-300 rounded p-1 outline-none focus:ring-1 focus:ring-blue-400 text-slate-950 shadow-sm ${className}`}
      />
    );
  }

  return (
    <span
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentValue(value); setIsEditing(true); }}
      className={`cursor-text hover:bg-white/20 hover:ring-1 hover:ring-blue-300 rounded transition-colors inline-block min-w-[20px] ${className}`}
      title="Cliquez pour modifier"
    >
      {value || (multiline ? "\u00A0\n\u00A0" : "\u00A0")}
    </span>
  );
};

const DraggableSection = ({ id, isInteractive, onDelete, children, style: extraStyle = {}, className = "" }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    ...extraStyle,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  if (!isInteractive) return <div style={extraStyle} className={className}>{children}</div>;

  return (
    <div ref={setNodeRef} style={style} className={`group relative ${className}`}>
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 bg-white rounded-md shadow-sm border border-slate-200 text-slate-500 hover:text-slate-700 transition-all z-[100]"
        title="Déplacer"
      >
        <GripVertical size={14} />
      </div>
      <div
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(id); }}
        className="absolute right-1 top-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer p-1 bg-white rounded-md shadow-sm border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all z-[100]"
        title="Supprimer"
      >
        <Trash2 size={14} />
      </div>
      {children}
    </div>
  );
};

export const CVRenderer = ({
  template,
  isPaid = true,
  analysisData = null,
  isInteractive = false,
  onUpdate,
  onDeleteSection,
}: any) => {
  const data = (template.templateData as any) || {};
  const style = template.templateStyle;

  const name = data.userName || analysisData?.userName || "Candidat";
  const title = data.jobTitle || analysisData?.jobTitle || "Optimisé par IA";
  const summaryText =
    data.summary ||
    "Professionnel expérimenté avec une solide expertise dans son domaine.";
  const experiences = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];
  const contact = data.contact || {};
  const projects = data.projects || [];
  const languages = data.languages || [];

  const headers = data.headers || {
    summary: "Profil",
    experience: "Expérience",
    education: "Formation",
    projects: "Projets",
    skills: "Compétences",
    languages: "Langues",
    contact: "Contact",
    certifications: "Certifications",
  };

  // --- STABLE REUSABLE SUB-COMPONENTS (Defined outside to prevent infinite unmount/remount loops) ---

  const SectionTitle = ({ sectionKey, className, headers: sectionHeaders = headers, isInteractive: interactive = isInteractive, onUpdate: updateHandler = onUpdate }: any) => (
    <h3 className={className}>
      <InlineEdit
        value={sectionHeaders?.[sectionKey] || sectionKey}
        path={`headers.${sectionKey}`}
        isInteractive={interactive}
        onUpdate={updateHandler}
      />
    </h3>
  );

  const ExperienceTitle = ({ className, headers: sectionHeaders = headers, isInteractive: interactive = isInteractive, onUpdate: updateHandler = onUpdate }: any) => (
    <h2 className={className}>
      <InlineEdit value={sectionHeaders?.experience} path="headers.experience" isInteractive={interactive} onUpdate={updateHandler} />
    </h2>
  );

  const ContactLinks = ({ className, contact: contactData = contact, isInteractive: interactive = isInteractive, onUpdate: updateHandler = onUpdate }: any) => (
    <>
      {contactData?.linkedin && (
        <p className={className}>
          <strong>LinkedIn:</strong>{" "}
          <InlineEdit value={contactData.linkedin} path="contact.linkedin" isInteractive={interactive} onUpdate={updateHandler} />
        </p>
      )}
      {contactData?.github && (
        <p className={className}>
          <strong>GitHub:</strong>{" "}
          <InlineEdit value={contactData.github} path="contact.github" isInteractive={interactive} onUpdate={updateHandler} />
        </p>
      )}
      {contactData?.portfolio && (
        <p className={className}>
          <strong>Portfolio:</strong>{" "}
          <InlineEdit value={contactData.portfolio} path="contact.portfolio" isInteractive={interactive} onUpdate={updateHandler} />
        </p>
      )}
    </>
  );

  const LanguagesSection = ({ headerClass, itemClass, languages: sectionLanguages = languages, isInteractive: interactive = isInteractive, onDeleteSection: deleteHandler = onDeleteSection, onUpdate: updateHandler = onUpdate, headers: sectionHeaders = headers }: any) => {
    if (!interactive && (!sectionLanguages || sectionLanguages.length === 0)) return null;
    return (
      <DraggableSection id="languages" isInteractive={interactive} onDelete={deleteHandler}>
        <SectionTitle sectionKey="languages" className={headerClass} headers={sectionHeaders} isInteractive={interactive} onUpdate={updateHandler} />
        <div className="space-y-1 mt-3">
          {(sectionLanguages || []).map((l: any, i: number) => (
            <p key={i} className={itemClass}>
              <strong><InlineEdit value={l.language || l.name || (typeof l === "string" ? l : "")} path={`languages.${i}.language`} isInteractive={interactive} onUpdate={updateHandler} /></strong>
              {l.level && <span className="opacity-70"> — <InlineEdit value={l.level} path={`languages.${i}.level`} isInteractive={isInteractive} onUpdate={onUpdate} /></span>}
            </p>
          ))}
        </div>
      </DraggableSection>
    );
  };

  const ProjectsSection = ({ headerClass, itemClass, projects: sectionProjects = projects, isInteractive: interactive = isInteractive, onDeleteSection: deleteHandler = onDeleteSection, onUpdate: updateHandler = onUpdate, headers: sectionHeaders = headers }: any) => {
    if (!interactive && (!sectionProjects || sectionProjects.length === 0)) return null;
    return (
      <DraggableSection id="projects" isInteractive={interactive} onDelete={deleteHandler}>
        <SectionTitle sectionKey="projects" className={headerClass} headers={sectionHeaders} isInteractive={interactive} onUpdate={updateHandler} />
        <div className="space-y-4 mt-3">
          {(sectionProjects || []).map((proj: any, i: number) => (
            <div key={i} className={itemClass}>
              <p className="font-bold"><InlineEdit value={proj.name} path={`projects.${i}.name`} isInteractive={interactive} onUpdate={updateHandler} /></p>
              {proj.technologies && (
                <p className="text-xs opacity-60">
                  <InlineEdit value={Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies} path={`projects.${i}.technologies`} isInteractive={interactive} onUpdate={(path: string, val: any) => updateHandler(path, val.split(",").map((s: string) => s.trim()))} />
                </p>
              )}
              <p className="text-xs mt-1"><InlineEdit value={proj.description} path={`projects.${i}.description`} isInteractive={interactive} onUpdate={updateHandler} multiline /></p>
            </div>
          ))}
        </div>
      </DraggableSection>
    );
  };

  const ExperienceSection = ({ headerClass, experiences: sectionExperiences = experiences, isInteractive: interactive = isInteractive, onDeleteSection: deleteHandler = onDeleteSection, onUpdate: updateHandler = onUpdate, headers: sectionHeaders = headers }: any) => {
    if (!interactive && (!sectionExperiences || sectionExperiences.length === 0)) return null;
    return (
      <DraggableSection id="experience" isInteractive={interactive} onDelete={deleteHandler}>
        <ExperienceTitle className={headerClass} headers={sectionHeaders} isInteractive={interactive} onUpdate={updateHandler} />
        <div className="space-y-10">
          {(sectionExperiences || []).map((exp: any, i: number) => (
            <div key={i} className="flex gap-6 relative">
              <div className="w-px bg-slate-200 relative"><div className="absolute top-2 -left-1 w-2.5 h-2.5 bg-[#3d3d3d] rounded-full"></div></div>
              <div className="flex-1 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[13px] font-black text-slate-900 uppercase"><InlineEdit value={exp.company} path={`experience.${i}.company`} isInteractive={interactive} onUpdate={updateHandler} /></h4>
                  <p className="text-[12px] font-black text-slate-700"><InlineEdit value={exp.title} path={`experience.${i}.title`} isInteractive={interactive} onUpdate={updateHandler} /></p>
                </div>
                <div className="text-[10px] text-slate-400 mb-2"><InlineEdit value={exp.period} path={`experience.${i}.period`} isInteractive={interactive} onUpdate={updateHandler} /></div>
                <p className="text-[11px] leading-relaxed text-slate-500 whitespace-pre-line"><InlineEdit value={exp.description} path={`experience.${i}.description`} isInteractive={interactive} onUpdate={updateHandler} multiline /></p>
              </div>
            </div>
          ))}
        </div>
      </DraggableSection>
    );
  };

  const EducationSection = ({ headerClass, education: sectionEducation = education, isInteractive: interactive = isInteractive, onDeleteSection: deleteHandler = onDeleteSection, onUpdate: updateHandler = onUpdate, headers: sectionHeaders = headers }: any) => {
    if (!interactive && (!sectionEducation || sectionEducation.length === 0)) return null;
    return (
      <DraggableSection id="education" isInteractive={interactive} onDelete={deleteHandler}>
        <SectionTitle sectionKey="education" className={headerClass} headers={sectionHeaders} isInteractive={interactive} onUpdate={updateHandler} />
        <div className="space-y-8">
          {(sectionEducation || []).map((edu: any, i: number) => (
            <div key={i} className="flex gap-6 relative">
              <div className="w-px bg-slate-200 relative"><div className="absolute top-2 -left-1 w-2.5 h-2.5 bg-[#3d3d3d] rounded-full"></div></div>
              <div className="flex-1 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[13px] font-black text-slate-900 uppercase"><InlineEdit value={edu.school} path={`education.${i}.school`} isInteractive={interactive} onUpdate={updateHandler} /></h4>
                  <p className="text-[12px] font-black text-slate-700"><InlineEdit value={edu.degree} path={`education.${i}.degree`} isInteractive={interactive} onUpdate={updateHandler} /></p>
                </div>
                <p className="text-[11px] text-slate-400"><InlineEdit value={edu.year} path={`education.${i}.year`} isInteractive={interactive} onUpdate={updateHandler} /></p>
                {edu.details && <p className="text-[11px] text-slate-500 mt-1"><InlineEdit value={edu.details} path={`education.${i}.details`} isInteractive={interactive} onUpdate={updateHandler} multiline /></p>}
              </div>
            </div>
          ))}
        </div>
      </DraggableSection>
    );
  };

  const SummarySection = ({ headerClass, itemClass, summaryText: sectionSummary = summaryText, isInteractive: interactive = isInteractive, onDeleteSection: deleteHandler = onDeleteSection, onUpdate: updateHandler = onUpdate, headers: sectionHeaders = headers }: any) => (
    <DraggableSection id="summary" isInteractive={interactive} onDelete={deleteHandler}>
      <SectionTitle sectionKey="summary" className={headerClass} headers={sectionHeaders} isInteractive={interactive} onUpdate={updateHandler} />
      <p className={`${itemClass} mt-3 whitespace-pre-line`}><InlineEdit value={sectionSummary} path="summary" isInteractive={interactive} onUpdate={updateHandler} multiline /></p>
    </DraggableSection>
  );

  const SkillsSection = ({ headerClass, itemClass, layout = "tags", skills: sectionSkills = skills, isInteractive: interactive = isInteractive, onDeleteSection: deleteHandler = onDeleteSection, onUpdate: updateHandler = onUpdate, headers: sectionHeaders = headers }: any) => {
    if (!interactive && (!sectionSkills || sectionSkills.length === 0)) return null;
    return (
      <DraggableSection id="skills" isInteractive={interactive} onDelete={deleteHandler}>
        <SectionTitle sectionKey="skills" className={headerClass} headers={sectionHeaders} isInteractive={interactive} onUpdate={updateHandler} />
        <div className={layout === "tags" ? "flex flex-wrap gap-2 mt-3" : "space-y-2 mt-3"}>
          {(sectionSkills || []).map((s: string, i: number) => (
            <span key={i} className={`${itemClass} ${layout === "tags" ? "inline-block" : ""}`}>
              <InlineEdit value={s} path={`skills.${i}`} isInteractive={interactive} onUpdate={updateHandler} />
            </span>
          ))}
        </div>
      </DraggableSection>
    );
  };

  const ContactSection = ({ headerClass, itemClass = "", contact: contactData = contact, isInteractive: interactive = isInteractive, onDeleteSection: deleteHandler = onDeleteSection, onUpdate: updateHandler = onUpdate, headers: sectionHeaders = headers }: any) => {
    if (!sectionHeaders?.contact) return null;
    return (
      <DraggableSection id="contact" isInteractive={interactive} onDelete={deleteHandler}>
        <SectionTitle sectionKey="contact" className={headerClass} headers={sectionHeaders} isInteractive={interactive} onUpdate={updateHandler} />
        <div className={`space-y-2 ${itemClass}`}>
          {contactData?.location && <p><InlineEdit value={contactData.location} path="contact.location" isInteractive={interactive} onUpdate={updateHandler} /></p>}
          <p><InlineEdit value={contactData?.email || ""} path="contact.email" isInteractive={interactive} onUpdate={updateHandler} /></p>
          <p><InlineEdit value={contactData?.phone || ""} path="contact.phone" isInteractive={interactive} onUpdate={updateHandler} /></p>
          <ContactLinks contact={contactData} isInteractive={interactive} onUpdate={updateHandler} />
        </div>
      </DraggableSection>
    );
  };

  const IdentityHeader = ({ nameClass, titleClass, containerClass = "", contactContainerClass = "text-right space-y-1 text-[10px] font-bold text-slate-500", showIcons = true, showContact = true, name: displayName = name, title: displayTitle = title, contact: contactData = contact, isInteractive: interactive = isInteractive, onUpdate: updateHandler = onUpdate }: any) => (
    <header className={containerClass}>
      <div>
        <h1 className={nameClass}><InlineEdit value={displayName} path="userName" isInteractive={interactive} onUpdate={updateHandler} /></h1>
        <p className={titleClass}><InlineEdit value={displayTitle} path="jobTitle" isInteractive={interactive} onUpdate={updateHandler} /></p>
      </div>
      {showContact && headers?.contact && (
        <DraggableSection id="contact" isInteractive={interactive} onDelete={onDeleteSection}>
          <div className={contactContainerClass}>
            {contactData?.location && <div className="flex items-center justify-end gap-2"><span><InlineEdit value={contactData.location} path="contact.location" isInteractive={interactive} onUpdate={updateHandler} /></span>{showIcons && <MapPin size={10} className="text-slate-300" />}</div>}
            <div className="flex items-center justify-end gap-2"><span><InlineEdit value={contactData?.phone || ""} path="contact.phone" isInteractive={interactive} onUpdate={updateHandler} /></span>{showIcons && <Phone size={10} className="text-slate-300" />}</div>
            <div className="flex items-center justify-end gap-2"><span><InlineEdit value={contactData?.email || ""} path="contact.email" isInteractive={interactive} onUpdate={updateHandler} /></span>{showIcons && <Mail size={10} className="text-slate-300" />}</div>
            <ContactLinks contact={contactData} isInteractive={interactive} onUpdate={updateHandler} />
          </div>
        </DraggableSection>
      )}
    </header>
  );

  const DynamicMainSections = ({ headerClass, itemClass, data: sectionData = data, style: templateStyle = style, experiences: sectionExperiences = experiences, education: sectionEducation = education, projects: sectionProjects = projects, languages: sectionLanguages = languages, skills: sectionSkills = skills, summaryText: sectionSummary = summaryText, isInteractive: interactive = isInteractive, onDeleteSection: deleteHandler = onDeleteSection, onUpdate: updateHandler = onUpdate, headers: sectionHeaders = headers }: any) => {
    // Deduplicate order to prevent "duplicate key" React errors
    const order = Array.from(new Set(sectionData?.sectionOrder || ["summary", "experience", "projects", "education", "skills", "languages"])) as string[];
    return (
      <>
        {order.map((key) => {
          if (key === "summary" && ["Horizon", "Lunar", "Stellar", "Solar", "Nebula"].includes(templateStyle)) return null;
          if (key === "contact") return null;
          if (key === "skills" && ["Horizon", "Eclipse", "Hyperion", "Lunar", "Stellar", "Solar", "Nebula", "Cosmos", "Astra", "Europass", "Galaxy"].includes(templateStyle)) return null;
          if (key === "languages" && ["Eclipse", "Hyperion", "Lunar", "Stellar", "Solar", "Nebula", "Cosmos", "Astra", "Europass"].includes(templateStyle)) return null;

          if (key === "experience") return <ExperienceSection key={key} headerClass={headerClass} experiences={sectionExperiences} isInteractive={interactive} onDeleteSection={deleteHandler} onUpdate={updateHandler} headers={sectionHeaders} />;
          if (key === "education") return <EducationSection key={key} headerClass={headerClass} education={sectionEducation} isInteractive={interactive} onDeleteSection={deleteHandler} onUpdate={updateHandler} headers={sectionHeaders} />;
          if (key === "projects") return <ProjectsSection key={key} headerClass={headerClass} itemClass={itemClass} projects={sectionProjects} isInteractive={interactive} onDeleteSection={deleteHandler} onUpdate={updateHandler} headers={sectionHeaders} />;
          if (key === "languages") return <LanguagesSection key={key} headerClass={headerClass} itemClass={itemClass} languages={sectionLanguages} isInteractive={interactive} onDeleteSection={deleteHandler} onUpdate={updateHandler} headers={sectionHeaders} />;
          if (key === "skills") return <SkillsSection key={key} headerClass={headerClass} itemClass={itemClass} skills={sectionSkills} isInteractive={interactive} onDeleteSection={deleteHandler} onUpdate={updateHandler} headers={sectionHeaders} />;
          if (key === "summary") return <SummarySection key={key} headerClass={headerClass} itemClass={itemClass} summaryText={sectionSummary} isInteractive={interactive} onDeleteSection={deleteHandler} onUpdate={updateHandler} headers={sectionHeaders} />;

          const standardKeys = ["summary", "experience", "education", "skills", "languages", "projects", "contact", "headers", "photourl", "username", "jobtitle", "_originalcvtext", "_originalcvcontext", "sectionorder"];
          if (!standardKeys.includes(key.toLowerCase()) && key in (sectionData || {})) {
            const items = sectionData[key];
            const isEmpty = !items || (Array.isArray(items) && items.length === 0) || (typeof items === 'string' && items.trim() === '');

            if (!interactive && isEmpty) return null;

            return (
              <DraggableSection key={key} id={key} isInteractive={interactive} onDelete={deleteHandler}>
                <SectionTitle sectionKey={key} className={headerClass} headers={sectionHeaders} isInteractive={interactive} onUpdate={updateHandler} />
                {Array.isArray(items) ? (
                  <div className="space-y-1 mt-3">{items.map((it: any, i: number) => (<p key={i} className={itemClass}><InlineEdit value={it} path={`${key}.${i}`} isInteractive={interactive} onUpdate={updateHandler} /></p>))}</div>
                ) : (
                  <p className={`${itemClass} mt-3 whitespace-pre-line`}><InlineEdit value={items} path={key} isInteractive={interactive} onUpdate={updateHandler} multiline /></p>
                )}
              </DraggableSection>
            );
          }
          return null;
        })}
      </>
    );
  };
  const ProtectionOverlay = () =>
    !isPaid && (
      <div className="absolute inset-0 z-[60] select-none pointer-events-none">
        <Watermark />
        <div className="absolute inset-0 bg-black/[0.02] backdrop-blur-[0.5px]"></div>
      </div>
    );

  return (
    <div
      className={`w-[210mm] min-h-[297mm] bg-white shadow-sm overflow-hidden text-left mx-auto relative select-none cv-printable`}
      onContextMenu={(e) => !isPaid && e.preventDefault()}
    >
      <style>{`
        .cv-readable-sidebar,
        .cv-readable-sidebar *:not(input):not(textarea):not(button) { color: #ffffff !important; }
        .cv-readable-sidebar .muted-readable { color: rgba(255,255,255,.78) !important; }
        .cv-readable-sidebar [class*="border-"] { border-color: rgba(255,255,255,.24) !important; }
        .cv-readable-sidebar input,
        .cv-readable-sidebar textarea { color: #0f172a !important; }
      `}</style>
      <ProtectionOverlay />

      {/* --- STYLE: HORIZON --- */}
      {style === "Horizon" && (
        <div className="flex min-h-[297mm] w-[210mm] font-sans bg-white">
          <div className="cv-readable-sidebar w-[30%] bg-[#3d3d3d] text-white p-10 flex flex-col gap-10">
            {data.photoUrl && (
              <div className="w-32 h-32 rounded-full border-4 border-white/20 mx-auto overflow-hidden shadow-2xl">
                <img
                  src={data.photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">
                À propos
              </h3>
              <p className="text-[11px] leading-relaxed text-white">
                <InlineEdit value={summaryText} path="summary" isInteractive={isInteractive} onUpdate={onUpdate} multiline />
              </p>
            </section>
            <ContactSection
              headerClass="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2"
              itemClass="text-[11px] opacity-90"
            />
            <SkillsSection
              headerClass="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2"
              itemClass="text-[9px] bg-white/20 px-2 py-1 rounded text-white"
            />
          </div>
          <div className="flex-1 p-12 flex flex-col gap-12">
            <IdentityHeader
              nameClass="text-4xl font-black text-[#222] uppercase tracking-tighter"
              titleClass="text-lg font-bold text-slate-400 mt-1 uppercase tracking-widest"
              containerClass="flex justify-between items-start border-b border-slate-100 pb-8"
              showContact={false}
            />
            <DynamicMainSections
              headerClass="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b-2 border-slate-100 pb-2"
              itemClass="text-[11px] leading-relaxed text-slate-500"
            />
          </div>
        </div>
      )}

      {/* --- STYLE: GALAXY --- */}
      {style === "Galaxy" && (
        <div className="p-16 font-serif text-[#1a1a1a]">
          <div className="text-center border-b-2 border-gray-100 pb-10 mb-10">
            <h1 className="text-5xl font-bold uppercase tracking-widest mb-4">
              <InlineEdit value={name} path="userName" isInteractive={isInteractive} onUpdate={onUpdate} />
            </h1>
            <p className="text-xl italic text-gray-500">
              <InlineEdit value={title} path="jobTitle" isInteractive={isInteractive} onUpdate={onUpdate} />
            </p>
            {headers.contact && (
            <DraggableSection id="contact" isInteractive={isInteractive} onDelete={onDeleteSection}>
            <div className="mt-4 flex flex-col items-center gap-2 text-xs font-sans uppercase tracking-widest text-gray-400">
              <p>
                <InlineEdit value={contact.location} path="contact.location" isInteractive={isInteractive} onUpdate={onUpdate} />
                {" • "}
                <InlineEdit value={contact.email} path="contact.email" isInteractive={isInteractive} onUpdate={onUpdate} />
                {" • "}
                <InlineEdit value={contact.phone} path="contact.phone" isInteractive={isInteractive} onUpdate={onUpdate} />
              </p>
              <ContactLinks className="" />
            </div>
            </DraggableSection>
            )}
          </div>
          <div className="flex flex-col gap-10 font-sans">
            <DynamicMainSections
              headerClass="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400"
              itemClass="text-sm text-gray-700"
            />
            {skills.length > 0 && (
              <DraggableSection id="skills" isInteractive={isInteractive} onDelete={onDeleteSection}>
                <SectionTitle sectionKey="skills" className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <InlineEdit
                    value={skills.join(" • ")}
                    path="skills"
                    isInteractive={isInteractive}
                    onUpdate={(path: string, val: any) => onUpdate(path, val.split("•").map((s: string) => s.trim()))}
                  />
                </p>
              </DraggableSection>
            )}
          </div>
        </div>
      )}

      {/* --- STYLE: ECLIPSE --- */}
      {style === "Eclipse" && (
        <div className="flex min-h-[297mm] w-[210mm] font-sans text-[#333]">
          <div className="cv-readable-sidebar w-[35%] bg-[#1a1a1a] text-white p-10 flex flex-col gap-10">
            {data.photoUrl && (
              <div className="w-40 h-40 rounded-3xl border-4 border-white/10 mx-auto overflow-hidden">
                <img
                  src={data.photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-[28px] font-black leading-[1.1] uppercase mb-4">
                <InlineEdit
                  value={name}
                  path="userName"
                  isInteractive={isInteractive}
                  onUpdate={onUpdate}
                />
              </h1>
              <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                <InlineEdit
                  value={title}
                  path="jobTitle"
                  isInteractive={isInteractive}
                  onUpdate={onUpdate}
                />
              </p>
            </div>
            <ContactSection
              headerClass="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2"
              itemClass="text-[11px] text-white/90"
            />
            <LanguagesSection
              headerClass="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2"
              itemClass="text-[11px] text-white/90"
            />
            <SkillsSection
              headerClass="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2"
              itemClass="text-[10px] bg-white/20 px-2 py-1 rounded text-white"
            />
          </div>
          <div className="flex-1 p-16 flex flex-col gap-12">
            <DynamicMainSections
              headerClass="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6"
              itemClass="text-[13px] leading-relaxed text-gray-600"
            />
          </div>
        </div>
      )}

      {/* --- STYLE: AETHER --- */}
      {style === "Aether" && (
        <div className="p-16 font-sans text-gray-900">
          <IdentityHeader
            nameClass="text-5xl font-black tracking-tighter"
            titleClass="text-xl font-bold text-gray-500 mt-1"
            containerClass="flex justify-between items-start border-b-4 border-gray-900 pb-8 mb-10"
            contactContainerClass="text-right text-xs font-bold space-y-1 text-gray-700"
            showIcons={false}
          />
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-8 flex flex-col gap-10">
              <DraggableSection id="experience" isInteractive={isInteractive} onDelete={onDeleteSection}>
                <SectionTitle sectionKey="experience" className="text-lg font-black border-b border-gray-200 pb-2 mb-4" />
                {experiences.map((exp: any, i: number) => (
                  <div key={i} className="mb-6">
                    <p className="font-black text-base">
                      <InlineEdit value={exp.company} path={`experience.${i}.company`} isInteractive={isInteractive} onUpdate={onUpdate} /> | <InlineEdit value={exp.title} path={`experience.${i}.title`} isInteractive={isInteractive} onUpdate={onUpdate} />
                    </p>
                    <p className="text-xs text-gray-400 font-bold mb-2">
                      <InlineEdit value={exp.period} path={`experience.${i}.period`} isInteractive={isInteractive} onUpdate={onUpdate} />
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <InlineEdit value={exp.description} path={`experience.${i}.description`} isInteractive={isInteractive} onUpdate={onUpdate} multiline />
                    </p>
                  </div>
                ))}
              </DraggableSection>
              {education.length > 0 && (
                <DraggableSection id="education" isInteractive={isInteractive} onDelete={onDeleteSection}>
                  <SectionTitle sectionKey="education" className="text-lg font-black border-b border-gray-200 pb-2 mb-4" />
                  {education.map((edu: any, i: number) => (
                    <div key={i} className="mb-4">
                      <p className="font-black text-base"><InlineEdit value={edu.degree} path={`education.${i}.degree`} isInteractive={isInteractive} onUpdate={onUpdate} /></p>
                      <p className="text-xs text-gray-500">
                        {edu.school} • {edu.year}
                      </p>
                    </div>
                  ))}
                </DraggableSection>
              )}
              <ProjectsSection
                headerClass="text-lg font-black border-b border-gray-200 pb-2 mb-4"
                itemClass="mb-6"
              />
            </div>
            <div className="col-span-4 flex flex-col gap-8">
              <DraggableSection id="summary" isInteractive={isInteractive} onDelete={onDeleteSection}>
                <SectionTitle sectionKey="summary" className="text-sm font-black uppercase border-b border-gray-200 pb-2 mb-4" />
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "<InlineEdit value={summaryText} path="summary" isInteractive={isInteractive} onUpdate={onUpdate} multiline />"
                </p>
              </DraggableSection>
              <LanguagesSection
                headerClass="text-sm font-black uppercase border-b border-gray-200 pb-2 mb-4"
                itemClass="text-xs"
              />
              <section>
                <h3 className="text-sm font-black uppercase border-b border-gray-200 pb-2 mb-4">
                  {headers.skills}
                </h3>
                <div className="space-y-2">
                  {skills.map((s: string, i: number) => (
                    <p key={i} className="text-xs font-bold">
                      • {s}
                    </p>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* --- STYLE: HYPERION --- */}
      {style === "Hyperion" && (
        <div className="flex min-h-[297mm] font-sans">
          <div className="cv-readable-sidebar w-[30%] bg-[#064e3b] text-white p-10 flex flex-col gap-10">
            {data.photoUrl ? (
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-emerald-400/30">
                <img
                  src={data.photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-3xl bg-emerald-800 flex items-center justify-center font-bold text-3xl">
                {name[0]}
              </div>
            )}
            <ContactSection
              headerClass="text-xs font-black uppercase tracking-widest text-emerald-400"
              itemClass="text-[10px] text-white"
            />
            <LanguagesSection
              headerClass="text-xs font-black uppercase tracking-widest text-emerald-400"
              itemClass="text-[10px] text-white"
            />
            <SkillsSection
              headerClass="text-xs font-black uppercase tracking-widest text-emerald-400"
              itemClass="bg-emerald-800/50 p-2 rounded-lg text-[10px] font-bold border border-emerald-700/50"
              layout="list"
            />
          </div>
          <div className="flex-1 p-16 flex flex-col gap-12">
            <header>
              <h1 className="text-5xl font-black text-emerald-950 tracking-tighter">
                <InlineEdit value={name} path="userName" isInteractive={isInteractive} onUpdate={onUpdate} />
              </h1>
              <p className="text-xl font-bold text-emerald-600 mt-2">
                <InlineEdit value={title} path="jobTitle" isInteractive={isInteractive} onUpdate={onUpdate} />
              </p>
            </header>
            <DynamicMainSections
              headerClass="text-lg font-black text-emerald-900 border-b-2 border-emerald-100 pb-2 mb-6 uppercase"
              itemClass="text-sm text-gray-600 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* --- STYLE: LUNAR --- */}
      {style === "Lunar" && (
        <div className="p-10 font-sans bg-slate-50 min-h-[297mm]">
          <header className="mb-8 flex gap-8 items-center">
            {data.photoUrl && (
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                <img
                  src={data.photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-light tracking-tighter text-slate-900 mb-2">
                <InlineEdit value={name} path="userName" isInteractive={isInteractive} onUpdate={onUpdate} />
              </h1>
              <p className="text-lg font-bold text-slate-400 tracking-widest uppercase">
                <InlineEdit value={title} path="jobTitle" isInteractive={isInteractive} onUpdate={onUpdate} />
              </p>
            </div>
          </header>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-4 flex flex-col gap-12">
              <ContactSection
                headerClass="text-xs font-black uppercase tracking-widest text-slate-400 mb-4"
                itemClass="text-sm font-bold text-slate-600"
              />
              <LanguagesSection
                headerClass="text-xs font-black uppercase tracking-widest text-slate-400 mb-4"
                itemClass="text-sm font-bold text-slate-600"
              />
              <SkillsSection
                headerClass="text-xs font-black uppercase tracking-widest text-slate-400 mb-4"
                itemClass="text-sm font-bold text-slate-700"
                layout="list"
              />
            </div>
            <div className="col-span-8 flex flex-col gap-16">
              <p className="text-sm leading-relaxed text-gray-600 font-medium italic">
                "<InlineEdit value={summaryText} path="summary" isInteractive={isInteractive} onUpdate={onUpdate} multiline />"
              </p>
              <DynamicMainSections
                headerClass="text-xs font-black uppercase tracking-widest text-slate-400 mb-8"
                itemClass="text-sm leading-relaxed text-slate-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- STYLE: STELLAR --- */}
      {style === "Stellar" && (
        <div className="font-sans min-h-[297mm] bg-white">
          <IdentityHeader
            nameClass="text-5xl font-black mb-2 text-white"
            titleClass="text-xl font-medium opacity-90 text-white"
            containerClass="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 p-10 relative flex justify-between items-center"
            contactContainerClass="absolute -bottom-8 right-16 bg-white shadow-xl p-6 rounded-2xl flex flex-col gap-2 text-xs font-bold text-gray-500"
            showIcons={false}
          />
          <div className="p-16 pt-24 grid grid-cols-12 gap-16">
            <div className="col-span-8 flex flex-col gap-8">
              <DynamicMainSections
                headerClass="text-xl font-black text-indigo-900 mb-6"
                itemClass="text-sm text-gray-600 leading-relaxed"
              />
            </div>
            <div className="col-span-4 flex flex-col gap-10">
              <div className="bg-gray-50 p-8 rounded-3xl">
                <SectionTitle sectionKey="summary" className="text-sm font-black uppercase text-gray-400 mb-4" />
                <p className="text-xs leading-relaxed text-gray-600 font-medium">
                  <InlineEdit value={summaryText} path="summary" isInteractive={isInteractive} onUpdate={onUpdate} multiline />
                </p>
              </div>
              <LanguagesSection
                headerClass="text-sm font-black uppercase text-indigo-900 mb-6"
                itemClass="text-xs"
              />
              <SkillsSection
                headerClass="text-sm font-black uppercase text-indigo-900 mb-6"
                itemClass="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- STYLE: SOLAR --- */}
      {style === "Solar" && (
        <div className="p-10 font-sans text-slate-800">
          <IdentityHeader
            nameClass="text-5xl font-black tracking-tight"
            titleClass="text-xl font-bold text-amber-600 mt-2"
            containerClass="mb-8 flex justify-between items-end border-b-8 border-amber-400 pb-6"
            contactContainerClass="text-right text-xs font-black space-y-1 opacity-60 uppercase"
            showIcons={false}
          />
          <div className="grid grid-cols-2 gap-16">
            <section className="flex flex-col gap-8">
              <DynamicMainSections
                headerClass="text-lg font-black uppercase border-b-2 border-slate-100 pb-2"
                itemClass="text-xs leading-relaxed text-slate-500"
              />
            </section>
            <div className="flex flex-col gap-12">
              <div className="border-b-2 border-slate-100 pb-2 mb-4">
                <SectionTitle sectionKey="summary" className="text-lg font-black uppercase mb-4" />
                <p className="text-sm leading-relaxed font-medium text-slate-600 italic">
                  "<InlineEdit value={summaryText} path="summary" isInteractive={isInteractive} onUpdate={onUpdate} multiline />"
                </p>
              </div>
              <LanguagesSection
                headerClass="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-6"
                itemClass="text-sm font-bold text-slate-600"
              />
              <SkillsSection
                headerClass="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-6"
                itemClass="flex items-center gap-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- STYLE: NEBULA --- */}
      {style === "Nebula" && (
        <div className="p-10 font-sans bg-white min-h-[297mm]">
          <div className="flex gap-12 mb-10">
            <div className="w-1/3 flex flex-col items-center text-center">
              <h1 className="text-3xl font-black text-rose-500 leading-tight mb-4">
                <InlineEdit value={name} path="userName" isInteractive={isInteractive} onUpdate={onUpdate} />
              </h1>
              <div className="h-2 w-12 bg-rose-500 mb-6"></div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                <InlineEdit value={title} path="jobTitle" isInteractive={isInteractive} onUpdate={onUpdate} />
              </p>
            </div>
            <div className="w-2/3 pt-4">
              <p className="text-sm leading-relaxed text-gray-600 font-medium border-l-2 border-rose-100 pl-8 italic">
                <InlineEdit value={summaryText} path="summary" isInteractive={isInteractive} onUpdate={onUpdate} multiline />
              </p>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-8 flex flex-col gap-8">
              <DynamicMainSections
                headerClass="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mt-12 mb-8"
                itemClass="text-sm text-gray-500 leading-relaxed"
              />
            </div>
            <div className="col-span-4 flex flex-col gap-12">
              <ContactSection
                headerClass="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6"
                itemClass="text-xs font-bold text-gray-500"
              />
              <LanguagesSection
                headerClass="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6"
                itemClass="text-xs"
              />
              <SkillsSection
                headerClass="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6"
                itemClass="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-[10px] font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- STYLE: COSMOS --- */}
      {style === "Cosmos" && (
        <div className="font-sans min-h-[297mm] text-slate-900">
          <IdentityHeader
            nameClass="text-5xl font-black tracking-tighter mb-2 text-white"
            titleClass="text-xl font-bold text-slate-400 uppercase tracking-widest text-white"
            containerClass="bg-slate-900 text-white p-12 flex justify-between items-center"
            contactContainerClass="text-right text-sm space-y-1 font-medium opacity-80 text-white"
            showIcons={false}
          />
          <div className="p-20 flex flex-col gap-16">
            <DynamicMainSections
              headerClass="text-sm font-black uppercase tracking-widest text-slate-400"
              itemClass="text-sm leading-relaxed text-slate-600"
            />
            <LanguagesSection
              headerClass="text-sm font-black uppercase tracking-widest text-slate-400 mb-4"
              itemClass="text-sm"
            />
            <SkillsSection
              headerClass="text-sm font-black uppercase tracking-widest text-slate-400"
              itemClass="bg-slate-100 px-3 py-1 font-bold text-xs rounded-full"
            />
          </div>
        </div>
      )}

      {/* --- STYLE: ASTRA --- */}
      {style === "Astra" && (
        <div className="p-12 font-serif bg-white text-[#1a1a1a]">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2 tracking-tight"><InlineEdit value={name} path="userName" isInteractive={isInteractive} onUpdate={onUpdate} /></h1>
            <p className="text-lg text-gray-600 italic mb-4"><InlineEdit value={title} path="jobTitle" isInteractive={isInteractive} onUpdate={onUpdate} /></p>
            {headers.contact && (
            <DraggableSection id="contact" isInteractive={isInteractive} onDelete={onDeleteSection}>
            <div className="flex justify-center gap-6 text-xs text-gray-500 border-y border-gray-100 py-3">
              {contact.location && <span><InlineEdit value={contact.location} path="contact.location" isInteractive={isInteractive} onUpdate={onUpdate} /> • </span>}
              <span><InlineEdit value={contact.phone} path="contact.phone" isInteractive={isInteractive} onUpdate={onUpdate} /></span>
              <span>•</span>
              <span><InlineEdit value={contact.email} path="contact.email" isInteractive={isInteractive} onUpdate={onUpdate} /></span>
            </div>
            <ContactLinks className="text-xs text-gray-500 mt-2" />
            </DraggableSection>
            )}
          </header>
          <div className="flex flex-col gap-10 font-sans">
            <DynamicMainSections
              headerClass="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-6"
              itemClass="text-sm text-gray-700 leading-relaxed"
            />
            <LanguagesSection
              headerClass="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4"
              itemClass="text-sm"
            />
            <SkillsSection
              headerClass="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4"
              itemClass="text-sm text-gray-700"
            />
          </div>
        </div>
      )}

      {/* --- STYLE: EUROPASS --- */}
      {style === "Europass" && (
        <div className="flex min-h-[297mm] font-sans text-slate-800">
          <div className="cv-readable-sidebar w-[32%] bg-[#0065a2] text-white p-8 flex flex-col gap-10">
            <ContactSection
              headerClass="text-[13px] font-black uppercase tracking-widest border-b border-white/20 pb-2"
              itemClass="text-[11px] font-medium text-white"
            />
            <LanguagesSection
              headerClass="text-[13px] font-black uppercase tracking-widest border-b border-white/20 pb-2"
              itemClass="text-[11px] text-white"
            />
            <SkillsSection
              headerClass="text-[13px] font-black uppercase tracking-widest border-b border-white/20 pb-2"
              itemClass="text-[11px] flex items-start gap-2 text-white"
              layout="list"
            />
          </div>
          <div className="flex-1 p-12 flex flex-col gap-12">
            <header className="border-b-2 border-slate-100 pb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
                <InlineEdit value={name} path="userName" isInteractive={isInteractive} onUpdate={onUpdate} />
              </h1>
              <p className="text-lg font-bold text-[#0065a2] uppercase tracking-widest">
                <InlineEdit value={title} path="jobTitle" isInteractive={isInteractive} onUpdate={onUpdate} />
              </p>
            </header>
            <DynamicMainSections
              headerClass="text-[14px] font-black uppercase tracking-widest text-slate-900 bg-slate-50 px-4 py-2 border-l-4 border-[#0065a2] mb-6"
              itemClass="px-4 text-[12px] text-slate-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CVRenderer;
