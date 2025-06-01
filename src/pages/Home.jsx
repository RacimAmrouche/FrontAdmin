import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Hospital, Crown } from "lucide-react";
import logovide from "../assets/logovide.png";

const Home = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (item) => {
    setActiveItem(item);
    setIsMobileMenuOpen(false);

    switch (item) {
      case "Adminin":
        navigate("/Adminin");
        break;
      case "AdminHin":
        navigate("/AdminHin");
        break;
      case "SupAdminin":
        navigate("/SupAdminin");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 mt-5">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={logovide} alt="E-Mergency Logo" className="h-10 w-10" />
              <h3 className="text-2xl font-bold text-gray-900">E-Mergency</h3>
            </div>
            <div className="text-sm text-gray-500">Administration Platform</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Administrator Dashboard</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your access level to manage the E-Mergency platform
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Admin Standard */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 hover:border-[#f05050]/20 p-6">
            <div className="text-center pb-4">
              <div className="mx-auto bg-[#f05050]/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-[#f05050]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Administrator</h3>
              <p className="text-gray-600">General platform management</p>
            </div>
            <div className="space-y-4">
              <button
                className="w-full bg-[#f05050] hover:bg-[#d63d3d] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                onClick={() => handleNavigate("Adminin")}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Hospital Admin */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 hover:border-[#f05050]/20 p-6">
            <div className="text-center pb-4">
              <div className="mx-auto bg-[#f05050]/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <Hospital className="h-10 w-10 text-[#f05050]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hospital Admin</h3>
              <p className="text-gray-600">Hospital-specific management</p>
            </div>
            <div className="space-y-4">
              <button
                className="w-full bg-[#f05050] hover:bg-[#d63d3d] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                onClick={() => handleNavigate("AdminHin")}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Super Admin */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 hover:border-[#f05050]/20 p-6">
            <div className="text-center pb-4">
              <div className="mx-auto bg-[#f05050]/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <Crown className="h-10 w-10 text-[#f05050]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Super Admin</h3>
              <p className="text-gray-600">Full system control</p>
            </div>
            <div className="space-y-4">
              <button
                className="w-full bg-[#f05050] hover:bg-[#d63d3d] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                onClick={() => handleNavigate("SupAdminin")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;




















































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
