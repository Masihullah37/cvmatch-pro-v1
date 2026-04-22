import { ReactNode } from 'react';
import { LayoutDashboard, Users, FileSignature, MessageSquare, BarChart, Plus } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 min-h-screen bg-[#F0ECE1] border-r border-[#e5e0d4] flex flex-col p-4">
       <div className="flex items-center gap-3 mb-8 px-2">
         <div className="bg-black text-white p-2 rounded flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-0.5"></div>
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
         </div>
         <div>
           <h2 className="font-bold text-primary leading-tight">CVMatch Pro</h2>
           <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Suite de Recrutement</p>
         </div>
       </div>

       <nav className="flex-1 space-y-2">
         <a href="#" className="flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium text-sm">
           <LayoutDashboard size={18} /> Vue d'ensemble
         </a>
         <a href="#" className="flex items-center gap-3 text-primary px-4 py-3 rounded-lg font-medium text-sm hover:bg-black/5 transition-colors">
           <Users size={18} /> Candidats
         </a>
         <a href="#" className="flex items-center gap-3 text-primary px-4 py-3 rounded-lg font-medium text-sm hover:bg-black/5 transition-colors">
           <FileSignature size={18} /> Correspondances
         </a>
         <a href="#" className="flex items-center gap-3 text-primary px-4 py-3 rounded-lg font-medium text-sm hover:bg-black/5 transition-colors">
           <MessageSquare size={18} /> Messages
         </a>
         <a href="#" className="flex items-center gap-3 text-primary px-4 py-3 rounded-lg font-medium text-sm hover:bg-black/5 transition-colors">
           <BarChart size={18} /> Rapports
         </a>
       </nav>

       <div className="mt-auto pt-4">
         <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm">
           <Plus size={16} /> Créer une nouvelle offre
         </button>
       </div>
    </aside>
  );
}
