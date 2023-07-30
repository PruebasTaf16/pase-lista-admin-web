import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/auth-hook'

/**Componente para contener rutas públicas */
const PublicLayout = () => {

  const { pathname } = useLocation();

  if (pathname.split('/')[1] != 'recuperar-cuenta-trabajador') {
    const {auth, cargando} = useAuth()

    if (cargando) return <div className='bg-black text-white font-bold min-h-screen'>Cargando...</div>
  
    if (auth.data) return <Navigate to={'/'} replace/>
  } else {
    console.log('Recuperación de cuenta global para trabajadores')
  }

  return (
    <Outlet />
  )
}

export default PublicLayout