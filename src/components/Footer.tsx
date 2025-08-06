import { Link } from "react-router-dom";
import {
  Package,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package size={32} className="text-white" />
              <span className="text-xl font-bold">SafepackLogistics</span>
            </div>
            <p className="text-gray-400 mb-4">
              Providing reliable logistics and courier services worldwide. Fast
              delivery, secure handling, and real-time tracking.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/tracking"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/#services">Domestic Delivery</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/#services">International Shipping</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/#services">Air Freight</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/#services">Sea Freight</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/#services">Warehouse Solutions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-white mt-1 flex-shrink-0" />
                <p className="text-gray-400"></p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-white flex-shrink-0" />
                <p className="text-gray-400">+14255650232</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-white flex-shrink-0" />
                <p className="text-gray-400">info@safepackglobaltravel.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} SafepackLogistics. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
