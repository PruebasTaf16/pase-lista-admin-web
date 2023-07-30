import axios from 'axios';
import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {API_URL} from "../constants/api"

/**Pantalla de recuperación de cuenta para administradores */
const Recuperar = () => {

    const [email, setEmail] = useState('');
    const [enviandoData, setEnviandoData] = useState(false)

    const navigate = useNavigate()
  
    function handleSubmit(ev) {
      ev.preventDefault()

      if (enviandoData) return;
      setEnviandoData(true)

      Swal.fire({
        title: '¿Está seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'No, no estoy seguro',
      }).then(async (result) => {
        if (result.isConfirmed) {

          try {
            const response = await axios.post(API_URL+'/admin-auth/recuperar-cuenta', {email})

            Swal.fire('Enviado', response.data.msg, 'success')
            navigate('/', {replace: true})
          } catch (e) {
            Swal.fire('Error', error.response.data.msg, 'error')
            setEnviandoData(false)
          }
        } else {
          setEnviandoData(false)
        }
      })
    }

    return (
        <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
          <h1 className='text-blue-600 font-medium text-4xl text-center'>Recuperar acceso perdido</h1>
    
          <form className='mx-auto w-4/5 md:w-1/3' onSubmit={handleSubmit}>
            <div className='my-16'>
              <input 
                value={email} 
                onInput={(ev) => setEmail(ev.target.value)} 
                type="email" 
                placeholder='Correo de Administrador' 
                className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'/>
            </div>

            <input type="submit" className='p-4 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 w-full cursor-pointer' value={'Recuperar Acceso'}/>    
          </form>

          <Link to={'/iniciar-sesion'} className='mt-10 p-4 block text-center mx-auto rounded-lg text-white font-medium border-4 border-white hover:border-blue-700 w-1/3 cursor-pointer'>Cancelar</Link>

        </div>
    )
}

export default Recuperar