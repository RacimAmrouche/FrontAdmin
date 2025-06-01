"use client"
import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import axios from "axios"
import L from "leaflet"
import * as signalR from "@microsoft/signalr"

// Icône personnalisée pour les ambulances
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

// Style personnalisé pour les popups
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
  const map = useMap()

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 13 })

    map.on("locationfound", (e) => {
      setPosition(e.latlng)
      map.flyTo(e.latlng, 13)
    })

    map.on("locationerror", (e) => {
      console.log("Erreur de localisation:", e.message)
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
  // État pour stocker les ambulances virtuelles créées par les simulations
  const [virtualAmbulances, setVirtualAmbulances] = useState([])
  const [alertPosition, setAlertPosition] = useState(null); // Position de l'alerte
  // États pour les connexions SignalR de chaque ambulance
  const [connections, setConnections] = useState({})
  const [statuses, setStatuses] = useState({})

  // États pour les ambulances statiques (base de données)
  const [ambulances, setAmbulances] = useState([])
  const [updatingStatus, setUpdatingStatus] = useState({})
  const [deletingAmbulance, setDeletingAmbulance] = useState({})

  // Référence pour stocker les positions en temps réel
  const ambulancePositionsRef = useRef({})

  // Fonction pour déterminer le statut d'une ambulance
  const getAmbulanceStatus = (ambulance) => {
    const isReady = Number(ambulance.isAmbulanceReady) === 1
    const isAvailable = Number(ambulance.isAmbulanceAvailable) === 1

    if (isReady && isAvailable) {
      return "Disponible"
    } else if (!isReady && isAvailable) {
      return "Indisponible"
    } else if (!isReady && !isAvailable) {
      return "En panne"
    } else {
      return "Statut inconnu"
    }
  }
  

      

useEffect(() => {
  const interval = setInterval(() => {
    const formData = new FormData();
    formData.append("start", "true");

    axios.post("http://192.168.255.1:5003/api/Start/AlerteSimulationADMinns", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(response => {
      const data = response.data;
      if (data.latitude && data.longitude) {
        console.log("📍 Nouvelle alerte détectée !");
        console.log("Latitude :", data.latitude);
        console.log("Longitude :", data.longitude);

        setAlertPosition([parseFloat(data.latitude), parseFloat(data.longitude)]);
      } else {
        console.log("Aucune alerte pour l’instant.");
      }
    })
    .catch(error => {
      console.error("Erreur lors de l'appel API :", error);
    });
  }, 3000); // toutes les 3 secondes

  return () => clearInterval(interval); // nettoyage
}, []);













  // Fonction pour déterminer la couleur du statut
  const getStatusColorClass = (ambulance) => {
    const status = getAmbulanceStatus(ambulance)

    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-800"
      case "Indisponible":
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
        return "✅ Marquer comme indisponible"
      case "Indisponible":
      case "En panne":
        return "❌ Marquer comme disponible"
      default:
        return "Changer le statut"
    }
  }



   











   

   

 





   const startSimulation = async (ambulanceId) => {
  const simId = `simId${ambulanceId}`;
  const hubUrl = `http://192.168.255.1:5002/hubs/ambulance${ambulanceId}?simId=${simId}`;

  try {
    console.log(`🚀 Démarrage ambulance ${ambulanceId}...`);
    setStatuses((prev) => ({ ...prev, [ambulanceId]: "Connecting" }));

    // Créer immédiatement le marqueur
    const newAmbulance = {
      id: ambulanceId,
      matricule: `VIRTUAL-${ambulanceId}`,
      latitude: 36.7538,
      longitude: 3.0588,
      isAmbulanceReady: "1",
      isAmbulanceAvailable: "1",
      hubId: ambulanceId,
    };

    setVirtualAmbulances((prev) => {
      const exists = prev.find((amb) => amb.id === ambulanceId);
      if (!exists) {
        console.log(`✅ Marqueur créé pour ambulance ${ambulanceId}`);
        return [...prev, newAmbulance];
      }
      return prev;
    });

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceivePosition", (position) => {
      console.log(`🚑 [Ambulance ${ambulanceId}] Position reçue:`, position);

      setVirtualAmbulances((prev) =>
        prev.map((amb) =>
          amb.id === ambulanceId
            ? { ...amb, latitude: position.lat, longitude: position.lon }
            : amb
        )
      );

      ambulancePositionsRef.current[simId] = position;
    });

    connection.onclose(() => {
      console.log(`❌ Connexion fermée pour ambulance ${ambulanceId}`);
      setStatuses((prev) => ({ ...prev, [ambulanceId]: "Disconnected" }));
    });

    await connection.start();
    console.log(`✅ Connexion établie pour ambulance ${ambulanceId}`);

    await connection.invoke("StartSimulation", simId);
    console.log(`✅ Simulation ${ambulanceId} démarrée`);

    setConnections((prev) => ({ ...prev, [ambulanceId]: connection }));
    setStatuses((prev) => ({ ...prev, [ambulanceId]: "Connected" }));
  } catch (error) {
    console.error(`❌ Erreur ambulance ${ambulanceId}:`, error);
    setStatuses((prev) => ({ ...prev, [ambulanceId]: "Error" }));
    alert(`Erreur ambulance ${ambulanceId}: ${error.message}`);
  }
};
















































































































  // Fonction pour arrêter une simulation
  const stopSimulation = async (ambulanceId) => {
    try {
      const connection = connections[ambulanceId]
      if (connection) {
        await connection.stop()
        console.log(`🛑 Simulation ${ambulanceId} arrêtée`)
      }

      // Nettoyer les états
      setConnections((prev) => {
        const newConnections = { ...prev }
        delete newConnections[ambulanceId]
        return newConnections
      })

      setStatuses((prev) => {
        const newStatuses = { ...prev }
        delete newStatuses[ambulanceId]
        return newStatuses
      })

      // Supprimer l'ambulance virtuelle
      setVirtualAmbulances((prev) => prev.filter((amb) => amb.id !== ambulanceId))
      console.log(`🗑️ Marqueur supprimé pour ambulance ${ambulanceId}`)
    } catch (error) {
      console.error(`❌ Erreur lors de l'arrêt de la simulation ${ambulanceId}:`, error)
    }
  }

  // Fonction pour modifier le statut d'une ambulance
  const updateAmbulanceStatus = async (ambulanceId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [ambulanceId]: true }))

    try {
      console.log("Mise à jour du statut:", { ambulanceId, newStatus })

      setAmbulances((prevAmbulances) =>
        prevAmbulances.map((ambulance) =>
          ambulance.idEmbulance === ambulanceId
            ? {
                ...ambulance,
                isAmbulanceAvailable: newStatus === "1" ? "1" : "0",
                isAmbulanceReady: newStatus === "1" ? "1" : "0",
              }
            : ambulance,
        ),
      )

      alert("Statut de l'ambulance mis à jour avec succès ✅")
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      alert(`Erreur lors de la mise à jour du statut: ${error.message} ❌`)
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [ambulanceId]: false }))
    }
  }

  // Fonction pour basculer le statut d'une ambulance
  const toggleAmbulanceStatus = async (ambulance) => {
    const status = getAmbulanceStatus(ambulance)
    const newStatus = status === "Disponible" ? "0" : "1"
    await updateAmbulanceStatus(ambulance.idEmbulance, newStatus)
  }

  // Fonction pour supprimer une ambulance
  const deleteAmbulance = async (ambulanceId) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'ambulance avec l'ID ${ambulanceId} ?`)) {
      return
    }

    setDeletingAmbulance((prev) => ({ ...prev, [ambulanceId]: true }))

    try {
      console.log("Suppression de l'ambulance:", ambulanceId)
      setAmbulances((prevAmbulances) => prevAmbulances.filter((ambulance) => ambulance.idEmbulance !== ambulanceId))
      alert("Ambulance supprimée avec succès ✅")
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
        // Données de test pour la démo
        const testData = [
          {
            idEmbulance: "1",
            matricule: "1493710231",
            latitude: "36.7538",
            longitude: "3.0588",
            isAmbulanceReady: "1",
            isAmbulanceAvailable: "1",
          },
          {
            idEmbulance: "2",
            matricule: "1493710232",
            latitude: "36.7600",
            longitude: "3.0600",
            isAmbulanceReady: "0",
            isAmbulanceAvailable: "1",
          },
        ]

        setAmbulances(testData)
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
      // Nettoyer les connexions au démontage
      Object.values(connections).forEach((connection) => {
        if (connection) {
          connection.stop()
        }
      })

      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const matricule = formData.get("Matricule")

    try {
      const newAmb = {
        idEmbulance: Date.now().toString(),
        matricule: matricule,
        latitude: "36.7538",
        longitude: "3.0588",
        isAmbulanceReady: "1",
        isAmbulanceAvailable: "1",
      }

      setAmbulances((prev) => [...prev, newAmb])
      alert("Ambulance ajoutée ✅")
      e.target.reset()
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error)
      alert("Erreur: Échec ❌")
    }
  }

  // Combiner les ambulances statiques et virtuelles pour l'affichage
  const allAmbulances = [
    ...ambulances.map((amb) => ({
      ...amb,
      latitude: Number.parseFloat(amb.latitude),
      longitude: Number.parseFloat(amb.longitude),
      type: "static",
    })),
    ...virtualAmbulances.map((amb) => ({
      ...amb,
      idEmbulance: `virtual-${amb.id}`,
      type: "virtual",
    })),
  ]

  console.log("🗺️ Ambulances à afficher:", allAmbulances)
  console.log("🚑 Ambulances virtuelles:", virtualAmbulances)

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de bord - Responsable d'hôpital</h1>

      {/* Section de contrôle SignalR */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-bold text-[#F05050] mb-4">Contrôle de simulation en temps réel</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ambulance 1 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">🚑 Ambulance 1</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Statut:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statuses[1] === "Connected"
                    ? "bg-green-100 text-green-800"
                    : statuses[1] === "Connecting"
                      ? "bg-yellow-100 text-yellow-800"
                      : statuses[1] === "Error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {statuses[1] || "Disconnected"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startSimulation(1)}
                disabled={statuses[1] === "Connected" || statuses[1] === "Connecting"}
                className="flex-1 px-3 py-2 bg-[#F05050] text-white rounded hover:bg-[#D32F2F] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {statuses[1] === "Connecting" ? "Connexion..." : "Démarrer"}
              </button>
              <button
                onClick={() => stopSimulation(1)}
                disabled={!connections[1]}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Arrêter
              </button>
            </div>
          </div>

          {/* Ambulance 2 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">🚑 Ambulance 2</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Statut:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statuses[2] === "Connected"
                    ? "bg-green-100 text-green-800"
                    : statuses[2] === "Connecting"
                      ? "bg-yellow-100 text-yellow-800"
                      : statuses[2] === "Error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {statuses[2] || "Disconnected"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startSimulation(2)}
                disabled={statuses[2] === "Connected" || statuses[2] === "Connecting"}
                className="flex-1 px-3 py-2 bg-[#F05050] text-white rounded hover:bg-[#D32F2F] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {statuses[2] === "Connecting" ? "Connexion..." : "Démarrer"}
              </button>
              <button
                onClick={() => stopSimulation(2)}
                disabled={!connections[2]}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Arrêter
              </button>
            </div>
          </div>

          {/* Ambulance 3 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">🚑 Ambulance 3</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Statut:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statuses[3] === "Connected"
                    ? "bg-green-100 text-green-800"
                    : statuses[3] === "Connecting"
                      ? "bg-yellow-100 text-yellow-800"
                      : statuses[3] === "Error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {statuses[3] || "Disconnected"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startSimulation(3)}
                disabled={statuses[3] === "Connected" || statuses[3] === "Connecting"}
                className="flex-1 px-3 py-2 bg-[#F05050] text-white rounded hover:bg-[#D32F2F] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {statuses[3] === "Connecting" ? "Connexion..." : "Démarrer"}
              </button>
              <button
                onClick={() => stopSimulation(3)}
                disabled={!connections[3]}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Arrêter
              </button>
            </div>
          </div>

          {/* Ambulance 4 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">🚑 Ambulance 4</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Statut:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statuses[4] === "Connected"
                    ? "bg-green-100 text-green-800"
                    : statuses[4] === "Connecting"
                      ? "bg-yellow-100 text-yellow-800"
                      : statuses[4] === "Error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {statuses[4] || "Disconnected"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startSimulation(4)}
                disabled={statuses[4] === "Connected" || statuses[4] === "Connecting"}
                className="flex-1 px-3 py-2 bg-[#F05050] text-white rounded hover:bg-[#D32F2F] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {statuses[4] === "Connecting" ? "Connexion..." : "Démarrer"}
              </button>
              <button
                onClick={() => stopSimulation(4)}
                disabled={!connections[4]}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Arrêter
              </button>
            </div>
          </div>

          {/* Ambulance 5 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">🚑 Ambulance 5</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Statut:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statuses[5] === "Connected"
                    ? "bg-green-100 text-green-800"
                    : statuses[5] === "Connecting"
                      ? "bg-yellow-100 text-yellow-800"
                      : statuses[5] === "Error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {statuses[5] || "Disconnected"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startSimulation(5)}
                disabled={statuses[5] === "Connected" || statuses[5] === "Connecting"}
                className="flex-1 px-3 py-2 bg-[#F05050] text-white rounded hover:bg-[#D32F2F] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {statuses[5] === "Connecting" ? "Connexion..." : "Démarrer"}
              </button>
              <button
                onClick={() => stopSimulation(5)}
                disabled={!connections[5]}
                className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Arrêter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section carte */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-bold text-[#F05050] mb-2">Carte en temps réel</h2>
          <p className="text-sm text-gray-600 mb-4">
            Ambulances affichées: {allAmbulances.length} ({ambulances.length} statiques + {virtualAmbulances.length}{" "}
            virtuelles)
          </p>

          {/* Conteneur de carte avec hauteur fixe */}
          <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300">
            <MapContainer center={[36.7538, 3.0588]} zoom={10} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Composant qui gère la localisation de l'utilisateur */}
              <LocationMarker />

              {/* Marqueurs pour toutes les ambulances (statiques + virtuelles) */}
              {allAmbulances.map((ambulance) => (
  <>
    <Marker
      key={ambulance.idEmbulance}
      position={[ambulance.latitude, ambulance.longitude]}
      icon={ambulanceIcon}
      eventHandlers={{
        click: () => {
          console.log("Ambulance clicked:", ambulance)
        },
      }}
    >
      <Popup className="custom-popup">
        <div>
          <div className="popup-title">🚑 Ambulance</div>
          <div className="popup-info">
            <span className="popup-label">ID:</span>
            <span className="popup-value">{ambulance.idEmbulance}</span>
          </div>
          <div className="popup-info">
            <span className="popup-label">Matricule:</span>
            <span className="popup-value">{ambulance.matricule}</span>
          </div>
          <div className="popup-info">
            <span className="popup-label">Type:</span>
            <span className="popup-value">
              {ambulance.type === "virtual" ? "Simulation" : "Base de données"}
            </span>
          </div>
          <div className="popup-info">
            <span className="popup-label">Statut:</span>
            <span className="popup-value">{getAmbulanceStatus(ambulance)}</span>
          </div>
          <div className="popup-info">
            <span className="popup-label">Position:</span>
            <span className="popup-value">
              {ambulance.latitude.toFixed(4)}, {ambulance.longitude.toFixed(4)}
            </span>
          </div>
          {ambulance.hubId && (
            <div className="popup-info">
              <span className="popup-label">Hub:</span>
              <span className="popup-value">Ambulance {ambulance.hubId}</span>
            </div>
          )}
        </div>
      </Popup>
    </Marker>

    {alertPosition && (
      <Marker
        position={alertPosition}
        icon={L.icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })}
      >
        <Popup>
          🚨 <strong>Alerte détectée</strong><br />
          Lat: {alertPosition[0].toFixed(4)}<br />
          Lon: {alertPosition[1].toFixed(4)}
        </Popup>
      </Marker>
    )}
  </>



























              ))}
            </MapContainer>
          </div>
        </div>

        {/* Section gestion des ambulances */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-bold text-[#F05050] mb-2">Gestion des ambulances</h2>

          {/* Formulaire d'ajout d'ambulance */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="Matricule" className="block text-sm font-medium text-gray-700 mb-1">
                  Immatriculation
                </label>
                <input
                  type="text"
                  id="Matricule"
                  name="Matricule"
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
              {allAmbulances.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune ambulance enregistrée</p>
              ) : (
                allAmbulances.map((ambulance) => (
                  <div key={ambulance.idEmbulance} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-black">{ambulance.matricule}</div>
                        <div className="text-xs text-gray-500">ID: {ambulance.idEmbulance}</div>
                        <div className="text-xs text-blue-600">
                          {ambulance.type === "virtual" ? "🔴 Simulation" : "🟢 Base de données"}
                        </div>
                        {ambulance.hubId && <div className="text-xs text-purple-600">Hub: {ambulance.hubId}</div>}
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-1 rounded-full ${getStatusColorClass(ambulance)}`}>
                            {getAmbulanceStatus(ambulance)}
                          </span>
                        </div>
                      </div>
                      {ambulance.type === "static" && (
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
                      )}
                    </div>

                    {/* Section de modification du statut - seulement pour les ambulances statiques */}
                    {ambulance.type === "static" && (
                      <div className="border-t pt-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Modifier le statut:</div>
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            onClick={() => toggleAmbulanceStatus(ambulance)}
                            disabled={updatingStatus[ambulance.idEmbulance]}
                            className={`px-3 py-2 text-sm rounded-md hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColorClass(ambulance)}`}
                          >
                            {updatingStatus[ambulance.idEmbulance] ? "..." : getButtonText(ambulance)}
                          </button>

                          {getAmbulanceStatus(ambulance) !== "En panne" && (
                            <button
                              onClick={() => updateAmbulanceStatus(ambulance.idEmbulance, "2")}
                              disabled={updatingStatus[ambulance.idEmbulance]}
                              className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingStatus[ambulance.idEmbulance] ? "..." : "🔧 Marquer en panne"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
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
