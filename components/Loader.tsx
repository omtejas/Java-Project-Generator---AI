
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-300 font-semibold">Generating your Java project...</p>
      <p className="mt-2 text-sm text-gray-500">This might take a moment. Please wait.</p>
    </div>
  );
};

export default Loader;
