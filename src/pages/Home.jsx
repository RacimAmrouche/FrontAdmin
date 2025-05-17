"use client"
import { useState, useEffect } from "react"

const Home = ({ isDarkMode }) => {
  const [textColor, setTextColor] = useState("text-white")

  useEffect(() => {
    if (isDarkMode) {
      setTextColor("text-black")
    } else {
      setTextColor("text-white")
    }
  }, [isDarkMode])

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? "bg-gray-100" : "bg-[#f05050]"} transition-all duration-300`}
    >
      {/* Logo */}
      <div className="mb-8">
        <img src="/path-to-your-big-logo.svg" alt="E-mergency Icon" className="h-32 w-32 opacity-80" />
      </div>

      {/* Titre */}
      <h1 className={`text-4xl font-bold mb-12 ${textColor}`}>E-MERGENCY ADMIN</h1>

      {/* Question */}
      <div className={`text-center mb-10`}>
        <h2 className={`text-2xl font-semibold mb-8 ${textColor}`}>Qui êtes-vous ?</h2>

        {/* Boutons */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          <button
            className={`px-8 py-4 rounded-lg text-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-white text-gray-900 hover:bg-gray-200 shadow-md"
                : "bg-white text-[#f05050] hover:bg-gray-100 shadow-md"
            }`}
          >
              <a href="/Adminin" >
                        Admin
                    </a>
          </button>

          <button
            className={`px-8 py-4 rounded-lg text-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-white text-gray-900 hover:bg-gray-200 shadow-md"
                : "bg-white text-[#f05050] hover:bg-gray-100 shadow-md"
            }`}
          >
            <a href="/Admincrea" >
                        Super admin
                    </a>
          </button>

          <button
            className={`px-8 py-4 rounded-lg text-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-white text-gray-900 hover:bg-gray-200 shadow-md"
                : "bg-white text-[#f05050] hover:bg-gray-100 shadow-md"
            }`}
          >
             <a href="/AdminHin" >
                        AdminH
                    </a>
          </button>
        </div>
      </div>

      {/* Texte d'aide */}
      <p className={`text-center mt-8 max-w-md ${isDarkMode ? "text-gray-600" : "text-white opacity-90"}`}>
        Sélectionnez votre type d'accès pour continuer vers l'interface d'administration appropriée.
      </p>
    </div>
  )
}

export default Home



















































////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
/*const Home = () => {
  const [data, setData] = useState(null); // Stocker les données de l'API
  const [loading, setLoading] = useState(true); // Gérer le chargement
  const [error, setError] = useState(null); // Gérer les erreurs

  useEffect(() => {
    // Remplace l'URL par celle de ton API ASP.NET
    axios.get("http://localhost:5002/api/test/json") 
      .then((response) => {
        setData(response.data); // Stocker les données reçues
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);*/
