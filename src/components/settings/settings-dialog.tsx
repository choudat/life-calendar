import { useState, useRef } from "react";
import { Dialog } from "@/components/ui/dialog-simple";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventsContext";
import { exportEventsToCSV, parseCSVToEvents } from "@/lib/csv-utils";
import { Download, Upload, Trash2, Database } from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { events, importEvents, clearAllEvents, resetToMockData } = useEvents();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>("");

  const handleExport = () => {
    const csv = exportEventsToCSV(events);
    // Add BOM for Excel compatibility
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `life-calendar-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const parsedEvents = parseCSVToEvents(content);
        if (parsedEvents.length === 0) {
            setImportStatus("Aucun événement trouvé ou format invalide.");
            return;
        }
        // Cast to LifeEvent because parseCSVToEvents returns Partial<LifeEvent>[]
        // But we filtered for required fields in the util.
        importEvents(parsedEvents as any);
        setImportStatus(`${parsedEvents.length} événements importés avec succès !`);
        setTimeout(() => {
            onClose();
            setImportStatus("");
        }, 1500);
      } catch (error) {
        console.error(error);
        setImportStatus("Erreur lors de l'import du fichier.");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Paramètres">
      <div className="space-y-6 py-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-900">Gestion des données</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md border border-slate-200">
                  <Download className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Exporter les données</h4>
                  <p className="text-xs text-slate-500">Télécharger vos événements au format CSV</p>
                </div>
              </div>
              <Button onClick={handleExport} variant="outline" className="w-full justify-center">
                Exporter en CSV
              </Button>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md border border-slate-200">
                  <Upload className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Importer des données</h4>
                  <p className="text-xs text-slate-500">Importer des événements depuis un fichier CSV</p>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="hidden" 
              />
              <Button onClick={handleImportClick} variant="outline" className="w-full justify-center">
                Importer un CSV
              </Button>
              {importStatus && (
                <p className={`text-xs text-center ${importStatus.includes("succès") ? "text-emerald-600" : "text-red-600"}`}>
                  {importStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-medium text-red-600">Zone de danger</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border border-red-100 rounded-lg bg-red-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md border border-red-100">
                  <Database className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-red-900">Données de démonstration</h4>
                  <p className="text-xs text-red-700">Remplacer vos données par le jeu de démonstration</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  if (confirm("Attention : Cela remplacera toutes vos données actuelles par les données de démonstration. Continuer ?")) {
                    resetToMockData();
                    onClose();
                  }
                }} 
                variant="outline" 
                className="w-full justify-center border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 hover:border-red-300"
              >
                Charger les données du mock
              </Button>
            </div>

            <div className="p-4 border border-red-100 rounded-lg bg-red-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md border border-red-100">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-red-900">Supprimer toutes les données</h4>
                  <p className="text-xs text-red-700">Cette action est irréversible</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  if (confirm("Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible.")) {
                    clearAllEvents();
                    onClose();
                  }
                }} 
                variant="outline" 
                className="w-full justify-center border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 hover:border-red-300"
              >
                Tout supprimer
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-slate-400 text-center pt-4 border-t border-slate-100">
            Life Calendar v1.0
        </div>
      </div>
    </Dialog>
  );
}
