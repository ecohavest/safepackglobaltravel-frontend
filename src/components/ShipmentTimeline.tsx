import React from "react";
import { CheckCircle, Clock, Truck, Package, MapPin } from "lucide-react";
import { Shipment, ShipmentStatus } from "../types";

interface ShipmentTimelineProps {
  shipment: Shipment;
}

const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ shipment }) => {
  // Function to determine the icon based on status
  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-500" size={24} />;
      case "in_transit":
        return <Truck className="text-primary" size={24} />;
      case "processing":
        return <Package className="text-yellow-500" size={24} />;
      case "pending":
        return <Clock className="text-gray-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Shipment Timeline</h2>

      <div className="space-y-6">
        {shipment.updates.map((update, index) => (
          <div key={index} className="relative">
            {/* Line connecting timeline items */}
            {index < shipment.updates.length - 1 && (
              <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
            )}

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                {getStatusIcon(update.status)}
              </div>

              <div className="flex-grow pb-6">
                <div className="text-lg font-medium text-gray-800">
                  {update.description}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {formatDate(update.timestamp)}
                </div>

                {update.location && (
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin size={16} className="mr-1" />
                    {update.location}
                  </div>
                )}

                {update.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {update.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentTimeline;
