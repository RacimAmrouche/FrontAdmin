import React from 'react';
import { Link } from 'react-router-dom'; // ou `next/link` si tu es sur Next.js

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">MyApp</div>
      <ul className="flex space-x-6">
        <li><Link to="../pages/Admin/" className="hover:text-gray-300">Home</Link></li>
        <li><Link to="../pages/VerifPat" className="hover:text-gray-300">About</Link></li>
        <li><Link to="../pages/VerifPros" className="hover:text-gray-300">Alerts</Link></li>
      </ul>
    </nav>
  );
}
