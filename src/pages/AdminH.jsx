"use client"
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { AllAmbu, AddAmbu, ModifStatu, DelAmbu } from "../../services/AdminH"

// Icône personnalisée pour les ambulances - sans arrière-plan ni contour
const ambulanceIcon = L.divIcon({
  className: "custom-ambulance-icon",
  html: `<div style="
    font-size: 36px;
    text-align: center;
    line-height: 36px;
  ">🚑</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
})

// Style personnalisé pour les popups - amélioré
const customPopupStyle = `
  <style>
    .custom-popup .leaflet-popup-content-wrapper {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      padding: 8px;
      border: 2px solid #F05050;
    }
    .custom-popup .leaflet-popup-content {
      margin: 12px;
      font-family: 'Arial', sans-serif;
      font-size: 15px;
      line-height: 1.5;
      color: #333;
      min-width: 200px;
    }
    .custom-popup .popup-title {
      font-size: 18px;
      font-weight: bold;
      color: #F05050;
      margin-bottom: 10px;
      border-bottom: 2px solid #F05050;
      padding-bottom: 6px;
      text-align: center;
    }
    .custom-popup .popup-info {
      margin: 8px 0;
      padding: 4px 8px;
      background-color: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #F05050;
    }
    .custom-popup .popup-label {
      font-weight: bold;
      color: #F05050;
      margin-right: 5px;
    }
    .custom-popup .popup-value {
      color: #333;
      font-weight: normal;
    }
    .custom-popup .leaflet-popup-tip {
      background-color: #ffffff;
      border: 2px solid #F05050;
    }
  </style>
`

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Composant pour centrer la carte sur la position de l'utilisateur
function LocationMarker() {
  const [position, setPosition] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const map = useMap()

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 13 })

    map.on("locationfound", (e) => {
      setPosition(e.latlng)
      map.flyTo(e.latlng, 13)
    })

    map.on("locationerror", (e) => {
      console.log("Erreur de localisation:", e.message)
      setLocationError(e.message)
    })

    return () => {
      map.off("locationfound")
      map.off("locationerror")
    }
  }, [map])

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Vous êtes ici <br />
        Latitude: {position.lat.toFixed(4)}, Longitude: {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  )
}

const AdminH = () => {
  // État pour stocker la liste des ambulances
  const [ambulances, setAmbulances] = useState([])
  const [userLocation, setUserLocation] = useState({ lat: 48.8566, lng: 2.3522 }) // Paris par défaut
  const [locationPermission, setLocationPermission] = useState("pending")

  // État pour le formulaire d'ajout d'ambulance
  const [newAmbulance, setNewAmbulance] = useState([])

  // État pour les erreurs de formulaire
  const [formError, setFormError] = useState("")

  // État pour le loading des mises à jour de statut
  const [updatingStatus, setUpdatingStatus] = useState({})

  // État pour le loading des suppressions
  const [deletingAmbulance, setDeletingAmbulance] = useState({})

  // Fonction pour déterminer le statut d'une ambulance
  const getAmbulanceStatus = (ambulance) => {
    // Convertir les valeurs en nombres pour s'assurer de la comparaison correcte
    const isReady = Number(ambulance.isAmbulanceReady) === 1
    const isAvailable = Number(ambulance.isAmbulanceAvailable) === 1

    if (isReady && isAvailable) {
      return "Disponible"
    } else if (!isReady && isAvailable) {
      return "Indisponible" // Changed back from "Unavailable"
    } else if (!isReady && !isAvailable) {
      return "En panne"
    } else {
      return "Statut inconnu"
    }
  }

  // Fonction pour déterminer la couleur du statut
  const getStatusColorClass = (ambulance) => {
    const status = getAmbulanceStatus(ambulance)

    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-800"
      case "Indisponible": // Changed back from "Unavailable"
        return "bg-red-100 text-red-800"
      case "En panne":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Fonction pour déterminer le texte du bouton
  const getButtonText = (ambulance) => {
    const status = getAmbulanceStatus(ambulance)

    switch (status) {
      case "Disponible":
        return " Marquer comme indisponible"
      case "Indisponible": // Changed back from "Unavailable"
        return " Marquer comme disponible"
      case "En panne":
        return " Marquer comme indisponible"
      default:
        return "Changer le statut"
    }
  }

  // Fonction pour modifier le statut d'une ambulance
  const updateAmbulanceStatus = async (ambulanceId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [ambulanceId]: true }))

    try {
      const formData = new FormData()
      formData.append("IdEmbulance", ambulanceId)
      formData.append("StateAmbu", newStatus)

      console.log("Envoi de la requête avec:", {
        IdEmbulance: ambulanceId,
        StateAmbu: newStatus,
      })

      const response = await ModifStatu(formData)

      console.log("Réponse reçue:", response)

      // Vérifier si la réponse indique un succès
      if (response && (response.success || response.data || response.message)) {
        console.log("Statut mis à jour avec succès")

        // Mettre à jour le statut local de l'ambulance
        setAmbulances((prevAmbulances) =>
          prevAmbulances.map((ambulance) =>
            ambulance.idEmbulance === ambulanceId
              ? {
                  ...ambulance,
                  isAmbulanceAvailable: newStatus === "1" ? "1" : newStatus === "0" ? "1" : "0",
                  isAmbulanceReady: newStatus === "1" ? "1" : "0",
                }
              : ambulance,
          ),
        )

        alert("Statut de l'ambulance mis à jour avec succès ✅")
      } else {
        throw new Error("Réponse inattendue du serveur")
      }
    } catch (error) {
      console.error("Erreur détaillée:", error)
      alert(`Erreur lors de la mise à jour du statut: ${error.message} ❌`)
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [ambulanceId]: false }))
    }
  }

  // Fonction pour basculer le statut d'une ambulance
  const toggleAmbulanceStatus = async (ambulance) => {
    const status = getAmbulanceStatus(ambulance)

    // Si l'ambulance est disponible, la rendre indisponible, sinon la rendre disponible
    const newStatus = status === "Disponible" ? "0" : "1"
    await updateAmbulanceStatus(ambulance.idEmbulance, newStatus)
  }

  // Fonction pour supprimer une ambulance
  const deleteAmbulance = async (ambulanceId) => {
    // Demander confirmation avant de supprimer
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'ambulance avec l'ID ${ambulanceId} ?`)) {
      return
    }

    setDeletingAmbulance((prev) => ({ ...prev, [ambulanceId]: true }))

    try {
      const formData = new FormData()
      formData.append("idEmbulance", ambulanceId)

      console.log("Envoi de la requête de suppression pour l'ID:", ambulanceId)

      // Appel à l'API pour supprimer l'ambulance
      const response = await DelAmbu(formData)

      console.log("Réponse de suppression:", response)

      // Vérifier si la réponse indique un succès
      if (response && (response.success || response.data || response.message)) {
        console.log("Ambulance supprimée avec succès")

        // Supprimer l'ambulance de l'état local
        setAmbulances((prevAmbulances) => prevAmbulances.filter((ambulance) => ambulance.idEmbulance !== ambulanceId))

        alert("Ambulance supprimée avec succès ✅")
      } else {
        throw new Error("Réponse inattendue du serveur")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert(`Erreur lors de la suppression: ${error.message} ❌`)
    } finally {
      setDeletingAmbulance((prev) => ({ ...prev, [ambulanceId]: false }))
    }
  }

  // Charger les données au démarrage
  useEffect(() => {
    console.log("Chargement des données...")

    const fetchdata = async () => {
      try {
        const formdata = new FormData()
        formdata.append("idadminH", "2E248525-209E-4AB3-89BA-7DE7DC2E754C")

        const result = await AllAmbu(formdata)
        console.log("Données reçues du backend:", result.data)

        // Utiliser les données telles quelles, sans modifier les statuts
        setAmbulances(result.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error)
      }
    }
    fetchdata()

    // Injecter le style personnalisé pour les popups
    const styleElement = document.createElement("style")
    styleElement.innerHTML = customPopupStyle.replace("<style>", "").replace("</style>", "")
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAmbulance({
      ...newAmbulance,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      alert("Utilisateur non connecté : données manquantes.")
      return
    }

    let user
    try {
      user = JSON.parse(storedUser)
    } catch (err) {
      console.error("Erreur de parsing JSON depuis le localStorage :", err)
      alert("Erreur dans les données utilisateur.")
      return
    }

    if (!user.result || !user.result.uid) {
      alert("UID introuvable dans les données utilisateur.")
      return
    }

    formData.append("idadminH", user.result.uid)

    try {
      const ambu = await AddAmbu(formData)
      alert("Ambulance ajoutée ✅")
      setAmbulances([...ambulances, ambu.data])
      console.log("Ambulance ajoutée :", ambu.data)
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error)
      alert("Erreur: Échec ❌")
    }
  }

  const handleAddAmbulance = (e) => {
    e.preventDefault()

    // Validation basique
    if (!newAmbulance.id || !newAmbulance.immatriculation || !newAmbulance.modele) {
      setFormError("Tous les champs sont obligatoires")
      return
    }

    // Vérifier si l'ID existe déjà
    if (ambulances.some((amb) => amb.id === newAmbulance.id)) {
      setFormError("Cet identifiant d'ambulance existe déjà")
      return
    }

    // Ajouter la nouvelle ambulance à la liste
    setAmbulances([...ambulances, newAmbulance])

    // Réinitialiser le formulaire
    setNewAmbulance({
      id: "",
      immatriculation: "",
      modele: "",
      statut: "disponible",
      latitude: userLocation.lat,
      longitude: userLocation.lng,
    })

    setFormError("")
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Tableau de bord - Responsable d'hôpital</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section carte */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md  p-4">
          <h2 className="text-2xl font-bold text-[#F05050] mb-2">Carte </h2>

          {/* Conteneur de carte avec hauteur fixe */}
          <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300">
            <MapContainer center={[36.7538, 3.0588]} zoom={10} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Composant qui gère la localisation de l'utilisateur */}
              <LocationMarker />

              {/* Marqueurs pour chaque ambulance */}
              {ambulances.map((ambulancei) => (
                <Marker
                  key={ambulancei.idEmbulance}
                  position={[Number.parseFloat(ambulancei.latitude), Number.parseFloat(ambulancei.longitude)]}
                  icon={ambulanceIcon}
                  eventHandlers={{
                    click: () => {
                      console.log("Ambulance clicked:", ambulancei)
                    },
                  }}
                >
                  <Popup className="custom-popup">
                    <div>
                      <div className="popup-title">🚑 Ambulance</div>
                      <div className="popup-info">
                        <span className="popup-label">ID:</span>
                        <span className="popup-value">{ambulancei.idEmbulance}</span>
                      </div>
                      <div className="popup-info">
                        <span className="popup-label">Matricule:</span>
                        <span className="popup-value">{ambulancei.matricule}</span>
                      </div>
                      <div className="popup-info">
                        <span className="popup-label">Statut:</span>
                        <span className="popup-value">{getAmbulanceStatus(ambulancei)}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Section gestion des ambulances */}
        <div className="bg-white rounded-lg shadow-md pt-5 p-4 mt-10">
          <h2 className="text-2xl font-bold text-[#F05050] mb-2">Gestion des ambulances</h2>

          {/* Formulaire d'ajout d'ambulance */}
          <form onSubmit={handleSubmit} className="">
            <div className="space-y-4">
              <div>
                <label htmlFor="Matricule" className="block text-sm font-medium text-gray-700 mb-1">
                  Immatriculation
                </label>
                <input
                  type="text"
                  id="Matricule"
                  name="Matricule"
                  onChange={handleInputChange}
                  placeholder="Ex: 1493710231"
                  pattern="\d{10}"
                  title="L'immatriculation doit contenir exactement 10 caractères numériques."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F05050] focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#F05050] text-white font-medium rounded-md hover:bg-[#D32F2F] transition-colors"
              >
                Ajouter une ambulance
              </button>
            </div>
          </form>

          {/* Liste des ambulances */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Liste des ambulances</h3>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {ambulances.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune ambulance enregistrée</p>
              ) : (
                ambulances.map((ambulance) => (
                  <div key={ambulance.idEmbulance} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-black">{ambulance.matricule}</div>
                        <div className="text-xs text-gray-500">ID: {ambulance.idEmbulance}</div>
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-1 rounded-full ${getStatusColorClass(ambulance)}`}>
                            {getAmbulanceStatus(ambulance)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteAmbulance(ambulance.idEmbulance)}
                        disabled={deletingAmbulance[ambulance.idEmbulance]}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        aria-label="Supprimer"
                      >
                        {deletingAmbulance[ambulance.idEmbulance] ? (
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Section de modification du statut */}
                    <div className="border-t pt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Modifier le statut:</div>
                      <div className="grid grid-cols-1 gap-2">
                        {/* Bouton toggle principal pour disponible/indisponible */}
                        <button
                          onClick={() => toggleAmbulanceStatus(ambulance)}
                          disabled={updatingStatus[ambulance.idEmbulance]}
                          className={`px-3 py-2 text-sm rounded-md hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            getAmbulanceStatus(ambulance) === "Disponible"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {updatingStatus[ambulance.idEmbulance] ? "..." : getButtonText(ambulance)}
                        </button>

                        {/* Bouton pour marquer en panne - seulement si l'ambulance n'est pas déjà en panne */}
                        {getAmbulanceStatus(ambulance) !== "En panne" && (
                          <button
                            onClick={() => updateAmbulanceStatus(ambulance.idEmbulance, "2")}
                            disabled={updatingStatus[ambulance.idEmbulance]}
                            className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingStatus[ambulance.idEmbulance] ? "..." : "Marquer en panne"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminH









