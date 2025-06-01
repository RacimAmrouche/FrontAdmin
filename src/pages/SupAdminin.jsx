"use client"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import {signinSuperAdmin } from '../../services/auth'; // ✅

const SupAdminin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set('Role', '50'); // ✅ rôle SuperAdmin
    formData.set('UIDKEY', formData.get('Key')); // ✅ corriger le nom de champ pour correspondre au backend

    try {
      const response = await signinSuperAdmin(formData);
      const data = response.data;
      console.log("Réponse du back :", data);
      localStorage.setItem('user', JSON.stringify(data));
      alert('Connexion réussie ✅');
      navigate("/SuperAdmin");
    } catch (error) {
      alert('Échec de la connexion ❌');
      console.error("Erreur", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl flex overflow-hidden rounded-2xl shadow-xl">
        <div className="hidden md:block w-2/5 bg-gradient-to-b from-[#F05050] to-[#D32F2F] p-12 text-white">
          <div className="h-full flex flex-col justify-between">
            <h2 className="text-3xl font-bold mb-6">Welcome to E-mergency</h2>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="italic text-sm">"test"</p>
              <p className="mt-2 font-semibold">1 2 3</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 bg-white p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#F05050] mb-2">Sign in as Super Admin</h1>
            <p className="text-gray-500">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="Email" name="Email" required className="w-full px-4 py-2 border rounded-lg focus:ring-[#F05050]" />
            </div>

            <div>
              <label htmlFor="PasswordHash" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} id="PasswordHash" name="PasswordHash" required className="w-full px-4 py-2 border rounded-lg pr-10 focus:ring-[#F05050]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {/* icône visible / cachée */}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="Key" className="block text-sm font-medium text-gray-700 mb-1">Admin Key</label>
              <input type={showPassword ? "text" : "password"} id="Key" name="Key" required className="w-full px-4 py-2 border rounded-lg focus:ring-[#F05050]" />
            </div>

            <button type="submit" className="w-full py-3 bg-[#F05050] text-white rounded-lg hover:bg-[#D32F2F]">
              Sign In
            </button>
            <a href="/SuperAdmin" className="text-[#F05050] hover:underline font-medium">
              Launch SuperAdmin
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupAdminin;
