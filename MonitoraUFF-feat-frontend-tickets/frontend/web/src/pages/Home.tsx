import { useContext } from "react";
import { AuthGoogleContext } from "../contexts/authGoogle";
import { Link } from 'react-router-dom';

export function Home(){

    const { signOut } = useContext<any>(AuthGoogleContext);
    const user = sessionStorage.getItem("@AuthFirebase:user");
    if (!user) {
        throw new Error('User não fornecido.');
    }
    const parsedUser = JSON.parse(user);

    return(
        
        <div className="flex flex-col justify-start items-center">
            <div>
                    <h1 className="text-3xl">Bem vindo ao Monitora UFF</h1>
                    <p>Opções disponíveis:</p>
                </div>
                <div className="text-xl">
                    <h2>1. Criar um sistema hierárquico de regiões</h2>
                    <h2>2. Delimitar áreas de regiões criadas</h2>
                    <h2>3. Adicionar ícones no mapa</h2>
                    <h2> <Link to="/Tickets">4. Visualizar tickets</Link></h2>
                    <h2> <Link to="/CreateTicket">5. Criar tickets</Link></h2>
                    <h2>6. Visualizar Câmeras</h2>
                </div>
                <div>
                <h1>
                    Bem Vindo { parsedUser['displayName']}
                    <br></br>
                    Email : { parsedUser['email'] }
                </h1>
                <button onClick={() => signOut()}>Sair</button>
            </div>
      </div>
    )
}