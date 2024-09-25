import { createContext, useState, useEffect } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../services/firebaseConfig";
import { Navigate } from "react-router-dom";
const provider = new GoogleAuthProvider();

export const AuthGoogleContext = createContext({});

export const AuthGoogleProvider = ({ children }) => {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadStoreAuth = () => {
            const sessionToken = sessionStorage.getItem("@AuthFirebase:token");
            const sessionUser = sessionStorage.getItem("@AuthFirebase:user")

            if (sessionToken && sessionUser){
                setUser(sessionUser);
            }
        };
        loadStoreAuth();
    }, []);

    const signInGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.idToken;
                const user = result.user;
                setUser(user);
                sessionStorage.setItem("@AuthFirebase:token", token);
                sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));
            
                const token_glpi = fetch('http://127.0.0.1:5000/Login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Adicione outros cabeçalhos, se necessário
                },
                body: JSON.stringify({ 
                    username: user['email'],
                    password: user['email'],
                    token_google: token }), 
                })
                .then(resposta => {
                    if (!resposta.ok) {
                      throw new Error('Erro na requisição: ' + resposta.statusText);
                    }
                    return resposta.json(); 
                  })
                  .then(dados => {
                    sessionStorage.setItem("@AuthFirebase:token_glpi", dados['token']);
                  })
                  .catch(error => {
                    console.error(error.message); 
                  });      
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    };

    function signOut(){
        sessionStorage.clear();
        setUser(null);

        return <Navigate to='/' />;
    }

    


    return (
        <AuthGoogleContext.Provider 
            value={{signInGoogle, signed: !!user, user, signOut}}>
            {children}
        </AuthGoogleContext.Provider>
    )
}