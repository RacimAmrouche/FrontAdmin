"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/layouts/layout"
import { ListProVal, RejectUser } from "../../services/Admin"
import { GetInfoPro } from "../../services/Admin"
import { ValidateUser } from "../../services/Admin"

const VerifProS = () => {
  // État pour stocker la liste des patients en attente de vérification
  const [pendingproSs, setPendingproSs] = useState([])
  const [selectedproS, setSelectedproS] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    const fetchPendingproSs = async () => {
      const tabnotclean =[]
      try{ 
        const formdata = new FormData()
        formdata.append("roleadm",0)
        formdata.append("IDAdminn","FF40682C-A640-40EC-A284-4A18966A8BA6")
        const response = await ListProVal(formdata)
        //on recois une liste de patients
        console.log(response.data)
        const tabrequestscrea = response.data
        await Promise.all(
          tabrequestscrea.map(async (requestcrea) => {
            const formdataa = new FormData()
            formdataa.append("IDProSs", requestcrea.userUID)
            const response2 = await GetInfoPro(formdataa)
            //info du pat 
            console.log(response2.data)
            const obj = {
              id: requestcrea.id,
              uid : requestcrea.userUID,
              name: response2.data.name,
              lastName: response2.data.lastName,
              email: response2.data.email,
              phoneNumber: response2.data.phoneNumber,
              gender: response2.data.gender === true ? "Male" : "Female",
              age: response2.data.age,
              dateofbirth:formatReadableDate(response2.data.dateofBirth),
              adress: response2.data.adress,
              postalcode: response2.data.postalCode,
              confmail : response2.data.confMail === true ? "Confirmed" : "Not Confirmed Yet",
              carteid: response2.data.identite.replace(/\\/g, "/"),
              certif: response2.data.certif.replace(/\\/g, "/"),
            };
            console.log("proS donnees recup: ", obj)
            tabnotclean.push(obj);
          })
        );

        const uniquePendingproSs = Array.from(
          new Map(tabnotclean.map(proS => [proS.id, proS])).values()
        );

        setPendingproSs(uniquePendingproSs)
        console.log("final product :", pendingproSs)
        
      }
      catch (error) {
        console.error(error)
      }
      
      
    }

    fetchPendingproSs()
    
  }, []);

  function formatReadableDate(isoString) {
    return new Date(isoString).toLocaleString("en-US", {
      dateStyle: "medium",
      //timeStyle: "medium",
    });
  }
  // Sélectionner un patient pour afficher ses détails
  const handleSelectproS = (proS) => {
    setSelectedproS(proS)
  }

  const handleValidateproS = async (proSId) => {
    const formdata = new FormData()
    formdata.append("idCreaCompte", proSId)
    formdata.append("role", "20")

    try{
      const response = await ValidateUser(formdata)
      console.log(response)
      
    }
    catch (error) {
      console.error(error)
      setNotification({
        show: true,
        message: "Erreur lors de la validation du proS",
        type: "error",
      })
    }
    setNotification({
      show: true,
      message: "proS validé avec succès",
      type: "success",
    })
    setPendingproSs((prevproSs) => prevproSs.filter((proS) => proS.id !== proSId))
    setSelectedproS(null)
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }



  const handleRejectproS = async (proSId) => {
    const formdata = new FormData()
    formdata.append("idCreaCompte", proSId)
    formdata.append("role", "20")

    try{
      const response = await RejectUser(formdata)
      console.log(response)
      
    }
    catch (error) {
      console.error(error)
      setNotification({
        show: true,
        message: "Erreur lors du rejet du proS",
        type: "error",
      })
    }
    setNotification({
      show: true,
      message: "proS rejeté avec succès",
      type: "success",
    })
    setPendingproSs((prevproSs) => prevproSs.filter((proS) => proS.id !== proSId))
    setSelectedproS(null)
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
      Vérifier comptes pratients
    </Link>
    <button className="px-8 py-4 font-semibold text-[#F05050] border-b-4 border-[#F05050]">
      Verif comptes proS
    </button>
    <Link
      to="/Moderation"
      className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
    >
      Moderation
    </Link>
  </div>
</div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Vérification des proSs</h1>

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
            <h2 className="text-xl font-semibold mb-4 text-gray-700">proSs en attente de vérification</h2>

            {pendingproSs.length === 0 ? (
              <p className="text-gray-500">Aucun proS en attente de vérification</p>
            ) : (
              <ul className="space-y-2">
                {pendingproSs.map((proS) => (
                  <li
                    key={proS.id}
                    className={`p-3 rounded cursor-pointer transition-colors duration-200 text-black ${
                      selectedproS?.id === proS.id ? "bg-[#F05050] text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleSelectproS(proS)}
                  >
                    <div className="font-medium text-s">
                    {proS.name} {proS.lastName}<br/><p className="text-xs">Request ID: {proS.id}</p>
                    </div>
                  {/*  <div className="text-sm opacity-80">{patient.email}</div>*/} 
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Détails du patient sélectionné */}
          <div className="w-full md:w-2/3 overflow-y-auto max-h-[400px] bg-white rounded-lg shadow p-4">
            {selectedproS ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Détails du proS</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations du patient */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-[#F05050]">Informations personnelles</h3>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Full Name:</span>
                          <span className="ml-2 text-black">
                            {selectedproS.name} {selectedproS.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Email:</span>
                          <span className="ml-2 text-black">{selectedproS.email}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Mail Confirmation:</span>
                          <span className="ml-2 text-black">{selectedproS.confmail}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Téléphone:</span>
                          <span className="ml-2 text-black">{selectedproS.phoneNumber}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Gender:</span>
                          <span className="ml-2 text-black">{selectedproS.gender}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Age:</span>
                          <span className="ml-2 text-black">{selectedproS.age} ans</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Date de naissance:</span>
                          <span className="ml-2 text-black">{selectedproS.dateofbirth}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#F05050]">Adresse</h3>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Adresse:</span>
                          <span className="ml-2 text-black">{selectedproS.adress}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Code postal:</span>
                          <span className="ml-2 text-black">{selectedproS.postalcode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photo de la carte d'identité */}
                  <div>
                    <h3 className="font-medium text-[#F05050] mb-2">Carte d'identité</h3>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={`http://192.168.163.10:5001/${selectedproS.carteid}`} 
                        alt="Carte d'identité"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-[#F05050] mb-2">Certification</h3>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={`http://192.168.163.10:5001/${selectedproS.certif}`} 
                        alt="Certification"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                </div>
                
                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => handleRejectproS(selectedproS.id)}
                    className="px-4 py-2 bg-[#F05050] text-white font-medium rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={() => handleValidateproS(selectedproS.id)}
                    className="px-4 py-2 bg-green-700 text-white font-medium rounded hover:bg-green-600 transition-colors duration-200"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => setSelectedproS(null)}
                    className="px-4 py-2 bg-gray-400 text-white font-medium rounded hover:bg-gray-600 transition-colors duration-200"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Sélectionnez un proS pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  )
}

export default VerifProS

