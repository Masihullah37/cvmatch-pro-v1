'use client';

import { useState } from 'react';
import CVUploadPanel from './CVUploadPanel';
import JobInputPanel from './JobInputPanel';
import AnalyzeButton from './AnalyzeButton';

export default function HeroUploadSection() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string>('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  return (
    <div className="w-full mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <JobInputPanel 
          jobTitle={jobTitle} 
          setJobTitle={setJobTitle} 
          jobDescription={jobDescription} 
          setJobDescription={setJobDescription} 
        />
        <CVUploadPanel 
          cvFile={cvFile} 
          setCvFile={setCvFile}
          cvUrl={cvUrl}
          setCvUrl={setCvUrl}
        />
      </div>

      <div className="mt-8 flex justify-center pb-12">
        <AnalyzeButton 
          cvFile={cvFile} 
          cvUrl={cvUrl}
          jobTitle={jobTitle} 
          jobDescription={jobDescription} 
        />
      </div>
    </div>
  );
}
