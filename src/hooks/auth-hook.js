import { useContext } from 'react';
import AuthContext from '../contexts/auth-context';

/**Se crea un hook para usar el context */
const useAuth = () => {
    return useContext(AuthContext);
}  

export default useAuth;