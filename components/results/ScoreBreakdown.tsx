import { Progress } from "@/components/ui/progress"; // Assuming shadcn progress is setup

interface ScoreBreakdownProps {
  breakdown: any;
}

export default function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  if (!breakdown) return null;

  const categories = [
    { key: 'keywordMatch', label: 'Correspondance Mots-clés' },
    { key: 'format', label: 'Format & Structure' },
    { key: 'experience', label: 'Pertinence Expérience' },
    { key: 'education', label: 'Correspondance Éducation' },
    { key: 'skills', label: 'Alignement Compétences' },
    { key: 'readability', label: 'Lisibilité' },
  ];

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-6">Détail du Score</h3>
      <div className="space-y-6">
        {categories.map(({ key, label }) => {
          const data = breakdown[key];
          if (!data) return null;
          
          const percentage = (data.score / data.max) * 100;
          let colorClass = "bg-green-500";
          if (percentage < 50) colorClass = "bg-red-500";
          else if (percentage < 80) colorClass = "bg-yellow-500";

          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>{label}</span>
                <span className="text-muted-foreground">{data.score} / {data.max}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
