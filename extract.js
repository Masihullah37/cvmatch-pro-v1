const fs = require('fs');
const content = fs.readFileSync('components/templates/TemplateGrid.tsx', 'utf8');
const startMatch = content.indexOf('const renderCVLayout = (template: Template, isPreview: boolean = false) => {');
if (startMatch === -1) { console.error('Not found'); process.exit(1); }
let openBraces = 0;
let endMatch = -1;
let started = false;
for (let i = startMatch; i < content.length; i++) {
  if (content[i] === '{') { openBraces++; started = true; }
  else if (content[i] === '}') { openBraces--; }
  if (started && openBraces === 0) {
    endMatch = i;
    break;
  }
}
let funcContent = content.substring(startMatch, endMatch + 1);
funcContent = funcContent.replace('const renderCVLayout = (template: Template, isPreview: boolean = false) => {', 'export const CVRenderer = ({ template, isPreview = false, isPaid = true, analysisData = null }: any) => {');
const imports = "import React from 'react';\nimport { Shield, Lock, MapPin, Mail, Phone, ExternalLink, Sparkles } from 'lucide-react';\nimport Watermark from '@/components/templates/Watermark';\n\n";
fs.writeFileSync('components/templates/CVRenderer.tsx', imports + funcContent);
console.log('Extracted successfully');
