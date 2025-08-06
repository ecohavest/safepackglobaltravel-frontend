import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Package } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    // Handle anchor links (e.g., /#about, /#services, /#contact)
    if (path.startsWith("/#")) {
      e.preventDefault();
      const sectionId = path.replace("/#", "");
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

        window.history.pushState(null, "", `/#${sectionId}`);
        setIsMenuOpen(false);
      }
    }
    // Handle Home link (/): Scroll to top if on homepage, navigate if on other pages
    else if (path === "/") {
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        window.history.pushState(null, "", "/");
        setIsMenuOpen(false);
      } else {
        // Allow default Link behavior to navigate to /
        setIsMenuOpen(false);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Define all nav links
  const allNavLinks = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/#about" },
    { title: "Services", path: "/#services" },
    { title: "Track Shipment", path: "/tracking" },
    { title: "Contact", path: "/#contact" },
  ];

  // Show only 'Home' link on /tracking routes
  const navLinks = location.pathname.startsWith("/tracking")
    ? allNavLinks.filter((link) => link.path === "/")
    : allNavLinks;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="flex items-center space-x-2"
        >
          <Package size={32} className="text-primary" />
          <span className="text-xl font-bold text-primary">
            SafepackLogistics
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.path}
              onClick={(e) => handleNavClick(e, link.path)}
              className={`font-medium transition-colors ${
                location.pathname === link.path ||
                (location.pathname === "/" &&
                  link.path === `/#${location.hash.replace("#", "")}`)
                  ? "text-primary"
                  : `${
                      isScrolled ? "text-gray-800" : "text-gray-800"
                    } hover:text-primary`
              }`}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white w-full shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`font-medium transition-colors ${
                  location.pathname === link.path ||
                  (location.pathname === "/" &&
                    link.path === `/#${location.hash.replace("#", "")}`)
                    ? "text-primary"
                    : "text-gray-800 hover:text-primary"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
