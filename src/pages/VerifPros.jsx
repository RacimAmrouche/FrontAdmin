"use client"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import Layout from "../components/layouts/layout"

const VerifPros = () => {
  // État pour stocker la liste des professionnels en attente de vérification
  const [pendingPros, setPendingPros] = useState([])
  // État pour stocker le professionnel actuellement sélectionné
  const [selectedPro, setSelectedPro] = useState(null)
  // État pour le message de notification
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  // Simuler le chargement des professionnels depuis une API
  useEffect(() => {
    // Dans une application réelle, ceci serait un appel API
    const fetchPendingPros = () => {
      // Données simulées basées sur la classe SignUpProSRequest
      const mockPros = [
        {
          id: 1,
          email: "thomas.dubois@example.com",
          name: "Thomas",
          lastName: "Dubois",
          gender: true, // true pour homme
          age: 45,
          dateOfBirth: "1979-05-15T00:00:00",
          adress: "123 Rue de Paris",
          postalCode: "75001",
          phoneNumber: "0612345678",
          idCardImage: "/placeholder.svg?height=300&width=500", // Représente File
          certifImage: "/placeholder.svg?height=300&width=500", // Représente FileCertif
          role: 2, // Supposons que 2 représente un médecin
          status: "pending",
        },
        {
          id: 2,
          email: "sophie.martin@example.com",
          name: "Sophie",
          lastName: "Martin",
          gender: false, // false pour femme
          age: 38,
          dateOfBirth: "1986-09-23T00:00:00",
          adress: "456 Avenue des Champs",
          postalCode: "75008",
          phoneNumber: "0687654321",
          idCardImage: "/placeholder.svg?height=300&width=500",
          certifImage: "/placeholder.svg?height=300&width=500",
          role: 3, // Supposons que 3 représente un spécialiste
          status: "pending",
        },
        {
          id: 3,
          email: "michel.durand@example.com",
          name: "Michel",
          lastName: "Durand",
          gender: true,
          age: 52,
          dateOfBirth: "1972-03-10T00:00:00",
          adress: "789 Boulevard Saint-Michel",
          postalCode: "75005",
          phoneNumber: "0698765432",
          idCardImage: "/placeholder.svg?height=300&width=500",
          certifImage: "/placeholder.svg?height=300&width=500",
          role: 4, // Supposons que 4 représente un autre type de professionnel
          status: "pending",
        },
      ]

      setPendingPros(mockPros)
    }

    fetchPendingPros()
  }, [])

  // Fonction pour convertir le rôle numérique en texte
  const getRoleText = (roleId) => {
    switch (roleId) {
      case 1:
        return "Patient"
      case 2:
        return "Médecin"
      case 3:
        return "Spécialiste"
      case 4:
        return "Thérapeute"
      default:
        return "Professionnel"
    }
  }

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  // Sélectionner un professionnel pour afficher ses détails
  const handleSelectPro = (pro) => {
    setSelectedPro(pro)
  }

  // Valider un professionnel
  const handleValidatePro = (proId) => {
    // Dans une application réelle, ceci serait un appel API pour mettre à jour le statut
    setPendingPros((prevPros) => prevPros.filter((pro) => pro.id !== proId))

    setNotification({
      show: true,
      message: "Professionnel validé avec succès",
      type: "success",
    })

    // Réinitialiser le professionnel sélectionné
    setSelectedPro(null)

    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Rejeter un professionnel
  const handleRejectPro = (proId) => {
    // Dans une application réelle, ceci serait un appel API pour mettre à jour le statut
    setPendingPros((prevPros) => prevPros.filter((pro) => pro.id !== proId))

    setNotification({
      show: true,
      message: "Professionnel rejeté",
      type: "error",
    })

    // Réinitialiser le professionnel sélectionné
    setSelectedPro(null)

    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  return (
    
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="bg-white rounded-xl shadow-md mb-6 w-full max-w-7xl mx-auto text-base">
            <div className="flex flex-wrap border-b">
           <Link
            to="/Admin"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            alertes
          </Link>
          <Link
            to="/VerifPat"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Vérifier comptes patients
          </Link>
          <button className="px-8 py-4 font-semibold text-[#F05050] border-b-4 border-[#F05050]">
            Verif comptes pro
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Vérification des Professionnels</h1>

        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-4 p-3 rounded ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {notification.message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Liste des professionnels en attente */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Professionnels en attente de vérification</h2>

            {pendingPros.length === 0 ? (
              <p className="text-gray-500">Aucun professionnel en attente de vérification</p>
            ) : (
              <ul className="space-y-2">
                {pendingPros.map((pro) => (
                  <li
                    key={pro.id}
                    className={`p-3 rounded cursor-pointer transition-colors duration-200 ${
                      selectedPro?.id === pro.id ? "bg-[#F05050] text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleSelectPro(pro)}
                  >
                    <div className="font-medium">
                      {pro.name} {pro.lastName}
                    </div>
                    <div className="text-sm opacity-80">{getRoleText(pro.role)}</div>
                    <div className="text-sm opacity-80">{pro.email}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Détails du professionnel sélectionné */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-4">
            {selectedPro ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Détails du professionnel</h2>

                <div className="grid grid-cols-1 gap-6">
                  {/* Informations du professionnel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-[#F05050]">Informations personnelles</h3>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <div>
                            <span className="font-medium text-gray-600">Nom complet:</span>
                            <span className="ml-2">
                              {selectedPro.name} {selectedPro.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Email:</span>
                            <span className="ml-2">{selectedPro.email}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Téléphone:</span>
                            <span className="ml-2">{selectedPro.phoneNumber}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Genre:</span>
                            <span className="ml-2">{selectedPro.gender ? "Homme" : "Femme"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Âge:</span>
                            <span className="ml-2">{selectedPro.age} ans</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Date de naissance:</span>
                            <span className="ml-2">{formatDate(selectedPro.dateOfBirth)}</span>
                          </div>
                        
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-[#F05050]">Adresse</h3>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <div>
                            <span className="font-medium text-gray-600">Adresse:</span>
                            <span className="ml-2">{selectedPro.adress}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Code postal:</span>
                            <span className="ml-2">{selectedPro.postalCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Photo de la carte d'identité */}
                    <div>
                      <h3 className="font-medium text-[#F05050] mb-2">Carte d'identité</h3>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={selectedPro.idCardImage || "/placeholder.svg"}
                          alt="Carte d'identité"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Certificat professionnel */}
                  <div>
                    <h3 className="font-medium text-[#F05050] mb-2">Certificat professionnel</h3>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={selectedPro.certifImage || "/placeholder.svg"}
                        alt="Certificat professionnel"
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => handleRejectPro(selectedPro.id)}
                      className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={() => handleValidatePro(selectedPro.id)}
                      className="px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition-colors duration-200"
                    >
                      Valider
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Sélectionnez un professionnel pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
   
  )
}

export default VerifPros
