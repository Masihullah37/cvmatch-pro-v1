const fs = require('fs');
let content = fs.readFileSync('components/templates/CVRenderer.tsx', 'utf8');

const headerDefaults = `    const interests = data.interests || [];

    const headers = data.headers || {
      summary: 'Profil',
      experience: 'Expérience',
      education: 'Formation',
      projects: 'Projets',
      skills: 'Compétences',
      languages: 'Langues',
      interests: 'Intérêts',
      contact: 'Contact'
    };`;

content = content.replace('    const interests = data.interests || [];', headerDefaults);

content = content.replace(/>Résumé</g, '>{headers.summary}<');
content = content.replace(/>Profil</g, '>{headers.summary}<');
content = content.replace(/>Profil Personnel</g, '>{headers.summary}<');

content = content.replace(/>Expérience</g, '>{headers.experience}<');
content = content.replace(/>Expériences</g, '>{headers.experience}<');
content = content.replace(/>Expérience Professionnelle</g, '>{headers.experience}<');
content = content.replace(/>Parcours</g, '>{headers.experience}<');
content = content.replace(/>Projets & Expériences</g, '>{headers.experience}<');

content = content.replace(/>Formation</g, '>{headers.education}<');

content = content.replace(/>Projets</g, '>{headers.projects}<');
content = content.replace(/>Projets Réalisés</g, '>{headers.projects}<');

content = content.replace(/>Compétences</g, '>{headers.skills}<');
content = content.replace(/>Expertise</g, '>{headers.skills}<');
content = content.replace(/>Skills</g, '>{headers.skills}<');

content = content.replace(/>Langues</g, '>{headers.languages}<');
content = content.replace(/>Intérêts</g, '>{headers.interests}<');
content = content.replace(/>Contact</g, '>{headers.contact}<');

fs.writeFileSync('components/templates/CVRenderer.tsx', content);
console.log('Headers replaced in CVRenderer.tsx');
