'use client';

import { useState } from 'react';
import CVUploadPanel from './CVUploadPanel';
import JobInputPanel from './JobInputPanel';
import AnalyzeButton from './AnalyzeButton';
import AnimatedBackground from '../layout/AnimatedBackground';

export default function HeroUploadSection() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string>('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [profileDescription, setProfileDescription] = useState('');

  return (
    <div className="w-full mt-12 relative">
      <AnimatedBackground />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
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
          profileDescription={profileDescription}
          setProfileDescription={setProfileDescription}
        />
      </div>

      <div className="mt-12 flex justify-center pb-20">
        <AnalyzeButton 
          cvFile={cvFile} 
          cvUrl={cvUrl}
          jobTitle={jobTitle} 
          jobDescription={jobDescription}
          profileDescription={profileDescription} 
        />
      </div>
    </div>
  );
}
