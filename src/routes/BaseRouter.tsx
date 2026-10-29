import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { AboutUsPage } from "../pages/AboutUsPage"
import { SupportPage } from "../pages/SupportPage"
import { LoginPage } from "../auth/pages/LoginPage"


export const BaseRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={ <HomePage/> } />
                <Route path="/about-us" element={ <AboutUsPage /> } />
                <Route path="/support" element={ <SupportPage/> } />
                <Route path="/login" element={ <LoginPage/> } />

                <Route path="/*" element= { <Navigate to="/" /> } />
            </Routes>
        </>
    )
}