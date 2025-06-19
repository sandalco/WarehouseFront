"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscriptionHistory } from "@/types/subscription/subscriptionhistory";
import { getHistory } from "@/lib/api/subscription";
import { Loader2 } from "lucide-react";

export function BillingHistory() {
  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Abunəlik tarixçəsi tapılmadı.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, idx) => (
        <Card key={idx} className="border shadow-sm">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-2">
            <div>
              <div className="font-semibold text-lg text-purple-primary">{item.packageName} Paketi</div>
              <div className="text-sm text-gray-500">
                Başlanğıc: <span className="font-medium text-gray-700">{new Date(item.startDate).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                Bitmə: <span className="font-medium text-gray-700">{new Date(item.endDate).toLocaleDateString()}</span>
              </div>
            </div>
            <Badge variant={item.isActive ? "default" : "outline"} color={item.isActive ? "success" : "secondary"}>
              {item.isActive ? "Aktiv" : "Bitib"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}