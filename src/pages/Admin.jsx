"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { ListeAlertes } from "../../services/Admin"
import { GetInfoAlert } from "../../services/Admin"


// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Icônes personnalisées pour les alertes
const alertIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Composant pour centrer la carte sur la position de l'administrateur
function LocationMarker() {
  const [position, setPosition] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const map = useMap()



  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Votre position (Admin) <br />
        Latitude: {position.lat.toFixed(4)}, Longitude: {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  )
}

// Fonction pour créer un alerte
const createAlerte = (
  uid,
  firstname,  
  lastname,
  dateofbirth,
  gender,
  height,
  weight,
  address,
  postalCode,
  phoneNumber,
  email,
 latitudepat,
 longitudepat,
  state,
  location,
  uidpros,
  firstnamepro,
  lastnamepro,
  emailpro,
  phonenumberpro,
  latitudepro,
  longitudepro,
  color,
  createdat


) => {
 
  return {
  uid,
  firstname,  
  lastname,
  dateofbirth,

  gender,
  height,
  weight,
  address,
  postalCode,
  phoneNumber,
  email,
  latitudepat,
  longitudepat,
  state,
  location,
  uidpros: uidpros===null ? "/": uidpros,
  firstnamepro: firstnamepro===null ? "/": firstnamepro,
  lastnamepro: lastnamepro===null ? "/": lastnamepro,
  emailpro: emailpro===null ? "/": emailpro,
  phonenumberpro: phonenumberpro===null ? "/": phonenumberpro,
  latitudepro: latitudepro===null ? "/": latitudepro,
  longitudepro: longitudepro===null ? "/": longitudepro,
  color,
  createdat 
  }
}

async function getAddressFromCoords(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'YourAppName/1.0' // Important pour l’API Nominatim
    }
  });
  const data = await response.json();
  return data.address.road; // ou data.address.road pour juste la rue
}


