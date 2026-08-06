import React from 'react';
import { PetriCanvas } from './components/canvas/PetriCanvas';
import { Toolbar } from './components/sidebar/Toolbar';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#020617' }}>
      <Toolbar />
      <PetriCanvas />
    </div>
  );
}