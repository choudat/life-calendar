"use client";

import { useEvents } from "@/context/EventsContext";
import { format, differenceInYears, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BirthDateInputProps {
  className?: string;
  variant?: "onboarding" | "settings";
}

export function BirthDateInput({ className, variant = "onboarding" }: BirthDateInputProps) {
  const { birthDate, setBirthDate, lifeExpectancy, setLifeExpectancy } = useEvents();
  
  // Local state for input before committing (to avoid rapid re-renders on context)
  // Initialize with formatted string YYYY-MM-DD
  const [dateStr, setDateStr] = useState(() => {
    return isValid(birthDate) ? format(birthDate, "yyyy-MM-dd") : "";
  });
  
  const [lifeExpStr, setLifeExpStr] = useState(lifeExpectancy.toString());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateStr(val);
    
    const date = new Date(val);
    if (isValid(date) && date.getFullYear() > 1800 && date < new Date()) {
      setBirthDate(date);
    }
  };

  const handleLifeExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLifeExpStr(val);
    
    const num = parseInt(val);
    if (!isNaN(num) && num > 0 && num < 150) {
      setLifeExpectancy(num);
    }
  };

  if (variant === "settings") {
    return (
      <div className={cn("grid gap-4", className)}>
        <div className="grid gap-2">
          <label htmlFor="birthdate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Date de naissance
          </label>
          <Input
            id="birthdate"
            type="date"
            value={dateStr}
            onChange={handleDateChange}
            className="w-full"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="life-expectancy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Espérance de vie (années)
          </label>
          <Input
            id="life-expectancy"
            type="number"
            value={lifeExpStr}
            onChange={handleLifeExpChange}
            min={1}
            max={120}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  // Onboarding Variant
  return (
    <div className={cn("w-full max-w-sm mx-auto space-y-4", className)}>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Quand tout a commencé ?</h2>
        <p className="text-slate-500">Entrez votre date de naissance pour générer votre grille de vie.</p>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700">Date de naissance</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="date"
              value={dateStr}
              onChange={handleDateChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center text-sm">
           <span className="text-slate-500">Espérance : </span>
           <div className="flex items-center gap-2">
             <Input 
                type="number" 
                value={lifeExpStr} 
                onChange={handleLifeExpChange}
                className="w-16 h-8 text-center" 
             />
             <span className="text-slate-500">ans</span>
           </div>
        </div>
      </div>
    </div>
  );
}
