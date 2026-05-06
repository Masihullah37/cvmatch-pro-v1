import { AlertTriangle } from "lucide-react";

interface FlawsListProps {
  flaws: string[];
  isGated?: boolean;
}

export default function FlawsList({ flaws, isGated = false }: FlawsListProps) {
  if (!flaws || flaws.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600">
          Points Faibles Détectés
        </h3>
        <p className="text-muted-foreground">Aucun problème majeur détecté sur votre CV.</p>
      </div>
    );
  }

  const visibleFlaws = isGated ? flaws.slice(0, 2) : flaws;
  const hiddenCount = isGated ? Math.max(0, flaws.length - 2) : 0;

  return (
    <div className="bg-card border border-destructive/20 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-destructive">
        <AlertTriangle size={20} />
        Points Faibles Détectés
      </h3>
      <ul className="space-y-3">
        {visibleFlaws.map((flaw, idx) => (
          <li key={idx} className="flex items-start gap-3 bg-destructive/5 p-3 rounded-lg border border-destructive/10">
            <span className="text-destructive mt-0.5">•</span>
            <span className="text-sm font-medium">{flaw}</span>
          </li>
        ))}
        {isGated && hiddenCount > 0 && (
          <li className="flex items-start gap-3 bg-destructive/5 p-3 rounded-lg border border-destructive/10 blur-[3px] opacity-40 select-none">
            <span className="text-destructive mt-0.5">•</span>
            <span className="text-sm font-medium">Contenu verrouillé pour les invités...</span>
          </li>
        )}
      </ul>
    </div>
  );
}
