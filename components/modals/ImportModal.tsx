"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useState } from "react";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "products" | "warehouses" | "customers" | "orders" | "shelves";
  onDownloadTemplate: () => void;
  onImport: (file: File) => void;
}

export function ImportModal({
  open,
  onOpenChange,
  type,
  onDownloadTemplate,
  onImport,
}: ImportModalProps) {
  const [fileName, setFileName] = useState<string>();
  
  // Reset the file input when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFileName(undefined);
    }
    onOpenChange(open);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onImport(file);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
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
          {/* Instructions */}
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium">Necə istifadə edilir?</h3>
              <ol className="list-decimal ml-4 space-y-2 text-muted-foreground">
                <li>Aşağıdakı "Şablon Yüklə" düyməsinə basaraq Excel şablonunu endirin</li>
                <li>Şablonu açın və tələb olunan məlumatları düzgün formatda doldurun</li>
                <li>Doldurulmuş faylı "Fayl Seç" düyməsi ilə sistemə yükləyin</li>
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
              {fileName && (
                <p className="text-xs text-muted-foreground text-center">
                  Fayl yükləndi. Modal bağlandıqdan sonra idxal prosesi başlayacaq.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
