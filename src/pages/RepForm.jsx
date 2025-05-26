"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AllHelp, RepHelp } from "../../services/Admin"

const RepForm = () => {
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [helpMessages, setHelpMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [admin, setAdmin] = useState(null)
  const [filter, setFilter] = useState("all") // 'all', 'pending', 'answered'

  // Charger les données de l'administrateur et des messages d'aide
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await AllHelp()
        console.log("Réponse de l'API:", response.data)
        setHelpMessages(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des messages d'aide:", error)
      }

      // Charger les messages d'aide (données fictives)
      const sampleHelpMessages = [
        {
          id: 1,
          userId: 101,
          userType: "patient",
          userName: "Jean Dupont",
          userEmail: "jean.dupont@example.com",
          subject: "Problème de connexion",
          message:
            "Bonjour, je n'arrive pas à me connecter à mon compte depuis hier. J'ai essayé de réinitialiser mon mot de passe mais je ne reçois pas l'email de réinitialisation. Pouvez-vous m'aider s'il vous plaît?",
          date: "2023-06-15T14:30:00",
          status: "pending",
          priority: "high",
          reply: null,
        },
        {
          id: 2,
          userId: 102,
          userType: "professional",
          userName: "Dr. Marie Martin",
          userEmail: "dr.martin@example.com",
          subject: "Mise à jour des informations de profil",
          message:
            "Bonjour, j'aimerais mettre à jour ma spécialité médicale sur mon profil mais je ne trouve pas où le faire. Pourriez-vous m'indiquer la procédure à suivre? Merci d'avance.",
          date: "2023-06-14T10:15:00",
          status: "answered",
          priority: "medium",
          reply: {
            adminId: 1,
            adminName: "Admin Support",
            text: "Bonjour Dr. Martin, pour mettre à jour votre spécialité, veuillez aller dans 'Paramètres du compte' puis 'Informations professionnelles'. Vous pourrez y modifier votre spécialité. N'hésitez pas si vous avez d'autres questions.",
            date: "2023-06-14T11:30:00",
          },
        },
        {
          id: 3,
          userId: 103,
          userType: "patient",
          userName: "Sophie Lefebvre",
          userEmail: "sophie.lefebvre@example.com",
          subject: "Comment ajouter un proche?",
          message:
            "Bonjour, je souhaite ajouter ma mère comme proche dans l'application pour qu'elle puisse être contactée en cas d'urgence. Comment puis-je procéder? Merci pour votre aide.",
          date: "2023-06-13T16:45:00",
          status: "pending",
          priority: "medium",
          reply: null,
        },
        {
          id: 4,
          userId: 104,
          userType: "professional",
          userName: "Dr. Thomas Moreau",
          userEmail: "thomas.moreau@example.com",
          subject: "Problème avec le calendrier",
          message:
            "Bonjour, j'ai un problème avec le calendrier des rendez-vous. Certains rendez-vous confirmés n'apparaissent pas dans mon agenda. Est-ce un bug connu? Y a-t-il une solution? Merci.",
          date: "2023-06-12T09:20:00",
          status: "answered",
          priority: "high",
          reply: {
            adminId: 2,
            adminName: "Admin Technique",
            text: "Bonjour Dr. Moreau, nous avons identifié un problème de synchronisation avec le calendrier qui affecte certains utilisateurs. Notre équipe technique travaille actuellement sur une correction qui sera déployée dans les 24 heures. En attendant, vous pouvez actualiser manuellement votre calendrier en cliquant sur l'icône de rafraîchissement en haut à droite. Nous vous prions de nous excuser pour ce désagrément.",
            date: "2023-06-12T10:45:00",
          },
        },
        {
          id: 5,
          userId: 105,
          userType: "patient",
          userName: "Pierre Durand",
          userEmail: "pierre.durand@example.com",
          subject: "Suppression de compte",
          message:
            "Bonjour, je souhaite supprimer définitivement mon compte. Pourriez-vous m'indiquer la procédure à suivre? Merci.",
          date: "2023-06-11T13:10:00",
          status: "pending",
          priority: "low",
          reply: null,
        },
      ]
    }
    fetchdata()
  }, [])

  // Filtrer les messages en fonction du terme de recherche et du filtre
  const filteredMessages = helpMessages.filter((message) => {
    const matchesSearch = message.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert("Veuillez saisir une réponse avant d'envoyer")
      return
    }
    const formdata = new FormData()
    formdata.append("id", selectedMessage.id)
    formdata.append("response", replyText)
    try {
      const response = await RepHelp(formdata)
      console.log("Réponse de l'API:", response.data)
      const updatedMessages = helpMessages.filter((msg) => msg.id !== selectedMessage.id)
      setHelpMessages(updatedMessages)
      setReplyText("")
      setSelectedMessage(null)
      alert("Réponse envoyée avec succès!")
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error)
    }
  }

  // Formater la date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  // Obtenir le temps écoulé depuis l'envoi du message
  const getTimeElapsed = (dateString) => {
    const messageDate = new Date(dateString)
    const now = new Date()
    const diffInMilliseconds = now - messageDate

    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

    if (diffInDays > 0) {
      return `il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
    } else if (diffInHours > 0) {
      return `il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`
    } else {
      return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`
    }
  }

  // Rendu des icônes
  const renderIcon = (name) => {
    switch (name) {
      case "search":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        )
      case "mail":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        )
      case "user":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )
      case "briefcase":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        )
      case "clock":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        )
      case "check":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )
      case "alert-circle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )
      case "send":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        )
      case "filter":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        )
      case "reply":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 10 4 15 9 20"></polyline>
            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <div className={`${isDark ? "bg-gray-800" : "bg-white"} shadow-md p-4`}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Help Requests Management</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Respond to user questions and issues
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Messages List */}
          <div className="w-full lg:w-1/3">
            {/* Search and Filter */}
            <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-4 mb-4`}>
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {renderIcon("search")}
                </div>
                <input
                  type="text"
                  placeholder="Search for a message..."
                  className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                      : "bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500"
                  } border focus:ring-2 focus:ring-opacity-50 focus:outline-none`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <div className="ml-auto text-sm">
                  <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Total: {filteredMessages.length} message(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
              {filteredMessages.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No messages found</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMessages.map((message) => (
                    <li
                      key={message.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? isDark
                            ? "bg-gray-700"
                            : "bg-blue-50"
                          : isDark
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-medium mr-2 ${
                              message.role === "10" ? "bg-[#f05050]" : "bg-blue-500"
                            }`}
                          >
                            {message.email.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{message.email}</h3>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              {message.role === "10" ? (
                                <span className="mr-1">{renderIcon("user")}</span>
                              ) : (
                                <span className="mr-1">{renderIcon("briefcase")}</span>
                              )}
                              <span>{message.role === "10" ? "Patient" : "Professional"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-col text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex justify-center items-center">
                            <span className="mr-1">{renderIcon("clock")}</span>
                            <span>{getTimeElapsed(message.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{message.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column - Message Details and Reply Form */}
          <div className="w-full lg:w-2/3">
            {selectedMessage ? (
              <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mt-1">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-medium mr-2 ${
                            selectedMessage.role === "10" ? "bg-[#f05050]" : "bg-blue-500"
                          }`}
                        >
                          {selectedMessage.email.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedMessage.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(selectedMessage.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{selectedMessage.body}</p>
                  </div>
                </div>

                <div className="p-4 ">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">{renderIcon("mail")}</span>
                    <h3 className="font-medium">Reply</h3>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#f05050]`}
                    placeholder="Write your reply here..."
                    rows={5}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleSendReply}
                      className="bg-[#f05050] text-white px-4 py-2 rounded-lg hover:bg-[#e04040] flex items-center"
                    >
                      <span className="mr-2">{renderIcon("send")}</span>
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-8 flex flex-col items-center justify-center h-full`}
              >
                <div className="text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-4 flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No message selected</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a message from the list to view its content and reply.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RepForm
