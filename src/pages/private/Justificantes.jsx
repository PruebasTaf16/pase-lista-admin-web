import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';

/**Pantalla para gestionar todos los justificantes de hoy */
const Justificantes = () => {

    const [recibiendoData, setRecibiendoData] = useState(false);
    const [lista, setLista] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [infoJustificante, setInfoJustificante] = useState({});

    const fetchData = async () => {
        try {
            setRecibiendoData(true);
            const response = await axios.get(API_URL+'/varios/listado-justificantes-hoy');
            setLista(response.data.data);
        } catch (e) {
            Swal.fire('Error', 'Error al obtener la lista', 'error');
        } finally {
            setRecibiendoData(false);
        }
    }

    useEffect(() => {
        const actualizarListado = () => {
            fetchData();
        }

        fetchData();

        const interval = setInterval(actualizarListado, 30000);

        return () => {
          clearInterval(interval);
        };
    }, []);

    function obtenerNombreCompleto(infoApi) {
        const nombre = infoApi.idAsistencia.idUsuario.nombre;
        const paterno = infoApi.idAsistencia.idUsuario.paterno;
        const materno = infoApi.idAsistencia.idUsuario.materno;
    
        return `${nombre} ${paterno} ${materno}`;
    }
    
    async function aceptarJustificante() {
        Swal.fire({
            title: '¿Está seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                  const response = await axios.post(API_URL+'/justificantes/aceptar/'+infoJustificante._id);

                  Swal.fire('Completado', response.data.msg, 'success');
                  fetchData();
                } catch (e) {
                  Swal.fire('Error', 'Hubo un error', 'error');
                } finally {
                    setInfoJustificante({});
                    setMostrarModal(false);
                }
              }
          })
    }

    async function rechazarJustificante() {
        Swal.fire({
            title: '¿Está seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await axios.post(API_URL+'/justificantes/rechazar/'+infoJustificante._id);

                Swal.fire('Completado', response.data.msg, 'success');
                fetchData();
              } catch (e) {
                Swal.fire('Error', 'Hubo un error', 'error');
              } finally {
                setInfoJustificante({});
                setMostrarModal(false);
                
              }
            }
          })
    }

    return (
        <>
        <h2 className='text-center text-4xl text-white font-semibold'>Justificantes de Hoy</h2>
        <br className='my-8'/>

        <div className='mb-8'>
            {
                recibiendoData ? <p className='mx-auto text-4xl text-center font-medium text-white'>Cargando...</p> : ''
            }
            <div className='my-8 grid grid-cols-3 gap-x-8'>
                {
                    recibiendoData
                    ?
                        ''
                    :
                    <>
                        {lista.map((justificante, index) => (
                            <div onClick={() => {
                                setInfoJustificante(justificante);
                                setMostrarModal(true);
                            }} key={index} className='cursor-pointer rounded-xl border-2 border-blue-600 p-2 text-white'>
                                <p className='text-center font-medium text-white'>{obtenerNombreCompleto(justificante)}</p>

                                <div className='my-2'>
                                    <p className='p-2 bg-orange-500'><span>{justificante.idMotivoInasistencia.nombre}</span></p>
                                    {
                                        justificante.idEstadoJustificante.nombre == 'Enviado' ? <p className='p-2 bg-yellow-600'><span>{justificante.idEstadoJustificante.nombre}</span></p> : ''
                                    }
                                                                {
                                        justificante.idEstadoJustificante.nombre == 'Aceptado' ? <p className='p-2 bg-green-600'><span>{justificante.idEstadoJustificante.nombre}</span></p> : ''
                                    }
                                                                {
                                        justificante.idEstadoJustificante.nombre == 'Rechazado' ? <p className='p-2 bg-red-600'><span>{justificante.idEstadoJustificante.nombre}</span></p> : ''
                                    }
                                </div>
                            </div>
                        ))}
                    </>
                }
            </div>
        </div>

        {
            !mostrarModal 
                ? ''
                : 
                    <div className='z-100 absolute top-0 left-0 right-0 bottom-0 bg-black-transparent flex flex-col items-center justify-center'>
                        <h2 className='text-4xl text-white'>Justificante de <span className='font-bold'>{obtenerNombreCompleto(infoJustificante)}</span></h2>

                        <div className='text-white text-left mt-10 text-xl'>
                            <p>Empleo: <span className='text-yellow-500'>{infoJustificante.idAsistencia.idUsuario.idRol.nombre}</span></p>
                            <p>Estado: <span className='text-yellow-500'>{infoJustificante.idEstadoJustificante.nombre}</span></p>
                            <p>Detalles: <span className='text-yellow-500'>{infoJustificante.detalles}</span></p>
                        </div>

                        <div className='flex gap-x-8 mt-10'>
                            <button 
                                onClick={() => aceptarJustificante()}
                                className='py-2 rounded-xl px-4 bg-green-400 hover:bg-green-500 text-white font-medium'>Aceptar</button>
                            <button 
                                onClick={() => rechazarJustificante()}
                                className='py-2 rounded-xl px-4 bg-red-400 hover:bg-red-500 text-white font-medium'>Rechazar</button>
                        </div>

                        <div className='mt-5 w-1/5'>
                            <button 
                                onClick={() => {
                                    setInfoJustificante({});
                                    setMostrarModal(false);
                                }}
                                className='block w-full py-2 rounded-xl px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium'>Cerrar</button>
                        </div>
                    </div>
        }
        </>
    )
}

export default Justificantes