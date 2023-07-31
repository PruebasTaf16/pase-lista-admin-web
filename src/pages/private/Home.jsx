import React, { useEffect, useState } from "react";

import GraficaDona from "../../components/GraficaDona";
import axios from "axios";
import { API_URL } from "../../constants/api";

/**Pantalla de inicio, y por defecto muestra una gráfica de la asistencia de hoy */
const Home = () => {
  const [cargando, setCargando] = useState(true);
  const [listaAsistencia, setListaAsistencia] = useState([]);

  const [apiData, setApiData] = useState({
    asistencia: {},
    faltaJustificada: {},
    esperandoJustificacion: {},
    inasistencia: {},
    retraso: {},
    todos: {},
  });

  useEffect(() => {
    const fetchListadoAsistencia = async () => {
      try {
        const response = await axios.get(API_URL + "/asistencias/hoy");
        console.log(response.data);

        setListaAsistencia({
          usuarios: response.data["usuarios"],
          asistencias: response.data["asistencias"],
        });
      } catch (error) {
        console.log(e);
      } finally {
        setCargando(false);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL + "/graficas/asistencia-hoy");
        console.log(response.data.data);
        setApiData(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    async function actualizarData() {
      console.log('iniciando carga');
      setCargando(true);
      try {
        await Promise.all([fetchData(), fetchListadoAsistencia()]);
      } catch (error) {
      } finally {
        console.log('carga completa')
        setCargando(false);
      }
    }

    fetchData();
    fetchListadoAsistencia();

    const interval = setInterval(actualizarData, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const data = {
    labels: Object.keys(apiData)
      .filter((key) => key !== "todos")
      .map((key) => apiData[key].label),
    datasets: [
      {
        label: "My First Dataset",
        data: Object.keys(apiData)
          .filter((key) => key !== "todos")
          .map((key) => apiData[key].cantidad),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(175, 120, 195)",
        ],
        hoverOffset: 4,
      },
    ],
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
  };

  function obtenerAsistencia(usuario) {
    const asistencia = listaAsistencia.asistencias.find(e => e.idUsuario._id == usuario._id);
    return asistencia;
  }

  return (
    <>
      <h2 className="text-center text-4xl text-white font-semibold">
        Asistencia de hoy
      </h2>
      <br className="my-8" />
      <div
        style={{ width: "500px", height: "500px" }}
        className="mx-auto text-2xl"
      >
        <GraficaDona data={data} options={options} />
      </div>
      <div className="my-10">
        <h2 className="text-center text-4xl text-white font-semibold">
          Tabla de Asistencias (Hoy)
        </h2>

        {cargando ? (
          <></>
        ) : (
          <div className="mt-10 overflow-x-scroll w-full">
            <table className="w-full">
              <thead className="w-full">
                <tr className="bg-white w-full font-semibold">
                  <td className="p-4 text-center">Nombre Completo</td>
                  <td className="text-center">Rol</td>
                  <td className="text-center">Hora de Asistencia</td>
                  <td className="text-center">Estado de Asistencia</td>
                </tr>
              </thead>
              <tbody className="w-full">
                {listaAsistencia.usuarios.map((usuario, index) => {
                  const detalles = obtenerAsistencia(usuario);

                  return (
                    <tr key={index} className="p-4 text-white text-center">
                      <td className="text-green-400 p-2">
                        {usuario.nombre} {usuario.paterno} {usuario.materno}
                      </td>
                      <td>{usuario.idRol.nombre}</td>
                      <td>{detalles ? detalles.horaAsistencia : 'Sin datos'}</td>
                      <td>{detalles ? detalles.idEstadoAsistencia.nombre : 'Sin registrar'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
