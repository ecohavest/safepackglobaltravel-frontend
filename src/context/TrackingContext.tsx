import React, { createContext, useState, useEffect } from "react";
import { Shipment, ShipmentStatus } from "../types";
import { mockShipments } from "../data/mockData";

interface TrackingContextType {
  shipments: Shipment[];
  getShipmentByTrackingId: (trackingId: string) => Promise<Shipment | null>;
  checkTrackingId: (trackingId: string) => Promise<boolean>;
  updateShipment: (updatedShipment: Shipment) => void;
  createShipment: (newShipment: Omit<Shipment, "updates">) => void;
  editShipment: (trackingId: string, updatedData: Partial<Shipment>) => void;
  loading: boolean;
}

// Backend tracking data structure
interface BackendTracking {
  id: number;
  trackingNumber: string;
  recipientName: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  status: string;
  service: string;
  shipDate: number | null;
  deliveryDate: number | null;
  estimatedDeliveryDate: number | null;
}

// Convert backend tracking format to frontend Shipment format
const mapTrackingToShipment = (tracking: BackendTracking): Shipment => {
  return {
    id: tracking.id,
    trackingId: tracking.trackingNumber,
    recipient: tracking.recipientName,
    recipientPhone: tracking.recipientPhone,
    origin: tracking.origin,
    destination: tracking.destination,
    status: tracking.status as ShipmentStatus,
    service: tracking.service,
    shipDate: tracking.shipDate
      ? new Date(tracking.shipDate).toISOString()
      : new Date().toISOString(),
    deliveryDate: tracking.deliveryDate
      ? new Date(tracking.deliveryDate).toISOString()
      : null,
    estimatedDelivery: tracking.estimatedDeliveryDate
      ? new Date(tracking.estimatedDeliveryDate).toISOString()
      : null,
    updates: [
      {
        timestamp: new Date().toISOString(),
        status: tracking.status as ShipmentStatus,
        description: `Current status: ${tracking.status}`,
        location: tracking.destination,
      },
    ],
  };
};

export const TrackingContext = createContext<TrackingContextType>({
  shipments: [],
  getShipmentByTrackingId: async () => null,
  checkTrackingId: async () => false,
  updateShipment: () => {},
  createShipment: () => {},
  editShipment: () => {},
  loading: false,
});

interface TrackingProviderProps {
  children: React.ReactNode;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({
  children,
}) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load shipments from mock data for initial state
    // In a real app, you might fetch all shipments or recent ones
    setShipments(mockShipments);
  }, []);

  // Fetch tracking info from API
  const fetchTrackingInfo = async (
    trackingId: string
  ): Promise<Shipment | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://safepackglobaltravel.onrender.com/api/public/tracking/${trackingId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API error: ${response.statusText}`);
      }

      const trackingData = await response.json();
      return mapTrackingToShipment(trackingData);
    } catch (error) {
      console.error("Error fetching tracking info:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getShipmentByTrackingId = async (
    trackingId: string
  ): Promise<Shipment | null> => {
    // First check if we already have it in state
    const existingShipment = shipments.find(
      (shipment) => shipment.trackingId === trackingId
    );

    if (existingShipment) {
      return existingShipment;
    }

    // If not in state, fetch from API
    const fetchedShipment = await fetchTrackingInfo(trackingId);

    // If found, add to state for future reference
    if (fetchedShipment) {
      setShipments((prev) => [...prev, fetchedShipment]);
    }

    return fetchedShipment;
  };

  const checkTrackingId = async (trackingId: string): Promise<boolean> => {
    // First check local state
    if (shipments.some((shipment) => shipment.trackingId === trackingId)) {
      return true;
    }

    // If not in state, check API
    const shipment = await fetchTrackingInfo(trackingId);
    return shipment !== null;
  };

  const updateShipment = (updatedShipment: Shipment): void => {
    setShipments((prevShipments) =>
      prevShipments.map((shipment) =>
        shipment.trackingId === updatedShipment.trackingId
          ? updatedShipment
          : shipment
      )
    );
  };

  const createShipment = (newShipment: Omit<Shipment, "updates">): void => {
    const initialUpdate: Shipment["updates"][0] = {
      status: "pending",
      description: "Shipping label created",
      location: newShipment.origin,
      timestamp: new Date().toISOString(),
    };

    const shipmentWithUpdates: Shipment = {
      ...newShipment,
      updates: [initialUpdate],
    };

    setShipments((prevShipments) => [...prevShipments, shipmentWithUpdates]);
  };

  const editShipment = (
    trackingId: string,
    updatedData: Partial<Shipment>
  ): void => {
    setShipments((prevShipments) =>
      prevShipments.map((shipment) =>
        shipment.trackingId === trackingId
          ? { ...shipment, ...updatedData }
          : shipment
      )
    );
  };

  return (
    <TrackingContext.Provider
      value={{
        shipments,
        getShipmentByTrackingId,
        checkTrackingId,
        updateShipment,
        createShipment,
        editShipment,
        loading,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
