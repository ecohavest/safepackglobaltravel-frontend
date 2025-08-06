import { LucideIcon } from "lucide-react";

interface CardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export const Card = ({ title, description, icon: Icon }: CardProps) => (
  <div className="flex items-start">
    {/* <div className="mr-4 p-2 bg-primary-light rounded-full">{icon}</div> */}
    {Icon && (
      <div className="mr-4 p-2 bg-primary-light rounded-full">
        <Icon size={24} className="w-5 h-5 text-white" />{" "}
        {/* Added className for proper sizing */}
      </div>
    )}
    <div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);
