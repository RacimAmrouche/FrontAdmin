"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { AddAdmin } from "../../services/auth"
import log from "../assets/logovide.png"

const AdminCrea = ({ isDark = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
    fullName: "",
    phoneNumber: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Placeholder logo - replace with your actual logo import
  const logo = "/placeholder.svg?height=32&width=32"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target)
    console.log(formData)

    try {
      console.log("Processing...")
      console.log(formData)
      const response = await AddAdmin(formData)
      alert("Success: Successfully added ✅")
      console.log("Done")
      setSubmitSuccess(true)
    } catch (error) {
      console.log("Error occurred")
      alert("Error: Failed to add ❌")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen p-4 bg-gray-100"}`}
    >
      {/* Navigation Bar */}
      <div className="bg-white rounded-xl shadow-md mb-3 w-full max-w-7xl mx-auto text-base mt-[51px]">
        <div className="flex flex-nowrap items-center border-b">
          {/* Logo + App Name */}
          <div className="flex items-center px-6 py-4 mr-6">
                                <img src={log} alt="E-mergency Logo" className="h-8 w-8 mr-2" />
                                <span className="font-bold text-xl text-[#F05050]">Emergency</span>
                              </div>
                      
          <Link
            to="/alerts"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Alerts
          </Link>
          <Link
            to="/VerifPat"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Verify Patient Account
          </Link>
          <Link
            to="/VerifPros"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Verify Healthcare Pro Account
          </Link>
          <Link
            to="/SuperModeration"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Moderation
          </Link>
          <Link
            to="/RepForm"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Response Form
          </Link>
          <button className="px-8 py-4 font-semibold text-[#F05050] border-b-4 border-[#F05050]">Create Admin</button>
          <Link
            to="/AdminHCrea"
            className="px-8 py-4 font-semibold text-gray-600 hover:text-[#F05050] hover:border-b-4 hover:border-[#F05050] transition-all"
          >
            Create AdminH
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
       

          {/* Form Card */}
          <div
            className={`${isDark ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" : "bg-white/90 backdrop-blur-sm border border-gray-200"} rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:shadow-3xl`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-3">
                    <label
                      htmlFor="Email"
                      className={`block text-base font-semibold ${isDark ? "text-gray-200" : "text-gray-700"} flex items-center gap-3`}
                    >
                      <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                        <svg className="w-5 h-5 text-[#F05050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="Email"
                      name="Email"
                      placeholder="admin@company.com"
                      className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#F05050]/20 focus:border-[#F05050] text-lg ${isDark ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"} hover:border-[#F05050]/50`}
                      required
                    />
                  </div>

                  {/* Full Name Field */}
                  <div className="space-y-3">
                    <label
                      htmlFor="Fullname"
                      className={`block text-base font-semibold ${isDark ? "text-gray-200" : "text-gray-700"} flex items-center gap-3`}
                    >
                      <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                        <svg className="w-5 h-5 text-[#F05050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="Fullname"
                      name="Fullname"
                      placeholder="John Doe"
                      className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#F05050]/20 focus:border-[#F05050] text-lg ${isDark ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"} hover:border-[#F05050]/50`}
                      pattern="^[^0-9]*$"
                      title="Name must not contain numbers"
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Password Field */}
                  <div className="space-y-3">
                    <label
                      htmlFor="Password"
                      className={`block text-base font-semibold ${isDark ? "text-gray-200" : "text-gray-700"} flex items-center gap-3`}
                    >
                      <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                        <svg className="w-5 h-5 text-[#F05050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="Password"
                        name="Password"
                        placeholder="Enter secure password"
                        className={`w-full px-5 py-4 pr-14 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#F05050]/20 focus:border-[#F05050] text-lg ${isDark ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"} hover:border-[#F05050]/50`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${isDark ? "text-gray-400 hover:text-white hover:bg-gray-600" : "text-gray-500 hover:text-[#F05050] hover:bg-gray-100"}`}
                      >
                        {showPassword ? (
                          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-3">
                    <label
                      htmlFor="Phonenumber"
                      className={`block text-base font-semibold ${isDark ? "text-gray-200" : "text-gray-700"} flex items-center gap-3`}
                    >
                      <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                        <svg className="w-5 h-5 text-[#F05050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="Phonenumber"
                      name="Phonenumber"
                      placeholder="0612345678"
                      className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#F05050]/20 focus:border-[#F05050] text-lg ${isDark ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"} hover:border-[#F05050]/50`}
                      pattern="^[0-9]{1,10}$"
                      title="Phone number must contain only digits and not exceed 10 characters"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="p-5 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Administrator Created Successfully!</h3>
                      <p className="text-green-700">
                        The new administrator account has been set up and is ready to use.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-12 py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#F05050]/30 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#F05050] to-red-500 hover:from-[#D32F2F] hover:to-red-600 shadow-xl"
                  } flex items-center gap-3 min-w-[280px] justify-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating Administrator...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Create Administrator
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
        
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCrea


