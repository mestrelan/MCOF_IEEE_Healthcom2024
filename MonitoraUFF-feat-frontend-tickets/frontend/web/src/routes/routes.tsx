import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login";
import { PrivateRoutes } from "./authentication";
import LayoutTemplate from "../template/Layout";
import Tickets  from "../pages/Tickets";
import { ContainerMaps } from "../pages/Container";
import {Ticket} from "../pages/Ticket";
import { useContext } from "react";
import { AuthGoogleContext } from "../contexts/authGoogle";
import CreateTicket from "../pages/CreateTicket";


export const AppRoutes = () => {
    
    return(
        <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login />}/> 
                    <Route path="/" element={<PrivateRoutes />}> 
                        <Route path="/" element={<LayoutTemplate/>}>
                            <Route path='/home' element={<Home />}/>
                            <Route path="/regiao/:id" element={<ContainerMaps/>} />
                            <Route path="/tickets" element={<Tickets/>} />
                            <Route path="/ticket/:id" element={<Ticket/>} />
                            <Route path="/CreateTicket" element={<CreateTicket/>}></Route>
                        </Route>
                    </Route> 
                </Routes>
        </BrowserRouter>
    )
}