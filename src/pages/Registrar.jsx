import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';

import { API_URL } from "../constants/api.js";
import { Link, useNavigate } from 'react-router-dom';

/**Pantalla para crear cuenta de administrador */
const Registrar = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  function handleSubmit(ev) {
    ev.preventDefault()

    if (!email.length || !password.length || !repeatPassword.length) return Swal.fire('Datos inválidos', 'Hay campos vacíos', 'error');
    if (password !== repeatPassword) return Swal.fire('Datos inválidos', 'Las contraseñas no coinciden', 'error');

    Swal.fire({
      title: 'Introduzca la clave maestra',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      preConfirm: (masterKey) => {
        return axios.post(API_URL+'/admin-auth/registrar', {
          email,
          password,
          masterKey
        })
        .then(response => {
          return response;
        })
        .catch(error => {
          console.log(error);
          Swal.showValidationMessage(error.response.data.msg)
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(result.value.data.msg);
        navigate('/iniciar-sesion', {replace: true});
      }
    })
  }

  return (
    <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
      <h1 className='text-white text-4xl text-center'>Crear Cuenta</h1>

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

        <div className='my-16'>
          <input 
            value={repeatPassword} 
            onInput={(ev) => setRepeatPassword(ev.target.value)} 
            type="password" 
            placeholder='Repetir contraseña' 
            className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'/>
        </div>

        <input type="submit" className='p-4 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 w-full cursor-pointer' value={'Crear Cuenta'}/>

        <Link to={'/iniciar-sesion'} className='text-center block mx-auto text-white mt-10'>¿Tienes Cuenta?</Link>
      </form>
    </div>
  )
}

export default Registrar