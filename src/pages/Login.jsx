import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../constants/api';

/**Pantalla de inicio de sesión para administradores */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [enviandoData, setEnviandoData] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault()

    if (enviandoData) return;
    setEnviandoData(true)

    if (!email.length || !password.length) return Swal.fire('Datos inválidos', 'Hay campos vacíos', 'error')

    try {
      const response = await axios.post(API_URL+'/admin-auth/iniciar-sesion', {
        email,
        password
      });

      localStorage.setItem('pase-lista-admin', response.data.data.jwt)

      navigate('/', {replace: true})
    } catch (error) {
      Swal.fire('Error', error.response.data.msg, 'error')
    } finally {
      setEnviandoData(false)
    }
  }

  return (
    <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
      <h1 className='text-white text-4xl text-center'>Iniciar Sesión</h1>

      <form className='mx-auto w-4/5 md:w-1/3' onSubmit={handleSubmit}>
        <div className='my-16'>
          <input 
            value={email} 
            onInput={(ev) => setEmail(ev.target.value)} 
            type="email" 
            placeholder='Correo de Administrador' 
            className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'/>
        </div>

        <div className='my-16'>
          <input 
            value={password} 
            onInput={(ev) => setPassword(ev.target.value)} 
            type="password" 
            placeholder='Contraseña' 
            className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'/>
        </div>

        <input type="submit" className='p-4 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 w-full cursor-pointer' value={'Iniciar sesión'}/>

        <Link to={'/recuperar'} className='mx-auto block text-center text-white mt-10'>¿Olvidaste tu contraseña?</Link>
        <Link to={'/registrar'} className='mx-auto block text-center text-white mt-10'>Crear Cuenta</Link>
      </form>
    </div>
  )
}

export default Login