"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LifeEvent, CalendarCategory } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cn, parseLocalDate } from '@/lib/utils';

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis").max(50, "Le titre ne doit pas dépasser 50 caractères"),
  calendarId: z.string().min(1, "La catégorie est requise"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date de début invalide",
  }),
  endDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Date de fin invalide",
  }),
  description: z.string().optional(),
  icon: z.string().max(2, "L'icône ne doit pas dépasser 2 caractères").optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      calendarId: initialData?.calendarId || calendars[0]?.id || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "",
      id: initialData?.id,
      startDate: initialData?.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      endDate: initialData?.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : "",
    },
  });

  const selectedCalendarId = watch("calendarId");
  const selectedCalendar = calendars.find(c => c.id === selectedCalendarId);

  useEffect(() => {
    if (initialData) {
        reset({
            id: initialData.id,
            title: initialData.title || "",
            calendarId: initialData.calendarId || calendars[0]?.id || "",
            startDate: initialData.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            endDate: initialData.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : "",
            description: initialData.description || "",
            icon: initialData.icon || ""
        });
    }
  }, [initialData, reset, calendars]);

  const onFormSubmit = (data: FormValues) => {
    const eventData: LifeEvent = {
      id: data.id || crypto.randomUUID(),
      title: data.title,
      calendarId: data.calendarId,
      // Parse dates as local midnight to avoid timezone shifts
      startDate: parseLocalDate(data.startDate),
      endDate: data.endDate ? parseLocalDate(data.endDate) : undefined,
      description: data.description,
      icon: data.icon,
    };
    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 font-serif">Titre</label>
        <Input
          {...register("title")}
          placeholder="Ex: Nouveau job"
          className={cn(errors.title && "border-red-500", "font-serif")}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 font-serif">Date de début</label>
          <Input
            type="date"
            {...register("startDate")}
            className={cn(errors.startDate && "border-red-500")}
          />
           {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 font-serif">Date de fin (optionnel)</label>
          <Input
            type="date"
            {...register("endDate")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1 font-serif">Calendrier</label>
        <div className="flex items-center gap-2">
            {selectedCalendar && (
                <div className={cn("w-4 h-4 rounded-full border border-black/10 shrink-0", selectedCalendar.color)} />
            )}
            <Select
              {...register("calendarId")}
              className="flex-1"
            >
              {calendars.map(cal => (
                <option key={cal.id} value={cal.id}>{cal.title}</option>
              ))}
            </Select>
        </div>
        {errors.calendarId && <p className="text-xs text-red-500 mt-1">{errors.calendarId.message}</p>}
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 font-serif">Icône</label>
          <Input
            {...register("icon")}
            className="w-16 text-center text-xl"
            placeholder="👶"
            maxLength={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 font-serif">Description</label>
           <Textarea 
             {...register("description")}
             placeholder="Détails supplémentaires..."
             className="min-h-[80px]"
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
