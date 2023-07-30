import React, { useEffect, useState } from 'react'

import GraficaDona from "../../components/GraficaDona";
import axios from 'axios';
import {API_URL} from "../../constants/api";

/**Pantalla de inicio, y por defecto muestra una gráfica de la asistencia de hoy */
const Home = () => {

  const [apiData, setApiData] = useState({
    asistencia: {}, 
    faltaJustificada: {}, 
    esperandoJustificacion: {}, 
    inasistencia: {},
    retraso: {},
    todos: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL+'/graficas/asistencia-hoy');
        console.log(response.data.data);
        setApiData(response.data.data);
      } catch (e) {
        console.log(e);
      }
    }

    function actualizarData() {
      fetchData();
    }

    fetchData();

    const interval = setInterval(actualizarData, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const data = {
    labels: Object.keys(apiData).filter(key => (key !== 'todos')).map(key => apiData[key].label),
    datasets: [{
      label: 'My First Dataset',
      data: Object.keys(apiData).filter(key => (key !== 'todos')).map(key => apiData[key].cantidad),
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(175, 120, 195)'
      ],
      hoverOffset: 4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          fontSize: 24,
        },
      },
    },
  }

  return (
    <>
      <h2 className='text-center text-4xl text-white font-semibold'>Asistencia de hoy</h2>
      <br className='my-8'/>
      <div style={{width: '500px', height: '500px'}} className='mx-auto text-2xl'>
        <GraficaDona data={data} options={options}/>
      </div>
    </>
  )
}

export default Home