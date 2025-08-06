import React, { useEffect, useRef } from "react";
import {
  ArrowRight,
  Truck,
  Ship,
  Plane,
  Package,
  Shield,
  Clock,
  Globe,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import TrackingForm from "../components/TrackingForm";
import ServiceCard from "../ui/ServiceCard";
import ContactForm from "../components/ContactForm";
import GoogleMap from "../components/GoogleMap";
import { Card } from "../ui/Card";
import { WhatsAppChatIcon } from "../ui/Chat";

const HomePage = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const linkButtonStyle =
    "bg-primary text-white font-medium py-3 px-4 rounded-lg  transition-all ease-in-out hover:bg-black hover:text-white";

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.85;

      const animateSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current && scrollPosition > ref.current.offsetTop) {
          ref.current.classList.add("animate-fade-in-up");
          ref.current.classList.remove("opacity-0", "translate-y-10");
        }
      };

      animateSection(aboutRef);
      animateSection(servicesRef);
      animateSection(contactRef);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }, [location]);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark pt-32 pb-20 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Fast & Reliable <br />
                Logistics Solutions
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-lg">
                We provide efficient delivery services worldwide with real-time
                tracking and complete reliability.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/#services"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("services");
                    if (element) {
                      const headerOffset = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top + window.scrollY;
                      const offsetPosition = elementPosition - headerOffset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });

                      window.history.pushState(null, "", "/#services");
                    }
                  }}
                  className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  Our Services
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link
                  to="/tracking"
                  className="bg-transparent hover:bg-white/10 border border-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Track Shipment
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-5/12">
              <TrackingForm isDark={true} isLarge={true} />
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 100"
            className="text-white fill-current"
          >
            <path d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white" ref={aboutRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              About SafePack Swift Courier
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
              <img
                src="https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
                alt="Logistics Company Warehouse"
                className="rounded-lg shadow-xl"
              />
            </div>

            <div className="w-full lg:w-1/2 lg:pl-12">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Your Trusted Logistics Partner
              </h3>
              <p className="text-gray-600 mb-6">
                SafepackLogistics has grown into a leading logistics provider
                with a commitment to excellence and customer satisfaction. Our
                extensive network spans across 50+ countries, enabling us to
                provide seamless delivery solutions worldwide.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card
                  title="Global Network"
                  description="Operations in over 50 countries worldwide"
                  icon={Globe}
                />
                <Card
                  title="Fast Delivery"
                  description="On-time delivery with real-time tracking"
                  icon={Clock}
                />
                <Card
                  title="Safe Handling"
                  description="Secure packaging and careful transportation"
                  icon={Package}
                />
                <Card
                  title="Insured Shipments"
                  description="All packages are fully insured"
                  icon={Shield}
                />
              </div>

              <Link to="/tracking" className={linkButtonStyle}>
                Track Your Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50" ref={servicesRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Our Services
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              We offer a comprehensive range of logistics and transportation
              solutions to meet all your shipping needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={Truck}
              title="Domestic Delivery"
              description="Reliable and fast delivery services within the country, with options for express and standard shipping."
            />

            <ServiceCard
              icon={Plane}
              title="Air Freight"
              description="Expedited shipping solutions via air freight for time-sensitive deliveries across continents."
            />

            <ServiceCard
              icon={Ship}
              title="Sea Freight"
              description="Cost-effective shipping for large cargo and bulk items across international waters."
            />

            <ServiceCard
              icon={Package}
              title="Warehousing"
              description="Secure storage facilities with inventory management systems for your goods."
            />

            <ServiceCard
              icon={Globe}
              title="International Shipping"
              description="Worldwide delivery services with customs clearance assistance and documentation."
            />

            <ServiceCard
              icon={Shield}
              title="Cargo Insurance"
              description="Comprehensive insurance coverage for all types of shipments to protect your valuable items."
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white" ref={contactRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Contact Us
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Have questions about our services? Get in touch with our team and
              we'll be happy to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ContactForm />

            <div className="space-y-6">
              <GoogleMap
                address="123 Logistics Avenue, Shipping District"
                height="300px"
              />

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Our Offices
                </h3>
                <div className="space-y-4">
                  <Card
                    title="Headquaters"
                    description="123 Logistics Avenue, Shipping District, SC 29001, USA"
                    icon={MapPin}
                  />

                  <Card
                    title="Call Us"
                    description="+14255650232"
                    icon={Phone}
                  />

                  <Card
                    title="Email Us"
                    description="info@safepackglobaltravel.com"
                    icon={Mail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WhatsAppChatIcon />
    </div>
  );
};

export default HomePage;
