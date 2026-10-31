import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/contexts/AuthContext";

export const NavBar = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (

    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
      <div className="container">
        {/* Logo link*/}
        <Link to="/" className="navbar-brand fw-bold">
          Clon de X
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Mostrar menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto">
            {authState.logged && (
              <>
                <li className="nav-item">
                  <NavLink to="/" end className="nav-link">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/feed" className="nav-link">
                    Feed
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-md-center">
            {authState.logged ? (
              <>
                <li className="nav-item">
                  {/* Username of the connected user */}
                  <span className="navbar-text me-md-3">@{authState.user?.username || authState.user?.email}</span>
                </li>
                <li className="nav-item">
                  {/* Logout link */}
                  <button type="button" className="btn btn-link nav-link" onClick={onLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Iniciar sesión
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};