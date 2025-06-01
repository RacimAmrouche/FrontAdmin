"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { ListeAlertes } from "../../services/Admin"
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
  shadowSize: [41, 41],
})

// Composant pour centrer la carte sur la position de l'administrateur
function LocationMarker() {
  const [position, setPosition] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const map = useMap()

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Votre position (SuperAdmin) <br />
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
  createdat,
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
    uidpros: uidpros == "" ? "/" : uidpros,
    firstnamepro: firstnamepro == "" ? "/" : firstnamepro,
    lastnamepro,
    emailpro: emailpro == "" ? "/" : emailpro,
    phonenumberpro: phonenumberpro == "" ? "/" : phonenumberpro,
    latitudepro: latitudepro == "" ? "/" : latitudepro,
    longitudepro: longitudepro == "" ? "/" : longitudepro,
    color,
    createdat,
  }
}

async function getAddressFromCoords(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  const response = await fetch(url, {
    headers: {
      "User-Agent": "YourAppName/1.0",
    },
  })
  const data = await response.json()
  console.log("rep open street ", data)
  return data.address.road + ", " + data.address.town + ", " + data.address.state
}

function capitalizeFirstLetter(str) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const SuperAdmin = () => {
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [activeTab, setActiveTab] = useState("alerts")
  // État pour les statistiques
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedAlerts: 0,
    pendingVerifications: 0,
  })
  const [tabalerts, setTabalerts] = useState([])

  // États pour les formulaires de création d'admin
  const [adminFormData, setAdminFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  })

  const [adminHFormData, setAdminHFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    hospitalName: "",
    hospitalAddress: "",
    hospitalId: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listepat = await ListeAlertes()
        console.log("liste des id alertes", listepat.data)

        const alertes = await Promise.all(
          listepat.data.map(async (alert) => {
            const formdataa = new FormData()
            formdataa.append("idpat", alert)

            try {
              const infoalert = await GetInfoAlert(formdataa)
              console.log("info d'une alerte", infoalert)
              const loca = await getAddressFromCoords(infoalert.data.latitudePatient, infoalert.data.longitudePatient)
              let loca2 = null
              if (infoalert.data.latitudeProS != "" && infoalert.data.longitudeProS != "") {
                loca2 = await getAddressFromCoords(infoalert.data.latitudeProS, infoalert.data.longitudeProS)
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
                loca2 == null ? "/" : loca2,
                infoalert.data.proSID,
                infoalert.data.firstnamepro,
                infoalert.data.lastnamepro,
                infoalert.data.emailProS,
                infoalert.data.phonenumberProS,
                infoalert.data.latitudeProS,
                infoalert.data.longitudeProS,
                infoalert.data.color,
                infoalert.data.createdAt,
              )
            } catch (error) {
              console.error("Erreur lors de GetInfoAlert:", error)
              return null
            }
          }),
        )

        // On filtre les alertes nulles (erreurs)
        const alertesValides = alertes.filter((a) => a !== null)
        setTabalerts(alertesValides)
        console.log("tab des alertes", alertesValides)
      } catch (error) {
        console.error("Erreur lors de ListeAlertes:", error)
      }
    }

    fetchData()
  }, [])

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
    })
  }

  // Gérer les changements dans le formulaire Admin
  const handleAdminFormChange = (e) => {
    const { name, value } = e.target
    setAdminFormData({
      ...adminFormData,
      [name]: value,
    })
  }

  // Gérer les changements dans le formulaire AdminH
  const handleAdminHFormChange = (e) => {
    const { name, value } = e.target
    setAdminHFormData({
      ...adminHFormData,
      [name]: value,
    })
  }

  // Soumettre le formulaire Admin
  const handleAdminFormSubmit = (e) => {
    e.preventDefault()
    console.log("Création d'un admin standard:", adminFormData)
    // Ici, vous ajouteriez l'appel à votre API pour créer un admin
    alert("Admin standard créé avec succès!")
    setAdminFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
    })
  }

  // Soumettre le formulaire AdminH
  const handleAdminHFormSubmit = (e) => {
    e.preventDefault()
    console.log("Création d'un admin hospitalier:", adminHFormData)
    // Ici, vous ajouteriez l'appel à votre API pour créer un adminH
    alert("Admin hospitalier créé avec succès!")
    setAdminHFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      hospitalName: "",
      hospitalAddress: "",
      hospitalId: "",
    })
  }

  // Rendu du contenu en fonction de l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case "createAdmin":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Créer un compte Admin standard</h2>
            <form onSubmit={handleAdminFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={adminFormData.firstName}
                    onChange={handleAdminFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={adminFormData.lastName}
                    onChange={handleAdminFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={adminFormData.email}
                    onChange={handleAdminFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={adminFormData.password}
                    onChange={handleAdminFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={adminFormData.phoneNumber}
                    onChange={handleAdminFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={adminFormData.address}
                    onChange={handleAdminFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-[#F05050] text-white font-medium rounded-md hover:bg-[#D32F2F] transition-colors"
                >
                  Créer Admin
                </button>
              </div>
            </form>
          </div>
        )
      case "createAdminH":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Créer un compte Admin Hospitalier</h2>
            <form onSubmit={handleAdminHFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={adminHFormData.firstName}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={adminHFormData.lastName}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={adminHFormData.email}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={adminHFormData.password}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={adminHFormData.phoneNumber}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={adminHFormData.address}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-700 mb-2 mt-2">Informations de l'hôpital</h3>
                </div>
                <div>
                  <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'hôpital
                  </label>
                  <input
                    type="text"
                    id="hospitalName"
                    name="hospitalName"
                    value={adminHFormData.hospitalName}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 mb-1">
                    Identifiant de l'hôpital
                  </label>
                  <input
                    type="text"
                    id="hospitalId"
                    name="hospitalId"
                    value={adminHFormData.hospitalId}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="hospitalAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de l'hôpital
                  </label>
                  <input
                    type="text"
                    id="hospitalAddress"
                    name="hospitalAddress"
                    value={adminHFormData.hospitalAddress}
                    onChange={handleAdminHFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050]"
                    required
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-[#F05050] text-white font-medium rounded-md hover:bg-[#D32F2F] transition-colors"
                >
                  Créer Admin Hospitalier
                </button>
              </div>
            </form>
          </div>
        )
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section carte */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Live Alerts Map</h2>

              {/* Conteneur de carte avec hauteur fixe */}
              <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300">
                <MapContainer center={[36.7538, 3.0588]} zoom={10} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Composant qui gère la localisation de l'administrateur */}
                  <LocationMarker />

                  {/* Marqueurs pour chaque alerte */}
                  {tabalerts.map((alerti) => (
                    <Marker
                      key={alerti.uid}
                      position={[Number.parseFloat(alerti.latitudepat), Number.parseFloat(alerti.longitudepat)]}
                      icon={alertIcon}
                      eventHandlers={{
                        click: () => {
                          setSelectedAlert(alerti)
                        },
                      }}
                    >
                      <Popup>
                        <div className="text-sm ">
                          <h3 className="font-bold text-[#F05050]">
                            {alerti.firstname} {alerti.lastname}
                          </h3>

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
            <div className="bg-white rounded-lg shadow-md py-2 px-4 h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {selectedAlert ? "Alert Details" : "Alerts List"}
              </h2>

              {selectedAlert ? (
                <div className="">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-700 mb-2">
                        {selectedAlert.firstname} {selectedAlert.lastname}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedAlert.state === 0 ? "bg-orange-100 text-orange-400" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {selectedAlert.state === 0 ? "Unhandled" : "Being Handled"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-800">Alert Level</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyBadgeClass(selectedAlert.color)}`}>
                      {translateUrgencyLevel(selectedAlert.color)}
                    </span>
                  </div>

                  <div className="mb-2">
                    <h4 className="font-medium text-gray-800">Location</h4>
                    <p className="text-sm text-gray-700">{selectedAlert.location}</p>
                    <p className="text-xs text-gray-700">
                      Lat: {selectedAlert.latitudepat}, Long: {selectedAlert.longitudepat}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800">Timestamp</h4>
                    <p className="text-xs text-gray-700">{formatReadableDate(selectedAlert.createdat)}</p>
                  </div>
                  {/* Informations du patient */}
                  <div className="bg-white p-3 rounded-lg border-1 my-3 border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">Patient Informations</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-sm text-gray-600">
                          <p className="font-semibold text-gray-800">UID: </p>
                          {selectedAlert.uid}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold">Date Of Birth</p>
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
                        <p className="text-gray-800 font-semibold">Phone Number</p>
                        <p className="text-gray-600">{selectedAlert.phoneNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-800 font-semibold">Email:</p>
                        <p className="text-gray-600">{selectedAlert.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations du patient */}
                  <div className="bg-white p-3 rounded-lg border-1 border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">Healthcare Professional Informations</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-800 font-semibold">Full Name:</p>
                        <p className="text-gray-600">
                          {selectedAlert.firstnamepro} {selectedAlert.lastnamepro}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-800 font-semibold">Phone Number:</p>
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
                          Lat: {selectedAlert.latitudeProS}, Long: {selectedAlert.longitudeProS}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex space-x-2 mb-2">
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-[#f05050] hover:text-white transition-colors"
                    >
                      Back To The List
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 py-1">
                  {tabalerts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No ongoing alerts.</p>
                  ) : (
                    tabalerts.map((alerti) => (
                      <div
                        key={alerti.uid}
                        className={`border-1 border-gray-200 rounded-md p-3 bg-white cursor-pointer hover:shadow-md hover:shadow-[#f05050]/50 hover:shadow-opa transition-shadow`}
                        onClick={() => setSelectedAlert(alerti)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-neutral-800">
                              {alerti.firstname} {alerti.lastname}
                            </div>

                            <div className="text-xs text-gray-500">{formatReadableDate(alerti.createdat)}</div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span
                              className={`text-xs px-2 py-1 rounded-full mb-1 ${
                                alerti.state === 0 ? "bg-orange-100 text-orange-400" : "bg-green-100 text-green-700"
                              }`}
                            >
                              {alerti.state === 0 ? "Unhandled" : "Being Handled"}
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
        )
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {/* Onglets de navigation */}
      <div className="bg-white rounded-xl shadow-md mb-3 w-full max-w-7xl mx-auto text-base mt-[51px]">
        <div className="flex flex-nowrap items-center border-b">
          {/* Logo + Nom app */}
          <div className="flex items-center px-6 py-4 mr-6">
            <img src={logo} alt="E-mergency Logo" className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl text-[#F05050]">E-mergency</span>
          </div>
          <button className="px-8 py-4 font-semibold text-[#F05050] border-b-4 border-[#F05050]">
            Alerts
          </button>
          <Link
            to="/VerifPat2"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Verify patient account
          </Link>
          <Link
            to="/VerifPros2"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Verify heatlhcare pro account
          </Link>
          <Link
            to="/SuperModeration"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Moderation
          </Link>
          <Link
            to="/RepForm2"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Response form
          </Link>
          <Link
            to="/AdminCrea"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Creat Admin
          </Link>
          <Link
            to="/AdminHCrea"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Creat AdminH
          </Link>
        </div>
      </div>
      {/* Contenu de l'onglet actif */}
      {renderTabContent()}
    </div>
  )
}

export default SuperAdmin
