import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../constants/api";

/**Valores por defecto en el context */
const authContextDefault = {
    auth: {
        jwt: null,
        data: null,
    },
    cargando: true,
}

/**Creación del context */
const AuthContext = createContext(authContextDefault);

/**Creación del provider para manejar estados globales en toda la aplicación */
export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(authContextDefault.auth);
    const [cargando, setCargando] = useState(authContextDefault.cargando);

    const location = useLocation();

    /**Evento para validar si el usuario está autenticado */
    useEffect(() => {
        console.log('Auth provider user effect')
        const autenticar = async () => {
            const jwt = localStorage.getItem('pase-lista-admin')
    
            if (!jwt) {
                return setCargando(false)
            }

            console.log('JWT detectado')
    
            try {
                const response = await axios.get(API_URL+'/admin-auth/obtener-info',{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`                   
                    }
                })
    
                console.log(response)
    
                setAuth({jwt, data: response.data.data})
            } catch (error) {
                console.log(error)
                setAuth(authContextDefault.auth)
            } finally {
                setCargando(false)
            }
        }

        autenticar()
    }, [location]);

    const cerrarSesion = () => {
        localStorage.removeItem('pase-lista-admin')
        setAuth(authContextDefault.auth);
    }

    return (
        <AuthContext.Provider value={{auth, setAuth, cargando, setCargando, cerrarSesion}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;