const Admin = () => {
  const [alerts, setAlerts] = useState([])
  // État pour l'alerte sélectionnée
  const [selectedAlert, setSelectedAlert] = useState(null)
  // État pour les statistiques
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedAlerts: 0,
    pendingVerifications: 0
  })
  const [tabalerts, setTabalerts] = useState([]);

  useEffect(() => {
   //getAddressFromCoords(48.8566, 2.3522).then(console.log)

    const fetchData = async () => {
      try {
        const listepat = await ListeAlertes();
        console.log("liste des id alertes", listepat.data);

        const alertes = await Promise.all(
          listepat.data.map(async (alert) => {
            const formdataa = new FormData();
            formdataa.append("idpat", alert);

            try {
              const infoalert = await GetInfoAlert(formdataa);
              console.log("info d'une alerte", infoalert);

              return createAlerte(
                infoalert.data.patientID,
                infoalert.data.name,
                infoalert.data.lastName,
                infoalert.data.birthdate,
                infoalert.data.gender,
                infoalert.data.height,
                infoalert.data.weight,
                infoalert.data.address,
                infoalert.data.postalcode,
                infoalert.data.phonenumber,
                infoalert.data.email,
                infoalert.data.latitudePatient,
                infoalert.data.longitudePatient,
                infoalert.data.state,
                infoalert.data.location,
                infoalert.data.proSID,
                infoalert.data.firstnamepro,
                infoalert.data.lastnamepro,
                infoalert.data.emailProS,
                infoalert.data.phonenumberProS,
                infoalert.data.latitudeProS,
                infoalert.data.longitudeProS,
                infoalert.data.color,
                infoalert.data.createdAt
              );
            } catch (error) {
              console.error("Erreur lors de GetInfoAlert:", error);
              return null;
            }
          })
        );

        // On filtre les alertes nulles (erreurs)
        const alertesValides = alertes.filter((a) => a !== null);
        setTabalerts(alertesValides);
        console.log("tab des alertes", alertesValides);
      } catch (error) {
        console.error("Erreur lors de ListeAlertes:", error);
      }
    };

    fetchData();
  }, []);

  // Obtenir la classe de badge en fonction du niveau d'urgence
  const getUrgencyBadgeClass = (level) => {
    switch (level) {
      case "rouge":
        return "bg-red-100 text-red-800"
      case "orange":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Traduire le niveau d'urgence
  const translateUrgencyLevel = (level) => {
    switch (level) {
      case "rouge":
        return "Élevée"
      case "orange":
        return "Moyenne"
      default:
        return "Inconnue"
    }
  }

  function formatReadableDate(isoString) {
    return new Date(isoString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  }



  return (
    <div className="container mx-auto px-4 py-8">
   

      {/* Cartes de statistiques */}
      

      {/* Onglets de navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button className="px-6 py-3 font-medium text-[#F05050] border-b-2 border-[#F05050]">
            Alertes
          </button>
          <Link to="/VerifPat" className="px-6 py-3 font-medium text-gray-600 hover:text-[#F05050]">
            Vérifier comptes patients
          </Link>
          <Link to="/VerifPros" className="px-6 py-3 font-medium text-gray-600 hover:text-[#F05050]">
            Vérifier comptes professionnels
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section carte */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Carte des alertes</h2>

          {/* Conteneur de carte avec hauteur fixe */}
          <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300">
            <MapContainer 
              center={[36.7538, 3.0588]} 
              zoom={10} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Composant qui gère la localisation de l'administrateur */}
              <LocationMarker />

              {/* Marqueurs pour chaque alerte */}
              {tabalerts.map((alerti) => (
                <Marker 
                  key={alerti.UID} 
                  position={[parseFloat(alerti.latitudepat), parseFloat(alerti.longitudepat)]}
                  icon={alertIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedAlert(alerti)
                    }
                  }}
                >
                  <Popup>
                    <div className="text-sm ">
                      <h3 className="font-bold text-[#F05050]">{alerti.firstname} {alerti.lastname}</h3>
                    
                      <p className="text-xs text-gray-600">{formatReadableDate(alerti.createdat)}</p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadgeClass(alerti.color)}`}>
                          Urgence:{translateUrgencyLevel(alerti.color)}
                        </span>
                      </div>
                      
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Section détails de l'alerte */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {selectedAlert ? "Détails de l'alerte" : "Liste des alertes"}
          </h2>

          {selectedAlert ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-black">{selectedAlert.firstname} {selectedAlert.lastname}</h3>
                  <p className="text-sm text-gray-600">ID: {selectedAlert.uid}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedAlert.state === 0 ? "bg-orange-100 text-orange-400" : "bg-green-100 text-green-700"
                }`}>
                  {selectedAlert.state === 0 ? "Non traitée" : "En cours de traitement"}
                </span>
              </div>
              
              {/* Informations du patient */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Informations du patient</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Date de naissance:</p>
                    <p className="text-black">{selectedAlert.dateofbirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Genre:</p>
                    <p className="text-black">{selectedAlert.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taille:</p>
                    <p className="text-black">{selectedAlert.height} m</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Poids:</p>
                    <p className="text-black">{selectedAlert.weight} kg</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Téléphone:</p>
                    <p className="text-black">{selectedAlert.phoneNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Email:</p>
                    <p className="text-black">{selectedAlert.email}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Niveau d'urgence</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadgeClass(selectedAlert.color)}`}>
                  {translateUrgencyLevel(selectedAlert.color)}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700">Localisation</h4>
                <p className="text-sm text-black">{}</p>
                <p className="text-xs text-black">
                  Lat: {selectedAlert.latitudepat}, 
                  Long: {selectedAlert.longitudepat}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700">Horodatage</h4>
                <p className="text-sm text-black">{formatReadableDate(selectedAlert.createdat)}</p>
              </div>
              
              <div className="pt-4 flex space-x-2">
                 <button 
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Retour à la liste
                </button>
              </div>
            </div>
          ): (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 py-1">
              {tabalerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune alerte en cours.</p>
              ) : (
                tabalerts.map((alerti) => (
                  <div
                    key={alerti.uid}
                    className={`border border-gray-200 rounded-md p-3 bg-gray-50 cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => setSelectedAlert(alerti)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-neutral-800" >{alerti.firstname} {alerti.lastname}</div>
                
                        <div className="text-xs text-gray-500">{formatReadableDate(alerti.createdat)}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs px-2 py-1 rounded-full mb-1 ${
                          alerti.state === 0 ? "bg-orange-100 text-orange-400" : "bg-green-100 text-green-700"
                        }`}>
                          {alerti.state === 0 ? "Non traitée" : "En cours de traitement"}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadgeClass(alerti.color)}`}>
                          {translateUrgencyLevel(alerti.color)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin