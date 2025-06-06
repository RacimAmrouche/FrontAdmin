"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/layouts/layout"
import { ListPatVal, RejectUser } from "../../services/Admin"
import { GetInfoPat } from "../../services/Admin"
import { ValidateUser } from "../../services/Admin"
import logo from "../assets/logovide.png"

const VerifPat2 = () => {
  // État pour stocker la liste des patients en attente de vérification
  const [pendingPatients, setPendingPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    const fetchPendingPatients = async () => {
      const tabnotclean =[]
      try{ 
        const formdata = new FormData()
        formdata.append("roleadm",1)
        formdata.append("IDAdminn","2416D137-5B91-4F96-8BBD-C21BD3DDBDF6")
        const response = await ListPatVal(formdata)
        //on recois une liste de patients
        console.log(response.data)
        const tabrequestscrea = response.data
        await Promise.all(
          tabrequestscrea.map(async (requestcrea) => {
            const formdataa = new FormData()
            formdataa.append("IDPatientt", requestcrea.userUID)
            const response2 = await GetInfoPat(formdataa)
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
              height: response2.data.height,
              weight: response2.data.weight,
              dateofbirth:formatReadableDate(response2.data.dateofBirth),
              adress: response2.data.adresse,
              postalcode: response2.data.postalCode,
              confmail : response2.data.confMail === true ? "Confirmed" : "Not Confirmed Yet",
              carteid: response2.data.identite.replace(/\\/g, "/"),
            };
            console.log("patient donnees recup: ", obj)
            tabnotclean.push(obj);
          })
        );

        const uniquePendingPatients = Array.from(
          new Map(tabnotclean.map(patient => [patient.id, patient])).values()
        );

        setPendingPatients(uniquePendingPatients)
        console.log("final product :", pendingPatients)
        
      }
      catch (error) {
        console.error(error)
      }
      
      
    }

    fetchPendingPatients()
    
  }, []);

  function formatReadableDate(isoString) {
    return new Date(isoString).toLocaleString("en-US", {
      dateStyle: "medium",
      //timeStyle: "medium",
    });
  }
  // Sélectionner un patient pour afficher ses détails
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
  }

  const handleValidatePatient = async (patientId) => {
    const formdata = new FormData()
    formdata.append("idCreaCompte", patientId)
    formdata.append("role", "10")

    try{
      const response = await ValidateUser(formdata)
      console.log(response)
      
    }
    catch (error) {
      console.error(error)
      setNotification({
        show: true,
        message: "Erreur lors de la validation du patient",
        type: "error",
      })
    }
    setNotification({
      show: true,
      message: "Patient validé avec succès",
      type: "success",
    })
    setPendingPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId))
    setSelectedPatient(null)
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }



  const handleRejectPatient = async (patientId) => {
    const formdata = new FormData()
    formdata.append("idCreaCompte", patientId)
    formdata.append("role", "10")

    try{
      const response = await RejectUser(formdata)
      console.log(response)
      
    }
    catch (error) {
      console.error(error)
      setNotification({
        show: true,
        message: "Erreur lors du rejet du patient",
        type: "error",
      })
    }
    setNotification({
      show: true,
      message: "Patient rejeté avec succès",
      type: "success",
    })
    setPendingPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId))
    setSelectedPatient(null)
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }


  return (
  
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="bg-white rounded-xl shadow-md mb-6 w-full max-w-7xl mx-auto text-base">
      <div className="flex flex-wrap border-b mt-[51px]">
         {/* Logo + Nom app */}
                      <div className="flex items-center px-6 py-4 mr-6">
                  <img src={logo} alt="E-mergency Logo" className="h-8 w-8 mr-2" />
                  <span className="font-bold text-xl text-[#F05050]">E-mergency</span>
                </div>
     <Link
      to="/SuperAdmin"
      className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
    >
      Alerts
    </Link>
    <button className="px-8 py-4 font-semibold text-[#F05050] border-b-4 border-[#F05050]">
    Verify patient accounts
    </button>

    <Link
        to="/VerifPros2"
        className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
      >
        Verify heatlhcare pro accounts
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

      <div className="max-w-6xl mx-auto">


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
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Patients pending verification</h2>

            {pendingPatients.length === 0 ? (
              <p className="text-gray-500">No patient pending verification</p>
            ) : (
              <ul className="space-y-2">
                {pendingPatients.map((patient) => (
                  <li
                    key={patient.id}
                    className={`p-3 rounded cursor-pointer transition-colors duration-200 text-black ${
                      selectedPatient?.id === patient.id ? "bg-[#F05050] text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleSelectPatient(patient)}
                  >
                    <div className="font-medium text-s">
                    {patient.name} {patient.lastName}<br/><p className="text-xs">Request ID: {patient.id}</p>
                    </div>
                  {/*  <div className="text-sm opacity-80">{patient.email}</div>*/} 
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Détails du patient sélectionné */}
          <div className="w-full md:w-2/3 overflow-y-auto max-h-[400px] bg-white rounded-lg shadow p-4">
            {selectedPatient ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Patient details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations du patient */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-[#F05050]">Personal information</h3>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Full Name:</span>
                          <span className="ml-2 text-black">
                            {selectedPatient.name} {selectedPatient.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Email:</span>
                          <span className="ml-2 text-black">{selectedPatient.email}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Mail Confirmation:</span>
                          <span className="ml-2 text-black">{selectedPatient.confmail}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Phone:</span>
                          <span className="ml-2 text-black">{selectedPatient.phoneNumber}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Gender:</span>
                          <span className="ml-2 text-black">{selectedPatient.gender}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Age:</span>
                          <span className="ml-2 text-black">{selectedPatient.age} years</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Date of birth:</span>
                          <span className="ml-2 text-black">{selectedPatient.dateofbirth}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#F05050]">Medical information</h3>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Height:</span>
                          <span className="ml-2 text-black">{selectedPatient.height}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Weight:</span>
                          <span className="ml-2 text-black">{selectedPatient.weight}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#F05050]">Address</h3>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div>
                          <span className="font-medium text-gray-600">Address:</span>
                          <span className="ml-2 text-black">{selectedPatient.adress}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Postal code:</span>
                          <span className="ml-2 text-black">{selectedPatient.postalcode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photo de la carte d'identité */}
                  <div>
                    <h3 className="font-medium text-[#F05050] mb-2">ID card</h3>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={`http://192.168.255.1:5001/${selectedPatient.carteid}`} 
                        alt="ID card"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => handleRejectPatient(selectedPatient.id)}
                    className="px-4 py-2 bg-[#F05050] text-white font-medium rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleValidatePatient(selectedPatient.id)}
                    className="px-4 py-2 bg-green-700 text-white font-medium rounded hover:bg-green-600 transition-colors duration-200"
                  >
                    Validate
                  </button>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="px-4 py-2 bg-gray-400 text-white font-medium rounded hover:bg-gray-600 transition-colors duration-200"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Select a patient to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  )
}

export default VerifPat2