import React from "react";

interface GoogleMapProps {
  address?: string;
  height?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address = "123 Logistics Avenue, Shipping District",
  height = "400px",
}) => {
  // Encode the address for the Google Maps URL
  const encodedAddress = encodeURIComponent(address);

  return (
    <div
      className="w-full rounded-lg overflow-hidden shadow-md"
      style={{ height }}
    >
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`}
      ></iframe>
    </div>
  );
};

export default GoogleMap;
