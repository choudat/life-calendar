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
import { Calendar as CalendarIcon, Tag, Type, AlignLeft, Clock, Smile } from 'lucide-react';

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
  icon: z.string().max(10, "L'icône ne doit pas dépasser 10 caractères").optional(),
}).refine((data) => {
  if (data.endDate && data.startDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "La date de fin doit être après la date de début",
  path: ["endDate"],
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
    formState: { errors, isSubmitting },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, reset]);

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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      
      {/* Title Section */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Type className="w-4 h-4 text-slate-500" />
          Titre de l'événement
        </label>
        <Input
          {...register("title")}
          placeholder="Ex: Voyage au Japon, Nouveau Job..."
          className={cn("text-lg font-medium placeholder:font-normal", errors.title && "border-red-500")}
        />
        {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
      </div>

      {/* Dates Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            Début
          </label>
          <Input
            type="date"
            {...register("startDate")}
            className={cn(errors.startDate && "border-red-500")}
          />
           {errors.startDate && <p className="text-xs text-red-500 font-medium">{errors.startDate.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock className="w-4 h-4 text-slate-500" />
            Fin (optionnel)
          </label>
          <Input
            type="date"
            {...register("endDate")}
            className={cn(errors.endDate && "border-red-500")}
          />
          {errors.endDate && <p className="text-xs text-red-500 font-medium">{errors.endDate.message}</p>}
        </div>
      </div>

      {/* Category Section with Icon Preview */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Tag className="w-4 h-4 text-slate-500" />
          Catégorie
        </label>
        <div className="relative">
          <Select
            {...register("calendarId")}
            className="pl-10" // Make room for the dot
          >
            {calendars.map(cal => (
              <option key={cal.id} value={cal.id}>{cal.title}</option>
            ))}
          </Select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {selectedCalendar ? (
              <div className={cn("w-4 h-4 rounded-full border border-black/10 shadow-sm", selectedCalendar.color)} />
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-200" />
            )}
          </div>
        </div>
        {errors.calendarId && <p className="text-xs text-red-500 font-medium">{errors.calendarId.message}</p>}
      </div>

      {/* Icon and Description */}
      <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Smile className="w-4 h-4 text-slate-500" />
            Icône
          </label>
          <Input
            {...register("icon")}
            className="w-[80px] text-center text-3xl h-[60px] p-0 flex items-center justify-center"
            placeholder="✈️"
            maxLength={2}
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <AlignLeft className="w-4 h-4 text-slate-500" />
            Description
          </label>
           <Textarea 
             {...register("description")}
             placeholder="Ajoutez des détails, notes ou souvenirs..."
             className="min-h-[60px] resize-none h-[60px]"
           />
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-6">
        <Button
          type="button"
          variant="outline"
          className="text-slate-600"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]"
        >
          {isSubmitting ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
