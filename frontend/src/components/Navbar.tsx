import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import UserAvatar from "./UserAvatar";

interface User {
  email: string;
  name: string;
  avatar?: string;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/upload", label: "Upload Image" },
    { path: "/predict", label: "Test Model" },
    { path: "/models", label: "Trained Models" },
  ];

  return (
    <nav className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
            Local Vision ML Image Classifier
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-white text-green-700 shadow-md transform scale-105"
                    : "text-white hover:bg-green-500 hover:shadow-md hover:scale-105"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <UserAvatar user={user} onLogout={onLogout} />
          </div>

          {/* Mobile menu button and avatar */}
          <div className="lg:hidden flex items-center gap-3">
            <UserAvatar user={user} onLogout={onLogout} />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-white text-green-700 shadow-md"
                    : "text-white hover:bg-green-500 hover:shadow-md"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}