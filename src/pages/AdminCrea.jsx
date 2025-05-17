"use client"
import React, { useEffect } from 'react';
import { useState } from "react"
import { AddAdmin } from "../../services/auth"


const AdminCrea = ({ isDark = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
    fullName: "",
    phoneNumber: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  
  const [submitSuccess, setSubmitSuccess] = useState(false)

 

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    console.log(formData)
  
     try{
      console.log("    la ")
        console.log(formData)
    const response = await AddAdmin(formData)
    alert('Succès', 'ajout réussie ✅');
    console.log("?")
    } catch (error) {
      console.log("test")
        alert('Erreur: Échec de l\'ajout ❌');

    }
    
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      <div className="max-w-md mx-auto">
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
          <h1 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
            Créer un compte administrateur
          </h1>

          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="grid grid-cols-1  gap-5">
                        <div>
                            <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="text"
                                id="Email"
                                name="Email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F05050] focus:border-transparent transition-all"
                                required
                            />
                        </div>
                         </div>

            {/* Mot de passe */}
            <div>
                        <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="Password"
                                name="Password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F05050] focus:border-transparent transition-all pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F05050] transition-colors"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                            clipRule="evenodd"
                                        />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                    </div>

            {/* Nom complet */}
            <div>
                            <label htmlFor="Fullname" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="Fullname"
                                name="Fullname"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F05050] focus:border-transparent transition-all"
                                pattern="^[^0-9]*$"
                                title="Le nom ne doit pas contenir de chiffres"
                                required
                            />
                        </div>

            {/* Numéro de téléphone */}
            <div>
                            <label htmlFor="Phonenumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Numéro de téléphone
                            </label>
                            <input
                                type="text"
                                id="Phonenumber"
                                name="Phonenumber"
                                placeholder="Ex: 06 12 34 56 78"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F05050] focus:border-transparent transition-all"
                                pattern="^[0-9]{1,10}$"
                                title="Le numéro de téléphone doit contenir uniquement des chiffres et ne pas dépasser 10 caractères"
                                required
                            />
                        </div>

                        <button
                       type="submit"
                        className="w-full py-3 bg-[#F05050] text-white font-medium rounded-lg hover:bg-[#D32F2F] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Créer Admin
                    </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminCrea

