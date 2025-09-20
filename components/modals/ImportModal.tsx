"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "products" | "warehouses" | "customers" | "orders" | "shelves";
  onDownloadTemplate: () => void;
  onImport: (file: File) => Promise<void>; // Make this async
}

export function ImportModal({
  open,
  onOpenChange,
  type,
  onDownloadTemplate,
  onImport,
}: ImportModalProps) {
  const [fileName, setFileName] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  // Reset the file input when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFileName(undefined);
      setSelectedFile(null);
      setIsImporting(false);
    }
    onOpenChange(open);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleStartImport = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    try {
      await onImport(selectedFile);
      // Success - modal will be closed by parent component if needed
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Import failed:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const getTypeTitle = (type: string) => {
    const titles = {
      products: "Məhsullar",
      warehouses: "Anbarlar",
      customers: "Müştərilər",
      orders: "Sifarişlər",
      shelves: "Rəflər",
    };
    return titles[type as keyof typeof titles] || type;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTypeTitle(type)} İdxalı</DialogTitle>
          <DialogDescription>
            Toplu {getTypeTitle(type).toLowerCase()} idxalı üçün aşağıdakı addımları izləyin:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {isImporting ? (
            // Loading state
            <div className="text-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-primary" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {getTypeTitle(type)} yüklənir...
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Xahiş edirik səhifəni bağlamayın və gözləyin
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    📋 <strong>Fayl:</strong> {fileName}<br/>
                    ⏳ <strong>Status:</strong> Backend-də işlənir...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
          {/* Instructions */}
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium">Necə istifadə edilir?</h3>
              <ol className="list-decimal ml-4 space-y-2 text-muted-foreground">
                <li>Aşağıdakı "Şablon Yüklə" düyməsinə basaraq Excel şablonunu endirin</li>
                <li>Şablonu açın və tələb olunan məlumatları düzgün formatda doldurun</li>
                <li>Doldurulmuş faylı "Fayl Seç" düyməsi ilə seçin</li>
                <li>"İmport-a Başla" düyməsinə basaraq prosesi başladın</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Vacib Qeydlər:</h3>
              <ul className="list-disc ml-4 space-y-2 text-muted-foreground">
                <li>Bütün məcburi xanaları doldurun</li>
                <li>Məlumatları şablondakı formatda daxil edin</li>
                <li>Şablonun strukturunu dəyişməyin</li>
                <li>Böyük həcmli məlumatları hissələrə bölərək idxal edin</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={onDownloadTemplate}
              className="w-full border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
              disabled={isImporting}
            >
              <Download className="h-4 w-4 mr-2" />
              Şablon Yüklə
            </Button>

            <div className="space-y-2">
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isImporting}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {fileName ? fileName : "Fayl Seç"}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              {selectedFile && !isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">{fileName} seçildi</span>
                  </div>
                  <Button
                    onClick={handleStartImport}
                    className="w-full bg-purple-primary hover:bg-purple-600"
                  >
                    İmport-a Başla
                  </Button>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
