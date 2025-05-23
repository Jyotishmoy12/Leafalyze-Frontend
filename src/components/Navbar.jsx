import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAnalysisPage = location.pathname === '/analysis';

  const buttonProps = isAnalysisPage 
    ? {
        to: '/',
        text: 'Home'
      }
    : {
        to: '/analysis',
        text: 'Analysis'
      };

  return (
    <nav className="bg-black px-6 py-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png" // Replace with your logo's path
            alt="Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-white text-xl font-bold tracking-wide">
            Leafalyze
          </span>
        </div>

        {/* Navigation Links */}
        <div>
          <Link
            to={buttonProps.to}
            className="text-white border border-white hover:bg-white hover:text-black px-4 py-2 rounded-md text-sm font-medium shadow-md transition duration-300"
          >
            {buttonProps.text}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;