import { useState } from "react";
import { CalendarCategory } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CalendarFormProps {
  initialData?: Partial<CalendarCategory>;
  onSubmit: (data: CalendarCategory) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const COLORS = [
  "bg-slate-500", "bg-red-500", "bg-orange-500", "bg-amber-500",
  "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500",
  "bg-teal-500", "bg-cyan-500", "bg-sky-500", "bg-blue-500",
  "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
  "bg-pink-500", "bg-rose-500"
];

export function CalendarForm({ initialData, onSubmit, onCancel, submitLabel = "Enregistrer" }: CalendarFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [color, setColor] = useState(initialData?.color || COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      title,
      color,
      isVisible: initialData?.isVisible ?? true,
      icon: initialData?.icon
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom du calendrier</label>
        <Input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Ex: Travail, Santé..."
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Couleur</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "w-6 h-6 rounded-full transition-all",
                c,
                color === c ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "hover:scale-110"
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
