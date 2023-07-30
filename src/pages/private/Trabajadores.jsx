import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { API_URL } from '../../constants/api'
import { generarPassword } from "../../utils/password-util"

/**Pantalla para gestionar todos los trabajadores */
const Trabajadores = () => {

    const [lista, setLista] = useState([])
    const [listaRoles, setListaRoles] = useState([])

    const [modoCreacion, setModoCreacion] = useState(false)
    const [modoEdicion, setModoEdicion] = useState(false)

    const [idUsuario, setIdUsuario] = useState('');
    const [idRol, setIdRol] = useState('')
    const [nombre, setNombre] = useState('')
    const [paterno, setPaterno] = useState('')
    const [materno, setMaterno] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [enviandoData, setEnviandoData] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axios.post(API_URL+'/usuarios/todos')
            const response2 = await axios.post(API_URL+'/roles/todos')

            setLista(response.data.data)
            setListaRoles(response2.data.data)
        } catch (e) {
            Swal.fire('Error', 'Error al obtener la lista', 'error')
        }
    } 
    useEffect(() => {
        fetchData()
    }, [])

    async function handleSubmit(ev) {
        ev.preventDefault()
        if (enviandoData) return;
        if (modoEdicion) return editar();
        setEnviandoData(true);
        
        if (!idRol.length || !nombre.length || !paterno.length || !materno.length || !email.length || !password.length) {
            return Swal.fire('Datos inválidos', 'Hay campos vaciós o no rellenados correctamente', 'error')
        }

        try {
            const response = await axios.post(API_URL+'/usuarios/registrar', {
                idRol,
                nombre,
                paterno,
                materno,
                email,
                password,
            })

            await fetchData()

            Swal.fire('Creado', response.data.msg, 'success')
            setModoCreacion(false)
            limpiarStates()
        } catch (error) {
            Swal.fire('Error', error.response.data.msg, 'error')
        } finally {
            setEnviandoData(false)
        }
    }

    function handleGenerarPassword() {
        const password = generarPassword()
        setPassword(password)
        Swal.fire('Generada', 'Se ha generado otra contraseña', 'warning')
    }

    function limpiarStates() {
        setIdUsuario('')
        setIdRol('')
        setNombre('')
        setPaterno('')
        setMaterno('')
        setEmail('')
        setPassword('')
    }

    function eliminar({_id}) {

        Swal.fire({
            title: '¿Está seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar',
          }).then(async (result) => {
            if (result.isConfirmed) {
    
              try {
                const response = await axios.delete(API_URL+'/usuarios/eliminar/'+_id)
    
                Swal.fire('Eliminado', response.data.msg, 'success')
                limpiarStates()
                await fetchData()
              } catch (e) {
                Swal.fire('Error', error.response.data.msg, 'error')
              }
            } else {

            }
          })
    }

    function entrarModoEdicin(usuario) {

        setIdUsuario(usuario._id)
        setIdRol(usuario.idRol._id)
        setNombre(usuario.nombre)
        setPaterno(usuario.paterno)
        setMaterno(usuario.materno)
        setEmail(usuario.email)

        setModoCreacion(true);
        setModoEdicion(true);

    }

    async function editar() {

        if (enviandoData) return;
        setEnviandoData(true)

        Swal.fire({
            title: '¿Está seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, editar',
            cancelButtonText: 'No, cancelar',
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.patch(API_URL+'/usuarios/editar/'+idUsuario, {
                        idRol,
                        nombre,
                        paterno,
                        materno,
                        email
                    });
        
                    Swal.fire('Actualizado', response.data.msg, 'success')
                    setModoCreacion(false)
                    setModoEdicion(false)
                    limpiarStates()
                    await fetchData()
                } catch (e) {
                    Swal.fire('Error', error.response.data.msg, 'error')
                } finally {
                    setEnviandoData(true)
                }
            }
          })

    }

    return (
        <>
            <h2 className='text-center text-4xl text-white font-semibold'>{modoEdicion ? 'Editar trabajador' : (modoCreacion ? 'Nueva cuenta de trabajador' :'Listado de Trabajadores')}</h2>
            <br className='my-8'/>

            {
                !modoCreacion 
                    ?

                        <div className='mb-8'>
                            <button onClick={(() => {limpiarStates(); setModoCreacion(true);})} className='block py-4 mx-auto w-full md:w-1/4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'>Nuevo</button>

                            <div className='my-8 grid grid-cols-2 gap-8'>
                                {lista.map((usuario, index) => 
                                    <div key={index} className='cursor-pointer rounded-xl border-2 border-blue-600 p-2 flex flex-col gap-2'>
                                        <p className='text-center font-semibold text-white'>{usuario.nombre + ' ' + usuario.paterno}</p>
                                        <p className='text-center font-medium text-white text break-words'>{usuario.email}</p>
                                        <p className='text-center font-medium text-white text break-words'>{usuario.idRol.nombre}</p>

                                        <div className='flex gap-x-4'>
                                            <button onClick={() => eliminar(usuario)} className='text-center w-1/2 rounded-lg p-2 bg-red-500 hover:bg-red-600 text-white font-medium '>Eliminar</button>
                                            <button onClick={() => entrarModoEdicin(usuario)} className='text-center w-1/2 rounded-lg p-2 bg-blue-500 hover:bg-blue-600 text-white font-medium '>Editar</button>       
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    :
                        <div>
                            <form className='mx-auto w-4/5 md:w-2/3' onSubmit={handleSubmit}>
                                <div className='my-16 flex flex-col gap-y-10'>
                                    <select onChange={(ev) => setIdRol(ev.target.value)} value={idRol} className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'>
                                        {modoEdicion ? <option value={idRol}>{listaRoles.find(e => e._id == idRol).nombre}</option> : <option value="">Elija un puesto</option>}

                                        {listaRoles.map((rol, index) => (
                                            <option value={rol._id} key={index}>{rol.nombre}</option>
                                        ))}
                                    </select>

                                    <input 
                                        value={nombre} 
                                        onInput={(ev) => setNombre(ev.target.value)} 
                                        type="text" 
                                        placeholder='Nombre(s) del trabajador' 
                                        className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                                    />
                                    <input 
                                        value={paterno} 
                                        onInput={(ev) => setPaterno(ev.target.value)} 
                                        type="text" 
                                        placeholder='Apellido paterno del trabajador' 
                                        className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                                    />
                                    <input 
                                        value={materno} 
                                        onInput={(ev) => setMaterno(ev.target.value)} 
                                        type="text" 
                                        placeholder='Apellido materno del trabajador' 
                                        className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                                    />
                                    <input 
                                        value={email} 
                                        onInput={(ev) => setEmail(ev.target.value)} 
                                        type="email" 
                                        placeholder='Correo del trabajador' 
                                        className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                                    />
                                    {
                                        modoEdicion ? ''
                                        :
                                        <div className='flex gap-x-8'>
                                            <input 
                                                value={password} 
                                                onInput={(ev) => setPassword(ev.target.value)} 
                                                type="password" 
                                                placeholder='Contraseña' 
                                                className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                                            />
                                            <button type='button' onClick={handleGenerarPassword} className='flex-grow p-4 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 w-64 cursor-pointer'>Generar Contraseña</button>
                                        </div>
                                    }
                                </div>

                                <input type="submit" className='p-4 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 w-full cursor-pointer' value={modoEdicion ? 'Actualizar Info.' :'Crear cuenta de trabajador'}/>    
                            </form>

                            <button onClick={() => {setModoCreacion(false); setModoEdicion(false); limpiarStates();}} className='mt-10 p-4 block text-center mx-auto rounded-lg text-white font-medium border-4 border-white hover:border-blue-700 w-1/3 cursor-pointer'>Cancelar</button>
                        </div>
            }
        </>
    )
}

export default Trabajadores