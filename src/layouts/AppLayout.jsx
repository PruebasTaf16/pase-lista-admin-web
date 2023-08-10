import React from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAuth from '../hooks/auth-hook'

/**Componente para contener rutas privadas */
const AppLayout = () => {

  const {auth, cargando, cerrarSesion} = useAuth()

  if (cargando) return <div className='bg-black text-white font-bold min-h-screen text-6xl flex items-center justify-center'>Cargando...</div>

  if (!auth.data) return <Navigate to={'/iniciar-sesion'} replace/>

  const logout = () => {
    Swal.fire({
      title: '¿Está seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No, no estoy seguro',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Sesión Cerrada',
          'La sesión se ha cerrado',
          'warning'
        )
        cerrarSesion();
      }
    })
  }

  return (
    <div className='bg-gray-800 min-h-screen flex flex-col'>
      <header className='w-full py-6 px-8 flex flex-col gap-x-8 justify-between items-center overflow-x-auto'>
        <h1 className='text-2xl text-blue-600 font-medium text-center lg:text-left mb-2 lg:mb-0'>Pase de Lista (Administración)</h1>
        <nav className='text-white flex gap-4 items-center'>
          <Link to={'/'} className='p-2 rounded-lg border-2 border-transparent hover:border-white hover:bg-gray-900 hover:shadow-lg text-lg font-medium w-32 text-center'>Hoy</Link>
          <Link to={'/mensual'} className='p-2 rounded-lg border-2 border-transparent hover:border-white hover:bg-gray-900 hover:shadow-lg text-lg font-medium w-32 text-center'>Mensual</Link>
          <Link to={'/justificantes'} className='p-2 rounded-lg border-2 border-transparent hover:border-white hover:bg-gray-900 hover:shadow-lg text-lg font-medium w-32 text-center'>Justificantes</Link>
          <Link to={'/trabajadores'} className='p-2 rounded-lg border-2 border-transparent hover:border-white hover:bg-gray-900 hover:shadow-lg text-lg font-medium w-32 text-center'>Trabajadores</Link>
          <Link to={'/roles'} className='p-2 rounded-lg border-2 border-transparent hover:border-white hover:bg-gray-900 hover:shadow-lg text-lg font-medium w-32 text-center'>Roles</Link>
          <Link to={'/graficas'} className='p-2 rounded-lg border-2 border-transparent hover:border-white hover:bg-gray-900 hover:shadow-lg text-lg font-medium w-32 text-center'>Gráficas</Link>
          <Link to={'/ubicacion'} className='p-2 rounded-lg border-2 border-transparent hover:border-white hover:bg-gray-900 hover:shadow-lg text-lg font-medium w-32 text-center'>Ubicación</Link>
        </nav>
      </header>

      <span id='separador' className='bg-white'></span>

      <main className='mt-8 mb-24 w-3/4 mx-auto'>
        <Outlet />
      </main>

      <footer className='fixed p-4 bottom-0 left-0 right-0 bg-gray-900 text-white font-bold'>
        <div className='container mx-auto flex justify-between items-center'>
          <div>
            <p>Email: <span className='text-green-200'>{auth.data.email}</span></p>
            <p>ID: <span className='text-green-200'>{auth.data._id}</span></p>
          </div>

          <button onClick={() => logout()} className='p-2 rounded-lg border-2 border-transparent hover:border-white hover:bg-gray-900 hover:shadow-lg text-lg font-medium w-38 text-center'>Cerrar Sesión</button>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout