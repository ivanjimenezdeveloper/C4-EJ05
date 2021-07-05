const fetch = require("node-fetch");
require("dotenv").config();

const urlMetro = process.env.API_METRO;
const apiId = process.env.API_ID;
const apiKey = process.env.API_KEY;
const urlMetroAutenticado = `${urlMetro}?app_id=${apiId}&app_key=${apiKey}`;

const getLineas = async () => {
  const respuesta = await fetch(urlMetroAutenticado);
  const paradas = await respuesta.json();

  const paradasToReturn = [];

  for (const parada of paradas.features) {
    const paradaToReturn = {};
    paradaToReturn.id = parada.properties.ID_LINIA;
    paradaToReturn.linea = parada.properties.NOM_LINIA;
    paradaToReturn.descripcion = parada.properties.DESC_LINIA;

    paradasToReturn.push(paradaToReturn);
  }

  return paradasToReturn;
};

const comprobarLinea = async (linea, lineas) => {
  const lineaReturn = lineas.filter((lineaApi) =>
    linea.toLowerCase() === lineaApi.properties.NOM_LINIA.toLowerCase()
      ? lineaApi
      : ""
  );

  return lineaReturn || false;
};

const anyadirParadas = (paradas, lineasAPI) => {
  const lineaToReturn = {};
  const paradasFormateadas = [];

  lineaToReturn.id = lineasAPI.properties.ID_LINIA;
  lineaToReturn.linea = lineasAPI.properties.NOM_LINIA;
  lineaToReturn.descripcion = lineasAPI.properties.DESC_LINIA;

  for (const parada of paradas.features) {
    const paradaTemp = {};
    paradaTemp.id = parada.properties.ID_ESTACIO;
    paradaTemp.nombre = parada.properties.NOM_ESTACIO;

    paradasFormateadas.push(paradaTemp);
  }

  lineaToReturn.paradas = [...paradasFormateadas];
  return lineaToReturn;
};

const getLineasCompletas = async () => {
  const respuesta = await fetch(urlMetroAutenticado);
  const paradas = await respuesta.json();

  return paradas.features;
};
const getInfoLinea = async (lineaRespuesta) => {
  const lineas = await getLineasCompletas();
  const linea = await comprobarLinea(lineaRespuesta, lineas);

  if (!linea || linea.length === 0) {
    return false;
  }
  const primeraLinea = { ...linea[0] };

  const respuesta = await fetch(
    `${urlMetro}/${primeraLinea.properties.CODI_LINIA}/estacions?app_id=${apiId}&app_key=${apiKey}`
  );
  const paradas = await respuesta.json();

  const lineasToReturn = { ...anyadirParadas(paradas, primeraLinea) };

  return lineasToReturn;
};

module.exports = {
  getLineas,
  getInfoLinea,
};
