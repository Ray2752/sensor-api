import React from 'react';
import ChartDisplay from './components/ChartDisplay'; // Ajusta esta ruta si está en otro lugar

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Monitor de Sensor LTR390UV</h1>
      <ChartDisplay />
    </div>
  );
}

export default App;

