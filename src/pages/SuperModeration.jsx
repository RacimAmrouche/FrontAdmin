"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { AllPat, AllProS, SuspendUser, BanUser,UnSus } from "../../services/Admin"
import logo from "../assets/logovide.png"
import { Link } from "react-router-dom"

const SuperModeration = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("patients")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDark, setIsDark] = useState(false)
  const [patients, setPatients] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [admins, setAdmins] = useState([])
  const [hospitalAdmins, setHospitalAdmins] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [banReason, setBanReason] = useState("")
  const [admin, setAdmin] = useState(null)
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false)

  useEffect(() => {
    const fetchdata = async () => {
      try {
        // Données d'exemple pour les admins
        const adminData = [
          {
            id: "admin1",
            uid: "ADM-001-2024",
            name: "Ahmed",
            lastName: "Benali",
            email: "ahmed.benali@emergency.dz",
            createdAt: "2024-01-15T10:30:00Z",
            lastlogin: "2024-01-20T14:22:00Z",
            accountStatus: false, // false = active, true = suspended
            isBanned: false,
            isOnline: true,
            role: "Super Admin",
            permissions: ["user_management", "system_config", "reports"],
            department: "IT Administration",
          },
          {
            id: "admin2",
            uid: "ADM-002-2024",
            name: "Fatima",
            lastName: "Khelifi",
            email: "fatima.khelifi@emergency.dz",
            createdAt: "2024-01-10T09:15:00Z",
            lastlogin: "2024-01-19T16:45:00Z",
            accountStatus: true, // suspended
            isBanned: false,
            isOnline: false,
            role: "Moderation Admin",
            permissions: ["user_moderation", "content_review"],
            department: "Content Moderation",
            suspensionReason: "Violation of moderation procedures",
          },
          {
            id: "admin3",
            uid: "ADM-003-2024",
            name: "Karim",
            lastName: "Meziane",
            email: "karim.meziane@emergency.dz",
            createdAt: "2023-12-20T11:00:00Z",
            lastlogin: "2024-01-18T13:30:00Z",
            accountStatus: false,
            isBanned: true,
            isOnline: false,
            role: "System Admin",
            permissions: ["system_maintenance", "backup_management"],
            department: "System Operations",
            banReason: "Unauthorized access to sensitive data",
          },
        ]

        // Données d'exemple pour les admins d'hôpital
        const hospitalAdminData = [
          {
            id: "hosp1",
            uid: "HOSP-001-2024",
            name: "Dr. Amina",
            lastName: "Boumediene",
            email: "amina.boumediene@chu-alger.dz",
            createdAt: "2024-01-12T08:45:00Z",
            lastlogin: "2024-01-20T12:15:00Z",
            accountStatus: false,
            isBanned: false,
            isOnline: true,
            hospitalName: "CHU Mustapha Pacha",
            hospitalId: "CHU-001",
            department: "Administration Médicale",
            specialization: "Gestion Hospitalière",
            licenseNumber: "MED-ALG-2019-1234",
          },
          {
            id: "hosp2",
            uid: "HOSP-002-2024",
            name: "Dr. Youcef",
            lastName: "Hamidi",
            email: "youcef.hamidi@ehs-oran.dz",
            createdAt: "2024-01-08T14:20:00Z",
            lastlogin: "2024-01-19T09:30:00Z",
            accountStatus: false,
            isBanned: false,
            isOnline: false,
            hospitalName: "EHS Oran",
            hospitalId: "EHS-002",
            department: "Urgences",
            specialization: "Médecine d'Urgence",
            licenseNumber: "MED-ORN-2020-5678",
          },
          {
            id: "hosp3",
            uid: "HOSP-003-2024",
            name: "Dr. Samira",
            lastName: "Cherif",
            email: "samira.cherif@hopital-constantine.dz",
            createdAt: "2023-11-25T16:10:00Z",
            lastlogin: "2024-01-15T11:45:00Z",
            accountStatus: true, // suspended
            isBanned: false,
            isOnline: false,
            hospitalName: "Hôpital Ibn Badis Constantine",
            hospitalId: "IBN-003",
            department: "Cardiologie",
            specialization: "Cardiologie Interventionnelle",
            licenseNumber: "MED-CST-2018-9012",
            suspensionReason: "Gestion inappropriée des dossiers patients",
          },
          {
            id: "hosp4",
            uid: "HOSP-004-2024",
            name: "Dr. Rachid",
            lastName: "Benaissa",
            email: "rachid.benaissa@hopital-annaba.dz",
            createdAt: "2023-10-30T10:25:00Z",
            lastlogin: "2024-01-10T15:20:00Z",
            accountStatus: false,
            isBanned: true,
            isOnline: false,
            hospitalName: "Hôpital Ibn Rochd Annaba",
            hospitalId: "IBR-004",
            department: "Neurologie",
            specialization: "Neurochirurgie",
            licenseNumber: "MED-ANB-2017-3456",
            banReason: "Falsification de rapports médicaux",
          },
        ]

        setAdmins(adminData)
        setHospitalAdmins(hospitalAdminData)

        // Code original pour patients et professionnels (commenté pour la démo)
        // const result = await AllPat()
        // console.log(result.data)
        // setPatients(result.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchdata()
  }, [])

  const getCurrentUsers = () => {
    switch (activeTab) {
      case "patients":
        return patients
      case "professionals":
        return professionals
      case "admins":
        return admins
      case "hospitalAdmins":
        return hospitalAdmins
      default:
        return []
    }
  }

  const filteredUsers = getCurrentUsers().filter((user) => {
    const fullName = `${user.name} ${user.lastName}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Gérer la suspension d'un utilisateur
  const handleSuspendUser = (user) => {
    setSelectedUser(user)
    setBanReason("")
    setIsModalOpen(true)
  }

  // Gérer le bannissement d'un utilisateur
  const handleBanUser = (user) => {
    setSelectedUser(user)
    setBanReason("")
    setIsBanModalOpen(true)
  }

  // Gérer la levée de suspension d'un utilisateur
  const handleUnsuspendUser = (user) => {
    if (activeTab === "patients") {
      const updatedPatients = patients.map((p) =>
        p.id === user.id ? { ...p, accountStatus: false, suspensionReason: null } : p,
      )
      setPatients(updatedPatients)
    } else if (activeTab === "professionals") {
      const updatedProfessionals = professionals.map((p) =>
        p.id === user.id ? { ...p, accountStatus: false, suspensionReason: null } : p,
      )
      setProfessionals(updatedProfessionals)
    } else if (activeTab === "admins") {
      const updatedAdmins = admins.map((p) =>
        p.id === user.id ? { ...p, accountStatus: false, suspensionReason: null } : p,
      )
      setAdmins(updatedAdmins)
    } else if (activeTab === "hospitalAdmins") {
      const updatedHospitalAdmins = hospitalAdmins.map((p) =>
        p.id === user.id ? { ...p, accountStatus: false, suspensionReason: null } : p,
      )
      setHospitalAdmins(updatedHospitalAdmins)
    }
  }

  // Afficher les informations de l'utilisateur
  const handleShowUserInfo = (user) => {
    setSelectedUser(user)
    setIsUserInfoModalOpen(true)
  }

  // Confirmer la suspension
  const confirmSuspension = async () => {
    if (!banReason.trim()) {
      alert("Veuillez fournir une raison pour la suspension")
      return
    }

    if (activeTab === "patients") {
      const updatedPatients = patients.map((p) =>
        p.id === selectedUser.id ? { ...p, accountStatus: true, suspensionReason: banReason } : p,
      )
      setPatients(updatedPatients)
    } else if (activeTab === "professionals") {
      const updatedProfessionals = professionals.map((p) =>
        p.id === selectedUser.id ? { ...p, accountStatus: true, suspensionReason: banReason } : p,
      )
      setProfessionals(updatedProfessionals)
    } else if (activeTab === "admins") {
      const updatedAdmins = admins.map((p) =>
        p.id === selectedUser.id ? { ...p, accountStatus: true, suspensionReason: banReason } : p,
      )
      setAdmins(updatedAdmins)
    } else if (activeTab === "hospitalAdmins") {
      const updatedHospitalAdmins = hospitalAdmins.map((p) =>
        p.id === selectedUser.id ? { ...p, accountStatus: true, suspensionReason: banReason } : p,
      )
      setHospitalAdmins(updatedHospitalAdmins)
    }

    setIsModalOpen(false)
    setSelectedUser(null)
    setBanReason("")
  }

  // Confirmer le bannissement
  const confirmBan = async () => {
    if (!banReason.trim()) {
      alert("Veuillez fournir une raison pour le bannissement")
      return
    }

    if (activeTab === "patients") {
      const updatedPatients = patients.map((p) =>
        p.id === selectedUser.id ? { ...p, isBanned: true, banReason: banReason } : p,
      )
      setPatients(updatedPatients)
    } else if (activeTab === "professionals") {
      const updatedProfessionals = professionals.map((p) =>
        p.id === selectedUser.id ? { ...p, isBanned: true, banReason: banReason } : p,
      )
      setProfessionals(updatedProfessionals)
    } else if (activeTab === "admins") {
      const updatedAdmins = admins.map((p) =>
        p.id === selectedUser.id ? { ...p, isBanned: true, banReason: banReason } : p,
      )
      setAdmins(updatedAdmins)
    } else if (activeTab === "hospitalAdmins") {
      const updatedHospitalAdmins = hospitalAdmins.map((p) =>
        p.id === selectedUser.id ? { ...p, isBanned: true, banReason: banReason } : p,
      )
      setHospitalAdmins(updatedHospitalAdmins)
    }

    setIsBanModalOpen(false)
    setSelectedUser(null)
    setBanReason("")
  }

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
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
      case "ban":
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
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        )
      case "check":
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
            <polyline points="20 6 9 17 4 12"></polyline>
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
      case "users":
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
      case "shield":
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        )
      case "building":
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
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
            <path d="M10 6h4"></path>
            <path d="M10 10h4"></path>
            <path d="M10 14h4"></path>
            <path d="M10 18h4"></path>
          </svg>
        )
      case "calendar":
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        )
      case "mail":
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
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        )
      case "x":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
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
      default:
        return null
    }
  }

  const getTabLabel = () => {
    switch (activeTab) {
      case "patients":
        return "patient"
      case "professionals":
        return "professionnel"
      case "admins":
        return "admin"
      case "hospitalAdmins":
        return "admin hospitalier"
      default:
        return "utilisateur"
    }
  }

  return (
    <div className={`min-h-screen p-4 bg-gray-100`}>
      
  <div className="bg-white rounded-xl shadow-md mb-3 w-full max-w-7xl mx-auto text-base mt-[51px]">
        <div className="flex flex-nowrap items-center border-b">
          {/* Logo + Nom app */}
          <div className="flex items-center px-6 py-4 mr-6">
            <img src={logo} alt="E-mergency Logo" className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl text-[#F05050]">Emergency</span>
          </div>
          <Link
            to="/SuperAdmin"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Alerts
            </Link>
          
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
          <button className="px-8 py-4 font-semibold text-[#F05050] border-b-4 border-[#F05050]">
            Moderation
          </button>
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
            Create Admin
          </Link>
          <Link
            to="/AdminCrea"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Create AdminH
          </Link>
        </div>
      </div>


      {/* Main content */}
      <div className="container mx-auto p-4">
        {/* Onglets */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "patients"
                ? `border-b-2 border-[#f05050] ${isDark ? "text-white" : "text-gray-900"}`
                : `${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
            }`}
            onClick={() => setActiveTab("patients")}
          >
            <div className="flex items-center">
              <span className="mr-2">{renderIcon("users")}</span>
              <span>Moderate Patients</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "professionals"
                ? `border-b-2 border-[#f05050] ${isDark ? "text-white" : "text-gray-900"}`
                : `${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
            }`}
            onClick={() => setActiveTab("professionals")}
          >
            <div className="flex items-center">
              <span className="mr-2">{renderIcon("briefcase")}</span>
              <span> Moderate healthcare pros</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "admins"
                ? `border-b-2 border-[#f05050] ${isDark ? "text-white" : "text-gray-900"}`
                : `${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
            }`}
            onClick={() => setActiveTab("admins")}
          >
            <div className="flex items-center">
              <span className="mr-2">{renderIcon("shield")}</span>
              <span>Moderate Admins</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab === "hospitalAdmins"
                ? `border-b-2 border-[#f05050] ${isDark ? "text-white" : "text-gray-900"}`
                : `${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
            }`}
            onClick={() => setActiveTab("hospitalAdmins")}
          >
            <div className="flex items-center">
              <span className="mr-2">{renderIcon("building")}</span>
              <span>Moderate Hospital Admins</span>
            </div>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-4 mb-6`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {renderIcon("search")}
            </div>
            <input
              type="text"
              placeholder={`Research ${getTabLabel()}...`}
              className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                isDark
                  ? "bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                  : "bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500"
              } border focus:ring-2 focus:ring-opacity-50 focus:outline-none`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? `Aucun ${getTabLabel()} trouvé` : `Aucun ${getTabLabel()} disponible`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${isDark ? "bg-gray-800" : "bg-white"} divide-y divide-gray-200 dark:divide-gray-700`}
                >
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-[#f05050] flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                            {user.lastName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div
                              className="font-medium cursor-pointer hover:underline"
                              onClick={() => handleShowUserInfo(user)}
                            >
                              {user.name} {user.lastName}
                            </div>
                          
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{renderIcon("mail")}</span>
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{renderIcon("calendar")}</span>
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.accountStatus === false
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          }`}
                        >
                          {user.accountStatus === false ? "Active" : "Suspended"}
                        </span>
                        {user.accountStatus === true && (
                          <div className="mt-1 flex items-center text-xs text-red-500">
                            <span>{user.suspensionReason}</span>
                          </div>
                        )}
                        {user.isBanned && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-black text-white">
                            Banned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {user.accountStatus === false ? (
                            <button
                              onClick={() => handleSuspendUser(user)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                            >
                              <span className="mr-1">{renderIcon("ban")}</span>
                              <span>Suspend</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnsuspendUser(user)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 flex items-center"
                            >
                              <span className="mr-1">{renderIcon("check")}</span>
                              <span>Reactivate</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleBanUser(user)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                          >
                            <span className="mr-1">{renderIcon("ban")}</span>
                            <span>Ban</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de suspension avec fond flou */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg w-full max-w-md mx-4`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Suspend the user</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {renderIcon("x")}
              </button>
            </div>
            <div className="p-4">
              <p className="mb-4">
                You are about to suspend{" "}
                <strong>
                  {selectedUser?.name} {selectedUser?.lastName}
                </strong>
                . Please provide a reason for this suspension.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Reason for suspension</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Explain the reason for the suspension..."
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-lg mr-2 ${
                  isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspension}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Confirm suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de bannissement avec fond flou */}
      {isBanModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg w-full max-w-md mx-4`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Ban the user</h2>
              <button
                onClick={() => setIsBanModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {renderIcon("x")}
              </button>
            </div>
            <div className="p-4">
              <p className="mb-4">
                You are about to permanently ban{" "}
                <strong>
                  {selectedUser?.name} {selectedUser?.lastName}
                </strong>
                . This action is irreversible. Please provide a reason for this ban.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Reason for the ban</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Explain the reason for the ban..."
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsBanModalOpen(false)}
                className={`px-4 py-2 rounded-lg mr-2 ${
                  isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button onClick={confirmBan} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                Confirm the ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User information modal */}
      {isUserInfoModalOpen && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div
            className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">User information</h2>
              <button
                onClick={() => setIsUserInfoModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {renderIcon("x")}
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-[#f05050] flex items-center justify-center text-white font-medium text-xl">
                  {selectedUser.name.charAt(0)}
                  {selectedUser.lastName.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">
                    {selectedUser.name} {selectedUser.lastName}
                  </h3>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {activeTab === "patients"
                      ? "Patient"
                      : activeTab === "professionals"
                        ? "Professionnel"
                        : activeTab === "admins"
                          ? selectedUser.role
                          : "Admin Hospitalier"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="mr-2 mt-1">{renderIcon("mail")}</span>
                  <div>
                    <span className="font-medium">Email&nbsp;:</span>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-2 mt-1">{renderIcon("user")}</span>
                  <div>
                    <span className="font-medium">UID&nbsp;:</span>
                    <p className="text-sm">{selectedUser.uid}</p>
                  </div>
                </div>

                {/* Informations spécifiques aux admins */}
                {activeTab === "admins" && (
                  <>
                    <div className="flex items-start">
                      <span className="mr-2 mt-1">{renderIcon("shield")}</span>
                      <div>
                        <span className="font-medium">Département&nbsp;:</span>
                        <p className="text-sm">{selectedUser.department}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2 mt-1">{renderIcon("briefcase")}</span>
                      <div>
                        <span className="font-medium">Permissions&nbsp;:</span>
                        <p className="text-sm">{selectedUser.permissions?.join(", ")}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Informations spécifiques aux admins d'hôpital */}
                {activeTab === "hospitalAdmins" && (
                  <>
                    <div className="flex items-start">
                      <span className="mr-2 mt-1">{renderIcon("building")}</span>
                      <div>
                        <span className="font-medium">Hôpital&nbsp;:</span>
                        <p className="text-sm">{selectedUser.hospitalName}</p>
                        <p className="text-xs text-gray-500">ID: {selectedUser.hospitalId}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2 mt-1">{renderIcon("briefcase")}</span>
                      <div>
                        <span className="font-medium">Département&nbsp;:</span>
                        <p className="text-sm">{selectedUser.department}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2 mt-1">{renderIcon("user")}</span>
                      <div>
                        <span className="font-medium">Spécialisation&nbsp;:</span>
                        <p className="text-sm">{selectedUser.specialization}</p>
                      </div>
                    </div>
                    {selectedUser.licenseNumber && (
                      <div className="flex items-start">
                        <span className="mr-2 mt-1">{renderIcon("shield")}</span>
                        <div>
                          <span className="font-medium">Numéro de licence&nbsp;:</span>
                          <p className="text-sm">{selectedUser.licenseNumber}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-start">
                  <span className="mr-2 mt-1">{renderIcon("calendar")}</span>
                  <div>
                    <span className="font-medium">Date d'inscription&nbsp;:</span>
                    <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>

                {selectedUser.lastlogin && (
                  <div className="flex items-start">
                    <span className="mr-2 mt-1">{renderIcon("calendar")}</span>
                    <div>
                      <span className="font-medium">Dernière connexion&nbsp;:</span>
                      <p className="text-sm">{formatDate(selectedUser.lastlogin)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <span className="mr-2 mt-1">
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
                      <path d="M12 16v.01"></path>
                      <path d="M12 8v4"></path>
                    </svg>
                  </span>
                  <div>
                    <span className="font-medium">Statut de connexion&nbsp;:</span>
                    <p className={`text-sm ${selectedUser.isOnline ? "text-green-500" : "text-gray-500"}`}>
                      {selectedUser.isOnline ? "En ligne" : "Hors ligne"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="mr-2 mt-1">
                    {renderIcon(selectedUser.accountStatus === false ? "check" : "ban")}
                  </span>
                  <div>
                    <span className="font-medium">Statut du compte&nbsp;:</span>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.accountStatus === false
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {selectedUser.accountStatus === false ? "Actif" : "Suspendu"}
                    </span>
                    {selectedUser.isBanned && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-black text-white">
                        Banni
                      </span>
                    )}
                  </div>
                </div>

                {selectedUser.accountStatus === true && (
                  <div className="flex items-start">
                    <span className="mr-2 mt-1">{renderIcon("alert-circle")}</span>
                    <div>
                      <span className="font-medium">Raison de la suspension&nbsp;:</span>
                      <p className="mt-1 text-sm">{selectedUser.suspensionReason || "Non spécifiée"}</p>
                    </div>
                  </div>
                )}

                {selectedUser.isBanned && (
                  <div className="flex items-start">
                    <span className="mr-2 mt-1">{renderIcon("alert-circle")}</span>
                    <div>
                      <span className="font-medium">Raison du bannissement&nbsp;:</span>
                      <p className="mt-1 text-sm">{selectedUser.banReason || "Non spécifiée"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsUserInfoModalOpen(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperModeration
