import React from "react";
import {
  Package,
  Calendar,
  MapPin,
  User,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Shipment } from "../types";

interface ShipmentDetailsProps {
  shipment: Shipment;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment }) => {
  const getStatusBadge = () => {
    switch (shipment.status) {
      case "delivered":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <CheckCircle size={16} className="mr-1" />
            Delivered
          </span>
        );
      case "in_transit":
        return (
          <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Truck size={16} className="mr-1" />
            In Transit
          </span>
        );
      case "processing":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Package size={16} className="mr-1" />
            Processing
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Package size={16} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Shipment #{shipment.trackingId}
        </h2>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Shipment Information
          </h3>

          <div className="space-y-3">
            <div className="flex">
              <Package
                size={20}
                className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="font-medium text-gray-800">{shipment.service}</p>
              </div>
            </div>

            <div className="flex">
              <Calendar
                size={20}
                className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-500">Shipment Date</p>
                <p className="font-medium text-gray-800">
                  {formatDate(shipment.shipDate)}
                </p>
              </div>
            </div>

            <div className="flex">
              <Calendar
                size={20}
                className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium text-gray-800">
                  {shipment.estimatedDelivery
                    ? formatDate(shipment.estimatedDelivery)
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Delivery Details
          </h3>

          <div className="space-y-3">
            <div className="flex">
              <User
                size={20}
                className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-500">Recipient</p>
                <p className="font-medium text-gray-800">
                  {shipment.recipient}
                </p>
              </div>
            </div>

            <div className="flex">
              <MapPin
                size={20}
                className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-500">Origin</p>
                <p className="font-medium text-gray-800">{shipment.origin}</p>
              </div>
            </div>

            <div className="flex">
              <MapPin
                size={20}
                className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-medium text-gray-800">
                  {shipment.destination}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
