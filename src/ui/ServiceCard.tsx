import React from "react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md transition-transform hover:-translate-y-1 duration-300 overflow-hidden group">
      <div className="p-6">
        {Icon && (
          <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
            <Icon
              size={24}
              className="text-white group-hover:text-white transition-colors duration-300"
            />
          </div>
        )}
        <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="bg-gray-50 py-3 px-6 text-primaryont-medium text-center border-t border-gray-100">
        Learn More
      </div>
    </div>
  );
};

export default ServiceCard;
