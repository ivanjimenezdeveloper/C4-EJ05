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

const getInfoLinea = async () => {};

module.exports = {
  getLineas,
};
