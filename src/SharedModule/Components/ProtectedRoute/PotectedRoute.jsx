import React from "react";
import { Navigate } from "react-router-dom";

export default function PotectedRoute({adminData, children}) {
  //law mafesh data wla token ana msh logged wla admin tal3ny barra
  if (adminData === null || localStorage.getItem("adminToken") == null) {
    return <Navigate to="/login" />;
  } else {
    //props mean here auth ui or master ui 
    return children;
  }
}
