import React from 'react';
import Navbar from '../navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
