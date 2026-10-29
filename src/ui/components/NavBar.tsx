import { useContext } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../../auth/contexts/AuthContext"

export const NavBar = () => {

    const { authState, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLoginButton =  () => {
        navigate('/login', {
            replace: true
        })
    }

    const onlogoutButton = () => {
        const result = logout();
        console.log('Logout: ', result)
    }

    return (
        <>
            <nav className="navbar sm:navbar-expand bg-1 fg-2">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">Blog App</Link>
                    <button className="btn-icon navbar-toggler" type="button" data-bs-toggle="drawer" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" aria-hidden="true"></span>
                    </button>
                    <dialog className="drawer drawer-end" tabindex="-1" id="navbarNav" aria-labelledby="navbarNavLabel">
                        <div className="drawer-header">
                            <h5 className="drawer-title" id="navbarNavLabel">Menu</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button>
                        </div>
                        <div className="drawer-body">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link">Feed</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/about-us" className="nav-link">About Us</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/support" className="nav-link">Need Support?</NavLink>
                                </li>
                            </ul> 
                            {
                                !authState.logged ? 
                                (
                                    <button className="btn-outline theme-success" type="button" onClick={onLoginButton}>Login</button>
                                )
                                :
                                (
                                    <>
                                    <button className="btn-outline theme-danger" type="button" onClick={onlogoutButton}>Logout</button>
                                    <span>{ authState.user.username || authState.user.email }</span>
                                    </>
                                )
                            }
                        </div>
                    </dialog>
                </div>
            </nav>
        </>
    )
}


