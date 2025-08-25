"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Upload, Calculator } from "lucide-react";
import { useState } from "react";
import { getImportTemplate } from "@/lib/api/template";

interface InventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => void;
}

export function InventoryModal({
  open,
  onOpenChange,
  onImport,
}: InventoryModalProps) {
  const [fileName, setFileName] = useState<string>();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onImport(file);
    }
    event.target.value = '';
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFileName(undefined);
    }
    onOpenChange(open);
  };

  const downloadTemplate = async () => {
    try {
      const response = await getImportTemplate("inventory");
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `stock_taking_template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anbar Sayımı</DialogTitle>
          <DialogDescription>
            Anbarınızdakı məhsulların faktiki sayımı üçün aşağıdakı addımları izləyin
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Instructions */}
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium">Necə istifadə edilir?</h3>
              <ol className="list-decimal ml-4 space-y-2 text-muted-foreground">
                <li>Aşağıdakı "Şablon Yüklə" düyməsinə basaraq Excel şablonunu endirin</li>
                <li>Anbarı fiziki olaraq sayın və məhsulların faktiki miqdarlarını şablona qeyd edin</li>
                <li>Doldurulmuş faylı "Fayl Seç" düyməsi ilə sistemə yükləyin</li>
                <li>Sistem faktiki sayımla mövcud stok arasındakı fərqləri müəyyən edəcək</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Vacib Qeydlər:</h3>
              <ul className="list-disc ml-4 space-y-2 text-muted-foreground">
                <li>Bütün məhsulları diqqətlə sayın</li>
                <li>Şablonda olan məhsul adlarını və SKU-ları dəyişməyin</li>
                <li>Yalnız faktiki saydığınız miqdarları daxil edin</li>
                <li>Fərqlər aşkarlandıqda sistem sizə bildiriş göndərəcək</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Şablon Yüklə
            </Button>

            <div className="space-y-2">
              <label className="w-full cursor-pointer">
                <Button
                  variant="outline"
                  className="w-full border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {fileName ? fileName : "Fayl Seç"}
                </Button>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {fileName && (
                <p className="text-xs text-muted-foreground text-center">
                  Fayl yükləndi. Modal bağlandıqdan sonra yoxlama prosesi başlayacaq.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
