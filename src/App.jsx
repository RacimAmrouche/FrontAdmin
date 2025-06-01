import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import "./App.css";
import React from "react";
import RootLayout from "./components/layouts/RootLayout";
import Home from "./pages/Home";
import PatientSignup from "./pages/Patientsignup";
import ProSignup from "./pages/ProSignup";
import RespSignup from "./pages/RespSignup";
import LoginSig from "./pages/LoginSig";
import PatientSignin from "./pages/Adminin";
import ProSignin from "./pages/ProSignin";
import RespSignin from "./pages/RespSignin";
import Patient from "./pages/Patient";
import Help from "./pages/help";
import Adminin from "./pages/Adminin";
import AdminHin from "./pages/AdminHin";
import SupAdminin from "./pages/SupAdminin";
import Resp from "./pages/Resp";
import Admin from "./pages/Admin";
import VerifPat from "./pages/VerifPat";
import VerifPat2 from "./pages/Verifpat2";
import VerifPros from "./pages/VerifPros";
import VerifPros2 from "./pages/VerifPros2";
import AdminCrea from "./pages/AdminCrea";
import Moderation from "./pages/Moderation";
import AccountSettings from "./pages/AccountSettings";
//import { DarkModeProvider } from "./components/layouts/DarkModeContext";
import ScrollTest from "./pages/tst";
import RepForm from "./pages/RepForm";
import RepForm2 from "./pages/RepForm2";
import AdminH from "./pages/AdminH";
import AdminHCrea from "./pages/AdminHCrea";
import SuperAdmin from "./pages/SuperAdmin";
import Layout from "./components/layouts/layout";
import SuperModeration from "./pages/SuperModeration";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="LoginSig" element={<LoginSig />} />

        <Route path="RespSignup" element={<RespSignup />} />

      <Route path="tst" element={<ScrollTest/>} />
        <Route path="Adminin" element={<Adminin/>} />
      <Route path="VerifPat" element={<VerifPat />} />
      <Route path="VerifPat2" element={<VerifPat2 />} />
      <Route path="VerifPros" element={<VerifPros />} />
      <Route path="VerifPros2" element={<VerifPros2 />} />
        <Route path="Resp" element={<Resp />} />
        <Route path="Admin" element={<Admin />} />
        <Route path="AdminHin" element={<AdminHin />} />
        <Route path="SupAdminin" element={<SupAdminin />} />
        <Route path="AdminCrea" element={<AdminCrea />} />
        <Route path="Moderation" element={<Moderation />} />
        <Route path="RepForm" element={<RepForm />} />
        <Route path="RepForm2" element={<RepForm2 />} />
        <Route path="AdminH" element={<AdminH />} />
        <Route path="AdminHCrea" element={<AdminHCrea />} />
        <Route path="SuperAdmin" element={<SuperAdmin />} />
        <Route path="SuperModeration" element={<SuperModeration />} />
      </Route>
    )
  );

  return (
    <>
   
      <RouterProvider router={router} />
   
    </>
  );
}

export default App;

