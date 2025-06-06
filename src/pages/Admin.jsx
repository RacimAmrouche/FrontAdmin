"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { ListeAlertes } from "../../services/Admin"
import Layout from "../components/layouts/layout"
import { GetInfoAlert } from "../../services/Admin"
import logo from "../assets/logovide.png"


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
  locationproS,
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
  locationproS,
  uidpros: uidpros=="" ? "/": uidpros,
  firstnamepro: firstnamepro=="" ? "/": firstnamepro,
  lastnamepro,
  emailpro: emailpro=="" ? "/": emailpro,
  phonenumberpro: phonenumberpro=="" ? "/": phonenumberpro,
  latitudepro: latitudepro=="" ? "/": latitudepro,
  longitudepro: longitudepro=="" ? "/": longitudepro,
  color,
  createdat 
  }
}

async function getAddressFromCoords(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'YourAppName/1.0' 
    }
  });
  const data = await response.json();
  console.log("rep open street ",data)
  return data.address.road+", "+data.address.town+", "+data.address.state; 
}

function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Admin = () => {

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
              const loca = await getAddressFromCoords(infoalert.data.latitudePatient, infoalert.data.longitudePatient);
              let loca2=null;
              if(infoalert.data.latitudeProS != "" && infoalert.data.longitudeProS != ""){
                loca2 = await getAddressFromCoords(infoalert.data.latitudeProS, infoalert.data.longitudeProS);
              }
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
                loca,
                loca2 == null ? "/": loca2,
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
        return "High"
      case "orange":
        return "Medium"
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
    <div className="min-h-screen p-4 bg-gray-100">

    
      <div className="bg-white rounded-xl shadow-md mb-3 w-full max-w-7xl mx-auto text-base mt-[51px]">
      <div className="flex flex-wrap border-b">
              {/* Logo + Nom app */}
              <div className="flex items-center px-6 py-4 mr-6">
          <img src={logo} alt="E-mergency Logo" className="h-8 w-8 mr-2" />
          <span className="font-bold text-xl text-[#F05050]">E-mergency</span>
        </div>

      <button className="px-8 py-4 font-semibold text-[#F05050] border-b-4 border-[#F05050]">
        Alerts
      </button>
      <Link
        to="/VerifPat"
        className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
      >
        Verify patient accounts
      </Link>
      <Link
        to="/VerifPros"
        className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
      >
        Verify heatlhcare pro accounts
      </Link>
      
      <Link
        to="/Moderation"
        className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
      >
        Moderation
      </Link>
      <Link
        to="/RepForm"
        className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
      >
        Response form
      </Link>

      </div>
    </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {  /* Map section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Live Alerts Map</h2>

            {/* Fixed height map container */}
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
                {/* AJOUTER MARKER PRO S*/}
                  <Popup>
                    <div className="text-sm ">
                      <h3 className="font-bold text-[#F05050]">{alerti.firstname} {alerti.lastname}</h3>
                    
                      <p className="text-xs text-gray-600">{formatReadableDate(alerti.createdat)}</p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadgeClass(alerti.color)}`}>
                          Urgency: {translateUrgencyLevel(alerti.color)}
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
        <div className="bg-white rounded-lg shadow-md py-2 px-4 h-[600px] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {selectedAlert ? "Alert details" : "Alerts list"}
          </h2>

          {selectedAlert ? (
            <div className="">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">{selectedAlert.firstname} {selectedAlert.lastname}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedAlert.state === 0 ? "bg-orange-100 text-orange-400" : "bg-green-100 text-green-700"
                }`}>
                  {selectedAlert.state === 0 ? "Not processed" : "In progress"}
                </span>
              </div>
              <div className="mb-2">
                <h4 className="font-medium text-gray-800">Urgency level</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadgeClass(selectedAlert.color)}`}>
                  {translateUrgencyLevel(selectedAlert.color)}
                </span>
              </div>
              
              <div className="mb-2">
                <h4 className="font-medium text-gray-800">Location</h4>
                <p className="text-sm text-gray-700">{selectedAlert.location}</p>
                <p className="text-xs text-gray-700">
                  Lat: {selectedAlert.latitudepat}, 
                  Long: {selectedAlert.longitudepat}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800">Timestamp</h4>
                <p className="text-xs text-gray-700">{formatReadableDate(selectedAlert.createdat)}</p>
              </div>
              {/* Informations du patient */}
              <div className="bg-white p-3 rounded-lg border-1 my-3 border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Patient information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                  <p className="text-sm text-gray-600"><p className="font-semibold text-gray-800">UID: </p>{selectedAlert.uid}</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">Date of birth</p>
                    <p className="text-gray-600">{selectedAlert.dateofbirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">Gender</p>
                    <p className="text-gray-600">{capitalizeFirstLetter(selectedAlert.gender)}</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">Height</p>
                    <p className="text-gray-600">{selectedAlert.height} m</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">Weight</p>
                    <p className="text-gray-600">{selectedAlert.weight} kg</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-800 font-semibold">Phone number</p>
                    <p className="text-gray-600">{selectedAlert.phoneNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-800 font-semibold">Email:</p>
                    <p className="text-gray-600">{selectedAlert.email}</p>
                  </div>
                </div>
              </div>
              
              
               {/* Informations du professionnel de santé */}
               <div className="bg-white p-3 rounded-lg border-1 border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Healthcare professional information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-800 font-semibold">Full name:</p>
                    <p className="text-gray-600">{selectedAlert.firstnamepro} {selectedAlert.lastnamepro}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-800 font-semibold">Phone number:</p>
                    <p className="text-gray-600">{selectedAlert.phonenumberpro}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-800 font-semibold">Email:</p>
                    <p className="text-gray-600">{selectedAlert.emailpro}</p>
                  </div>
                  <div>
                <h4 className="font-medium text-gray-800">Location</h4>
                <p className="text-sm text-gray-700">{selectedAlert.locationproS}</p>
                <p className="text-xs text-gray-700">
                  Lat: {selectedAlert.latitudeProS}, 
                  Long: {selectedAlert.longitudeProS}
                </p>
              </div>
                </div>
              </div>

              <div className="pt-4 flex space-x-2 mb-2">
                 <button 
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-[#f05050] hover:text-white transition-colors"
                >
                  Back to list
                </button>
              </div>
            </div>
          ): (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 py-1">
              {tabalerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No ongoing alert.</p>
              ) : (
                tabalerts.map((alerti) => (
                  <div
                    key={alerti.uid}
                    className={`border-1 border-gray-200 rounded-md p-3 bg-white cursor-pointer hover:shadow-md hover:shadow-[#f05050]/50 hover:shadow-opa transition-shadow`}
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
                          {alerti.state === 0 ? "Not processed" : "In progress"}
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