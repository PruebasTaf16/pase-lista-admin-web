import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_URL } from "../../constants/api";

/**Pantalla para gestionar todos los justificantes de hoy */
const Ubicacion = () => {
  const [cargando, setCargando] = useState(false);
  const [ubicacion, setUbicacion] = useState({});

  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [rango, setRango] = useState(0);

  const fetchData = async () => {
    try {
      setCargando(true);
      const response = await axios.get(API_URL + "/ubicaciones/actual");
      setUbicacion(response.data.data);

      setLatitud(response.data.data["latitud"]);
      setLongitud(response.data.data["longitud"]);
      setRango(response.data.data["rango"]);
    } catch (e) {
      Swal.fire("Error", "Error al obtener la ubicación configurada", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault();

    if (cargando) return;
    setCargando(true);

    if (!latitud || !longitud || !rango) {
      return Swal.fire(
        "Datos inválidos",
        "Hay campos vaciós o no rellenados correctamente",
        "error"
      );
    }

    try {
      const response = await axios.patch(API_URL + "/ubicaciones/modificar", {
        latitud,
        longitud,
        rango,
      });

      await fetchData();

      Swal.fire("Modificado", response.data.msg, "success");
    } catch (error) {
      Swal.fire("Error", error.response.data.msg, "error");
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <h2 className="text-center text-4xl text-white font-semibold">
        Ubicación configurada
      </h2>
      <br className="my-8" />

      <div className="mb-8">
        {cargando ? (
          <p className="mx-auto text-4xl text-center font-medium text-white">
            Cargando...
          </p>
        ) : (
          ""
        )}
        {cargando ? (
          ""
        ) : (
          <div>
            <form className="mx-auto w-4/5 md:w-2/3" onSubmit={handleSubmit}>
              <div className="my-16 flex flex-col gap-y-10">
                <label htmlFor="" className="font-semibold text-white text-xl">Latitud</label>
                <input
                  value={latitud}
                  onInput={(ev) => setLatitud(ev.target.value)}
                  type="number"
                  placeholder="Latitud"
                  className="bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full"
                />
                <label htmlFor="" className="font-semibold text-white text-xl">Longitud</label>
                <input
                  value={longitud}
                  onInput={(ev) => setLongitud(ev.target.value)}
                  type="number"
                  placeholder="Longitud"
                  className="bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full"
                />
                <label htmlFor="" className="font-semibold text-white text-xl">Rango</label>
                <input
                  value={rango}
                  onInput={(ev) => setRango(ev.target.value)}
                  type="number"
                  placeholder="Rango"
                  className="bg-transparent text-white text-lg border-b-2 border-b-white focus:border-b-blue-500 outline-none w-full"
                />
              </div>

              <input
                type="submit"
                className="p-4 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 w-full cursor-pointer"
                value="Actualizar info"
              />
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Ubicacion;
