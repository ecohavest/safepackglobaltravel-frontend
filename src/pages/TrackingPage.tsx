import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrackingForm from "../components/TrackingForm";
import ShipmentDetails from "../components/ShipmentDetails";
import ShipmentTimeline from "../components/ShipmentTimeline";
import { TrackingContext } from "../context/TrackingContext";
import { Shipment } from "../types";
import { Package, AlertTriangle } from "lucide-react";
import { WhatsAppChatIcon } from "../ui/Chat";

const TrackingPage = () => {
  const { trackingId } = useParams<{ trackingId?: string }>();
  const { getShipmentByTrackingId } = useContext(TrackingContext);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShipment = async () => {
      if (trackingId) {
        const foundShipment = await getShipmentByTrackingId(trackingId);
        if (foundShipment) {
          setShipment(foundShipment);
          setNotFound(false);
        } else {
          setShipment(null);
          setNotFound(true);
        }
      } else {
        setShipment(null);
        setNotFound(false);
      }
    };
    fetchShipment();
  }, [trackingId, getShipmentByTrackingId]);

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Track Your Shipment
          </h1>

          {/* Tracking form */}
          <div className="mb-10">
            <TrackingForm />
          </div>

          {/* Tracking results */}
          {notFound && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-500" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Tracking Number Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any shipment with the tracking number:{" "}
                <strong>{trackingId}</strong>
              </p>
              <p className="text-gray-600 mb-6">
                Please check the tracking number and try again, or contact our
                customer service for assistance.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}

          {!trackingId && !notFound && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
                  <Package size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Enter Your Tracking Number
              </h2>
              <p className="text-gray-600">
                Please enter your tracking number in the form above to see your
                shipment status and details.
              </p>
            </div>
          )}

          {shipment && (
            <div className="space-y-8 animate-fade-in">
              <ShipmentDetails shipment={shipment} />
              <ShipmentTimeline shipment={shipment} />
            </div>
          )}
        </div>
      </div>
      <WhatsAppChatIcon />
    </div>
  );
};

export default TrackingPage;
