// Example: ../types.ts
export type ShipmentStatus =
  | "pending"
  | "processing"
  | "in_transit"
  | "delivered";

export interface ShipmentUpdate {
  timestamp: string;
  status: ShipmentStatus;
  description: string;
  location?: string;
  notes?: string;
}

export interface Shipment {
  id: string | number; // Assuming backend 'id' is present
  trackingId: string;
  recipient: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  service: string;
  shipDate: string; // ISO date string
  deliveryDate?: string | null; // ISO date string
  estimatedDelivery?: string | null; // ISO date string
  updates: ShipmentUpdate[];
}
