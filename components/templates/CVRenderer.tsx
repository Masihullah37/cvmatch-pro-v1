import { Shield, Lock, MapPin, Mail, Phone, ExternalLink, Sparkles } from 'lucide-react';
import Watermark from '@/components/templates/Watermark';

export const CVRenderer = ({ template, isPreview = false, isPaid = true, analysisData = null }: any) => {
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

  const headers = data.headers || {
    summary: 'Profil',
    experience: 'Expérience',
    education: 'Formation',
    projects: 'Projets',
    skills: 'Compétences',
    languages: 'Langues',
    interests: 'Intérêts',
    contact: 'Contact',
    certifications: 'Certifications'
  };

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
              <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">{headers.summary}</h3>
              <p className="text-sm leading-relaxed text-gray-700">{summaryText}</p>
            </section>
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">{headers.experience}</h3>
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
                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">{headers.education}</h3>
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
                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">{headers.projects}</h3>
                <div className="space-y-6">
                  {projects.map((proj: any, i: number) => (
                    <div key={i} className="relative pl-6 border-l border-gray-100">
                      <h4 className="text-base font-bold">{proj.name}</h4>
                      {/* <p className="text-xs text-gray-400 mb-2">{proj.technologies?.join(' • ')}</p> */}
                      <p className="text-xs text-gray-400 mb-2">
                        {Array.isArray(proj.technologies)
                          ? proj.technologies.join(' • ')
                          : proj.technologies}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-2 gap-10">
              {languages.length > 0 && (
                <section>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">{headers.languages}</h3>
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
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-gray-400">{headers.interests}</h3>
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
              <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">{headers.contact}</h3>
              <div className="text-[11px] space-y-2 opacity-80">
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <p>{contact.location}</p>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">{headers.skills}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: string, i: number) => (
                  <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded">{s}</span>
                ))}
              </div>
            </section>
            {languages.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">{headers.languages}</h3>
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
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2">{headers.interests}</h3>
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
              <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6">{headers.summary}</h2>
              <p className="text-[13px] leading-relaxed text-gray-600">{summaryText}</p>
            </section>
            <section>
              <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6">{headers.experience}</h2>
              {Array.isArray(experiences) ? experiences.map((exp: any, i: number) => (
                <div key={i} className="mb-6">
                  <div className="flex justify-between font-bold text-[13px]">
                    <span>{exp.title}</span>
                    <span className="text-gray-400">{exp.period}</span>
                  </div>
                  <p className="text-[11px] font-black text-gray-500 uppercase mb-2">{exp.company}</p>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              )) : null}
            </section>
            {projects.length > 0 && (
              <section>
                <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6">{headers.projects}</h2>
                {Array.isArray(projects) ? projects.map((proj: any, i: number) => (
                  <div key={i} className="mb-6">
                    <p className="text-[13px] font-bold mb-1">{proj.name}</p>
                    <p className="text-[11px] text-gray-500 mb-2 italic">{proj.technologies?.join(', ')}</p>
                    <p className="text-[12px] text-gray-600 leading-relaxed">{proj.description}</p>
                  </div>
                )) : null}
              </section>
            )}
            {Array.isArray(education) ? education.length > 0 && (
              <section>
                <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-black pl-4 mb-6">{headers.education}</h2>
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
            ) : null}
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
                <h3 className="text-lg font-black border-b border-gray-200 pb-2 mb-4">{headers.experience}</h3>
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
                <h3 className="text-sm font-black uppercase border-b border-gray-200 pb-2 mb-4">{headers.summary}</h3>
                <p className="text-xs text-gray-600 leading-relaxed italic">"{summaryText}"</p>
              </section>
              <section>
                <h3 className="text-sm font-black uppercase border-b border-gray-200 pb-2 mb-4">{headers.skills}</h3>
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
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">{headers.skills}</h3>
              <div className="space-y-3">
                {skills.map((s: string, i: number) => (
                  <div key={i} className="bg-emerald-800/50 p-2 rounded-lg text-[10px] font-bold border border-emerald-700/50">{s}</div>
                ))}
              </div>
            </section>
            {languages.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">{headers.languages}</h3>
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
              <h2 className="text-lg font-black text-emerald-900 border-b-2 border-emerald-100 pb-2 mb-6 uppercase">{headers.experience}</h2>
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
                <h2 className="text-lg font-black text-emerald-900 border-b-2 border-emerald-100 pb-2 mb-6 uppercase">{headers.projects}</h2>
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
                <h2 className="text-lg font-black text-emerald-900 border-b-2 border-emerald-100 pb-2 mb-6 uppercase">{headers.education}</h2>
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
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{headers.contact}</h3>
                <div className="space-y-1 text-sm font-bold text-slate-600">
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                  <p>{contact.location}</p>
                </div>
              </section>
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{headers.skills}</h3>
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
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">{headers.experience}</h3>
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">{headers.projects}</h3>
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">{headers.education}</h3>
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
                <h3 className="text-xl font-black text-indigo-900 mb-6">{headers.experience}</h3>
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
                <h3 className="text-sm font-black uppercase text-gray-400 mb-4">{headers.summary}</h3>
                <p className="text-xs leading-relaxed text-gray-600 font-medium">{summaryText}</p>
              </section>
              <section>
                <h3 className="text-sm font-black uppercase text-indigo-900 mb-6">{headers.skills}</h3>
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
              <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2">{headers.experience}</h3>
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
                <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-4">{headers.summary}</h3>
                <p className="text-sm leading-relaxed font-medium text-slate-600 italic">{summaryText}</p>
              </section>
              {projects.length > 0 && (
                <section>
                  <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-4">{headers.projects}</h3>
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
                  <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-4">{headers.education}</h3>
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
                <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-6">{headers.skills}</h3>
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
                  <h3 className="text-lg font-black uppercase border-b-2 border-slate-100 pb-2 mb-4">{headers.languages}</h3>
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
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-8">{headers.experience}</h3>
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
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">{headers.contact}</h3>
                <div className="space-y-4 text-xs font-bold text-gray-500">
                  <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {contact.email}</p>
                  <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {contact.phone}</p>
                  <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {contact.location}</p>
                </div>
              </section>
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">{headers.skills}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s: string, i: number) => (
                    <span key={i} className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-gray-100">{s}</span>
                  ))}
                </div>
              </section>
              {languages.length > 0 && (
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">{headers.languages}</h3>
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
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-6">{headers.education}</h3>
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
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{headers.summary}</h3>
              </div>
              <div className="w-3/4">
                <p className="text-lg leading-relaxed text-slate-600 font-medium border-l-4 border-slate-900 pl-8">
                  {summaryText}
                </p>
              </div>
            </section>
            <section className="flex gap-16">
              <div className="w-1/4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{headers.experience}</h3>
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
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{headers.projects}</h3>
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
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">{headers.skills}</h3>
                  <div className="space-y-2">
                    {skills.map((s: string, i: number) => <p key={i} className="text-sm font-bold text-slate-700">• {s}</p>)}
                  </div>
                </section>
                {languages.length > 0 && (
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">{headers.languages}</h3>
                    <div className="space-y-2">
                      {languages.map((lang: any, i: number) => (
                        <p key={i} className="text-sm font-bold text-slate-700">{lang.language || lang.name || (typeof lang === 'string' ? lang : '')} ({lang.level})</p>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              <div className="w-3/4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">{headers.education}</h3>
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
              <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4">{headers.summary}</h3>
              <p className="text-sm leading-relaxed text-gray-700">{summaryText}</p>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-6">{headers.experience}</h3>
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
                <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-6">{headers.projects}</h3>
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
                <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4">{headers.education}</h3>
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

      {/* Style: Europass (Official European Format) */}
      {style === 'Europass' && (
        <div className="flex min-h-[297mm] w-[210mm] font-sans text-slate-800 bg-white">
          {/* Left Sidebar (Blue) */}
          <div className="w-[30%] bg-[#0065a2] text-white p-8 flex flex-col gap-10">
            <div className="text-center">
              <div className="text-[32px] font-black tracking-tighter border-b-2 border-white/30 pb-4 mb-6">
                EUROPASS
              </div>
              <div className="space-y-2 text-[11px] font-medium opacity-90">
                <p>{contact.phone}</p>
                <p className="break-all">{contact.email}</p>
                {contact.linkedin && <p>LinkedIn</p>}
              </div>
            </div>

            <section className="space-y-6">
              <h3 className="text-[13px] font-black uppercase tracking-widest border-b border-white/20 pb-2">
                {headers.skills}
              </h3>
              <div className="space-y-4">
                {skills.slice(0, 10).map((s: string, i: number) => (
                  <div key={i} className="text-[11px] flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {languages.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-[13px] font-black uppercase tracking-widest border-b border-white/20 pb-2">
                  {headers.languages}
                </h3>
                <div className="space-y-4">
                  {languages.map((l: any, i: number) => (
                    <div key={i} className="text-[11px] flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0"></span>
                      <span>
                        <strong className="block">{l.language || l.name || (typeof l === 'string' ? l : '')}</strong>
                        <span className="opacity-70">{l.level}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Side (White) */}
          <div className="flex-1 p-12 space-y-10">
            <section>
              <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">
                {headers.summary}
              </h3>
              <p className="text-[12px] leading-relaxed text-slate-600">
                {summaryText}
              </p>
            </section>

            <section>
              <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">
                {headers.experience}
              </h3>
              <div className="space-y-8">
                {experiences.map((exp: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-[13px] font-black text-slate-900">{exp.title} à {exp.company}</h4>
                      <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-4">— {exp.period}</span>
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-line border-l-2 border-slate-50 pl-4">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">
                {headers.education}
              </h3>
              <div className="space-y-4">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <h4 className="text-[13px] font-black text-slate-900">{edu.degree}</h4>
                    <p className="text-[11px] text-slate-500">{edu.school} — {edu.year}</p>
                  </div>
                ))}
              </div>
            </section>

            {data.certifications && (
              <section>
                <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">
                  {headers.certifications}
                </h3>
                <div className="space-y-2">
                  {data.certifications.map((cert: string, i: number) => (
                    <p key={i} className="text-[12px] font-bold text-slate-700">{cert}</p>
                  ))}
                </div>
              </section>
            )}

            {interests.length > 0 && (
              <section>
                <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-100 pb-2 mb-4">
                  {headers.interests}
                </h3>
                <p className="text-[12px] text-slate-600">
                  {interests.join(', ')}
                </p>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVRenderer;


