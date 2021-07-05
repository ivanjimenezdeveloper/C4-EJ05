const express = require("express");
const { getLineas, getInfoLinea } = require("./API/tmb");

const app = express();
const puerto = 5000;

const server = app.listen(puerto, () => {
  console.log(`Escuchando puerto ${puerto}`);
});

app.use(express.static("public"));
app.use(express.json());

app.get("/metro/lineas", async (req, res, next) => {
  res.send(JSON.stringify(await getLineas()));
});

app.get("/metro/linea/:linea", async (req, res, next) => {
  const { linea } = req.params;
  res.send(
    (await getInfoLinea(linea)) || "No existe ninguna Línea con ese codigo"
  );
});

app.use((req, res, next) => {
  res.status(404).send({ error: true, mensaje: "Recurso no encontrado" });
});

app.use((err, req, res, next) => {
  const codigo = err.codigo || 500;
  const mensaje = err.codigo ? err.message : "Ha habido un pete general";
  res.status(codigo).send({ error: true, mensaje: "Error general" });
});
