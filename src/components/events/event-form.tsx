import React, { useState, useEffect } from 'react';
import { LifeEvent, CalendarCategory } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { format } from 'date-fns';

interface EventFormProps {
  initialData?: Partial<LifeEvent>;
  calendars: CalendarCategory[];
  onSubmit: (data: LifeEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function EventForm({ 
  initialData, 
  calendars, 
  onSubmit, 
  onCancel,
  submitLabel = "Enregistrer"
}: EventFormProps) {
  const [formData, setFormData] = useState<Partial<LifeEvent>>({
    title: "",
    calendarId: calendars[0]?.id || "default",
    startDate: new Date(),
    icon: "",
    description: "",
    ...initialData
  });

  // Update form data if initialData changes (e.g. when switching between add/edit in same dialog)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.calendarId || !formData.startDate) return;

    const eventData: LifeEvent = {
      id: formData.id || crypto.randomUUID(),
      title: formData.title,
      calendarId: formData.calendarId,
      startDate: formData.startDate instanceof Date ? formData.startDate : new Date(formData.startDate!),
      endDate: formData.endDate ? (formData.endDate instanceof Date ? formData.endDate : new Date(formData.endDate)) : undefined,
      icon: formData.icon,
      description: formData.description
    };

    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
        <Input
          type="text"
          required
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          placeholder="Ex: Nouveau job"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
          <Input
            type="date"
            required
            value={formData.startDate ? format(new Date(formData.startDate), 'yyyy-MM-dd') : ''}
            onChange={e => setFormData({...formData, startDate: new Date(e.target.value)})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin (optionnel)</label>
          <Input
            type="date"
            value={formData.endDate ? format(new Date(formData.endDate), 'yyyy-MM-dd') : ''}
            onChange={e => setFormData({...formData, endDate: e.target.value ? new Date(e.target.value) : undefined})}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Calendrier</label>
        <Select
          value={formData.calendarId}
          onChange={e => setFormData({...formData, calendarId: e.target.value})}
        >
          {calendars.map(cal => (
            <option key={cal.id} value={cal.id}>{cal.title}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Icône</label>
          <Input
            type="text"
            maxLength={2}
            value={formData.icon}
            onChange={e => setFormData({...formData, icon: e.target.value})}
            className="w-16 text-center"
            placeholder="👶"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <Input
            type="text"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Détails supplémentaires..."
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          type="submit"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
