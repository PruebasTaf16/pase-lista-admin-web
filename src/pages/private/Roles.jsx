import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { API_URL } from '../../constants/api'
import Swal from 'sweetalert2'

/**Gráfica para gestionar todos los roles */
const Roles = () => {

  const [lista, setLista] = useState([])
  
  const [modoCreacion, setModoCreacion] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)

  const [idRol, setIdRol] = useState('')
  const [nombre, setNombre] = useState('')
  const [horarioEntrada, setHorarioEntrada] = useState('')
  const [horarioSalida, setHorarioSalida] = useState('')
  const [tiempoAntesEntrada, setTiempoAntesEntrada] = useState(15)
  const [tiempoMaxTolerancia, setTiempoMaxTolerancia] = useState(30)

  const [enviandoData, setEnviandoData] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.post(API_URL+'/roles/todos')

      setLista(response.data.data)
    } catch (e) {
      Swal.fire('Error', 'Error al obtener la lista', 'error')
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault()

    if (enviandoData) return;
    if (modoEdicion) return editar();
    setEnviandoData(true)

    if (!nombre.length || !horarioEntrada || !horarioSalida || tiempoAntesEntrada < 0 || tiempoMaxTolerancia < 0) {
      return Swal.fire('Datos inválidos', 'Hay campos vacíos o no rellenados correctamente', 'error')
    }

    try {
      const response = await axios.post(API_URL+'/roles/crear', {
        nombre,
        horarioEntrada,
        horarioSalida,
        tiempoAntesEntrada,
        tiempoMaxTolerancia,
      })

      await fetchData()

      Swal.fire('Creado', response.data.msg, 'success')
      setModoCreacion(false)
    } catch (error) {
      Swal.fire('Error', error.response.data.msg, 'error')
    } finally {
      setEnviandoData(false)
    }
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
            const response = await axios.delete(API_URL+'/roles/eliminar/'+_id)

            Swal.fire('Eliminado', response.data.msg, 'success')
            await fetchData()
          } catch (e) {
            Swal.fire('Error', error.response.data.msg, 'error')
          }
        } else {

        }
      })
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
                const response = await axios.patch(API_URL+'/roles/editar/'+idRol, {
                  nombre,
                  horarioEntrada,
                  horarioSalida,
                  tiempoAntesEntrada,
                  tiempoMaxTolerancia,
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

  function entrarModoEdicion(rol) {
    setIdRol(rol._id)
    setNombre(rol.nombre)
    setHorarioEntrada(formatearFechas(rol.horarioEntrada))
    setHorarioSalida(formatearFechas(rol.horarioSalida))
    setTiempoAntesEntrada(rol.tiempoAntesEntrada)
    setTiempoMaxTolerancia(rol.tiempoMaxTolerancia)

    setModoCreacion(true)
    setModoEdicion(true)
  }

  function limpiarStates() {
    setIdRol('')
    setNombre('')
    setHorarioEntrada('')
    setHorarioSalida('')
    setTiempoAntesEntrada('')
    setTiempoMaxTolerancia('')
  }

  function formatearFechas(fechaUTC) {
    const fechaString = fechaUTC.split("T")[1];
    
    const horas = fechaString.split(":")[0];
    const minutos = fechaString.split(":")[1];
    const horaFormateada = `${horas}:${minutos}`;
    
    return horaFormateada
  }

  return (
    <>
    <h2 className='text-center text-4xl text-white font-semibold'>{modoEdicion ? 'Editando Rol' : modoCreacion ? 'Nuevo Rol' : 'Listado de Roles'}</h2>
    <br className='my-8'/>

    {
        !modoCreacion 
            ?
              <div className='mb-8'>
                <button onClick={(() => setModoCreacion(true))} className='block py-4 mx-auto w-full md:w-1/4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md'>Nuevo</button>

                <div className='my-8 grid grid-cols-3 gap-8'>
                  {lista.map((rol, index) => 
                    <div key={index} className='cursor-pointer rounded-xl border-2 border-blue-600 p-2'>
                      <p className='text-center font-medium text-white'>{rol.nombre}</p>

                      <div className='flex mt-2 gap-x-4'>
                        <button onClick={() => {eliminar(rol)}} className='text-center w-1/2 rounded-lg p-2 bg-red-500 hover:bg-red-600 text-white font-medium '>Eliminar</button>
                        <button onClick={() => {entrarModoEdicion(rol)}} className='text-center w-1/2 rounded-lg p-2 bg-blue-500 hover:bg-blue-600 text-white font-medium '>Editar</button>       
                      </div>
                    </div>
                  )}
                </div>
              </div>
            :
                <div className='mb-8'>
                    <form className='mx-auto w-4/5 md:w-2/3' onSubmit={handleSubmit}>
                        <div className='my-16 flex flex-col gap-y-10'>
                            <input 
                              value={nombre} 
                              onInput={(ev) => setNombre(ev.target.value)} 
                              type="text" 
                              placeholder='Nombre del rol' 
                              className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                            />

                            <div>
                              <label className="text-lg text-white">Horario de entrada</label>
                              <input 
                                value={horarioEntrada} 
                                onInput={(ev) => setHorarioEntrada(ev.target.value)} 
                                type="time" 
                                placeholder='Horario de entrada' 
                                className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                              />
                            </div>

                            <div>
                              <label className="text-lg text-white">Horario de salida</label>
                              <input 
                                value={horarioSalida} 
                                onInput={(ev) => setHorarioSalida(ev.target.value)} 
                                type="time" 
                                placeholder='Horario de salida' 
                                className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                              />
                            </div>
                            
                            <div>
                              <label className='text-lg text-white'>Minutos antes del horario de entrada</label>
                              <input 
                                value={tiempoAntesEntrada} 
                                onInput={(ev) => setTiempoAntesEntrada(ev.target.value)} 
                                type="number" 
                                placeholder='Minutos antes del horario de entrada' 
                                className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                              />
                            </div>
                            <div>
                              <label className='text-lg text-white'>Minutos máximos de tolerancia después del horario de entrada</label>
                              <input 
                                value={tiempoMaxTolerancia} 
                                onInput={(ev) => setTiempoMaxTolerancia(ev.target.value)} 
                                type="number" 
                                placeholder='Minutos después del horario de entrada' 
                                className='bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full'
                              />
                            </div>
                        </div>

                        <input type="submit" className='p-4 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 w-full cursor-pointer' value={modoEdicion ? 'Actualizar Info.' : 'Crear Rol'}/>    
                    </form>

                    <button onClick={() => {setModoEdicion(false); limpiarStates(); setModoCreacion(false);}} className='mt-10 p-4 block text-center mx-auto rounded-lg text-white font-medium border-4 border-white hover:border-blue-700 w-1/3 cursor-pointer'>Cancelar</button>
                </div>
    }
</>
  )
}

export default Roles