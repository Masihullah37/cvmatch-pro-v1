import { Lightbulb, CheckCircle } from "lucide-react";

interface ImprovementSuggestionsProps {
  suggestions: string[];
}

export default function ImprovementSuggestions({ suggestions }: ImprovementSuggestionsProps) {
  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
        <Lightbulb size={20} />
        Suggestions d'Amélioration
      </h3>
      <ul className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
            <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
            <span className="text-sm">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
