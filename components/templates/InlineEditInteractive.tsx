"use client";

import React, { useState, useRef } from 'react';

const InlineEditInteractive = ({ value, path, isInteractive, onUpdate, className = "", multiline = false }: any) => {
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
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
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

export default InlineEditInteractive;
