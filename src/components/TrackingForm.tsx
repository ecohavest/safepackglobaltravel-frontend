import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { TrackingContext } from "../context/TrackingContext";
import { Button } from "../ui/Button";

interface TrackingFormProps {
  isDark?: boolean;
  isLarge?: boolean;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  isDark = false,
  isLarge = false,
}) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { checkTrackingId, loading } = useContext(TrackingContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    const formattedTrackingNumber = trackingNumber.trim().toUpperCase();

    setError("");
    setIsSubmitting(true);

    try {
      const exists = await checkTrackingId(formattedTrackingNumber);

      if (!exists) {
        setError("Tracking number not found");
        return;
      }

      navigate(`/tracking/${formattedTrackingNumber}`);
    } catch (err) {
      console.error("Error checking tracking number:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setTrackingNumber(value);
  };

  return (
    <div
      className={`${
        isDark ? "bg-black" : "bg-white"
      } rounded-lg shadow-lg p-6 md:p-8`}
    >
      <h2
        className={`${isDark ? "text-white" : "text-black-800"} font-semibold ${
          isLarge ? "text-2xl mb-6" : "text-xl mb-4"
        }`}
      >
        Track Your Shipment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter tracking number"
            className={`w-full outline-none py-3 px-4 ${
              isLarge ? "pl-12" : "pl-10"
            } outline-none rounded-lg focus:outline-none ${
              isDark
                ? "bg-white/10 text-white placeholder-gray-400"
                : "bg-white text-black-800 placeholder-gray-500"
            }`}
            value={trackingNumber}
            onChange={handleInputChange}
            disabled={isSubmitting || loading}
          />
          <Search
            size={isLarge ? 24 : 20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          className={`w-full bg-primary text-white font-medium py-3 px-4 rounded-lg transition-all ease-in-out hover:bg-black hover:text-white ${
            isLarge ? "text-lg" : "text-base"
          } ${isSubmitting || loading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? "Searching..." : "Track Now"}
        </Button>
      </form>
    </div>
  );
};

export default TrackingForm;
