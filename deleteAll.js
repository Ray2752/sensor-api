const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://esp32:3lTgcUx0HGkNSUOA@sensorbd.hd8jusf.mongodb.net/?retryWrites=true&w=majority&appName=sensorBD";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("test"); // Base de datos "test"
    const result = await db.collection("lecturas").deleteMany({}); // Elimina todos los documentos
    console.log(`${result.deletedCount} documentos eliminados.`);
  } catch (e) {
    console.error("Error eliminando documentos:", e);
  } finally {
    await client.close();
  }
}

run();
