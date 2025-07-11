import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface OrderNotesProps {
  order: any
  editedOrder: any
  isEditing: boolean
  onNotesChange: (notes: string) => void
}

export function OrderNotes({ order, editedOrder, isEditing, onNotesChange }: OrderNotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sifariş Qeydləri</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            placeholder="Add notes about this order..."
            value={editedOrder.notes || ""}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
          />
        ) : (
          <p className="text-gray-600">{order.note || "No additional notes for this order."}</p>
        )}
      </CardContent>
    </Card>
  )
}
