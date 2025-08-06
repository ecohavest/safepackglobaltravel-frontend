import { MessageCircle } from "lucide-react";
import { useState } from "react";

export const WhatsAppChatIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = "+14255650232";
  const message = "Hello, I have a question";

  const openWhatsApp = () => {
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    window.open(
      `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip */}
      {isHovered && (
        <div className="mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg">
          Chat with us on WhatsApp
        </div>
      )}

      {/* Animated Button */}
      <button
        onClick={openWhatsApp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center relative group"
      >
        <MessageCircle className="w-6 h-6" />
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-70 animate-ping duration-1000"></span>
      </button>
    </div>
  );
};
