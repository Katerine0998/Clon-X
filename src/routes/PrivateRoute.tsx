import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../auth/contexts/AuthContext";


export const PrivateRoute = () => {
  const { authState } = useContext(AuthContext);

  if (authState.checking) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return authState.logged ? <Outlet /> : <Navigate to="/login" replace />;
};