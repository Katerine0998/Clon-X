import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Avatar } from "../components/Avatar";

// Common header of the app: logo, logged username and logout
export const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const me = useCurrentUser();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Inicio", icon: "bi-house-door", end: true },
    { to: "/feed", label: "Feed", icon: "bi-chat-square-text" },
    { to: "/following", label: "Seguidos", icon: "bi-person-check" },
    { to: "/followers", label: "Seguidores", icon: "bi-people" },
    { to: `/user/${me.username}`, label: "Perfil", icon: "bi-person" },
  ];

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="x-sidebar">
      <Link to="/" className="x-logo" aria-label="Ir al inicio">
        𝕏
      </Link>

      <nav className="d-flex flex-column">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className="x-nav-link">
            <i className={`bi ${link.icon}`}></i>
            <span className="d-none d-xl-inline">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <Link to="/tweet" className="btn btn-primary x-post-btn">
        <span className="d-none d-xl-inline">Tweet</span>
        <i className="bi bi-plus-lg d-xl-none"></i>
      </Link>

      <div className="dropup mt-auto">
        <button type="button" className="x-user-chip" data-bs-toggle="dropdown" aria-expanded="false">
          <Avatar name={me.fullName} />
          <div className="x-user-text d-none d-xl-flex">
            <strong>{me.fullName}</strong>
            <span className="text-secondary">@{me.username}</span>
          </div>
        </button>
        <ul className="dropdown-menu">
          <li>
            <button type="button" className="dropdown-item" onClick={onLogout}>
              Cerrar sesión de @{me.username}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};