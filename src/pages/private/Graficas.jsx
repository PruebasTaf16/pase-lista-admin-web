import React, { useEffect, useState } from "react";
import GraficoBarra from "../../components/GraficoBarra";
import GraficaDona from "../../components/GraficaDona";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../../constants/api";

/**Pantalla para la ruta de gráficas */
const Graficas = () => {
  const colors = [
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(175, 120, 195)",
    "rgb(255, 182, 193)",
    "rgb(173, 216, 230)",
    "rgb(255, 231, 186)",
    "rgb(152, 251, 152)",
    "rgb(221, 160, 221)",
  ];

  const [cargando, setCargando] = useState(true);

  const [apiData1, setApiData1] = useState({});
  const [apiData2, setApiData2] = useState({});
  const [apiData3, setApiData3] = useState({});
  const [apiData4, setApiData4] = useState({});

  const fetchRolesOcupacion = async () => {
    try {
      const response = await axios.get(API_URL + "/graficas/roles-ocupacion");

      const responseData = response.data["data"];

      const data = {
        labels: Object.keys(responseData),
        datasets: [
          {
            label: "",
            data: Object.values(responseData).map((v) => v),
            backgroundColor: colors,
            hoverOffset: 4,
          },
        ],
      };
      setApiData1(data);
    } catch (e) {
      Swal.fire("Error", "Hubo un error", "error");
    }
  };

  const fetchEstadoAsistenciaGeneral = async () => {
    try {
      const response = await axios.get(
        API_URL + "/graficas/estado-asistencia-general"
      );

      const responseData = response.data["data"];

      const data = {
        labels: Object.keys(responseData),
        datasets: [
          {
            label: "",
            data: Object.values(responseData).map((v) => v),
            backgroundColor: colors,
            hoverOffset: 4,
          },
        ],
      };
      setApiData2(data);
    } catch (e) {
      Swal.fire("Error", "Hubo un error", "error");
    }
  };

  const fetchMotivosFaltas = async () => {
    try {
      const response = await axios.get(API_URL + "/graficas/motivos-faltas");

      const responseData = response.data["data"];

      const data = {
        labels: Object.keys(responseData),
        datasets: [
          {
            label: "",
            data: Object.values(responseData).map((v) => v),
            backgroundColor: colors,
            hoverOffset: 4,
          },
        ],
      };
      setApiData3(data);
    } catch (e) {
      Swal.fire("Error", "Hubo un error", "error");
    }
  };

  const fetchRelacionJustificantes = async () => {
    try {
      const response = await axios.get(API_URL + "/graficas/estatus-justificantes");

      const responseData = response.data["data"];

      const data = {
        labels: Object.keys(responseData),
        datasets: [
          {
            label: "",
            data: Object.values(responseData).map((v) => v),
            backgroundColor: colors,
            hoverOffset: 4,
          },
        ],
      };
      console.log(data);
      setApiData4(data);
    } catch (e) {
      Swal.fire("Error", "Hubo un error", "error");
    }
  };

  useEffect(() => {
    async function execAllRequests() {
      setCargando(true);
      try {
        await Promise.all([
          fetchRolesOcupacion(),
          fetchEstadoAsistenciaGeneral(),
          fetchMotivosFaltas(),
          fetchRelacionJustificantes(),
        ]);
      } catch (error) {
        Swal.fire("Error", "Hubo error al cargar las peticiones", "error");
      } finally {
        setCargando(false);
      }
    }

    execAllRequests();
  }, []);

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

  return (
    <>
      <h2 className="text-center text-4xl text-white font-semibold">
        Gráficas
      </h2>
      <br className="my-8" />

      {cargando ? (
        <h3 className="text-center text-white text-2xl font-semibold">
          Cargando...
        </h3>
      ) : (
        <>
          <div className="my-10">
            <h2 className="text-center text-2xl text-white font-semibold">
              Ocupaciones por rol
            </h2>
            <div
              style={{ width: "500px", height: "500px" }}
              className="mx-auto text-2xl"
            >
              <GraficoBarra data={apiData1} options={options} />
            </div>
          </div>

          <div className="my-10">
            <h2 className="text-center text-2xl text-white font-semibold">
              Estado de la asistencia general
            </h2>
            <div
              style={{ width: "500px", height: "500px" }}
              className="mx-auto text-2xl"
            >
              <GraficoBarra data={apiData2} options={options} />
            </div>
          </div>

          <div className="my-10">
            <h2 className="text-center text-2xl text-white font-semibold">
              Motivos más comunes de inasistencia
            </h2>
            <div
              style={{ width: "500px", height: "500px" }}
              className="mx-auto text-2xl"
            >
              <GraficoBarra data={apiData3} options={options} />
            </div>
          </div>

          <div className="my-10">
            <h2 className="text-center text-2xl text-white font-semibold">
              Relación de justificantes enviados/aceptados/aceptados
            </h2>
            <div
              style={{ width: "500px", height: "500px" }}
              className="mx-auto text-2xl"
            >
              <GraficaDona data={apiData4} options={options} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Graficas;
