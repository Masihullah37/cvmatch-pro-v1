'use client';

import { useEffect } from 'react';

interface CVPrintViewProps {
  template: {
    id: string;
    templateStyle: string;
    templateData: any;
  };
}

function renderLang(lang: any): string {
  return lang.language || lang.name || (typeof lang === 'string' ? lang : '');
}

export default function CVPrintView({ template }: CVPrintViewProps) {
  const data = template.templateData || {};
  const style = template.templateStyle;

  const name = data.userName || 'Candidat';
  const title = data.jobTitle || '';
  const summaryText = data.summary || '';
  const experiences = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];
  const contact = data.contact || {};
  const projects = data.projects || [];
  const languages = data.languages || [];
  const interests = data.interests || [];

  useEffect(() => {
    // Small delay so the page renders before print dialog opens
    const timer = setTimeout(() => window.print(), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{`CV - ${name}`}</title>
        <style>{`
          @page { margin: 0; size: A4; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: sans-serif; background: white; }
          @media screen { body { display: flex; justify-content: center; padding: 20px; background: #f0f0f0; } }
        `}</style>
      </head>
      <body>
        <div style={{ width: '210mm', minHeight: '297mm', background: 'white', position: 'relative', overflow: 'hidden' }}>

          {/* Eclipse */}
          {style === 'Eclipse' && (
            <div style={{ display: 'flex', minHeight: '297mm', fontFamily: 'sans-serif' }}>
              <div style={{ width: '35%', background: '#1a1a1a', color: 'white', padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', marginBottom: '12px', margin: '0 0 12px' }}>{name}</h1>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{title}</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '6px', marginBottom: '12px' }}>Contact</h3>
                  <p style={{ fontSize: '10px', opacity: 0.8, margin: '4px 0' }}>{contact.email}</p>
                  <p style={{ fontSize: '10px', opacity: 0.8, margin: '4px 0' }}>{contact.phone}</p>
                  <p style={{ fontSize: '10px', opacity: 0.8, margin: '4px 0' }}>{contact.location}</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '6px', marginBottom: '12px' }}>Compétences</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {skills.map((s: string, i: number) => <span key={i} style={{ fontSize: '9px', background: 'rgba(255,255,255,0.1)', padding: '3px 7px', borderRadius: '4px' }}>{s}</span>)}
                  </div>
                </div>
                {languages.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '6px', marginBottom: '12px' }}>Langues</h3>
                    {languages.map((lang: any, i: number) => (
                      <div key={i} style={{ fontSize: '9px', marginBottom: '6px' }}>
                        <span style={{ display: 'block', fontWeight: 700 }}>{renderLang(lang)}</span>
                        <span style={{ opacity: 0.6 }}>{lang.level}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, padding: '40px', background: 'white' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', borderLeft: '4px solid black', paddingLeft: '12px', marginBottom: '16px' }}>Profil</h2>
                <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#4b5563', marginBottom: '32px' }}>{summaryText}</p>
                <h2 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', borderLeft: '4px solid black', paddingLeft: '12px', marginBottom: '16px' }}>Expérience</h2>
                {experiences.map((exp: any, i: number) => (
                  <div key={i} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '12px' }}>
                      <span>{exp.title}</span><span style={{ color: '#9ca3af' }}>{exp.period}</span>
                    </div>
                    <p style={{ fontSize: '10px', fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', margin: '4px 0 6px' }}>{exp.company}</p>
                    <p style={{ fontSize: '11px', color: '#4b5563', lineHeight: 1.5 }}>{exp.description}</p>
                  </div>
                ))}
                {projects.length > 0 && <>
                  <h2 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', borderLeft: '4px solid black', paddingLeft: '12px', marginBottom: '16px', marginTop: '24px' }}>Projets</h2>
                  {projects.map((proj: any, i: number) => (
                    <div key={i} style={{ marginBottom: '16px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 4px' }}>{proj.name}</p>
                      <p style={{ fontSize: '10px', color: '#9ca3af', margin: '0 0 6px', fontStyle: 'italic' }}>{proj.technologies?.join(', ')}</p>
                      <p style={{ fontSize: '11px', color: '#4b5563' }}>{proj.description}</p>
                    </div>
                  ))}
                </>}
                {education.length > 0 && <>
                  <h2 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', borderLeft: '4px solid black', paddingLeft: '12px', marginBottom: '16px', marginTop: '24px' }}>Formation</h2>
                  {education.map((edu: any, i: number) => (
                    <div key={i} style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '12px' }}>
                        <span>{edu.degree}</span><span style={{ color: '#9ca3af' }}>{edu.year}</span>
                      </div>
                      <p style={{ fontSize: '10px', fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', margin: '2px 0' }}>{edu.school}</p>
                    </div>
                  ))}
                </>}
              </div>
            </div>
          )}

          {/* Generic fallback for all other styles */}
          {style !== 'Eclipse' && (
            <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
              <div style={{ borderBottom: '3px solid #111', paddingBottom: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h1 style={{ fontSize: '36px', fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{name}</h1>
                  <p style={{ fontSize: '16px', color: '#6b7280', fontWeight: 700, margin: 0 }}>{title}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#6b7280' }}>
                  <p style={{ margin: '2px 0' }}>{contact.email}</p>
                  <p style={{ margin: '2px 0' }}>{contact.phone}</p>
                  <p style={{ margin: '2px 0' }}>{contact.location}</p>
                </div>
              </div>
              {summaryText && <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#374151', marginBottom: '28px', fontStyle: 'italic' }}>{summaryText}</p>}
              <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px', marginBottom: '16px' }}>Expérience</h3>
              {experiences.map((exp: any, i: number) => (
                <div key={i} style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '13px' }}>{exp.title} — {exp.company}</strong>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{exp.period}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px', lineHeight: 1.5 }}>{exp.description}</p>
                </div>
              ))}
              {skills.length > 0 && <>
                <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px', marginBottom: '14px', marginTop: '24px' }}>Compétences</h3>
                <p style={{ fontSize: '12px', color: '#374151' }}>{skills.join(' • ')}</p>
              </>}
              {education.length > 0 && <>
                <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px', marginBottom: '14px', marginTop: '24px' }}>Formation</h3>
                {education.map((edu: any, i: number) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <strong style={{ fontSize: '12px' }}>{edu.degree}</strong> — <span style={{ fontSize: '11px', color: '#6b7280' }}>{edu.school}, {edu.year}</span>
                  </div>
                ))}
              </>}
              {languages.length > 0 && <>
                <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px', marginBottom: '14px', marginTop: '24px' }}>Langues</h3>
                <p style={{ fontSize: '12px', color: '#374151' }}>{languages.map((l: any) => `${renderLang(l)} (${l.level})`).join(' • ')}</p>
              </>}
            </div>
          )}

        </div>
      </body>
    </html>
  );
}
