const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Reemplaza con tu URI real de MongoDB Atlas
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

const lecturaSchema = new mongoose.Schema({
  alsRaw: Number,
  lux: Number,
  uvRaw: Number,
  timestamp: { type: Date, default: Date.now }
});

const Lectura = mongoose.model('Lectura', lecturaSchema);

// Variable global para controlar el guardado de datos
let isSavingData = false;

// Ruta para recibir y guardar los datos del sensor
app.post('/data', async (req, res) => {
  const { alsRaw, lux, uvRaw } = req.body;
  if (isSavingData) {
    try {
      const nuevaLectura = new Lectura({ alsRaw, lux, uvRaw });
      await nuevaLectura.save();
      console.log('📥 Datos recibidos y guardados:', nuevaLectura);
      res.status(201).send('Guardado en MongoDB');
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      res.status(500).send('Error al guardar');
    }
  } else {
    res.status(400).send('El guardado de datos está detenido');
  }
});

// Ruta para obtener los datos guardados
app.get('/data', async (req, res) => {
  try {
    const lecturas = await Lectura.find().sort({ timestamp: -1 }).limit(50); // número de registros limitados según lo que necesites
    res.json(lecturas);
  } catch (error) {
    console.error('❌ Error al obtener datos:', error);
    res.status(500).send('Error al obtener datos');
  }
});

// Ruta para iniciar el guardado de datos
app.post('/start', (req, res) => {
  isSavingData = true;
  console.log('📦 Guardado de datos iniciado');
  res.send('Guardado de datos iniciado');
});

// Ruta para detener el guardado de datos
app.post('/stop', (req, res) => {
  isSavingData = false;
  console.log('⏸ Guardado de datos detenido');
  res.send('Guardado de datos detenido');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
