"use client"

import { useState, useEffect } from "react"

const VerifPat = () => {
  // État pour stocker la liste des patients en attente de vérification
  const [pendingPatients, setPendingPatients] = useState([])
  // État pour stocker le patient actuellement sélectionné
  const [selectedPatient, setSelectedPatient] = useState(null)
  // État pour le message de notification
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  // Simuler le chargement des patients depuis une API
  useEffect(() => {
    // Dans une application réelle, ceci serait un appel API
    const fetchPendingPatients = () => {
      // Données simulées basées sur la structure fournie
      const mockPatients = [
        {
          id: 1,
          email: "jean.dupont@example.com",
          name: "Jean",
          lastName: "Dupont",
          adress: "123 Rue de Paris",
          postalCode: "75001",
          dateOfBirth: "1985-06-15",
          phoneNumber: "0612345678",
          idCardImage: "/placeholder.svg?height=300&width=500", // Représente File
          age: "38",
          gender: "Homme",
          weight: "75 kg",
          height: "180 cm",
          status: "pending",
        },
        {
          id: 2,
          email: "marie.martin@example.com",
          name: "Marie",
          lastName: "Martin",
          adress: "456 Avenue des Champs",
          postalCode: "75008",
          dateOfBirth: "1990-09-23",
          phoneNumber: "0687654321",
          idCardImage: "/placeholder.svg?height=300&width=500",
          age: "33",
          gender: "Femme",
          weight: "62 kg",
          height: "165 cm",
          status: "pending",
        },
        {
          id: 3,
          email: "pierre.durand@example.com",
          name: "Pierre",
          lastName: "Durand",
          adress: "789 Boulevard Saint-Michel",
          postalCode: "75005",
          dateOfBirth: "1978-03-10",
          phoneNumber: "0698765432",
          idCardImage: "/placeholder.svg?height=300&width=500",
          age: "45",
          gender: "Homme",
          weight: "80 kg",
          height: "175 cm",
          status: "pending",
        },
      ]

      setPendingPatients(mockPatients)
    }

    fetchPendingPatients()
  }, [])

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  // Sélectionner un patient pour afficher ses détails
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
  }

  // Valider un patient
  const handleValidatePatient = (patientId) => {
    // Dans une application réelle, ceci serait un appel API pour mettre à jour le statut
    setPendingPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId))

    setNotification({
      show: true,
      message: "Patient validé avec succès",
      type: "success",
    })

    // Réinitialiser le patient sélectionné
    setSelectedPatient(null)

    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Rejeter un patient
  const handleRejectPatient = (patientId) => {
    // Dans une application réelle, ceci serait un appel API pour mettre à jour le statut
    setPendingPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId))

    setNotification({
      show: true,
      message: "Patient rejeté",
      type: "error",
    })

    // Réinitialiser le patient sélectionné
    setSelectedPatient(null)

    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Vérification des Patients</h1>

        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-4 p-3 rounded ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {notification.message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Liste des patients en attente */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Patients en attente de vérification</h2>

            {pendingPatients.length === 0 ? (
              <p className="text-gray-500">Aucun patient en attente de vérification</p>
            ) : (
              <ul className="space-y-2">
                {pendingPatients.map((patient) => (
                  <li
                    key={patient.id}
                    className={`p-3 rounded cursor-pointer transition-colors duration-200 ${
                      selectedPatient?.id === patient.id ? "bg-[#F05050] text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleSelectPatient(patient)}
                  >
                    <div className="font-medium">
                      {patient.name} {patient.lastName}
                    </div>
                    <div className="text-sm opacity-80">{patient.email}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Détails du patient sélectionné */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-4">
            {selectedPatient ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Détails du patient</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations du patient */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-[#F05050]">Informations personnelles</h3>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Nom complet:</span>
                          <span className="ml-2">
                            {selectedPatient.name} {selectedPatient.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Email:</span>
                          <span className="ml-2">{selectedPatient.email}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Téléphone:</span>
                          <span className="ml-2">{selectedPatient.phoneNumber}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Genre:</span>
                          <span className="ml-2">{selectedPatient.gender}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Âge:</span>
                          <span className="ml-2">{selectedPatient.age} ans</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Date de naissance:</span>
                          <span className="ml-2">{formatDate(selectedPatient.dateOfBirth)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#F05050]">Informations médicales</h3>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Taille:</span>
                          <span className="ml-2">{selectedPatient.height}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Poids:</span>
                          <span className="ml-2">{selectedPatient.weight}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#F05050]">Adresse</h3>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Adresse:</span>
                          <span className="ml-2">{selectedPatient.adress}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Code postal:</span>
                          <span className="ml-2">{selectedPatient.postalCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photo de la carte d'identité */}
                  <div>
                    <h3 className="font-medium text-[#F05050] mb-2">Carte d'identité</h3>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={selectedPatient.idCardImage || "/placeholder.svg"}
                        alt="Carte d'identité"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => handleRejectPatient(selectedPatient.id)}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={() => handleValidatePatient(selectedPatient.id)}
                    className="px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition-colors duration-200"
                  >
                    Valider
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Sélectionnez un patient pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifPat

