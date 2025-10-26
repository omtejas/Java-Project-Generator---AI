
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 border-b border-gray-700">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
        Java Project Generator
      </h1>
      <p className="text-gray-400 mt-2 text-lg">
        Turn your project idea into a complete Java application with AI.
      </p>
    </header>
  );
};

export default Header;
