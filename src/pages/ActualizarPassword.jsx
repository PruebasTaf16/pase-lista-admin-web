import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {API_URL} from "../constants/api"

/**Pantalla para poner la nueva contraseña una vez que detecte que el token es válido */
const ActualizarPassword = () => {

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [enviandoData, setEnviandoData] = useState(false)

    const navigate = useNavigate()
    const {token} = useParams()

    useEffect(() => {
        async function comprobarToken() {
            try {
                const response = await axios.get(API_URL+'/admin-auth/recuperar-cuenta/'+token)
            } catch (e) {
                navigate('/', {replace: true})
            }
        }
        comprobarToken()
    }, [])
  
    async function handleSubmit(ev) {
      ev.preventDefault()

      if (!password.length) return Swal.fire('Datos inválidos', 'Introduzca una contraseña', 'error')
      if (password !== repeatPassword) return Swal.fire('Datos inválidos', 'Las contraseñas no coinciden', 'error')

      if (enviandoData) return;
      setEnviandoData(true)

      try {
        const response = await axios.post(API_URL+'/admin-auth/actualizar-password/'+token, {password})

        Swal.fire('Actualizada', response.data.msg, 'success')
        navigate('/', {replace: true})
      } catch (e) {
        Swal.fire('Error', error.response.data.msg, 'error')
      } finally {
        setEnviandoData(false)
      }
    }

    return (
        <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
          <h1 className='text-blue-600 font-medium text-4xl text-center'>Recuperar acceso perdido</h1>
    
          <form className='mx-auto w-4/5 md:w-1/3' onSubmit={handleSubmit}>
            <div className='my-16'>
              <input 
                value={password} 
                onInput={(ev) => setPassword(ev.target.value)} 
                type="password" 
                placeholder='Contraseña' 
                className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'/>
            </div>
            <div className='my-16'>
              <input 
                value={repeatPassword} 
                onInput={(ev) => setRepeatPassword(ev.target.value)} 
                type="password" 
                placeholder='Repetir Contraseña' 
                className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'/>
            </div>

            <input type="submit" className='p-4 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 w-full cursor-pointer' value={'Actualizar Contraseña'}/>    
          </form>
        </div>
    )
}

export default ActualizarPassword