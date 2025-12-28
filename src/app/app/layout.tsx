import Link from "next/link";
import { Calendar, Settings, List } from "lucide-react";
import { EventsProvider } from "@/context/EventsContext";
import { AppHeader } from "@/components/layout/app-header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventsProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AppHeader />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </EventsProvider>
  );
}
