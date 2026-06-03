import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PalletGenerator from './PalletGenerator';
import Options from './Options';

const Notes = lazy(() => import('./Notes'));

export default function App() {
  return (
    <BrowserRouter basename='/oneoffs'>
      <Routes>
        <Route path='/' element={<Options />} />
        <Route path='/PalletGenerator' element={<PalletGenerator />} />
        <Route path='/notes' element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}
