import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthGoogleContext } from "../contexts/authGoogle";

export const PrivateRoutes = () => {
    const { signed } = useContext<any>(AuthGoogleContext);
    return signed ? (<Outlet />) : (<Navigate to='/login'/>);
}