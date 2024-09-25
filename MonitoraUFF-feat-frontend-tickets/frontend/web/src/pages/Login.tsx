import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthGoogleContext } from "../contexts/authGoogle";
import GoogleIcon from '@mui/icons-material/Google';
import { Button } from "@mui/material";

export const Login = () => {
    const { signInGoogle, signed } = useContext<any>(AuthGoogleContext);

    async function loginGoogle(){
        await signInGoogle();
    }

    if (!signed){
        return (
            <div className="flex justify-center items-center">
                <Button onClick={() => loginGoogle()} className="flex flex-col">
                    Logar com Google
                    <GoogleIcon/>
                </Button>
            </div>
        );
    } else {
        return <Navigate to='/Home' />; 
    }
    
};